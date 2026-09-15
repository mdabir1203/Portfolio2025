const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const { writeFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");

const HERE = __filename.endsWith(".cjs")
  ? dirname(__filename)
  : dirname(require.resolve("./capture-prod.cjs"));

(async () => {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
  await p.goto("https://abir.getwaved.ai/", {
    waitUntil: "networkidle0",
    timeout: 90_000,
  });
  // Wait for the rails to mount + fetch.
  await new Promise((r) => setTimeout(r, 7000));
  // Scroll to the watch section to trigger lazy mounts.
  await p.evaluate(() => {
    const el = document.getElementById("watch");
    if (el) el.scrollIntoView({ block: "start" });
  });
  await new Promise((r) => setTimeout(r, 4000));

  const box = await p.evaluate(() => {
    const el = document.getElementById("watch");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  });
  console.log("Watch box:", box);
  if (!box) {
    await b.close();
    return;
  }

  // Take a fullPage screenshot and crop the section.
  const fullBuf = await p.screenshot({ type: "jpeg", quality: 88, fullPage: true });
  const tmpPath = resolve(HERE, "_prod-full.jpg");
  writeFileSync(tmpPath, fullBuf);
  const cropped = await sharp(tmpPath)
    .extract({
      left: Math.floor(box.x),
      top: Math.floor(box.y),
      width: Math.floor(box.w),
      height: Math.min(Math.floor(box.h), 2400),
    })
    .jpeg({ quality: 88 })
    .toBuffer();
  const outPath = resolve(HERE, "preview-youtube-prod.jpg");
  writeFileSync(outPath, cropped);
  console.log("Wrote", outPath, "size:", cropped.length);
  // Quick check: did the rail render curated videos?
  const stats = await p.evaluate(() => {
    const watch = document.getElementById("watch");
    if (!watch) return { ok: false };
    const cards = watch.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtube.com/shorts/"]');
    const curated = watch.textContent.toLowerCase().includes("curated");
    return { ok: true, totalCards: cards.length, hasCuratedBadge: curated };
  });
  console.log("Stats:", stats);
  await b.close();
})();
