/**
 * Tests for the multi-channel personalization engine.
 *
 * Run with:  npm test
 * (Uses Node's built-in test runner — no extra deps.)
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  generateForChannel,
  detectIntent,
  contactHandle,
  RENDERERS,
  DEFAULT_CONTACTS,
} = require('../personalize.cjs');

const sample = (overrides = {}) => ({
  name: 'Satwa Roundabout (Abu Nasir)',
  phone: '+971566353859',
  source: 'Locanto + rentforroom listings',
  tags: ['satwa', 'roundabout'],
  profile: {
    likely_audience: 'African + Indian mix',
    building_hint: 'Apartment building near Satwa Roundabout, very close to Max Metro',
    speaks: ['english'],
    best_window: '09:00-17:00 GULF (business hours)',
  },
  ...overrides,
});

test('detectIntent — decline phrases', () => {
  for (const phrase of ['Sorry, all full', 'Not available', 'no vacancy', "can't help"]) {
    assert.equal(detectIntent(phrase), 'decline');
  }
});

test('detectIntent — available phrases (not "not available")', () => {
  assert.equal(detectIntent('Yes, still available'), 'available');
  assert.equal(detectIntent('Yes I have one'), 'available');
  // negative: "not available" must NOT register as available
  assert.equal(detectIntent('Sorry, not available'), 'decline');
});

test('detectIntent — price', () => {
  assert.equal(detectIntent('How much is the rent?'), 'price');
  assert.equal(detectIntent('AED 500/month?'), 'price');
});

test('detectIntent — info', () => {
  assert.equal(detectIntent('Which building?'), 'info');
  assert.equal(detectIntent('How many bathrooms?'), 'info');
});

test('detectIntent — unknown falls through', () => {
  assert.equal(detectIntent('Cool'), 'unknown');
  assert.equal(detectIntent(''), 'unknown');
});

test('contactHandle is stable and slugified', () => {
  assert.equal(contactHandle({ name: 'Satwa Big Mosque capsule' }), 'satwa-big-mosque-capsule');
  assert.equal(contactHandle({ email: 'someone@example.com' }), 'someone-example-com');
});

test('generateForChannel — WhatsApp first message has full structure', () => {
  const out = generateForChannel('whatsapp', sample(), 'first');
  assert.equal(out.subject, null); // no subject on WhatsApp
  assert.match(out.body, /Hi, Saw your listing/);
  assert.match(out.body, /AED 600/);
  assert.match(out.body, /Lower bunk/);
  // building hint
  assert.match(out.body, /Max Metro/);
});

test('generateForChannel — LinkedIn first returns a connectionNote ≤ 300 chars', () => {
  const out = generateForChannel('linkedin', sample(), 'first');
  assert.ok(out.connectionNote, 'should include a connection note');
  assert.ok(out.connectionNote.length <= 300, `connection note was ${out.connectionNote.length} chars`);
  // The DM body should be formal: no 🙏, no long checklist
  assert.ok(!out.body.includes('🙏'), 'LinkedIn DM should not use heavy emoji');
  assert.ok(!out.body.includes('•'), 'LinkedIn DM should not use bullet list');
  assert.match(out.body, /LI-/);
});

test('generateForChannel — LinkedIn nudge varies by day', () => {
  const d3 = generateForChannel('linkedin', sample(), 'nudge', { day: 3 });
  const d7 = generateForChannel('linkedin', sample(), 'nudge', { day: 7 });
  const d14 = generateForChannel('linkedin', sample(), 'nudge', { day: 14 });
  assert.match(d3.subject, /Quick bump/);
  assert.match(d7.subject, /Last ping/);
  assert.match(d14.subject, /Closing the loop/);
});

test('generateForChannel — Email first has a subject and full body', () => {
  const out = generateForChannel('email', sample(), 'first');
  assert.ok(out.subject && out.subject.length > 0);
  assert.match(out.body, /Abir/);
  assert.match(out.body, /abir\.abbas@proton\.me/);
  assert.match(out.body, /Ref: /);
});

test('generateForChannel — Email reply subject is "Re: ..."', () => {
  const out = generateForChannel('email', sample(), 'reply', { intent: 'available' });
  assert.match(out.subject, /^Re: /);
  // The email reply body for "available" intent is the same as WhatsApp:
  // a quick sanity-check list before the visit. We just check the body
  // is non-empty and contains the right opening line.
  assert.ok(out.body && out.body.length > 0);
  assert.match(out.body, /thanks for confirming/i);
});

test('generateForChannel — All three channels render for every default contact', () => {
  // Smoke test — every default contact renders without throwing on
  // every channel × every kind.
  for (const c of DEFAULT_CONTACTS) {
    for (const channel of Object.keys(RENDERERS)) {
      for (const kind of ['first', 'nudge', 'reply']) {
        const ctx = kind === 'nudge' ? { day: 3 } : kind === 'reply' ? { intent: 'available' } : undefined;
        const out = generateForChannel(channel, c, kind, ctx);
        assert.ok(out.body && out.body.length > 0, `${channel}/${kind} for ${c.name} returned empty body`);
      }
    }
  }
});

test('Unknown channel throws', () => {
  assert.throws(() => generateForChannel('fax', sample(), 'first'), /Unknown channel/);
});
