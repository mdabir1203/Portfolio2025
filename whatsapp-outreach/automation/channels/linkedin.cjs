/**
 * LinkedIn DM channel driver.
 *
 * ⚠️  LinkedIn aggressively rate-limits and bans accounts that look
 * like bots. This driver is OFF BY DEFAULT and refuses to run unless
 * the env var LINKEDIN_OPT_IN=1 is set, so a stray `npm start` can't
 * accidentally fire off 30 connection requests at 3am.
 *
 * Architecture mirrors the WhatsApp driver: it reuses the same
 * connect-to-existing-Chrome pattern (debug port 9222) and reuses
 * whichever signed-in LinkedIn session you already have open.
 *
 * What it does:
 *   - sendFirst  → opens the contact's profile, sends a connection
 *                   request with the `connectionNote` from personalize,
 *                   then (if already connected) sends the DM body.
 *   - sendReply  → sends a DM to an already-connected contact.
 *   - sendNudge  → sends a DM to an already-connected contact.
 *   - pollReplies → scrapes the messaging inbox for new threads.
 *
 * What it does NOT do (yet):
 *   - InMail (requires Sales Navigator).
 *   - Auto-accepting incoming connection requests.
 *   - Reading attachments / InMails.
 *
 * Run with: LINKEDIN_OPT_IN=1 node automation/run.cjs send --channel=linkedin
 */

const LINKEDIN_HOME = 'https://www.linkedin.com';

async function connectBrowser() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch (e) {
    throw new Error('puppeteer-core is not installed. Run `npm install` in whatsapp-outreach.');
  }
  const port = parseInt(process.env.CHROME_DEBUG_PORT || '9222', 10);
  try {
    const resp = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (resp.ok) {
      const data = await resp.json();
      console.log(`[linkedin] Connected to existing browser: ${data.Browser}`);
      return await puppeteer.connect({
        browserURL: `http://127.0.0.1:${port}`,
        defaultViewport: null,
      });
    }
  } catch (_) { /* fall through to launch */ }
  throw new Error('No Chrome/Edge with remote debugging is running. Start one with --remote-debugging-port=9222 and sign in to LinkedIn first.');
}

async function openLinkedInTab(browser) {
  const pages = await browser.pages();
  let page = pages.find((p) => p.url().includes('linkedin.com'));
  if (!page) {
    page = await browser.newPage();
    await page.goto(LINKEDIN_HOME, { waitUntil: 'domcontentloaded' });
  }
  return page;
}

async function waitForSignedIn(page) {
  console.log('[linkedin] Waiting for signed-in session...');
  await page.waitForSelector('input[aria-label*="Search"], [data-testid="nav-messaging"]', { timeout: 180_000 });
}

function guard() {
  if (process.env.LINKEDIN_OPT_IN !== '1') {
    throw new Error(
      'LinkedIn automation is opt-in. Set LINKEDIN_OPT_IN=1 in your env to run it. ' +
        'Be aware: aggressive automation can get your account restricted.'
    );
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendFirst(contact, message) {
  guard();
  if (!contact.linkedin_url) {
    throw new Error(`Contact ${contact.name} has no linkedin_url.`);
  }
  const browser = await connectBrowser();
  const page = await openLinkedInTab(browser);
  await waitForSignedIn(page);

  // Open the contact's profile
  await page.goto(contact.linkedin_url, { waitUntil: 'domcontentloaded' });
  // Wait for the Connect / Message button
  await page.waitForSelector('button', { timeout: 30_000 });
  await sleep(2000);

  // Try the "Connect" button first (sends with note). Fall back to "Message".
  let clicked = false;
  for (const label of ['Connect', 'Message']) {
    const handle = await page.evaluateHandle((lbl) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((b) => b.textContent && b.textContent.trim().toLowerCase() === lbl.toLowerCase()) || null;
    }, label);
    const el = handle.asElement();
    if (el) {
      try {
        await el.click();
        clicked = true;
        break;
      } catch (_) { /* try next */ }
    }
  }
  if (!clicked) {
    // Already connected or button hidden — try the messaging shortcut.
    await page.goto(`${LINKEDIN_HOME}/messaging/`, { waitUntil: 'domcontentloaded' });
  }

  // The Connect modal has a textarea for the note. We try to fill it; if
  // the modal is the messaging compose instead, we paste the DM body.
  try {
    const note = message.connectionNote || message.body || '';
    const textarea = await page.$('textarea[name="message"], textarea#custom-message, textarea');
    if (textarea && note) {
      await textarea.click();
      await textarea.evaluate((el) => { el.value = ''; });
      await page.keyboard.type(note.slice(0, 300), { delay: 8 });
    }
  } catch (_) { /* not a Connect modal — skip */ }

  // Hit Send. The DOM changes often; try a few known selectors.
  for (const sel of [
    'button[aria-label="Send now"]',
    'button[aria-label="Send"]',
    'button[data-testid="send-button"]',
    'button.ml1',
  ]) {
    try {
      const el = await page.$(sel);
      if (el) { await el.click(); break; }
    } catch (_) { /* try next */ }
  }

  return { preview: false, contactId: contact.id, channel: 'linkedin' };
}

async function sendReply(contact, message) {
  return sendFirst(contact, message); // same code path
}

async function sendNudge(contact, message) {
  return sendFirst(contact, message);
}

async function pollReplies() {
  // Minimal: open the messaging tab, list unread threads, return bodies.
  // Real implementation would diff against the DB to only return NEW
  // messages. For v2 we keep it simple — orchestrator can disable.
  guard();
  const browser = await connectBrowser();
  const page = await openLinkedInTab(browser);
  await waitForSignedIn(page);
  await page.goto(`${LINKEDIN_HOME}/messaging/`, { waitUntil: 'domcontentloaded' });
  await sleep(3000);
  const previews = await page.$$eval(
    '.msg-conversation-listitem__message-snippet, .msg-conversation-card__message-snippet, .conversation-snippet',
    (els) => els.map((e) => e.textContent?.trim()).filter(Boolean)
  );
  return previews.map((body) => ({ channel: 'linkedin', body }));
}

module.exports = {
  name: 'linkedin',
  label: 'LinkedIn DM',
  isReady(contact) {
    return Boolean(contact?.linkedin_url);
  },
  sendFirst,
  sendReply,
  sendNudge,
  pollReplies,
};
