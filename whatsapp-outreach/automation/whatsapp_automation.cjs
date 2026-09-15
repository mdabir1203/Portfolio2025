/**
 * WhatsApp Web automation via Puppeteer.
 *
 *  - Connects to your existing Chrome (debug port) so it uses your logged-in WhatsApp Web session.
 *  - Sends the first message to each contact (with a human-like delay between sends).
 *  - Polls incoming messages, classifies intent (interested / price / available / decline / info),
 *    stores them in SQLite, and sends a contextual follow-up reply.
 *  - Schedules 24h and 72h nudges for contacts who haven't replied.
 *
 * Usage:
 *   node automation/whatsapp_automation.cjs send         # send first message to all pending contacts
 *   node automation/whatsapp_automation.cjs listen       # poll for incoming messages and reply
 *   node automation/whatsapp_automation.cjs run          # send + listen (foreground)
 *   node automation/whatsapp_automation.cjs seed         # populate contacts into the DB
 *
 * Setup:
 *   1. Close Chrome.
 *   2. Open Chrome with remote debugging: chrome.exe --remote-debugging-port=9222
 *   3. Open https://web.whatsapp.com in that Chrome and scan QR.
 *   4. Run: node automation/whatsapp_automation.cjs run
 *
 * Or skip manual setup and just run, the script will try to launch its own Chrome via puppeteer-core.
 */

const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const puppeteer = require('puppeteer-core');

const db = require('./database.cjs').open();
const { DEFAULT_CONTACTS } = require('./contacts.cjs');
const { generateFirst, generateNudge, generateReply, detectIntent } = require('./personalize.cjs');

const CHROME_DEBUG_PORT = parseInt(process.env.CHROME_DEBUG_PORT || '9222', 10);
const USER_HOME = process.env.USERPROFILE || process.env.HOME || `C:\\Users\\${process.env.USERNAME || 'default'}`;
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  `${USER_HOME}\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`,
  `${USER_HOME}\\AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe`,
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_PATHS) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (_) {}
  }
  return null;
}

async function connect() {
  // First, try to connect to an existing Chrome with remote debugging
  try {
    const resp = await fetch(`http://127.0.0.1:${CHROME_DEBUG_PORT}/json/version`);
    if (resp.ok) {
      const data = await resp.json();
      console.log(`[+] Connected to existing browser: ${data.Browser}`);
      const browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${CHROME_DEBUG_PORT}`,
        defaultViewport: null,
      });
      return browser;
    }
  } catch (_) {}

  // Otherwise, launch our own Chrome with debugging enabled
  const exe = findChrome();
  if (!exe) {
    throw new Error('No Chrome/Edge found. Install Chrome and re-run, or set CHROME_PATH env var.');
  }
  console.log(`[+] Launching browser: ${exe}`);
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: false,
    defaultViewport: null,
    args: [
      '--remote-debugging-port=' + CHROME_DEBUG_PORT,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  return browser;
}

async function openWhatsAppTab(browser) {
  const pages = await browser.pages();
  let page = pages.find((p) => p.url().includes('web.whatsapp.com'));
  if (!page) {
    page = await browser.newPage();
    await page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded' });
  }
  return page;
}

async function waitForWhatsAppReady(page) {
  console.log('[+] Waiting for WhatsApp Web to load...');
  // Wait for the search bar / chat list to appear
  await page.waitForSelector('#pane-side, [data-testid="chat-list"]', { timeout: 120_000 });
  console.log('[+] WhatsApp Web ready.');
}

function e164(phone) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : '+' + digits;
}

/**
 * Send a message to a phone number. Opens a new tab to the wa.me URL, types, sends.
 */
async function sendMessage(page, phone, message) {
  const url = `https://web.whatsapp.com/send?phone=${encodeURIComponent(e164(phone))}&text=${encodeURIComponent(message)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for the message input to be ready
  const inputSelector = '[data-testid="conversation-compose-box-input"]';
  await page.waitForSelector(inputSelector, { timeout: 60_000 });

  // WhatsApp Web usually pre-fills the text from the URL. Just click send.
  // But we need to wait for the send button to be enabled.
  await sleep(500);

  // Try send button - selector has changed over time, try a few
  const sendSelectors = [
    'button[data-testid="send"]',
    'button[aria-label="Send"]',
    'span[data-testid="send"]',
  ];
  let sent = false;
  for (const sel of sendSelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        sent = true;
        break;
      }
    } catch (_) {}
  }
  if (!sent) {
    // Fallback: press Enter
    await page.focus(inputSelector);
    await page.keyboard.press('Enter');
  }
  await sleep(800);
}

/**
 * Read recent messages from all chats.
 * Returns a list of { contactName, body, timestamp, isOutgoing }.
 */
async function readRecentChats(page) {
  // Get the chat list
  const chatList = await page.$$('#pane-side [data-testid="cell-frame-container"], #pane-side .infinite-list-item');
  const results = [];
  for (const chat of chatList.slice(0, 30)) {
    try {
      const name = await page.evaluate((el) => {
        const t = el.querySelector('[data-testid="cell-title"], ._ao3e');
        return t ? t.textContent : null;
      }, chat);
      const preview = await page.evaluate((el) => {
        const t = el.querySelector('[data-testid="last-msg-status"], .matched-text, ._ao3e span');
        return t ? t.textContent : null;
      }, chat);
      if (name) results.push({ contactName: name.trim(), preview: (preview || '').trim() });
    } catch (_) {}
  }
  return results;
}

/**
 * Read the full message history of the currently open chat.
 */
async function readCurrentChat(page) {
  // Get all incoming messages in the currently open chat
  const messages = await page.$$eval(
    'div.message-in .copyable-text, div[data-testid="msg-container"] .copyable-text',
    (els) => els.map((el) => el.textContent || el.innerText)
  );
  return messages;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Normalize a SQLite CURRENT_TIMESTAMP ("YYYY-MM-DD HH:MM:SS", UTC) or
 * an ISO string to a parseable Date. SQLite's default format lacks 'T'
 * and 'Z', and the legacy code path used to do `s + 'Z'` blindly —
 * which broke for JS ISO strings that already end in 'Z'.
 */
function parseSqliteUtc(s) {
  if (!s) return s;
  if (s.includes('T')) return s.endsWith('Z') ? s : s + 'Z';
  return s.replace(' ', 'T') + 'Z';
}

/* ---------------------- DB ops ---------------------- */

function upsertContact(c) {
  const existing = db.prepare('SELECT * FROM contacts WHERE phone = ?').get(c.phone);
  if (existing) return existing;
  const info = db
    .prepare(
      'INSERT INTO contacts (name, phone, source, tags, notes) VALUES (?, ?, ?, ?, ?)'
    )
    .run(c.name, c.phone, c.source || null, JSON.stringify(c.tags || []), c.profile ? JSON.stringify(c.profile) : null);
  return db.prepare('SELECT * FROM contacts WHERE id = ?').get(info.lastInsertRowid);
}

function getContactByPhone(phone) {
  return db.prepare('SELECT * FROM contacts WHERE phone = ?').get(phone);
}

function recordOut(contactId, body) {
  const info = db
    .prepare('INSERT INTO messages (contact_id, direction, body) VALUES (?, ?, ?)')
    .run(contactId, 'out', body);
  return info.lastInsertRowid;
}

function recordIn(contactId, body) {
  const info = db
    .prepare('INSERT INTO messages (contact_id, direction, body) VALUES (?, ?, ?)')
    .run(contactId, 'in', body);
  // Classify and store as reply
  const intent = detectIntent(body);
  db.prepare('INSERT INTO replies (contact_id, message_id, body, intent) VALUES (?, ?, ?, ?)').run(
    contactId,
    info.lastInsertRowid,
    body,
    intent
  );
  return { id: info.lastInsertRowid, intent };
}

function lastOutForContact(contactId) {
  return db
    .prepare('SELECT * FROM messages WHERE contact_id = ? AND direction = ? ORDER BY id DESC LIMIT 1')
    .get(contactId, 'out');
}

function listContactsNeedingFirstSend() {
  return db
    .prepare(
      `SELECT c.* FROM contacts c
       LEFT JOIN messages m ON m.contact_id = c.id AND m.direction = 'out'
       WHERE m.id IS NULL`
    )
    .all();
}

function listContactsNeedingNudge(olderThanHours) {
  return db
    .prepare(
      `SELECT c.*, MAX(m.sent_at) as last_out
       FROM contacts c
       JOIN messages m ON m.contact_id = c.id AND m.direction = 'out'
       WHERE c.id NOT IN (
         SELECT contact_id FROM replies
       )
       GROUP BY c.id
       HAVING last_out < datetime('now', ?)
         AND c.id NOT IN (
           SELECT contact_id FROM followups
           WHERE status = 'sent' AND reason LIKE 'nudge%' AND due_at > datetime('now', '-1 day')
         )`,
      [`-${olderThanHours} hours`]
    )
    .all();
}

function logFollowup(contactId, reason) {
  db.prepare('INSERT INTO followups (contact_id, due_at, reason) VALUES (?, datetime("now"), ?)').run(
    contactId,
    reason
  );
}

/* ---------------------- main flows ---------------------- */

async function seed() {
  console.log('[+] Seeding contacts...');
  for (const c of DEFAULT_CONTACTS) {
    upsertContact(c);
  }
  const count = db.prepare('SELECT COUNT(*) as n FROM contacts').get().n;
  console.log(`[+] Done. ${count} contacts in DB.`);
  db.close();
}

async function sendAllFirst(browser) {
  const page = await openWhatsAppTab(browser);
  await waitForWhatsAppReady(page);

  const pending = listContactsNeedingFirstSend();
  console.log(`[+] ${pending.length} contacts waiting for first message.`);
  for (const c of pending) {
    const profile = c.notes ? JSON.parse(c.notes) : null;
    const contactObj = { name: c.name, phone: c.phone, source: c.source, profile };
    const body = generateFirst(contactObj);
    console.log(`\n→ ${c.name} (${c.phone})`);
    try {
      await sendMessage(page, c.phone, body);
      recordOut(c.id, body);
      console.log(`  ✓ sent`);
      await sleep(8000 + Math.random() * 4000); // 8-12s between sends to avoid flagging
    } catch (e) {
      console.log(`  ✗ FAILED: ${e.message}`);
    }
  }
}

async function listen(browser) {
  const page = await openWhatsAppTab(browser);
  await waitForWhatsAppReady(page);
  console.log('[+] Listening for incoming messages. Press Ctrl+C to stop.\n');

  // Track which chat we're currently viewing so we know the messages
  // we read are from THIS contact.
  let currentContactId = null;

  // Poll every 15s
  while (true) {
    try {
      // Check the title bar / header to know which chat is open
      const headerName = await page.$eval(
        'header [data-testid="conversation-title"], header span[dir="auto"]',
        (el) => el.textContent?.trim()
      ).catch(() => null);

      if (headerName) {
        // Find contact in DB by name (approximate) or skip
        const contact = db
          .prepare('SELECT * FROM contacts WHERE LOWER(name) LIKE ? OR LOWER(?) LIKE ?')
          .get(`%${headerName.toLowerCase()}%`, headerName.toLowerCase(), `%${headerName.toLowerCase()}%`);
        if (contact) {
          currentContactId = contact.id;
          // Read last few incoming messages
          const incoming = await page.$$eval(
            'div.message-in div.copyable-text, div.message-in [data-testid="msg-text"]',
            (els) => els.slice(-5).map((el) => el.textContent || el.innerText)
          );
          for (const body of incoming) {
            const clean = body.trim();
            if (!clean) continue;
            // Skip if already recorded
            const exists = db
              .prepare('SELECT 1 FROM messages WHERE contact_id = ? AND direction = ? AND body = ?')
              .get(currentContactId, 'in', clean);
            if (exists) continue;
            const { intent } = recordIn(currentContactId, clean);
            console.log(`← [${contact.name}] (${intent}) ${clean.slice(0, 100)}`);

            // Auto-reply based on intent
            const reply = generateReply(contact, intent);
            if (reply) {
              await sleep(2000 + Math.random() * 2000);
              const inputSel = '[data-testid="conversation-compose-box-input"]';
              await page.waitForSelector(inputSel, { timeout: 30_000 });
              await page.click(inputSel);
              await page.keyboard.type(reply, { delay: 10 });
              // Send via Enter
              await page.keyboard.press('Enter');
              recordOut(currentContactId, reply);
              console.log(`→ [${contact.name}] (auto-reply ${intent})`);
              await sleep(5000);
            }
          }
        }
      }
    } catch (e) {
      console.log(`[!] listen error: ${e.message}`);
    }
    await sleep(15_000);
  }
}

async function nudgeStale(browser) {
  const page = await openWhatsAppTab(browser);
  await waitForWhatsAppReady(page);
  const due24 = listContactsNeedingNudge(24);
  const due72 = listContactsNeedingNudge(72);
  const due = [...new Map([...due24, ...due72].map((c) => [c.id, c])).values()];

  console.log(`[+] ${due.length} contacts need nudging.`);
  for (const c of due) {
    const profile = c.notes ? JSON.parse(c.notes) : null;
    const contactObj = { name: c.name, phone: c.phone, source: c.source, profile };
    // figure out hours since last out
    const last = lastOutForContact(c.id);
    const hoursAgo = last
      ? (Date.now() - new Date(parseSqliteUtc(last.sent_at)).getTime()) / 3_600_000
      : 999;
    const body = generateNudge(contactObj, hoursAgo);
    if (!body) continue;
    try {
      await sendMessage(page, c.phone, body);
      recordOut(c.id, body);
      logFollowup(c.id, `nudge${Math.round(hoursAgo)}h`);
      console.log(`  ✓ nudged ${c.name} (${Math.round(hoursAgo)}h since last)`);
      await sleep(10_000);
    } catch (e) {
      console.log(`  ✗ nudge failed: ${e.message}`);
    }
  }
}

async function main() {
  const cmd = process.argv[2] || 'run';
  if (cmd === 'seed') {
    return seed();
  }

  console.log('[+] Connecting to browser...');
  const browser = await connect();
  try {
    if (cmd === 'send') {
      await sendAllFirst(browser);
    } else if (cmd === 'listen') {
      await listen(browser);
    } else if (cmd === 'nudge') {
      await nudgeStale(browser);
    } else if (cmd === 'run') {
      await sendAllFirst(browser);
      console.log('\n[+] First messages sent. Now listening for replies (Ctrl+C to stop).\n');
      await listen(browser);
    } else {
      console.log('Unknown command. Use: seed | send | listen | nudge | run');
    }
  } finally {
    db.close();
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
