-- D1 schema for the QR-referral follow-up engine.
-- One row per email that drops via /connect.
-- The follow-up Worker (cloudflare/src/handlers/referral-followup.ts) reads
-- this table on a cron trigger and sends Day-3 / Day-7 emails via Resend.

CREATE TABLE IF NOT EXISTS referral_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT,
  code TEXT NOT NULL DEFAULT 'intro',
  ref TEXT,
  created_at INTEGER NOT NULL,           -- unix ms
  day0_sent_at INTEGER,                  -- set by the API right after the Day-0 send
  day3_sent_at INTEGER,                  -- set by the follow-up worker
  day7_sent_at INTEGER,                  -- set by the follow-up worker
  unsubscribed_at INTEGER                -- one-tap unsubscribe
);

-- One row per email. Re-scanning the QR just updates the existing row.
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_email
  ON referral_subscribers(email);

-- Used by the follow-up worker to find "due" rows fast.
CREATE INDEX IF NOT EXISTS idx_referral_due
  ON referral_subscribers(created_at, day3_sent_at, day7_sent_at, unsubscribed_at);
