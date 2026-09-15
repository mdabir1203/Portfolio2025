// scripts/capture-cinema.mjs
//
// Captures a brand-studio-grade video of the portfolio using the
// in-page CinemaMode auto-driver. Output is a raw WebM that gets
// transcoded to MP4 by transcode-cinema.mjs.
//
// Usage:
//   node scripts/capture-cinema.mjs
//
// Requires:
//   - Dev server running on http://localhost:5173 (vite dev)
//   - Playwright + chromium-headless-shell installed locally
//   - CinemaMode mounted in CinematicLanding (already done)

import { chromium } from 'playwright';
import { mkdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const BASE_URL = process.env.CAPTURE_URL ?? 'http://localhost:5173';
const OUT_DIR = resolve(process.cwd(), 'cinema-out');
const VIEWPORT = { width: 1440, height: 900 };
const TOTAL_RUNTIME_MS = 115_000; // intro 1.8s + 11 beats @ ~9.5s + end slate margin

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: undefined,
    args: ['--disable-web-security', '--use-fake-ui-for-media-stream'],
  });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR,
      size: VIEWPORT,
    },
  });
  const page = await ctx.newPage();

  // Surface any console errors loudly so we don't capture a broken reel.
  page.on('pageerror', (e) => {
    console.error('[pageerror]', e.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('[console.error]', msg.text());
    }
  });

  console.log(`[capture] navigating to ${BASE_URL}/?cinema`);
  await page.goto(`${BASE_URL}/?cinema`, { waitUntil: 'networkidle' });
  // Let layout settle + FirstVisitSplash pass + intro scroll start
  await page.waitForTimeout(1500);

  // Sanity-check the cinema mode actually mounted
  const cinemaReady = await page.evaluate(() => {
    const el = document.querySelector('[data-cinema-mode]');
    if (!el) return { mounted: false };
    return {
      mounted: true,
      chapter: el.querySelector('.font-display')?.textContent ?? null,
    };
  });
  console.log('[capture] cinema mode:', cinemaReady);

  // Wait for the auto-driver to start
  await page.waitForTimeout(1000);

  console.log(`[capture] rolling for ${TOTAL_RUNTIME_MS} ms...`);
  await page.waitForTimeout(TOTAL_RUNTIME_MS);

  // Capture the final page state for a thumbnail
  await page.screenshot({
    path: join(OUT_DIR, 'final-still.png'),
    fullPage: false,
  });

  // Close context to flush video
  await ctx.close();
  await browser.close();

  // Find the WebM the browser wrote
  const files = await (await import('node:fs/promises')).readdir(OUT_DIR);
  const webm = files.find((f) => f.endsWith('.webm'));
  if (!webm) {
    console.error('[capture] no .webm produced');
    process.exit(1);
  }
  const finalWebm = join(OUT_DIR, 'reel-raw.webm');
  await (await import('node:fs/promises')).rename(
    join(OUT_DIR, webm),
    finalWebm,
  );
  const s = await stat(finalWebm);
  console.log(`[capture] raw WebM: ${finalWebm} (${(s.size / 1024 / 1024).toFixed(2)} MB)`);
}

run().catch((e) => {
  console.error('[capture] FATAL:', e);
  process.exit(1);
});