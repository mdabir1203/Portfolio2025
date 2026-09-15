/**
 * Multi-channel dashboard.
 *
 * Shows the full outreach state across WhatsApp, LinkedIn, and Email:
 *
 *   - per-contact: drip day, last send, last reply, last intent
 *   - per-channel: how many sends today, replies, intent distribution
 *   - due list:    which contacts are ready for a Day 3 / 7 / 14 nudge
 *
 * Run with:   node automation/dashboard.cjs
 *             node automation/dashboard.cjs --json     # machine-readable
 */

const { open } = require('./database.cjs');
const { DRIP_SCHEDULE, dripDayFor } = require('./drip.cjs');

function fmt(d) {
  if (!d) return '-';
  return d.replace('T', ' ').slice(0, 19);
}

function safeJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

function build(db) {
  const totals = {
    contacts: db.prepare('SELECT COUNT(*) as n FROM contacts').get().n,
    sent: db.prepare("SELECT COUNT(*) as n FROM messages WHERE direction = 'out'").get().n,
    received: db.prepare("SELECT COUNT(*) as n FROM messages WHERE direction = 'in'").get().n,
    replied: db.prepare('SELECT COUNT(DISTINCT contact_id) as n FROM replies').get().n,
    interested: db
      .prepare("SELECT COUNT(DISTINCT contact_id) as n FROM replies WHERE intent IN ('available','price')")
      .get().n,
    declined: db
      .prepare("SELECT COUNT(DISTINCT contact_id) as n FROM replies WHERE intent = 'decline'")
      .get().n,
  };

  // per-channel breakdown
  const byChannel = db
    .prepare(
      `SELECT channel,
              SUM(CASE WHEN direction = 'out' THEN 1 ELSE 0 END) as out_count,
              SUM(CASE WHEN direction = 'in'  THEN 1 ELSE 0 END) as in_count
       FROM messages
       WHERE channel IS NOT NULL
       GROUP BY channel`
    )
    .all();
  const channelStats = {};
  for (const r of byChannel) {
    channelStats[r.channel || 'unknown'] = { out: r.out_count || 0, in: r.in_count || 0 };
  }

  // per-contact row
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.phone, c.email, c.linkedin_url, c.drip_day, c.channel_priority,
              (SELECT MIN(sent_at) FROM messages WHERE contact_id = c.id AND direction = 'out') as first_send_at,
              (SELECT MAX(sent_at) FROM messages WHERE contact_id = c.id AND direction = 'out') as last_send_at,
              (SELECT MAX(sent_at) FROM messages WHERE contact_id = c.id AND direction = 'in')  as last_reply_at,
              (SELECT COUNT(*) FROM messages WHERE contact_id = c.id AND direction = 'out') as out_count,
              (SELECT intent FROM replies WHERE contact_id = c.id ORDER BY id DESC LIMIT 1) as last_intent,
              (SELECT 1 FROM replies WHERE contact_id = c.id LIMIT 1) as has_reply
       FROM contacts c
       ORDER BY (last_send_at IS NULL), last_send_at DESC, c.id`
    )
    .all();

  // due list
  const due = [];
  for (const r of rows) {
    if (r.has_reply) continue;
    if (!r.first_send_at) continue;
    const next = dripDayFor(r);
    if (next != null) {
      const priority = safeJson(r.channel_priority, null);
      const channels = priority
        ? priority.filter((c) => {
            if (c === 'whatsapp') return Boolean(r.phone);
            if (c === 'linkedin') return Boolean(r.linkedin_url);
            if (c === 'email') return Boolean(r.email);
            return false;
          })
        : [r.phone && 'whatsapp', r.linkedin_url && 'linkedin', r.email && 'email'].filter(Boolean);
      due.push({ id: r.id, name: r.name, nextDay: next, channels });
    }
  }

  return { totals, channelStats, rows, due };
}

function renderText(data) {
  const lines = [];
  lines.push('\n=== Outreach Dashboard · multi-channel ===\n');
  lines.push(`Contacts:        ${data.totals.contacts}`);
  lines.push(`Sent messages:   ${data.totals.sent}`);
  lines.push(`Replies:         ${data.totals.received} (from ${data.totals.replied} contacts)`);
  lines.push(`  • interested:  ${data.totals.interested}`);
  lines.push(`  • declined:    ${data.totals.declined}`);
  lines.push('');

  lines.push('Per-channel:');
  for (const [ch, s] of Object.entries(data.channelStats)) {
    lines.push(`  ${ch.padEnd(10)} out ${String(s.out).padStart(4)}   in ${String(s.in).padStart(4)}`);
  }
  lines.push('');

  lines.push(
    'ID  | Name                            | Drip | Out | Last sent          | Last reply         | Intent'
  );
  lines.push('----+---------------------------------+------+-----+--------------------+--------------------+----------');
  for (const r of data.rows) {
    const id = String(r.id).padEnd(3);
    const name = (r.name || '').slice(0, 31).padEnd(31);
    const drip = String(r.drip_day ?? '-').padEnd(4);
    const out = String(r.out_count).padEnd(3);
    const lastOut = fmt(r.last_send_at).padEnd(18);
    const lastIn = fmt(r.last_reply_at).padEnd(18);
    const intent = r.last_intent || '-';
    lines.push(`${id} | ${name} | ${drip} | ${out} | ${lastOut} | ${lastIn} | ${intent}`);
  }
  lines.push('');

  if (data.due.length) {
    lines.push(`Due for drip (${data.due.length}):`);
    for (const d of data.due) {
      lines.push(`  → #${d.id} ${d.name}  day ${d.nextDay}  channels: [${d.channels.join(', ')}]`);
    }
  } else {
    lines.push('No drip due.');
  }
  lines.push('');
  return lines.join('\n');
}

if (require.main === module) {
  const json = process.argv.includes('--json');
  const db = open();
  try {
    const data = build(db);
    if (json) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(renderText(data));
    }
  } finally {
    db.close();
  }
}

module.exports = { build, renderText };
