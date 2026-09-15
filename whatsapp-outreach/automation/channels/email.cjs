/**
 * Email channel driver.
 *
 * Uses nodemailer with SMTP. The driver is intentionally thin:
 *   - sendFirst(contact, message)         → first outreach
 *   - sendReply(contact, message, inReplyTo)
 *   - sendNudge(contact, message, day)
 *   - pollReplies()                       → not implemented in-process
 *                                           (requires IMAP or Gmail API
 *                                           — out of scope for v2)
 *
 * The driver is safe to import without nodemailer installed: it only
 * throws on `sendFirst`/`sendReply`/`sendNudge` if a real send is
 * attempted without the dependency.
 *
 * Setup (env vars, see README):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
 *
 * The driver supports a "preview mode" (default when SMTP_HOST is not
 * set): it just logs the rendered email and returns { preview: true }.
 */

const path = require('node:path');

let _transporter = null;
function transporter() {
  if (_transporter) return _transporter;
  if (!process.env.SMTP_HOST) return null;
  // Lazy-require so a missing nodemailer doesn't break the preview path.
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (e) {
    throw new Error(
      'nodemailer is not installed. Run `npm install nodemailer` in the whatsapp-outreach folder to enable real email sending.'
    );
  }
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === '1',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return _transporter;
}

function fromAddress() {
  return process.env.EMAIL_FROM || process.env.SMTP_USER || 'abir.abbas@proton.me';
}

async function _send(contact, message, opts = {}) {
  if (!contact.email) {
    throw new Error(`Contact ${contact.name || contact.id} has no email address set.`);
  }
  const t = transporter();
  if (!t) {
    // Preview mode — no SMTP configured. Render to terminal.
    console.log(
      [
        '',
        '──── EMAIL PREVIEW ───────────────────────────────────',
        `To:      ${contact.name} <${contact.email}>`,
        `Subject: ${message.subject || '(no subject)'}`,
        `In-Reply-To: ${opts.inReplyTo || '(none)'}`,
        '──────────────────────────────────────────────────────',
        message.body,
        '──────────────────────────────────────────────────────',
        '',
      ].join('\n')
    );
    return { preview: true, contactId: contact.id, channel: 'email' };
  }
  const info = await t.sendMail({
    from: fromAddress(),
    to: `${contact.name || ''} <${contact.email}>`.trim(),
    subject: message.subject || '',
    text: message.body,
    inReplyTo: opts.inReplyTo,
    references: opts.references,
  });
  return { preview: false, messageId: info.messageId, contactId: contact.id, channel: 'email' };
}

async function sendFirst(contact, message) {
  return _send(contact, message);
}

async function sendReply(contact, message, inReplyTo) {
  return _send(contact, message, { inReplyTo });
}

async function sendNudge(contact, message) {
  return _send(contact, message);
}

/**
 * Email replies need an IMAP / Gmail API listener. We don't ship that
 * here — instead the run-orchestrator can drop a webhook on the
 * portfolio's /api/referral/webhook or a new /api/email/inbound route
 * and have it record `replies` rows directly. This function returns
 * an empty array so the orchestrator can run the loop without crashing.
 */
async function pollReplies() {
  return [];
}

module.exports = {
  name: 'email',
  label: 'Email',
  // Eager pre-flight check the orchestrator can use to decide whether
  // to schedule email on a contact (skip if no email is on file).
  isReady(contact) {
    return Boolean(contact?.email);
  },
  sendFirst,
  sendReply,
  sendNudge,
  pollReplies,
};
