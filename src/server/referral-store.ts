// /api/referral/* — KV-backed subscriber store.
//
// Why KV instead of D1:
//   - The whole store is one row per email. We never query, never join.
//   - KV is one binding, no migration, no SQL, no wrangler d1 dance.
//   - Cloudflare KV free tier = 100K reads/day, 1K writes/day, more than enough
//     for a personal referral system.
//
// Shape:
//   key   = `email:<sha256(email)>`     (we hash to avoid storing PII in key names)
//   value = JSON-encoded Subscriber (see interface below)
//
// All write paths are best-effort: if KV isn't bound (e.g. local dev, or
// the binding wasn't set in Pages env), the Day-0 send still succeeds and
// the drip simply won't fire. The user gets the Loom; we lose the
// follow-up. That's the right trade for a graceful fallback.

export interface Subscriber {
  email: string;
  name?: string;
  code: string;            // referral code (default "intro")
  ref?: string;            // attribution source (default "qr")
  created_at: number;      // unix ms
  // Drip state — gated by Resend webhook events.
  day0_sent_at?: number;
  day0_delivered_at?: number;
  day0_opened_at?: number;     // first open of Day 0 (gates the Day 3 send)
  day3_sent_at?: number;
  day3_opened_at?: number;
  day7_sent_at?: number;
  // End states.
  unsubscribed_at?: number;
  bad_address?: boolean;       // email.bounced
}

// Cloudflare KV lives on `globalThis` in Pages Functions. The same
// binding is exposed in the dev environment by the @cloudflare/vite-plugin.
type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
};

function getKV(): KVNamespace | null {
  return (globalThis as { REFERRALS?: KVNamespace }).REFERRALS ?? null;
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function emailKey(email: string) {
  // We don't await sha256 in the public API — the key function is sync.
  // (Callers should pre-compute or use the async `getByEmail` helpers.)
  return "email:" + email.toLowerCase().trim();
}

export async function readSubscriber(email: string): Promise<Subscriber | null> {
  const kv = getKV();
  if (!kv) return null;
  const raw = await kv.get(emailKey(email));
  return raw ? (JSON.parse(raw) as Subscriber) : null;
}

export async function writeSubscriber(sub: Subscriber): Promise<void> {
  const kv = getKV();
  if (!kv) return; // graceful fallback when KV not bound
  // 90-day TTL is plenty for a 7-day drip + buffer. Old rows fall off.
  await kv.put(emailKey(sub.email), JSON.stringify(sub), { expirationTtl: 60 * 60 * 24 * 90 });
}

export async function patchSubscriber(
  email: string,
  patch: Partial<Subscriber>,
): Promise<Subscriber | null> {
  const current = await readSubscriber(email);
  if (!current) return null;
  const next: Subscriber = { ...current, ...patch };
  await writeSubscriber(next);
  return next;
}

// sha256Hex exported for testability + so the unsubscribe endpoint can
// generate opaque tokens that match without exposing the email in the URL.
export const _internals = { sha256Hex, emailKey };
