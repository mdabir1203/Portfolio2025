/**
 * Capture a full-section screenshot of one or more section IDs of the
 * running dev server, using puppeteer-core (already in the project).
 *
 * Strategy: take a fullPage screenshot once, then crop the section
 * bounds in pure Node (sharp) so we never have to fight setViewport
 * resetting the scroll position.
 *
 * Usage:
 *   node .record/capture-rails.cjs
 *   node .record/capture-rails.cjs --section=watch --out=preview-yt.jpg
 */
const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const { writeFileSync, unlinkSync } = require("node:fs");
const { resolve, dirname } = require("node:path");

const HERE = __filename.endsWith(".cjs")
  ? dirname(__filename)
  : dirname(require.resolve("./capture-rails.cjs"));
const args = process.argv.slice(2);
const get = (flag, def) => {
  const hit = args.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.split("=").slice(1).join("=") : def;
};

const URL = get("--url", "http://localhost:8080/");
const OUT = get("--out", "preview-rails.jpg");
const WIDTH = parseInt(get("--w", "1600"), 10);
const SCALE = parseFloat(get("--scale", "1"));
const SECTIONS = get("--sections", "watch,writing").split(",");
const MAX_H = parseInt(get("--max-h", "4400"), 10);

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: WIDTH,
    height: 900,
    deviceScaleFactor: SCALE,
  });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
  // Wait for the rails to render — both fetch their data from RSS feeds.
  await new Promise((r) => setTimeout(r, 5000));
  // Trigger any lazy loaders by scrolling the page.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));

  // Measure the section bounds in the live page.
  const boxes = await page.evaluate((sectionIds) => {
    return sectionIds
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          w: rect.width,
          h: rect.height,
        };
      })
      .filter(Boolean);
  }, SECTIONS);

  if (!boxes.length) {
    console.error("No sections found:", SECTIONS);
    await browser.close();
    process.exit(1);
  }
  console.log("Found sections:", boxes);

  const top = Math.floor(Math.min(...boxes.map((b) => b.y)));
  const bottom = Math.ceil(Math.max(...boxes.map((b) => b.y + b.h)));
  const left = Math.floor(Math.min(...boxes.map((b) => b.x)));
  const right = Math.ceil(Math.max(...boxes.map((b) => b.x + b.w)));
  const w = right - left;
  const h = Math.min(bottom - top, MAX_H);
  console.log("Crop:", { left, top, w, h });

  // Take a fullPage screenshot so we don't have to fight setViewport
  // scroll resets. The PNG is then cropped in Node.
  const tmp = resolve(HERE, "_tmp-full.jpg");
  const pngBuf = await page.screenshot({
    type: "jpeg",
    quality: 92,
    fullPage: true,
  });
  writeFileSync(tmp, pngBuf);
  console.log("Full screenshot:", pngBuf.length, "bytes");

  // Crop the section to a JPEG.
  const out = await sharp(tmp)
    .extract({ left, top, width: w, height: h })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  const outPath = resolve(HERE, OUT);
  writeFileSync(outPath, out);
  console.log("Wrote", outPath, "size:", out.length, "bytes");

  // Best-effort cleanup of the temp file.
  try {
    unlinkSync(tmp);
  } catch {}

  await browser.close();
})();
