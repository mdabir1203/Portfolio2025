/**
 * Channel registry — a small list of channel drivers that the rest
 * of the orchestrator imports by name.
 *
 * Adding a new channel = add a file in this directory with the
 * { name, isReady, sendFirst, sendReply, sendNudge, pollReplies }
 * shape, then add it to CHANNELS below.
 *
 * The registry is the single source of truth for "which channels
 * exist". Run `node automation/channels/index.cjs` to list them.
 */

const whatsapp = require('./whatsapp.cjs');
const linkedin = require('./linkedin.cjs');
const email = require('./email.cjs');

const CHANNELS = {
  whatsapp,
  linkedin,
  email,
};

const DEFAULT_PRIORITY = ['whatsapp', 'linkedin', 'email'];

function get(name) {
  const c = CHANNELS[name];
  if (!c) throw new Error(`Unknown channel: ${name}. Available: ${Object.keys(CHANNELS).join(', ')}`);
  return c;
}

function list() {
  return Object.values(CHANNELS).map((c) => ({ name: c.name, label: c.label }));
}

/**
 * For a given contact, decide which channels to use and in what order.
 * Honors `contact.channel_priority` if set; otherwise falls back to
 * DEFAULT_PRIORITY filtered by each channel's `isReady` check.
 */
function channelsFor(contact) {
  let order = DEFAULT_PRIORITY;
  if (contact.channel_priority) {
    try {
      const parsed = JSON.parse(contact.channel_priority);
      if (Array.isArray(parsed) && parsed.length) order = parsed;
    } catch (_) { /* fall through to default */ }
  }
  return order.map(get).filter((c) => c.isReady(contact));
}

module.exports = { CHANNELS, get, list, channelsFor, DEFAULT_PRIORITY };

if (require.main === module) {
  console.log('Available channels:');
  for (const c of list()) console.log(`  - ${c.name} (${c.label})`);
  console.log(`\nDefault priority: ${DEFAULT_PRIORITY.join(' → ')}`);
}
