// /api/referral/subscribe — server function behind the QR landing's email drop.
// Captures name + email + referral code, sends the Day-0 Loom email via
// Resend, and stores the subscription in Cloudflare KV so the webhook
// handler can read it on open/click events to drive the Day-3 and Day-7 drip.
//
// Storage:
//   - KV binding `REFERRALS` (free tier, no migration needed).
//   - Best-effort: if KV isn't bound (e.g. local dev), the Day-0 send
//     still succeeds and the drip simply won't fire. The user gets the
//     Loom; we lose the follow-up. That's the right trade for a graceful
//     fallback — never surface a server error to a visitor who just
//     typed their email.
//
// Architecture note:
//   We do NOT use a cron Worker to drive the follow-up sequence. Instead,
//   the Resend webhook (see /api/referral/webhook) is the scheduler: when
//   Day 0 is opened, the webhook handler checks the elapsed time and
//   fires Day 3 / Day 7 accordingly. This means:
//     - no separate Worker deploy
//     - no D1 migration
//     - smarter drip (we don't send Day 3 to a Day 0 that never opened)
//
// See: src/routes/api/referral/webhook.ts and src/server/referral-store.ts.

import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";
import { readSubscriber, writeSubscriber, patchSubscriber, type Subscriber } from "./referral-store";

const subscribeSchema = z.object({
  email: z.string().email().max(320),
  name: z.string().max(120).optional(),
  code: z.string().max(40).default("intro"),
  ref: z.string().max(40).optional(),
  ts: z.number().int().nonnegative().optional(),
});

const DAY0_SUBJECT = "Your 30-sec Loom of the AED 111K story";
const DAY3_SUBJECT = "The boardroom one-pager (PDF attached)";
const DAY7_SUBJECT = "One question, one calendar link";

const LOOM_URL = "https://abir.getwaved.ai/loom-case-study.mp4";
const CAL_URL = "https://cal.com/abir-abbas/15min";
const FROM = "Abir Abbas <abir@getwaved.ai>";

export const subscribeReferral = createServerFn({ method: "POST" })
  .inputValidator(subscribeSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const resend = apiKey ? new Resend(apiKey) : null;

    // 1. Day-0 email — the Loom.
    if (resend) {
      const day0Html = day0Email(data.name ?? "there", data.code);
      const { error: day0Err } = await resend.emails.send({
        from: FROM,
        to: [data.email],
        subject: DAY0_SUBJECT,
        html: day0Html,
        text: day0Text(data.name ?? "there"),
        headers: {
          "List-Unsubscribe": `<mailto:abir.abbas@proton.me?subject=unsubscribe&body=${encodeURIComponent(data.email)}>`,
          "X-Entity-Type": "transactional",
        },
        // Tag the email so we can correlate Resend webhook events to our
        // subscriber row. `day0` is a static tag; the per-recipient tags
        // (email, code) are dynamic.
        tags: [
          { name: "drip", value: "day0" },
          { name: "code", value: data.code },
        ],
      });
      if (day0Err) {
        console.error("Day-0 send error:", day0Err);
        throw new Error("Failed to send Day-0 email");
      }
    } else {
      console.warn("RESEND_API_KEY not set; skipping Day-0 send (dev fallback)");
    }

    // 2. Persist to KV so the webhook can find this row on open/click.
    //    If the same email subscribes twice, we refresh created_at and
    //    reset the drip state — a re-scan means they want a fresh start.
    const existing = await readSubscriber(data.email);
    const now = Date.now();
    const sub: Subscriber = {
      email: data.email,
      name: data.name,
      code: data.code,
      ref: data.ref,
      created_at: now,
      day0_sent_at: now,
    };
    await writeSubscriber(sub);

    return { success: true, sent: ["day0"] as const, replaced: !!existing };
  });

/** Mark a subscriber as unsubscribed. */
export const unsubscribeReferral = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const patched = await patchSubscriber(data.email, { unsubscribed_at: Date.now() });
    return { success: true, found: !!patched };
  });

// ─────────────────────  Email templates  ─────────────────────

function day0Text(name: string) {
  return [
    `Hi ${name},`,
    ``,
    `You scanned the QR. Here is the 30-second Loom:`,
    LOOM_URL,
    ``,
    `Three numbers you should walk away with:`,
    `  - AED 111,246 of trapped backlog, recovered in 30 days`,
    `  - 11.1 : 1 value-to-cost ratio on a AED 10K build`,
    `  - 70.5% completion rate after the system went live`,
    ``,
    `If a 15-min chat makes sense, here is my cal: ${CAL_URL}`,
    ``,
    `— Abir`,
    ``,
    `Day 3 (auto): the boardroom one-pager (PDF).`,
    `Day 7 (auto): one personal note from me.`,
    `Unsubscribe in one tap: mailto:abir.abbas@proton.me?subject=unsubscribe`,
  ].join("\n");
}

function day0Email(name: string, code: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f7f3ec;font-family:Inter,system-ui,sans-serif;color:#0e0e0e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:24px 0 8px 0;font-family:ui-monospace,JetBrains Mono,monospace;font-size:11px;letter-spacing:2px;color:#6b6b6b;text-transform:uppercase;">
          Ref · ${code} · Day 0 of 3
        </td></tr>
        <tr><td style="padding:8px 0 4px 0;font-family:Georgia,'Instrument Serif',serif;font-size:36px;font-weight:500;letter-spacing:-0.5px;color:#0e0e0e;">
          Hi ${escapeHtml(name)},
        </td></tr>
        <tr><td style="padding:16px 0 8px 0;font-size:17px;line-height:1.6;color:#0e0e0e;">
          You scanned the QR. Here is your 30-second Loom of the
          <em style="color:#0c6b58;">AED 111,246</em> story.
        </td></tr>
        <tr><td style="padding:16px 0 8px 0;">
          <a href="${LOOM_URL}" style="display:inline-block;background:#0e0e0e;color:#f7f3ec;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:500;font-size:15px;">
            Watch the 30-sec Loom →
          </a>
        </td></tr>
        <tr><td style="padding:16px 0 0 0;font-size:14px;line-height:1.6;color:#3a3a3a;">
          If a 15-min chat makes sense, my cal is below. No pitch, no slide deck.
        </td></tr>
        <tr><td style="padding:12px 0 32px 0;">
          <a href="${CAL_URL}" style="color:#0c6b58;font-weight:500;text-decoration:underline;">
            cal.com/abir-abbas/15min →
          </a>
        </td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #e5e1d8;font-size:11px;line-height:1.6;color:#6b6b6b;font-family:ui-monospace,JetBrains Mono,monospace;letter-spacing:1px;">
          DAY 3 (auto) · the boardroom one-pager (PDF)
          <br/>DAY 7 (auto) · a personal note from me
          <br/>UNSUBSCRIBE · mailto:abir.abbas@proton.me?subject=unsubscribe
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─────────────────────  Day-3 + Day-7 senders (webhook-only)  ─────────────────────
// These are called from the webhook handler, not from the subscribe flow.
// They are exported here so the webhook route can import them from one place.

export async function sendDay3(sub: Subscriber): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY not set" };
  if (sub.unsubscribed_at) return { ok: false, reason: "unsubscribed" };
  if (sub.bad_address) return { ok: false, reason: "bad_address" };

  const resend = new Resend(apiKey);
  const name = sub.name ?? "there";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f7f3ec;font-family:Inter,system-ui,sans-serif;color:#0e0e0e;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 16px;">
      <tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:8px 0;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:2px;color:#6b6b6b;text-transform:uppercase;">Ref · ${escapeHtml(sub.code)} · Day 3 of 3</td></tr>
        <tr><td style="padding:8px 0;font-family:Georgia,serif;font-size:32px;color:#0e0e0e;">Hi ${escapeHtml(name)},</td></tr>
        <tr><td style="padding:16px 0;font-size:16px;line-height:1.6;color:#0e0e0e;">As promised, the one-pager I would hand a CEO if I had 90 seconds in the elevator. The actual numbers, the actual scenarios, and a single line about how to start.</td></tr>
        <tr><td style="padding:16px 0;"><a href="https://abir.getwaved.ai/press/brand-onepager.pdf" style="display:inline-block;background:#0e0e0e;color:#f7f3ec;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:500;">Download the one-pager (PDF) →</a></td></tr>
        <tr><td style="padding:16px 0;font-size:14px;line-height:1.6;color:#3a3a3a;">If the Loom raised a question, the one-pager usually answers it. If it raised three, that's a chat. <a href="${CAL_URL}" style="color:#0c6b58;">cal.com/abir-abbas/15min</a>.</td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #e5e1d8;font-size:11px;color:#6b6b6b;font-family:ui-monospace,monospace;letter-spacing:1px;">ONE MORE EMAIL ON DAY 7 · UNSUBSCRIBE mailto:abir.abbas@proton.me?subject=unsubscribe</td></tr>
      </table></td></tr>
    </table>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [sub.email],
    subject: DAY3_SUBJECT,
    html,
    headers: {
      "List-Unsubscribe": `<mailto:abir.abbas@proton.me?subject=unsubscribe&body=${encodeURIComponent(sub.email)}>`,
    },
    tags: [
      { name: "drip", value: "day3" },
      { name: "code", value: sub.code },
    ],
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function sendDay7(sub: Subscriber): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY not set" };
  if (sub.unsubscribed_at) return { ok: false, reason: "unsubscribed" };
  if (sub.bad_address) return { ok: false, reason: "bad_address" };

  const resend = new Resend(apiKey);
  const name = sub.name ?? "there";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f7f3ec;font-family:Inter,system-ui,sans-serif;color:#0e0e0e;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 16px;">
      <tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:8px 0;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:2px;color:#6b6b6b;text-transform:uppercase;">Ref · ${escapeHtml(sub.code)} · Day 7 · last one</td></tr>
        <tr><td style="padding:8px 0;font-family:Georgia,serif;font-size:28px;color:#0e0e0e;">One question.</td></tr>
        <tr><td style="padding:16px 0;font-size:16px;line-height:1.6;color:#0e0e0e;">Is there a role on your team in the next 90 days where an AI Architect who ships would help? If yes, <a href="${CAL_URL}" style="color:#0c6b58;font-weight:500;">15 minutes here</a> and I'll bring the case study tailored to your stack. If no, no follow-up, I promise.</td></tr>
        <tr><td style="padding:24px 0;font-size:16px;color:#0e0e0e;">— Abir</td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #e5e1d8;font-size:11px;color:#6b6b6b;font-family:ui-monospace,monospace;letter-spacing:1px;">END OF SEQUENCE · UNSUBSCRIBE mailto:abir.abbas@proton.me?subject=unsubscribe</td></tr>
      </table></td></tr>
    </table>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [sub.email],
    subject: DAY7_SUBJECT,
    html,
    headers: {
      "List-Unsubscribe": `<mailto:abir.abbas@proton.me?subject=unsubscribe&body=${encodeURIComponent(sub.email)}>`,
    },
    tags: [
      { name: "drip", value: "day7" },
      { name: "code", value: sub.code },
    ],
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
