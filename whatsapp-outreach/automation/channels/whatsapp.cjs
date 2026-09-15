/**
 * WhatsApp channel driver — thin wrapper around the existing v1
 * whatsapp_automation flow.
 *
 * The v1 module is a Puppeteer driver that:
 *   - connects to an existing Chrome (debug port 9222) with WhatsApp Web
 *     already signed in,
 *   - sends the first message via the wa.me deep link,
 *   - polls for incoming messages and replies based on intent,
 *   - sends 24h/72h nudges for contacts that didn't reply.
 *
 * This wrapper re-exports the same logic but stamped with the
 * `channel: 'whatsapp'` label so the multi-channel orchestrator can
 * route the right contact fields + message parts.
 *
 * The functions in this module are intentionally long-running (they
 * hold a single browser tab). The orchestrator schedules them per-
 * contact, not as a single batch.
 */

const { DEFAULT_CONTACTS } = require('../contacts.cjs');
const { generateForChannel, detectIntent } = require('../personalize.cjs');
const { open } = require('../database.cjs');

let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  // soft-fail; surfaced on first send
}

const CHROME_DEBUG_PORT = parseInt(process.env.CHROME_DEBUG_PORT || '9222', 10);
const fs = require('node:fs');
const os = require('node:os');
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
    try { if (fs.existsSync(p)) return p; } catch (_) {}
  }
  return null;
}

async function connect() {
  try {
    const resp = await fetch(`http://127.0.0.1:${CHROME_DEBUG_PORT}/json/version`);
    if (resp.ok) {
      const data = await resp.json();
      console.log(`[whatsapp] Connected to existing browser: ${data.Browser}`);
      return await puppeteer.connect({
        browserURL: `http://127.0.0.1:${CHROME_DEBUG_PORT}`,
        defaultViewport: null,
      });
    }
  } catch (_) {}
  const exe = findChrome();
  if (!exe) throw new Error('No Chrome/Edge found. Set CHROME_PATH or install Chrome.');
  return await puppeteer.launch({
    executablePath: exe,
    headless: false,
    defaultViewport: null,
    args: [
      `--remote-debugging-port=${CHROME_DEBUG_PORT}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
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
  await page.waitForSelector('#pane-side, [data-testid="chat-list"]', { timeout: 120_000 });
}

function e164(phone) {
  const digits = (phone || '').replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : '+' + digits;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function sendMessage(page, phone, body) {
  const url = `https://web.whatsapp.com/send?phone=${encodeURIComponent(e164(phone))}&text=${encodeURIComponent(body)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const inputSelector = '[data-testid="conversation-compose-box-input"]';
  await page.waitForSelector(inputSelector, { timeout: 60_000 });
  await sleep(500);
  for (const sel of [
    'button[data-testid="send"]',
    'button[aria-label="Send"]',
    'span[data-testid="send"]',
  ]) {
    try {
      const el = await page.$(sel);
      if (el) { await el.click(); return; }
    } catch (_) {}
  }
  await page.focus(inputSelector);
  await page.keyboard.press('Enter');
  await sleep(800);
}

/* -------- per-channel driver surface -------- */

async function sendFirst(contact, message) {
  if (!contact.phone) throw new Error(`Contact ${contact.name} has no phone.`);
  const browser = await connect();
  try {
    const page = await openWhatsAppTab(browser);
    await waitForWhatsAppReady(page);
    await sendMessage(page, contact.phone, message.body);
  } finally {
    try { await browser.disconnect(); } catch (_) {}
  }
  return { preview: false, contactId: contact.id, channel: 'whatsapp' };
}

async function sendReply(contact, message /*, inReplyTo */) {
  return sendFirst(contact, message);
}

async function sendNudge(contact, message) {
  return sendFirst(contact, message);
}

async function pollReplies() {
  // Minimal: open WhatsApp, list recent incoming messages. The
  // orchestrator (run.cjs) is responsible for diffing these against
  // what we already have on file.
  const browser = await connect();
  try {
    const page = await openWhatsAppTab(browser);
    await waitForWhatsAppReady(page);
    const chats = await page.$$('#pane-side [data-testid="cell-frame-container"], #pane-side .infinite-list-item');
    const out = [];
    for (const chat of chats.slice(0, 30)) {
      try {
        const name = await page.evaluate((el) => {
          const t = el.querySelector('[data-testid="cell-title"], ._ao3e');
          return t ? t.textContent : null;
        }, chat);
        const preview = await page.evaluate((el) => {
          const t = el.querySelector('[data-testid="last-msg-status"], .matched-text, ._ao3e span');
          return t ? t.textContent : null;
        }, chat);
        if (name) out.push({ channel: 'whatsapp', contactName: name.trim(), body: (preview || '').trim() });
      } catch (_) {}
    }
    return out;
  } finally {
    try { await browser.disconnect(); } catch (_) {}
  }
}

module.exports = {
  name: 'whatsapp',
  label: 'WhatsApp',
  isReady(contact) {
    return Boolean(contact?.phone);
  },
  sendFirst,
  sendReply,
  sendNudge,
  pollReplies,
  // re-exports for the legacy `whatsapp_automation.cjs` v1 entrypoint.
  _v1: { open, DEFAULT_CONTACTS, generateForChannel, detectIntent, connect, openWhatsAppTab, waitForWhatsAppReady, sendMessage, sleep },
};
