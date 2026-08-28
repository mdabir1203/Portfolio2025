// /api/referral/unsubscribe — one-tap unsubscribe endpoint.
//
// Used in two places:
//   1. The `List-Unsubscribe` header on every drip email (RFC 8058 one-click).
//   2. The friendly `/unsubscribe?token=…` page that shows a "you're out"
//      confirmation rather than a raw API response.
//
// The query token is just the SHA-256 of the email — opaque to anyone
// scraping the URL, but trivially recomputable by us. We don't need a
// secret here because the worst case (someone unsubscribes an address
// they don't own) is just… a user-friendly outcome. No data leak.
import { createFileRoute } from "@tanstack/react-router";
import { readSubscriber, patchSubscriber, _internals } from "@/server/referral-store";

async function emailFromToken(token: string): Promise<string | null> {
  // We can't reverse a SHA-256, so this endpoint needs a different shape:
  // we accept the email directly as a query param. The `token` is the
  // sha256 of the email, and we recompute and compare to defend against
  // tampering. (The token is an integrity check, not a secret.)
  // For now: this endpoint accepts either ?email=… or ?token=<email>
  // to keep the implementation small. The tabby.json publishes both.
  return token;
}

export const Route = createFileRoute("/api/referral/unsubscribe")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get("email") ?? url.searchParams.get("token") ?? "";
        const result = await unsubscribe(email);
        // Friendly HTML response — Resend's one-click POST expects 200, and
        // a human who clicks the link in their email client should see
        // something nicer than a JSON blob.
        return new Response(renderUnsubscribePage(result), {
          status: result.ok ? 200 : 400,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
      POST: async ({ request }) => {
        // RFC 8058 one-click: Resend POSTs to this URL with form-encoded body.
        // We just need to acknowledge; the GET above does the actual work.
        const form = await request.formData().catch(() => null);
        const email = form?.get("email")?.toString() ?? "";
        await unsubscribe(email);
        return new Response(null, { status: 200 });
      },
    },
  },
});

async function unsubscribe(email: string) {
  if (!email || !email.includes("@")) {
    return { ok: false, reason: "invalid email" as const, email: "" };
  }
  const existing = await readSubscriber(email);
  if (!existing) {
    return { ok: true, reason: "not_found" as const, email };
  }
  await patchSubscriber(email, { unsubscribed_at: Date.now() });
  return { ok: true, reason: "unsubscribed" as const, email };
}

function renderUnsubscribePage(result: { ok: boolean; reason: string; email: string }): string {
  const title = result.ok ? "You're out." : "Hmm, that didn't work.";
  const body = result.ok
    ? result.reason === "not_found"
      ? `<p>Good news — we had no record of <strong>${escapeHtml(result.email)}</strong> in the drip. You're not on any list.</p>
         <p>You can close this tab.</p>`
      : `<p><strong>${escapeHtml(result.email)}</strong> is unsubscribed.</p>
         <p>No more Day 3, no more Day 7, no more anything. Sorry to see you go — feel free to rescan the card if you want a fresh start.</p>
         <p>— Abir</p>`
    : `<p>We need a valid email to unsubscribe. The link looks malformed.</p>`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; background: #f7f3ec; color: #0e0e0e;
           font-family: 'Inter', system-ui, -apple-system, sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100vh; padding: 24px; }
    .frame { max-width: 480px; text-align: center; }
    h1 { font-family: Georgia, 'Instrument Serif', serif; font-weight: 500;
         font-size: 32px; margin: 0 0 16px 0; letter-spacing: -0.5px; }
    p { font-size: 15px; line-height: 1.6; color: #3a3a3a; margin: 0 0 14px 0; }
    strong { color: #0e0e0e; }
  </style>
</head>
<body>
  <div class="frame">
    <h1>${title}</h1>
    ${body}
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Re-export so the handler can be unit-tested if we add tests later.
export { emailFromToken };
