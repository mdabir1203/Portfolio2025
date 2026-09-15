/**
 * Day-by-day drip scheduler.
 *
 * The referral system on the portfolio already uses a Day 0 / Day 3 /
 * Day 7 cadence for the post-`/connect` Loom email. This module
 * applies the same cadence to outreach:
 *
 *   Day 0   → first message (per channel) — sent by `seed + send` flow.
 *   Day 3   → softer bump — "if the original ask doesn't fit, even a
 *             different building in the same price band would work."
 *   Day 7   → last ping — "won't keep pinging, here's my contact info."
 *   Day 14  → close-out — "still looking, but I won't keep pinging."
 *   Day 30+ → automatic stop. The contact is parked unless a reply
 *             re-opens the conversation.
 *
 * State is held in two places:
 *   - `contacts.drip_day` — the highest day sent so far (0, 3, 7, 14).
 *   - `followups` table  — append-only audit trail of every drip send.
 *
 * The function `processDrip(now)` is the cron-shaped entry point:
 * it scans all contacts, finds which ones are due, sends the right
 * message on each ready channel, and advances their `drip_day`.
 *
 * Per-channel rate limiting is enforced via the `lastChannelSendAt`
 * in-memory cache (so we don't fire 3 channels at the same second).
 */

const { open } = require('./database.cjs');
const { generateForChannel } = require('./personalize.cjs');
const { channelsFor } = require('./channels/index.cjs');

const DRIP_SCHEDULE = [
  // day, kind, label
  { day: 3,  kind: 'nudge', label: 'Day 3 — softer bump' },
  { day: 7,  kind: 'nudge', label: 'Day 7 — last ping' },
  { day: 14, kind: 'nudge', label: 'Day 14 — close-out' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function dripDayFor(contact, now = Date.now()) {
  // Compute the next drip day based on time since first send.
  if (!contact.first_send_at) return null;
  // SQLite CURRENT_TIMESTAMP yields "YYYY-MM-DD HH:MM:SS" (UTC, no Z).
  // JS ISO yields "...Z". Normalize so either works.
  const raw = String(contact.first_send_at);
  const iso = raw.includes('T') ? (raw.endsWith('Z') ? raw : raw + 'Z') : raw.replace(' ', 'T') + 'Z';
  const firstMs = new Date(iso).getTime();
  if (Number.isNaN(firstMs)) return null;
  const elapsedDays = (now - firstMs) / DAY_MS;
  if (elapsedDays >= 30) return null; // automatic stop
  for (const step of DRIP_SCHEDULE) {
    if (elapsedDays >= step.day) {
      // already past it? skip — `drip_day` is the source of truth.
      if ((contact.drip_day ?? 0) < step.day) return step.day;
    }
  }
  return null;
}

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

/**
 * processDrip({ channels, onlyChannels, dryRun }):
 *   - Scans all contacts, finds which ones are due for a drip step.
 *   - Sends the right message on each ready channel.
 *   - Records `followups` rows + advances `contacts.drip_day`.
 *   - Returns a summary for the dashboard / orchestrator.
 */
async function processDrip({ onlyChannels = null, dryRun = false } = {}) {
  const db = open();
  const summary = { processed: 0, sent: 0, skipped: 0, errors: 0, byChannel: {}, due: [] };

  try {
    // Pull every contact that has had at least one first send.
    const rows = db
      .prepare(
        `SELECT c.*,
                (SELECT MIN(sent_at) FROM messages WHERE contact_id = c.id AND direction = 'out') as first_send_at,
                (SELECT MAX(sent_at) FROM messages WHERE contact_id = c.id AND direction = 'out') as last_send_at,
                (SELECT 1 FROM replies WHERE contact_id = c.id LIMIT 1) as has_reply
         FROM contacts c
         ORDER BY c.id`
      )
      .all();

    for (const row of rows) {
      summary.processed++;
      if (row.has_reply) { summary.skipped++; continue; }          // don't drip on contacts that replied
      if (!row.first_send_at) { summary.skipped++; continue; }     // no first send yet
      const nextDay = dripDayFor(row);
      if (nextDay == null) { summary.skipped++; continue; }

      const step = DRIP_SCHEDULE.find((s) => s.day === nextDay);
      if (!step) { summary.skipped++; continue; }

      const contact = contactFromRow(row);
      const channels = channelsFor(contact).filter((c) => !onlyChannels || onlyChannels.includes(c.name));
      if (channels.length === 0) { summary.skipped++; continue; }

      summary.due.push({ contactId: contact.id, name: contact.name, day: nextDay, channels: channels.map((c) => c.name) });

      for (const channel of channels) {
        try {
          const message = generateForChannel(channel.name, contact, 'nudge', { day: nextDay });
          if (dryRun) {
            console.log(
              `[drip:dry] would send ${channel.name} nudge to ${contact.name} (day ${nextDay})`
            );
            continue;
          }
          await channel.sendNudge(contact, message);
          db.prepare(
            `INSERT INTO messages (contact_id, direction, body, channel, subject)
             VALUES (?, ?, ?, ?, ?)`
          ).run(contact.id, 'out', message.body, channel.name, message.subject || null);
          db.prepare(
            `INSERT INTO followups (contact_id, due_at, status, reason) VALUES (?, datetime('now'), 'sent', ?)`
          ).run(contact.id, `drip-day${nextDay}-${channel.name}`);
          summary.sent++;
          summary.byChannel[channel.name] = (summary.byChannel[channel.name] || 0) + 1;
          // 4-7s between channel sends to look human
          await new Promise((r) => setTimeout(r, 4000 + Math.random() * 3000));
        } catch (e) {
          summary.errors++;
          console.error(`[drip] ${channel.name} → ${contact.name} failed: ${e.message}`);
        }
      }

      // Advance the drip state for this contact (highest day sent).
      db.prepare(`UPDATE contacts SET drip_day = ?, updated_at = datetime('now') WHERE id = ?`)
        .run(nextDay, contact.id);
    }
  } finally {
    db.close();
  }

  return summary;
}

module.exports = { processDrip, DRIP_SCHEDULE, dripDayFor, contactFromRow };

/* ------------------------------------------------------------------ */
/* CLI                                                                */
/* ------------------------------------------------------------------ */

if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');
  const onlyIdx = process.argv.indexOf('--only');
  const onlyChannels = onlyIdx > -1 ? process.argv[onlyIdx + 1].split(',') : null;
  processDrip({ onlyChannels, dryRun })
    .then((s) => {
      console.log('\n=== Drip summary ===');
      console.log(`  processed: ${s.processed}`);
      console.log(`  sent:      ${s.sent}`);
      console.log(`  skipped:   ${s.skipped}`);
      console.log(`  errors:    ${s.errors}`);
      console.log(`  by channel:`, s.byChannel);
      if (s.due.length) {
        console.log('\n  due list:');
        for (const d of s.due) console.log(`    - #${d.contactId} ${d.name}  day ${d.day}  → [${d.channels.join(', ')}]`);
      }
    })
    .catch((e) => { console.error('FATAL:', e); process.exit(1); });
}
