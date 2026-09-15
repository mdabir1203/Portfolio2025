/**
 * Hyperpersonalization engine — multi-channel.
 *
 * Generates outreach messages for three channels, all from the same
 * contact profile:
 *
 *   - whatsapp  — ~1500 char limit, casual, uses some emoji, can be long
 *   - linkedin  — connection note (300 char) + DM (8000 char), formal,
 *                 NO heavy emoji, professional opener
 *   - email     — short subject + long body, formal-ish, single CTA
 *
 * Existing single-channel exports (generateFirst / generateNudge /
 * generateReply) are kept as the WhatsApp path so legacy callers still
 * work. The new public API is `generateForChannel(channel, contact, kind)`.
 *
 * Run with:  node automation/personalize.cjs
 *            to print every contact × every channel preview.
 */

const { DEFAULT_CONTACTS } = require('./contacts.cjs');

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

const LINKEDIN_CONNECTION_LIMIT = 300;
const LINKEDIN_DM_SOFT_LIMIT = 8000;

function articleFor(word) {
  return /^[aeiouAEIOU]/.test(word || '') ? 'an' : 'a';
}

function contactHandle(contact) {
  // Stable handle used as the personalization seed for tags, refs, etc.
  return (contact.name || contact.phone || contact.email || 'contact')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);
}

/* ------------------------------------------------------------------ */
/* building blocks — the same content, three channel-shaped wrappers  */
/* ------------------------------------------------------------------ */

function buildFirst(contact) {
  const aud = contact.profile?.likely_audience || '';
  const article = articleFor(aud);
  const opening = aud
    ? `Saw your listing (likely ${article} ${aud} setup — figured I'd reach out)`
    : `Saw your listing`;
  const source = contact.source ? ` — found it via ${contact.source}` : '';
  const buildingHint = contact.profile?.building_hint;
  const isAggregator = buildingHint && buildingHint.includes('aggregator');
  const buildingLine = buildingHint && !isAggregator
    ? ` Your ${buildingHint} spot is exactly the kind of area I'm targeting.`
    : isAggregator
      ? ` Since you cover multiple buildings, maybe you know of something specific in that area.`
      : '';
  return {
    opening,
    source,
    buildingLine,
    body: [
      `I'm a single working professional, quiet, working near DWTC (Dubai World Trade Centre — that's the Founders HQ area). I'm looking for a bed space in the AED 600–700 range.`,
      ``,
      `What I need (non-negotiable):`,
      `• Lower bunk`,
      `• Window bed (good natural light — really important to me)`,
      `• 3–4 tenants max per room`,
      `• DEWA + WiFi + gas all included, no surprise bills`,
      buildingLine,
      ``,
      `Move-in is ASAP, long-term (yearly if it works out).`,
      ``,
      `If you have anything, please share:`,
      `1. Building name + exact area`,
      `2. Lower bed available?`,
      `3. Window bed available?`,
      `4. How many tenants in the room and total in the flat?`,
      `5. Number of bathrooms per flat?`,
      `6. When can I drop by for a daytime visit?`,
      ``,
      `Thanks! 🙏`,
    ].join('\n').trim(),
  };
}

function buildNudge(contact, day) {
  // day === 3 → softer bump; day === 7 → last ping; day >= 14 → close-out
  const isAdmin = contact.profile?.likely_audience?.includes('admin')
    || contact.profile?.likely_audience?.includes('aggregator');
  if (day >= 14) {
    return [
      `Hi, last note on this — I know these messages stack up.`,
      ``,
      `I'm still looking (600–700, window bed, lower bunk, DWTC area), but I won't keep pinging. If something opens up, my contact info is in this thread.`,
      ``,
      `Either way, thanks for the time 🙏`,
    ].join('\n');
  }
  if (day >= 7) {
    return [
      `Last ping from me on this — I know these messages stack up.`,
      ``,
      `If nothing's available right now, no worries. But if you do know of a clean spot (600-700, window bed, lower bunk) anywhere near Max Metro or ADCB Metro, I'd really appreciate a name or a building to check.`,
      ``,
      `Either way, thanks for the time 🙏`,
    ].join('\n');
  }
  // day 3
  const adj = isAdmin
    ? `If you've got any 600-700 spots in mind — even in older buildings or villas — that'd be great.`
    : `If the bed I asked about isn't available, any other 600-700 spot with a window would also work.`;
  return [
    `Hi, just bumping this in case it got buried 👋`,
    ``,
    `Still looking for the same thing — bed space 600-700, Satwa or Al Jafiliya (or Karama near ADCB), lower bunk, window bed, working near DWTC.`,
    ``,
    adj,
    ``,
    `Thanks!`,
  ].join('\n');
}

function buildReply(intent) {
  switch (intent) {
    case 'available':
      return [
        `Great, thanks for confirming!`,
        ``,
        `Quick sanity check before I come over:`,
        `• Lower bed still mine?`,
        `• Window bed?`,
        `• How many tenants in the room right now?`,
        `• How many bathrooms in the flat?`,
        `• DEWA + WiFi + gas really all in, no cap?`,
        `• Deposit + key money?`,
        `• When's the earliest I can visit (daytime only — I need to see the light in the actual room)?`,
        ``,
        `And what's the building name + nearest landmark so I can find it?`,
      ].join('\n');
    case 'price':
      return [
        `Budget's AED 600–700 all-in (rent + DEWA + WiFi + gas). For the right spot — lower bunk, window bed, 3-4 tenants max — I can stretch a bit on the upper end.`,
        ``,
        `What's the asking?`,
      ].join('\n');
    case 'decline':
      return [
        `Understood, thanks for letting me know.`,
        ``,
        `If anything opens up in the next 2 weeks (even in a different building you manage), please keep me in mind. Lower bunk + window bed are the must-haves.`,
        ``,
        `Cheers 🙏`,
      ].join('\n');
    case 'info':
      return [
        `Thanks for the info.`,
        ``,
        `A couple of follow-ups:`,
        `• Lower or upper bed? (I need lower)`,
        `• Window bed available?`,
        `• Building name?`,
        `• Earliest visit time?`,
      ].join('\n');
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* intent detection — channel-agnostic                                */
/* ------------------------------------------------------------------ */

function detectIntent(text) {
  const t = (text || '').toLowerCase();
  if (/\b(no|nothing|fully|all full|sorry|unavailable|not available|no vacancy|not now|can't|cant)\b/.test(t)) return 'decline';
  if (/\b(yes|available|still there|yes available|hav(ing|e))\b/.test(t) && !/\bnot\b/.test(t)) return 'available';
  if (/\b(how much|price|rent|aed|dirham|cost|month|charge)\b/.test(t)) return 'price';
  if (/\?|roommate|share|bathroom|building|location|near|metro|deposit/.test(t)) return 'info';
  return 'unknown';
}

/* ------------------------------------------------------------------ */
/* channel-shaped renderers                                           */
/* ------------------------------------------------------------------ */

function renderWhatsApp(contact, kind, ctx) {
  // WhatsApp = the full first message. Casual, with emoji, longer.
  if (kind === 'first') {
    const f = buildFirst(contact);
    return {
      subject: null,
      body: [
        `Hi, ${f.opening}${f.source}.`,
        ``,
        f.body,
      ].join('\n'),
    };
  }
  if (kind === 'nudge') {
    return { subject: null, body: buildNudge(contact, ctx?.day ?? 3) };
  }
  if (kind === 'reply') {
    return { subject: null, body: buildReply(ctx?.intent) };
  }
  throw new Error(`Unknown kind for WhatsApp: ${kind}`);
}

function renderLinkedIn(contact, kind, ctx) {
  // LinkedIn has TWO surfaces:
  //   - the connection request note (≤300 chars, written when the contact
  //     is NOT a 1st-degree connection)
  //   - the DM (≤8000 chars, used after they accept or for inMail)
  // We render both as { subject, body, connectionNote }.
  const handle = contactHandle(contact);
  const f = buildFirst(contact);

  if (kind === 'first') {
    const connectionNote = [
      `Hi — came across your work on ${contact.source || 'a shared post'}.`,
      `I'm Abir, an AI Architect in Ajman. Would love to connect.`,
    ].join(' ').slice(0, LINKEDIN_CONNECTION_LIMIT);

    const dm = [
      `Hi ${contact.name?.split(' ')[0] || 'there'},`,
      ``,
      `Thanks for the connect. ${f.opening}${f.source}.`,
      ``,
      // Strip the long list + emoji — LinkedIn is professional.
      `I'm an AI Architect working near DWTC, looking for a clean bed space in the AED 600–700 range — lower bunk, window bed, 3–4 tenants max, all-inclusive.`,
      ``,
      `If you know of anything (or manage a place), I'd really appreciate a pointer. Move-in is ASAP, long-term.`,
      ``,
      `— Abir`,
      `Portfolio: abir.getwaved.ai (ref: LI-${handle})`,
    ].join('\n');

    return {
      subject: null,
      body: dm.length > LINKEDIN_DM_SOFT_LIMIT ? dm.slice(0, LINKEDIN_DM_SOFT_LIMIT - 1) + '…' : dm,
      connectionNote,
    };
  }

  if (kind === 'nudge') {
    const day = ctx?.day ?? 3;
    const subject = day >= 14
      ? `Closing the loop`
      : day >= 7
        ? `Last ping — bed space near DWTC`
        : `Quick bump — bed space near DWTC`;
    const body = [
      `Hi ${contact.name?.split(' ')[0] || ''},`,
      ``,
      // Strip emoji for LinkedIn
      `Just bumping my earlier note. Still looking for a 600–700 bed space, lower bunk, window bed, DWTC area.`,
      day >= 7 ? `Last note from me on this — won't keep pinging.` : ``,
      ``,
      `If anything opens up, my contact info is in the original message.`,
      ``,
      `— Abir (LI-${handle})`,
    ].filter(Boolean).join('\n');
    return { subject, body, connectionNote: null };
  }

  if (kind === 'reply') {
    const intent = ctx?.intent;
    const firstName = contact.name?.split(' ')[0] || 'there';
    let body;
    if (intent === 'available') {
      body = [
        `Great — thanks for confirming.`,
        ``,
        `A few quick checks before I come over: lower bed confirmed? window bed confirmed? tenants in the room and the flat? bathrooms per flat? deposit + key money? earliest daytime visit? building name + nearest landmark?`,
        ``,
        `— Abir (LI-${handle})`,
      ].join('\n');
    } else if (intent === 'price') {
      body = [
        `Budget is AED 600–700 all-in (rent + DEWA + WiFi + gas). For the right spot I can stretch slightly. What's the asking?`,
        ``,
        `— Abir (LI-${handle})`,
      ].join('\n');
    } else if (intent === 'decline') {
      body = [
        `Understood — thanks for letting me know. If anything opens up in the next 2 weeks, please keep me in mind. Lower bunk + window bed are the must-haves.`,
        ``,
        `— Abir (LI-${handle})`,
      ].join('\n');
    } else {
      body = buildReply(intent) || '';
    }
    return { subject: null, body, connectionNote: null };
  }

  throw new Error(`Unknown kind for LinkedIn: ${kind}`);
}

function renderEmail(contact, kind, ctx) {
  const handle = contactHandle(contact);
  const f = buildFirst(contact);
  const firstName = contact.name?.split(' ')[0] || 'there';
  const subjectPrefix = (contact.profile?.tags?.includes('aggregator') || contact.profile?.likely_audience?.includes('admin'))
    ? 'Quick question — bed space, Satwa / Al Jafiliya area'
    : 'Bed space near DWTC — quick question';

  if (kind === 'first') {
    return {
      subject: subjectPrefix,
      body: [
        `Hi ${firstName},`,
        ``,
        `${f.opening}${f.source}.`,
        ``,
        `I'm Abir — an AI Architect working near DWTC, quiet single tenant, looking for a clean bed space in the AED 600–700 range. Long-term, move-in ASAP.`,
        ``,
        `Non-negotiables:`,
        `  • Lower bunk`,
        `  • Window bed (natural light matters to me)`,
        `  • 3–4 tenants max per room`,
        `  • DEWA + WiFi + gas all-inclusive`,
        f.buildingLine,
        ``,
        `If you have something — or know someone who does — could you share:`,
        `  1. Building name + exact area`,
        `  2. Lower bed available?`,
        `  3. Window bed available?`,
        `  4. Tenants in the room / flat`,
        `  5. Bathrooms per flat`,
        `  6. Earliest daytime visit`,
        ``,
        `My portfolio (one-pager) is here if you want a quick read on me: abir.getwaved.ai`,
        ``,
        `Ref: ${handle} — happy to forward any intro.`,
        ``,
        `Thanks,`,
        `Abir`,
        `abir.abbas@proton.me  ·  +971 054 361 8066`,
      ].join('\n'),
    };
  }

  if (kind === 'nudge') {
    const day = ctx?.day ?? 3;
    const subject = day >= 14
      ? `Closing the loop — bed space near DWTC`
      : day >= 7
        ? `One last note — bed space near DWTC`
        : `Quick bump — bed space near DWTC`;
    const body = [
      `Hi ${firstName},`,
      ``,
      `Just bumping my earlier email. Still looking for the same thing: 600–700, lower bunk, window bed, DWTC area.`,
      ``,
      day >= 7 ? `Last note from me on this — won't keep pinging.` : `If the original ask doesn't fit, even a different building in the same price band would work.`,
      ``,
      `Thanks,`,
      `Abir`,
      `Ref: ${handle}`,
    ].join('\n');
    return { subject, body };
  }

  if (kind === 'reply') {
    return { subject: `Re: ${subjectPrefix}`, body: buildReply(ctx?.intent) || '' };
  }

  throw new Error(`Unknown kind for Email: ${kind}`);
}

/* ------------------------------------------------------------------ */
/* public API                                                         */
/* ------------------------------------------------------------------ */

const RENDERERS = {
  whatsapp: renderWhatsApp,
  linkedin: renderLinkedIn,
  email: renderEmail,
};

function generateForChannel(channel, contact, kind, ctx) {
  const fn = RENDERERS[channel];
  if (!fn) throw new Error(`Unknown channel: ${channel}`);
  return fn(contact, kind, ctx);
}

// ---- Legacy single-channel exports (kept for backward compat) ----

function generateFirst(contact) {
  return renderWhatsApp(contact, 'first').body;
}

function generateNudge(contact, hoursSinceLast) {
  // Hours → drip day. 24h ≈ day 1, 72h ≈ day 3, 168h ≈ day 7.
  const day = hoursSinceLast >= 168 ? 14 : hoursSinceLast >= 72 ? 7 : 3;
  return renderWhatsApp(contact, 'nudge', { day }).body;
}

function generateReply(contact, intent) {
  return renderWhatsApp(contact, 'reply', { intent }).body;
}

module.exports = {
  // New multi-channel API
  generateForChannel,
  RENDERERS,
  // Legacy single-channel (whatsapp) API
  generateFirst,
  generateNudge,
  generateReply,
  // Shared helpers (re-exported for tests / other modules)
  detectIntent,
  contactHandle,
  // Contact list (re-exported for CLI demo)
  DEFAULT_CONTACTS,
};

/* ------------------------------------------------------------------ */
/* CLI demo                                                           */
/* ------------------------------------------------------------------ */

if (require.main === module) {
  const sample = DEFAULT_CONTACTS.slice(0, 2);
  for (const c of sample) {
    console.log(`\n========== ${c.name} (${c.phone}) ==========`);
    for (const channel of Object.keys(RENDERERS)) {
      console.log(`\n----- ${channel.toUpperCase()} · first -----`);
      const out = renderWhatsApp === RENDERERS[channel]
        ? RENDERERS[channel](c, 'first')
        : RENDERERS[channel](c, 'first');
      console.log(out.subject ? `Subject: ${out.subject}\n` : '');
      console.log(out.body);
    }
  }
}
