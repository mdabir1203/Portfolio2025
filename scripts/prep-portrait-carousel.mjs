// scripts/prep-portrait-carousel.mjs
// One-shot asset prep: convert the 6 personality photos into webp for the
// hero propic carousel. Run with: `node scripts/prep-portrait-carousel.mjs`
//
// The 6 source images live in the assistant's read-only attachment cache.
// We stage them into src/assets/portrait-{identity}.webp so Vite can hash
// and serve them. Each is sized to 720px wide (2.4x the 300px display) at
// quality 82, which keeps file size comparable to the existing
// abir-2026.webp (125 kB) while preserving enough detail for the headshot.

import sharp from "sharp";
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from "node:fs";
import path from "node:path";

const ATTACH_DIR = path.resolve(
  process.env.USERPROFILE ?? "",
  ".minimax/v2/assets/2026/09/19",
);

const OUT_DIR = path.resolve(process.cwd(), "src/assets");

// Identity slides. Order matters — this is the cycle order.
//  01 DRIFTER     Vietnam mountains, plaid shirt, travel hat
//  02 ARRIVED     KL Petronas, arms spread, joyful
//  03 GROUNDED    Lighthouse field, sitting meditation
//  04 EXPRESSIVE  Fitting-room bowler hat, sunglasses, lapel flower
//  05 SPEAKER     On-stage mic, presenting to audience
//  06 ARCHITECT   Dubai 2026 suit, glasses, blue tie (current propic)
const SLIDES = [
  {
    identity: "drifter",
    src: "14-03-30-423-asset_20260919-140330-423_89c261440236_abd71ff4-1.jpg",
    alt: "Abir in Vietnam — plaid shirt and travel hat, limestone cliffs of Ha Long Bay behind.",
  },
  {
    identity: "arrived",
    src: "14-03-30-431-asset_20260919-140330-431_d483b88b04a5_7126c778-2.jpg",
    alt: "Abir in Kuala Lumpur — arms spread beneath the Petronas Twin Towers.",
  },
  {
    identity: "grounded",
    src: "14-03-30-436-asset_20260919-140330-436_502aad5ad2a4_9689cd70-3.jpg",
    alt: "Abir at the lighthouse — seated cross-legged on the field, red sweater and travel hat.",
  },
  {
    identity: "expressive",
    src: "14-03-30-442-asset_20260919-140330-442_3859da286ecb_0f7a8a0e-4.jpg",
    alt: "Abir in the fitting-room mirror — bowler hat, sunglasses, and a red lapel flower.",
  },
  {
    identity: "speaker",
    src: "14-03-30-447-asset_20260919-140330-447_25637e95b939_1fa8f8f1-5.jpg",
    alt: "Abir on stage — laughing into the microphone mid-presentation, audience blurred behind.",
  },
];

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let totalIn = 0;
let totalOut = 0;

for (const slide of SLIDES) {
  const srcPath = path.join(ATTACH_DIR, slide.src);
  const outPath = path.join(OUT_DIR, `portrait-${slide.identity}.webp`);
  if (!existsSync(srcPath)) {
    console.error(`MISSING source: ${srcPath}`);
    process.exitCode = 1;
    continue;
  }
  const result = await sharp(srcPath)
    .rotate() // honour EXIF orientation
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
  const inStat = await sharp(srcPath).metadata();
  totalIn += inStat.size ?? 0;
  totalOut += result.size;
  console.log(
    `  ${slide.identity.padEnd(11)} ${String(inStat.size ?? 0).padStart(7)} B → ${String(result.size).padStart(7)} B  ${outPath}`,
  );
}

console.log(`\nTotal: ${totalIn} B → ${totalOut} B (${((1 - totalOut / totalIn) * 100).toFixed(0)}% smaller)`);
console.log(`\nNOTE: the 6th slide ARCHITECT is the existing src/assets/abir-2026.webp — kept as-is.`);
console.log("Run the build to verify, then commit the new files alongside the carousel component.");