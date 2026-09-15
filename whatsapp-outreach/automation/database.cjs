/**
 * SQLite-backed state store for the multi-channel outreach system.
 *
 * Tracks: contacts (now with email + linkedin_url + channel priority),
 * per-channel messages, replies, followups, and per-contact memory.
 *
 * The schema is migrated in place — older v1 DBs (without linkedin_url
 * / email / channel / drip columns) are upgraded on first open. The
 * migration is idempotent: re-running open() is safe.
 */

const Database = require('better-sqlite3');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, 'outreach.sqlite3');

/**
 * Idempotent migration. SQLite has limited ALTER TABLE support, so we
 * use `ADD COLUMN` defensively (catch the "duplicate column" error) for
 * each new field. This is the standard SQLite pattern.
 *
 * Note: SQLite refuses `DEFAULT CURRENT_TIMESTAMP` in ADD COLUMN, so we
 * add the columns as NULLABLE and backfill below.
 */
function migrate(db) {
  const adds = [
    'ALTER TABLE contacts ADD COLUMN email TEXT',
    'ALTER TABLE contacts ADD COLUMN linkedin_url TEXT',
    'ALTER TABLE contacts ADD COLUMN channel_priority TEXT',  // JSON array, e.g. ["email","linkedin","whatsapp"]
    'ALTER TABLE contacts ADD COLUMN drip_state TEXT',        // JSON: { lastDaySent: 0, lastDayAt, stopped }
    'ALTER TABLE contacts ADD COLUMN drip_day INTEGER',
    'ALTER TABLE contacts ADD COLUMN updated_at TEXT',
    'ALTER TABLE messages ADD COLUMN channel TEXT',           // 'whatsapp' | 'linkedin' | 'email'
    'ALTER TABLE messages ADD COLUMN subject TEXT',            // for email
    'ALTER TABLE messages ADD COLUMN external_id TEXT',        // LinkedIn message id, Gmail thread id, etc.
  ];
  for (const sql of adds) {
    try {
      db.exec(sql);
    } catch (e) {
      if (!/duplicate column/i.test(String(e.message))) throw e;
    }
  }
  // Backfill
  db.exec("UPDATE messages SET channel = 'whatsapp' WHERE channel IS NULL");
  db.exec("UPDATE contacts SET drip_day = 0 WHERE drip_day IS NULL");
  // Indexes
  db.exec('CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(contact_id, channel, sent_at)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_contacts_drip ON contacts(drip_day)');
}

function open() {
  const isNew = !fs.existsSync(DB_PATH);
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      source TEXT,
      first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP,
      tags TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      direction TEXT NOT NULL,
      body TEXT NOT NULL,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      read_at TEXT,
      reply_to_id INTEGER,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      message_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      received_at TEXT DEFAULT CURRENT_TIMESTAMP,
      intent TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(id),
      FOREIGN KEY (message_id) REFERENCES messages(id)
    );

    CREATE TABLE IF NOT EXISTS memory (
      contact_id INTEGER PRIMARY KEY,
      facts TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS followups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      due_at TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(contact_id, sent_at);
    CREATE INDEX IF NOT EXISTS idx_replies_contact ON replies(contact_id);
  `);
  migrate(db);
  if (isNew) {
    // touch a marker so the dashboard can show "v2 schema"
    db.exec("INSERT OR REPLACE INTO memory (contact_id, facts) VALUES (0, '{\"schema\":\"v2-multi-channel\"}')");
  }
  return db;
}

module.exports = { open, DB_PATH };
