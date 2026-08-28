// /api/referral/subscribe — server function behind the QR landing's email drop.
// Captures name + email + referral code, sends the Day-0 Loom email via
// Resend, and stores the subscription in a D1 table for the 14-day follow-up
// engine to read later.
//
// D1 schema (created by `cloudflare/migrations/0017_referral_subscribers.sql`):
//   CREATE TABLE referral_subscribers (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT NOT NULL,
//     name TEXT,
//     code TEXT NOT NULL DEFAULT 'intro',
//     ref TEXT,
//     created_at INTEGER NOT NULL,
//     day0_sent_at INTEGER,
//     day3_sent_at INTEGER,
//     day7_sent_at INTEGER,
//     unsubscribed_at INTEGER
//   );
//   CREATE UNIQUE INDEX idx_referral_email ON referral_subscribers(email);

import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

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
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Day-0 email — the Loom.
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
    });
    if (day0Err) {
      console.error("Day-0 send error:", day0Err);
      throw new Error("Failed to send Day-0 email");
    }

    // 2. Persist to D1 so the follow-up engine can pick it up.
    //    Best-effort: if D1 isn't bound (e.g. local dev), we still return success
    //    for the Day-0 send — the Loom is the primary deliverable.
    const db = (globalThis as { DB?: D1Database }).DB;
    if (db) {
      try {
        await db
          .prepare(
            `INSERT INTO referral_subscribers
              (email, name, code, ref, created_at, day0_sent_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(email) DO UPDATE SET
               name = excluded.name,
               code = excluded.code,
               ref = excluded.ref,
               day0_sent_at = excluded.day0_sent_at,
               unsubscribed_at = NULL`
          )
          .bind(
            data.email,
            data.name ?? null,
            data.code,
            data.ref ?? null,
            Date.now(),
            Date.now()
          )
          .run();
      } catch (err) {
        console.warn("D1 insert failed (non-fatal):", err);
      }
    }

    return { success: true, sent: ["day0"] as const };
  });

/** Mark a subscriber as unsubscribed. Used by the one-tap list-unsubscribe link. */
export const unsubscribeReferral = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const db = (globalThis as { DB?: D1Database }).DB;
    if (!db) return { success: true };
    await db
      .prepare(
        "UPDATE referral_subscribers SET unsubscribed_at = ? WHERE email = ?"
      )
      .bind(Date.now(), data.email)
      .run();
    return { success: true };
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
