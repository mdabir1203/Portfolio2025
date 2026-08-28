// Cloudflare Worker — cron-triggered 14-day referral follow-up engine.
// Bound to the same D1 as /api/referral/subscribe. Wired with a Cron Trigger
// (e.g. "*/30 * * * *" — every 30 min) so we don't burn Resend quota.
//
// How to wire (one-time):
//   1. wrangler d1 create portfolio-referrals    # then bind the id in wrangler.toml
//   2. wrangler d1 migrations apply portfolio-referrals \
//        --file=cloudflare/migrations/0017_referral_subscribers.sql
//   3. In wrangler.toml, add a Cron Trigger:
//        [triggers]
//        crons = ["*/30 * * * *"]
//   4. Set the route or worker name to bind to your Pages project.
//
// What it does on each tick:
//   - Find subscribers where:
//       created_at + 3d  < now AND day3_sent_at IS NULL AND unsubscribed_at IS NULL
//     → send the Day-3 boardroom one-pager, mark day3_sent_at.
//   - Same for Day 7 with the personal-note template.
//
// Day 0 is handled in the same transaction as the subscribe (see
// src/server/referral.ts), so this worker only handles 3 and 7.

import { Resend } from "resend";

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
}

const LOOM_URL = "https://abir.getwaved.ai/loom-case-study.mp4";
const CAL_URL = "https://cal.com/abir-abbas/15min";
const ONE_PAGER_URL = "https://abir.getwaved.ai/press/brand-onepager.pdf";
const FROM = "Abir Abbas <abir@getwaved.ai>";

const DAY_MS = 24 * 60 * 60 * 1000;

interface Sub {
  id: number;
  email: string;
  name: string | null;
  code: string;
  created_at: number;
  day0_sent_at: number | null;
  day3_sent_at: number | null;
  day7_sent_at: number | null;
  unsubscribed_at: number | null;
}

export default {
  // Cron Trigger entry
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    await runFollowup(env);
  },

  // Optional HTTP entry for manual triggering / testing
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") return new Response("POST only", { status: 405 });
    const result = await runFollowup(env);
    return Response.json(result);
  },
};

async function runFollowup(env: Env) {
  const resend = new Resend(env.RESEND_API_KEY);
  const now = Date.now();

  const due3 = await env.DB.prepare(
    `SELECT id, email, name, code, created_at, day0_sent_at, day3_sent_at,
            day7_sent_at, unsubscribed_at
       FROM referral_subscribers
      WHERE unsubscribed_at IS NULL
        AND day3_sent_at IS NULL
        AND created_at <= ?
      LIMIT 50`
  )
    .bind(now - 3 * DAY_MS)
    .all<Sub>();

  const due7 = await env.DB.prepare(
    `SELECT id, email, name, code, created_at, day0_sent_at, day3_sent_at,
            day7_sent_at, unsubscribed_at
       FROM referral_subscribers
      WHERE unsubscribed_at IS NULL
        AND day3_sent_at IS NOT NULL
        AND day7_sent_at IS NULL
        AND created_at <= ?
      LIMIT 50`
  )
    .bind(now - 7 * DAY_MS)
    .all<Sub>();

  const sent3: string[] = [];
  for (const sub of due3.results ?? []) {
    if (sub.unsubscribed_at) continue;
    await sendDay3(resend, env, sub);
    sent3.push(sub.email);
  }

  const sent7: string[] = [];
  for (const sub of due7.results ?? []) {
    if (sub.unsubscribed_at) continue;
    await sendDay7(resend, env, sub);
    sent7.push(sub.email);
  }

  return { ok: true, sent3: sent3.length, sent7: sent7.length };
}

async function sendDay3(resend: Resend, env: Env, sub: Sub) {
  const name = sub.name ?? "there";
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f7f3ec;font-family:Inter,system-ui,sans-serif;color:#0e0e0e;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;padding:32px 16px;">
      <tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:8px 0;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:2px;color:#6b6b6b;text-transform:uppercase;">Ref · ${escapeHtml(sub.code)} · Day 3 of 3</td></tr>
        <tr><td style="padding:8px 0;font-family:Georgia,serif;font-size:32px;color:#0e0e0e;">Hi ${escapeHtml(name)},</td></tr>
        <tr><td style="padding:16px 0;font-size:16px;line-height:1.6;color:#0e0e0e;">As promised, the one-pager I would hand a CEO if I had 90 seconds in the elevator. The actual numbers, the actual scenarios, and a single line about how to start.</td></tr>
        <tr><td style="padding:16px 0;"><a href="${ONE_PAGER_URL}" style="display:inline-block;background:#0e0e0e;color:#f7f3ec;text-decoration:none;padding:14px 24px;border-radius:8px;font-weight:500;">Download the one-pager (PDF) →</a></td></tr>
        <tr><td style="padding:16px 0;font-size:14px;line-height:1.6;color:#3a3a3a;">If the Loom raised a question, the one-pager usually answers it. If it raised three, that's a chat. <a href="${CAL_URL}" style="color:#0c6b58;">cal.com/abir-abbas/15min</a>.</td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #e5e1d8;font-size:11px;color:#6b6b6b;font-family:ui-monospace,monospace;letter-spacing:1px;">ONE MORE EMAIL ON DAY 7 · UNSUBSCRIBE mailto:abir.abbas@proton.me?subject=unsubscribe</td></tr>
      </table></td></tr>
    </table>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [sub.email],
    subject: "The boardroom one-pager (PDF attached)",
    html,
    headers: {
      "List-Unsubscribe": `<mailto:abir.abbas@proton.me?subject=unsubscribe&body=${encodeURIComponent(sub.email)}>`,
    },
  });
  if (!error) {
    await env.DB.prepare(
      "UPDATE referral_subscribers SET day3_sent_at = ? WHERE id = ?"
    )
      .bind(Date.now(), sub.id)
      .run();
  }
}

async function sendDay7(resend: Resend, env: Env, sub: Sub) {
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
    subject: "One question, one calendar link",
    html,
    headers: {
      "List-Unsubscribe": `<mailto:abir.abbas@proton.me?subject=unsubscribe&body=${encodeURIComponent(sub.email)}>`,
    },
  });
  if (!error) {
    await env.DB.prepare(
      "UPDATE referral_subscribers SET day7_sent_at = ? WHERE id = ?"
    )
      .bind(Date.now(), sub.id)
      .run();
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}
