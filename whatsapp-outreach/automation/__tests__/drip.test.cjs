/**
 * Tests for the drip scheduler — pure logic (no DB).
 *
 * Run with:  npm test
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { DRIP_SCHEDULE, dripDayFor } = require('../drip.cjs');

const NOW = Date.parse('2026-08-29T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;

test('DRIP_SCHEDULE has the right cadence', () => {
  assert.deepEqual(
    DRIP_SCHEDULE.map((s) => s.day),
    [3, 7, 14]
  );
});

test('dripDayFor returns null when no first_send_at', () => {
  assert.equal(dripDayFor({}), null);
  assert.equal(dripDayFor({ first_send_at: null }), null);
});

test('dripDayFor returns null when first_send_at is <24h ago', () => {
  const row = { first_send_at: new Date(NOW - 12 * 3600_000).toISOString(), drip_day: 0 };
  assert.equal(dripDayFor(row, NOW), null);
});

test('dripDayFor returns 3 when ~3 days have elapsed and drip_day < 3', () => {
  const row = { first_send_at: new Date(NOW - 3 * DAY).toISOString(), drip_day: 0 };
  assert.equal(dripDayFor(row, NOW), 3);
});

test('dripDayFor returns 7 when ~7 days have elapsed and drip_day < 7', () => {
  const row = { first_send_at: new Date(NOW - 7 * DAY).toISOString(), drip_day: 3 };
  assert.equal(dripDayFor(row, NOW), 7);
});

test('dripDayFor returns 14 when ~14 days have elapsed and drip_day < 14', () => {
  const row = { first_send_at: new Date(NOW - 14 * DAY).toISOString(), drip_day: 7 };
  assert.equal(dripDayFor(row, NOW), 14);
});

test('dripDayFor returns null at day 30+ (automatic stop)', () => {
  const row = { first_send_at: new Date(NOW - 30 * DAY).toISOString(), drip_day: 14 };
  assert.equal(dripDayFor(row, NOW), null);
  const row45 = { first_send_at: new Date(NOW - 45 * DAY).toISOString(), drip_day: 14 };
  assert.equal(dripDayFor(row45, NOW), null);
});

test('dripDayFor skips a step if drip_day already reached it', () => {
  // 8 days elapsed, but we already sent day 3 → next is 7 (not 3 again)
  const row = { first_send_at: new Date(NOW - 8 * DAY).toISOString(), drip_day: 3 };
  assert.equal(dripDayFor(row, NOW), 7);
});

test('dripDayFor returns null when first_send_at is malformed', () => {
  assert.equal(dripDayFor({ first_send_at: 'not-a-date' }, NOW), null);
});
