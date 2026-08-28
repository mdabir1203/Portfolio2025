// /api/referral/webhook — Resend webhook receiver.
//
// Resend sends POST requests here on every event for every email we send
// through the referral system. We use these events to drive the Day-3
// and Day-7 drip:
//
//   email.opened     → record first-open timestamp; if elapsed >= 72h
//                       and Day 3 not yet sent → send Day 3.
//   email.opened     → same gating for Day 7 at 168h.
//   email.delivered  → record delivery timestamp (informational).
//   email.bounced    → mark bad_address = true; never send again.
//   email.complained → mark unsubscribed_at; never send again.
//
// This replaces the original cron Worker design. Pros:
//   - no separate Worker deploy
//   - no D1 migration / binding
//   - smart drip: we don't send Day 3 to a Day 0 that never opened
//   - real-time: Day 3 fires the moment a person opens Day 0 + waits 72h
//
// Security:
//   Resend signs every webhook with `svix-*` headers + an HMAC-SHA256
//   signature in `svix-signature`. We MUST verify before processing —
//   otherwise anyone can POST a fake "open" event and trigger the drip.
//   Set RESEND_WEBHOOK_SECRET in the Pages env. If unset (local dev),
//   we accept unsigned requests so the route is testable in isolation.
import { createFileRoute } from "@tanstack/react-router";
import { readSubscriber, patchSubscriber, type Subscriber } from "@/server/referral-store";
import { sendDay3, sendDay7 } from "@/server/referral";

const DAY_MS = 24 * 60 * 60 * 1000;

export const Route = createFileRoute("/api/referral/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Read raw body — we need the bytes for HMAC verification, NOT
        //    a parsed JSON object, because the signature is over the raw bytes.
        const rawBody = await request.text();

        // 2. Verify the signature (if a secret is configured).
        const secret = process.env.RESEND_WEBHOOK_SECRET;
        if (secret) {
          const ok = await verifyResendSignature(request, rawBody, secret);
          if (!ok) {
            return new Response(JSON.stringify({ error: "invalid signature" }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }
        } else if (process.env.NODE_ENV === "production") {
          // Production MUST have a secret. Refuse unsigned requests.
          return new Response(JSON.stringify({ error: "RESEND_WEBHOOK_SECRET not set" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        // 3. Parse the event.
        let event: ResendEvent;
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        // 4. Look up the subscriber. Resend's event payload includes the
        //    recipient email; we use that as the lookup key.
        const email = (event.data?.to ?? [])[0] ?? event.data?.email;
        if (!email) {
          return new Response(JSON.stringify({ ok: true, ignored: "no recipient" }), {
            headers: { "content-type": "application/json" },
          });
        }

        const sub = await readSubscriber(email);
        if (!sub) {
          // We never sent to this address — Resend must be echoing a test
          // send or a different list. Acknowledge so they don't retry.
          return new Response(JSON.stringify({ ok: true, ignored: "unknown recipient" }), {
            headers: { "content-type": "application/json" },
          });
        }

        // 5. Dispatch by event type.
        const result = await handleEvent(event.type, sub, event.created_at);
        return new Response(JSON.stringify({ ok: true, ...result }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});

async function handleEvent(
  type: string,
  sub: Subscriber,
  eventTs: number,
): Promise<Record<string, unknown>> {
  const now = eventTs || Date.now();

  switch (type) {
    case "email.sent": {
      // Informational. We already marked day0_sent_at in subscribeReferral.
      return { handled: "sent" };
    }

    case "email.delivered": {
      await patchSubscriber(sub.email, { day0_delivered_at: now });
      return { handled: "delivered" };
    }

    case "email.opened": {
      // First open of this drip email — record it. The drip tag tells us
      // which email in the sequence this is, so we can fire the next one.
      const drip = (sub as Subscriber & { _drip?: string })._drip ?? detectDripFromSubject(sub, type);
      // We use sent_at fields directly: the most recently sent day that
      // doesn't have a corresponding opened_at is the one being opened.
      const patch: Partial<Subscriber> = {};
      let openedWhichDay: "day0" | "day3" | "day7" | null = null;

      if (sub.day0_sent_at && !sub.day0_opened_at) {
        patch.day0_opened_at = now;
        openedWhichDay = "day0";
      } else if (sub.day3_sent_at && !sub.day3_opened_at) {
        patch.day3_opened_at = now;
        openedWhichDay = "day3";
      }

      const updated = Object.keys(patch).length > 0
        ? await patchSubscriber(sub.email, patch)
        : sub;
      if (!updated) return { handled: "open", error: "patch failed" };

      // Now decide: should Day 3 or Day 7 fire?
      const sent: string[] = [];
      if (
        openedWhichDay === "day0" &&
        updated.day0_opened_at &&
        !updated.day3_sent_at &&
        now - updated.day0_opened_at >= 3 * DAY_MS
      ) {
        const r = await sendDay3(updated);
        if (r.ok) {
          await patchSubscriber(sub.email, { day3_sent_at: Date.now() });
          sent.push("day3");
        }
      }
      if (
        openedWhichDay === "day0" &&
        updated.day0_opened_at &&
        !updated.day7_sent_at &&
        now - updated.day0_opened_at >= 7 * DAY_MS
      ) {
        const r = await sendDay7(updated);
        if (r.ok) {
          await patchSubscriber(sub.email, { day7_sent_at: Date.now() });
          sent.push("day7");
        }
      }
      // Day-3 open also gates Day-7 (if Day 7 hasn't been sent yet and
      // it's been 7 days since the Day-3 open).
      if (
        openedWhichDay === "day3" &&
        updated.day3_opened_at &&
        !updated.day7_sent_at &&
        now - updated.day3_opened_at >= 4 * DAY_MS // Day 3 was sent on Day 3, so 4 more days = Day 7
      ) {
        const r = await sendDay7(updated);
        if (r.ok) {
          await patchSubscriber(sub.email, { day7_sent_at: Date.now() });
          sent.push("day7");
        }
      }

      return { handled: "open", openedWhichDay, sent };
    }

    case "email.clicked": {
      // A click is the strongest engagement signal. We could accelerate
      // the drip here ("they clicked the cal link, don't send Day 3"),
      // but for v1 we just log it. Future: skip Day 7 if cal clicked.
      return { handled: "clicked" };
    }

    case "email.bounced": {
      await patchSubscriber(sub.email, { bad_address: true });
      return { handled: "bounced" };
    }

    case "email.complained": {
      await patchSubscriber(sub.email, { unsubscribed_at: now });
      return { handled: "complained" };
    }

    default:
      return { ignored: type };
  }
}

// ─────────────────────  HMAC signature verification  ─────────────────────
// Resend uses Svix for webhook delivery. The signature is computed as:
//   HMAC-SHA256(secret, `${svix-id}.${svix-timestamp}.${rawBody}`)
// encoded as base64 and prefixed with `v1,` in the `svix-signature` header.
async function verifyResendSignature(
  request: Request,
  rawBody: string,
  secret: string,
): Promise<boolean> {
  const svixId = request.headers.get("svix-id");
  const svixTs = request.headers.get("svix-timestamp");
  const svixSig = request.headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig) return false;

  // Reject events older than 5 minutes to prevent replay attacks.
  const tsMs = Number(svixTs) * 1000;
  if (!Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) {
    return false;
  }

  // Svix secrets are base64-encoded with a `whsec_` prefix.
  const key = secret.startsWith("whsec_") ? secret.slice(7) : secret;
  let keyBytes: Uint8Array;
  try {
    keyBytes = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
  } catch {
    return false;
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = `${svixId}.${svixTs}.${rawBody}`;
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(signed));
  const expectedB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));

  // `svix-signature` may contain multiple space-separated `v1,<sig>` entries
  // (rotation). Constant-time compare against any of them.
  const candidates = svixSig.split(" ").map((s) => s.replace(/^v1,/, ""));
  for (const c of candidates) {
    if (timingSafeEqual(expectedB64, c)) return true;
  }
  return false;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─────────────────────  Resend event type (subset)  ─────────────────────
type ResendEvent = {
  type:
    | "email.sent"
    | "email.delivered"
    | "email.opened"
    | "email.clicked"
    | "email.bounced"
    | "email.complained"
    | (string & {});
  created_at?: number;
  data?: {
    to?: string[];
    email?: string;
    subject?: string;
    tags?: Array<{ name: string; value: string }>;
  };
};

function detectDripFromSubject(_sub: Subscriber, _type: string): string {
  // Reserved for a future enhancement where the open event doesn't
  // carry a `tags` field — we'd fall back to looking up the subject.
  return "";
}
