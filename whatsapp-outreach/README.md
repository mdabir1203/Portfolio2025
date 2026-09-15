# Multi-Channel Outreach (v3.0 — WhatsApp + LinkedIn + Email)

A complete system that runs the same personalized outreach on **three
channels** at once, with one day-by-day drip cadence and one shared
dashboard.

## What's new in v3.0

- **Three channels** — WhatsApp, LinkedIn DM, Email — driven by the same
  contact profile and the same `generateForChannel()` engine.
- **Day-by-day drip** — Day 0 (first), Day 3 (softer), Day 7 (last ping),
  Day 14 (close-out), then auto-stop at Day 30. Like the portfolio's
  referral drip, but applied to outreach.
- **Multi-channel DB** — same SQLite file, but every message now has a
  `channel` column and every contact can carry `email` + `linkedin_url`
  alongside `phone`. Idempotent migration from the v2 schema.
- **Per-channel auto-reply** — each driver implements the same
  `{ sendFirst, sendReply, sendNudge, pollReplies, isReady }` shape.
- **Unified dashboard** — one terminal view of all channels.
- **Tested** — 22 unit tests (Node's built-in `node --test`) covering
  intent detection, channel-aware rendering, and drip scheduling.

The legacy single-channel WhatsApp flow (`whatsapp_automation.cjs`) is
still here for anyone who hasn't migrated — but the new entry point is
`automation/run.cjs`.

## Files

| File | Purpose |
|---|---|
| `automation/run.cjs` | New multi-channel orchestrator (`seed` / `send` / `listen` / `drip` / `run`) |
| `automation/personalize.cjs` | Channel-aware message renderer (WhatsApp / LinkedIn / Email) |
| `automation/database.cjs` | SQLite state store with v3 migration (`email`, `linkedin_url`, `channel`, `drip_day`) |
| `automation/drip.cjs` | Day-by-day drip scheduler (Day 3 / 7 / 14) |
| `automation/dashboard.cjs` | Multi-channel dashboard (per-channel stats + due list) |
| `automation/channels/whatsapp.cjs` | WhatsApp driver (Puppeteer, debug port) |
| `automation/channels/linkedin.cjs` | LinkedIn DM driver (Puppeteer, **opt-in** via `LINKEDIN_OPT_IN=1`) |
| `automation/channels/email.cjs` | Email driver (nodemailer SMTP, preview mode if unconfigured) |
| `automation/channels/index.cjs` | Channel registry + per-contact `channelsFor(contact)` resolver |
| `automation/contacts.cjs` | Contact registry (phone / source / profile hints) |
| `automation/whatsapp_automation.cjs` | Legacy v2 single-channel flow (still works) |
| `automation/__tests__/personalize.test.cjs` | Personalization tests (15) |
| `automation/__tests__/drip.test.cjs` | Drip scheduler tests (7) |

## Setup (one time, ~5 min)

### 1. Install the new dep

```powershell
cd C:\Users\mabba\Downloads\Portfolio2025\whatsapp-outreach
npm install
```

This pulls in `nodemailer` for the Email channel. The WhatsApp /
LinkedIn drivers reuse the existing `puppeteer-core`.

### 2. (WhatsApp) Open Chrome with remote debugging

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Sign in to WhatsApp Web (scan the QR with your phone) and stay signed in.

### 3. (Email) Set SMTP env vars

In your shell or `.env`:

```powershell
$env:SMTP_HOST    = "smtp.protonmail.ch"        # or smtp.gmail.com, smtp.resend.com, ...
$env:SMTP_PORT    = "587"
$env:SMTP_USER    = "abir.abbas@proton.me"
$env:SMTP_PASS    = "your-app-password"
$env:SMTP_SECURE  = ""                          # "1" only for port 465
$env:EMAIL_FROM   = "Abir Abbas <abir.abbas@proton.me>"
```

If you don't set these, the email driver runs in **preview mode** —
it prints the rendered email to the terminal instead of sending. Good
for testing message shape.

### 4. (LinkedIn) Opt in only when you mean it

LinkedIn aggressively rate-limits and bans automation accounts. The
LinkedIn driver refuses to run unless you set:

```powershell
$env:LINKEDIN_OPT_IN = "1"
```

…and even then, keep it to a handful of contacts per day.

### 5. Add `email` and `linkedin_url` to your contacts

`automation/contacts.cjs` only carries `phone` because that's what
the v2 system used. For v3, extend each contact:

```js
{
  name: 'Satwa Roundabout (Abu Nasir)',
  phone: '+971566353859',
  email: 'abu.nasir@satwa.ae',                  // for the Email channel
  linkedin_url: 'https://www.linkedin.com/in/...',  // for the LinkedIn channel
  source: 'Locanto + rentforroom listings',
  tags: ['satwa', 'roundabout', 'max-metro'],
  channel_priority: ['whatsapp', 'email', 'linkedin'],  // optional override
  profile: { ... },
}
```

`channel_priority` is optional. If absent, the registry's default order
(`whatsapp → linkedin → email`) is used, with channels that have no
contact info for that person silently skipped.

## Usage

```powershell
# 0. Preview all messages for every contact × every channel (no sends)
node automation/personalize.cjs

# 1. Seed the DB
node automation/run.cjs seed

# 2a. Dry-run the first send — see what would be sent, channel by channel
node automation/run.cjs send --dry-run

# 2b. Actually send the first message (all ready channels per contact)
node automation/run.cjs send

# 2c. Limit to one channel
node automation/run.cjs send --channel=email
node automation/run.cjs send --channel=linkedin
node automation/run.cjs send --channel=whatsapp

# 3. Listen for replies and auto-reply (WhatsApp + LinkedIn)
node automation/run.cjs listen

# 4. Run the day-by-day drip — sends Day 3 / 7 / 14 nudges
node automation/run.cjs drip
node automation/run.cjs drip --dry-run          # just see who's due
node automation/run.cjs drip --channel=email    # limit to one channel

# 5. One-shot: seed + send + listen + drip, in order
node automation/run.cjs run

# 6. The dashboard — multi-channel view
node automation/dashboard.cjs
node automation/dashboard.cjs --json            # machine-readable

# 7. Tests
npm test
```

## How the drip works

- Every contact starts at `drip_day = 0`.
- After their first send, the scheduler watches the clock. When ≥ 3
  days have elapsed since the first send AND `drip_day < 3`, it sends
  a softer bump on every ready channel and sets `drip_day = 3`.
- Same for Day 7 and Day 14. After Day 30, the contact is parked
  automatically.
- Any reply on any channel halts the drip for that contact — we don't
  keep nudging people who've already answered.

## Channel-specific rules baked into the renderer

- **WhatsApp** — long-form, casual, can use 🙏/👋, runs the original
  hyperpersonalized first message verbatim.
- **LinkedIn** — connection note (≤ 300 chars) + DM (≤ 8000 chars).
  No heavy emoji, no bullet checklist, professional opener, signed with
  `— Abir (LI-<handle>)`.
- **Email** — short subject + long body, single CTA, signed with full
  contact info. Reply subject is `Re: <original subject>`.

## Safety

- **4-7 second delay** between channel sends (humans don't fire 3
  channels in 200ms).
- **No auto-reply on 'unknown' intent** (real human takes over).
- **Per-contact channel filtering** — only channels with contact info
  for that person are scheduled. (No trying to email someone with no
  email on file.)
- **Day 30 auto-stop** — old contacts aren't dripped forever.
- **LinkedIn is opt-in** — refuses to run without `LINKEDIN_OPT_IN=1`.

## Legacy

The v2 single-channel WhatsApp flow is still here for anyone who
hasn't migrated:

```powershell
npm start                  # v2 — WhatsApp-only
npm run seed               # v2
npm run send               # v2
npm run listen             # v2
npm run nudge              # v2 — 24h/72h nudges
npm run dashboard          # v2
```

For new work, prefer `node automation/run.cjs …`.
