/**
 * Multi-channel orchestrator — replaces the v1 single-channel
 * `whatsapp_automation.cjs` for the new outreach flow.
 *
 * Sub-commands:
 *
 *   seed                      Seed the DB with DEFAULT_CONTACTS (idempotent).
 *
 *   send                      Send the first message on each ready channel
 *                             for every contact that hasn't been contacted yet.
 *                             Honors --channel=email,linkedin,whatsapp to limit
 *                             the run to specific channels.
 *
 *   listen                    Poll each channel for incoming replies, classify
 *                             intent, and auto-reply. Polls WhatsApp + LinkedIn
 *                             (no email in v2 — see channels/email.cjs).
 *
 *   drip                      Run the day-by-day drip scheduler. Same as
 *                             `node automation/drip.cjs`.
 *
 *   run                       Convenience: seed (if needed) + send + listen
 *                             + drip, in that order. The "fire it and watch"
 *                             command.
 *
 * Flags:
 *   --channel=<list>          Comma-separated channel filter
 *                             (e.g. --channel=email,linkedin)
 *   --dry-run                 Don't actually send; just print the plan
 *   --max=<n>                 Process at most n contacts (for testing)
 *
 * Examples:
 *
 *   node automation/run.cjs seed
 *   node automation/run.cjs send --channel=email
 *   node automation/run.cjs drip --dry-run
 *   node automation/run.cjs run --max=3
 *   LINKEDIN_OPT_IN=1 node automation/run.cjs send --channel=linkedin
 */

const { open } = require('./database.cjs');
const { DEFAULT_CONTACTS } = require('./contacts.cjs');
const { generateForChannel, detectIntent } = require('./personalize.cjs');
const { channelsFor, get: getChannel } = require('./channels/index.cjs');
const { processDrip } = require('./drip.cjs');

function parseFlags(argv) {
  const flags = { dryRun: false, max: null, channels: null };
  for (const arg of argv.slice(2)) {
    if (arg === '--dry-run') flags.dryRun = true;
    else if (arg.startsWith('--channel=')) flags.channels = arg.slice(10).split(',');
    else if (arg.startsWith('--max=')) flags.max = parseInt(arg.slice(6), 10);
  }
  return flags;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function contactFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    linkedin_url: row.linkedin_url,
    source: row.source,
    tags: row.tags ? safeJson(row.tags, []) : [],
    channel_priority: row.channel_priority,
    profile: row.notes ? safeJson(row.notes, null) : null,
  };
}

function safeJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

/* ---------------------- seed ---------------------- */

function seed() {
  const db = open();
  try {
    for (const c of DEFAULT_CONTACTS) {
      const existing = db.prepare('SELECT * FROM contacts WHERE phone = ?').get(c.phone);
      if (existing) continue;
      db.prepare(
        `INSERT INTO contacts (name, phone, source, tags, notes) VALUES (?, ?, ?, ?, ?)`
      ).run(c.name, c.phone, c.source || null, JSON.stringify(c.tags || []), c.profile ? JSON.stringify(c.profile) : null);
    }
    const count = db.prepare('SELECT COUNT(*) as n FROM contacts').get().n;
    console.log(`[seed] ${count} contacts in DB.`);
  } finally {
    db.close();
  }
}

/* ---------------------- send first ---------------------- */

async function send({ dryRun = false, channels = null, max = null } = {}) {
  const db = open();
  const summary = { processed: 0, sent: 0, skipped: 0, errors: 0, byChannel: {} };
  try {
    const rows = db
      .prepare(
        `SELECT c.* FROM contacts c
         LEFT JOIN messages m ON m.contact_id = c.id AND m.direction = 'out'
         WHERE m.id IS NULL
         ORDER BY c.id`
      )
      .all();
    for (const row of rows) {
      if (max != null && summary.processed >= max) break;
      summary.processed++;
      const contact = contactFromRow(row);
      const ready = channelsFor(contact).filter((c) => !channels || channels.includes(c.name));
      if (ready.length === 0) {
        summary.skipped++;
        console.log(`[send] skip #${contact.id} ${contact.name} — no ready channel`);
        continue;
      }
      for (const channel of ready) {
        try {
          const message = generateForChannel(channel.name, contact, 'first');
          if (dryRun) {
            console.log(`[send:dry] ${channel.name} → ${contact.name}`);
            console.log(message.subject ? `  subject: ${message.subject}\n` : '');
            console.log(`  ${(message.body || '').split('\n').join('\n  ')}`);
            continue;
          }
          await channel.sendFirst(contact, message);
          db.prepare(
            `INSERT INTO messages (contact_id, direction, body, channel, subject) VALUES (?, ?, ?, ?, ?)`
          ).run(contact.id, 'out', message.body, channel.name, message.subject || null);
          summary.sent++;
          summary.byChannel[channel.name] = (summary.byChannel[channel.name] || 0) + 1;
          // 4-7s between channel sends (humans don't fire 3 channels in 200ms)
          await sleep(4000 + Math.random() * 3000);
        } catch (e) {
          summary.errors++;
          console.error(`[send] ${channel.name} → ${contact.name} failed: ${e.message}`);
        }
      }
    }
  } finally {
    db.close();
  }
  return summary;
}

/* ---------------------- listen (poll replies) ---------------------- */

async function listen({ channels = null, max = null } = {}) {
  // Per channel, poll for new replies, dedupe, classify, auto-reply.
  const db = open();
  const summary = { polled: 0, replied: 0, errors: 0 };
  try {
    const enabled = (channels && channels.length) ? channels : ['whatsapp', 'linkedin'];
    for (const name of enabled) {
      const channel = getChannel(name);
      if (!channel.pollReplies) continue;
      try {
        const messages = await channel.pollReplies();
        summary.polled += messages.length;
        for (const m of messages.slice(0, max ?? messages.length)) {
          // Find a matching contact (by name for whatsapp, by linkedin for linkedin).
          let contact = null;
          if (name === 'whatsapp' && m.contactName) {
            contact = db
              .prepare('SELECT * FROM contacts WHERE LOWER(name) LIKE ?')
              .get(`%${m.contactName.toLowerCase()}%`);
          }
          if (!contact) continue;
          const intent = detectIntent(m.body || '');
          // Dedupe — never record the same body twice
          const exists = db
            .prepare('SELECT 1 FROM messages WHERE contact_id = ? AND direction = ? AND body = ?')
            .get(contact.id, 'in', m.body);
          if (exists) continue;
          db.prepare(
            `INSERT INTO messages (contact_id, direction, body, channel) VALUES (?, ?, ?, ?)`
          ).run(contact.id, 'in', m.body, name);
          db.prepare(
            `INSERT INTO replies (contact_id, message_id, body, intent) VALUES (?, last_insert_rowid(), ?, ?)`
          ).run(contact.id, m.body, intent);
          console.log(`[listen:${name}] ← ${contact.name} (${intent}) ${(m.body || '').slice(0, 80)}`);
          summary.replied++;

          // Auto-reply only on known intents.
          const reply = generateForChannel(name, contactFromRow(contact), 'reply', { intent });
          if (reply?.body) {
            try {
              await channel.sendReply(contactFromRow(contact), reply);
              db.prepare(
                `INSERT INTO messages (contact_id, direction, body, channel, subject) VALUES (?, ?, ?, ?, ?)`
              ).run(contact.id, 'out', reply.body, name, reply.subject || null);
              console.log(`[listen:${name}] → ${contact.name} (auto-reply ${intent})`);
            } catch (e) {
              summary.errors++;
              console.error(`[listen:${name}] auto-reply failed for ${contact.name}: ${e.message}`);
            }
          }
        }
      } catch (e) {
        summary.errors++;
        console.error(`[listen:${name}] poll error: ${e.message}`);
      }
    }
  } finally {
    db.close();
  }
  return summary;
}

/* ---------------------- main ---------------------- */

async function main() {
  const cmd = process.argv[2] || 'help';
  const flags = parseFlags(process.argv);

  if (cmd === 'seed') return seed();
  if (cmd === 'send') {
    const s = await send(flags);
    console.log('\n=== send summary ===');
    console.log(`  processed: ${s.processed}`);
    console.log(`  sent:      ${s.sent}`);
    console.log(`  skipped:   ${s.skipped}`);
    console.log(`  errors:    ${s.errors}`);
    console.log(`  by channel:`, s.byChannel);
    return;
  }
  if (cmd === 'listen') {
    const s = await listen(flags);
    console.log('\n=== listen summary ===');
    console.log(`  polled:  ${s.polled}`);
    console.log(`  replied: ${s.replied}`);
    console.log(`  errors:  ${s.errors}`);
    return;
  }
  if (cmd === 'drip') {
    const s = await processDrip({ onlyChannels: flags.channels, dryRun: flags.dryRun });
    console.log('\n=== drip summary ===');
    console.log(`  processed: ${s.processed}`);
    console.log(`  sent:      ${s.sent}`);
    console.log(`  skipped:   ${s.skipped}`);
    console.log(`  errors:    ${s.errors}`);
    console.log(`  by channel:`, s.byChannel);
    return;
  }
  if (cmd === 'run') {
    seed();
    await send(flags);
    await listen(flags);
    const s = await processDrip({ onlyChannels: flags.channels, dryRun: flags.dryRun });
    console.log('\n=== run summary ===');
    console.log(`  drip sent: ${s.sent}, errors: ${s.errors}`);
    return;
  }
  console.log(`Unknown command: ${cmd}`);
  console.log('Available: seed | send | listen | drip | run');
  console.log('Flags: --dry-run, --channel=<csv>, --max=<n>');
}

if (require.main === module) {
  main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
}

module.exports = { seed, send, listen, contactFromRow, parseFlags, safeJson };
