// Bundle the press kit into /public/press.zip so the Footer's "Press kit" link works.
// Contents:
//   - brand-onepager.pdf   (one-page brand sheet)
//   - CV.pdf               (existing public/Abir_Abbas_CV.pdf, renamed for clarity)
//   - smartswap-whitepaper.pdf
//   - portrait-2026.webp   (editorial hero portrait)
//   - portrait-bento.webp  (legacy bento portrait)
//   - deepblue-logo.webp
//   - project-tiles/       (all the editorial work tiles)
//   - README.txt
const fs = require("node:fs");
const path = require("node:path");
const { ZipArchive } = require("archiver");

const ROOT = path.resolve(__dirname, "..");
const PRESS_DIR = path.join(ROOT, "press");
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "src", "assets");
const OUT = path.join(PUBLIC_DIR, "press.zip");

function mustExist(p, label) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing ${label}: ${p}`);
  }
  return p;
}

// Build the brand one-pager first so we can include it.
require("child_process").execSync("node scripts/build-press-onepager.cjs", {
  cwd: ROOT,
  stdio: "inherit",
});

mustExist(path.join(PRESS_DIR, "brand-onepager.pdf"), "brand one-pager PDF");

const files = [
  // PDFs
  { src: path.join(PRESS_DIR, "brand-onepager.pdf"), name: "brand-onepager.pdf" },
  { src: path.join(PUBLIC_DIR, "Abir_Abbas_CV.pdf"), name: "CV.pdf" },
  { src: path.join(PUBLIC_DIR, "smartswap-whitepaper.pdf"), name: "smartswap-whitepaper.pdf" },
  // Portraits
  { src: path.join(ASSETS_DIR, "abir-2026.webp"), name: "portraits/portrait-2026.webp" },
  { src: path.join(ASSETS_DIR, "abir.webp"), name: "portraits/portrait-bento.webp" },
  { src: path.join(ASSETS_DIR, "deepblue-logo.webp"), name: "logos/deepblue-logo.webp" },
];

// All tile images.
const tileNames = [
  "wavelink-tile.webp",
  "redagpt-tile.webp",
  "wolfsburg-tile.webp",
  "deepblue-tile.webp",
  "hnm-tile.webp",
  "phaeno-tile.webp",
  "smartswap-tile.webp",
  "delivery-module-tile.webp",
  "case-study-gcc-abaya.png",
];
for (const n of tileNames) {
  const p = path.join(ASSETS_DIR, n);
  if (fs.existsSync(p)) {
    files.push({ src: p, name: `project-tiles/${n}` });
  }
}

const readme = `Mohammad Abir Abbas — Press Kit
====================================

Updated: August 2026
Use: editorial, press, podcast hosts, partnerships.

What's inside
-------------
brand-onepager.pdf         — single-page brand summary
CV.pdf                     — full curriculum vitae
smartswap-whitepaper.pdf   — MIT Hacknation 2026 project write-up
portraits/                 — official headshots
logos/                     — co-founder brand assets
project-tiles/             — editorial tiles from the portfolio grid

Headshot usage
--------------
- portrait-2026.webp is the current 2026 headshot. Use this by default.
- portrait-bento.webp is the older bento landing portrait.
- For minimum-size crops, use the image at native resolution; do not upscale.

Boilerplate
-----------
Mohammad Abir Abbas is a Creative Technologist and AI Architect
based in Dubai. He is the AI Solution Architect at Famous Abaya LLC,
where he built the AbaYa-Track Delivery Module that recovered
AED 111K of trapped manufacturing backlog in 30 days (11.1:1
value-to-cost). In 2026 he won Next Top Project at MIT Hacknation
with SmartSwap. He is currently Chief Technical Advisor at Wavelink
and the co-founder of Deep Blue Digital.

Contact
-------
abir.abbas@proton.me
+971 054 361 8066
linkedin.com/in/abir-abbas
abir.getwaved.ai
youtube.com/@wavelinkd
`;

const out = fs.createWriteStream(OUT);
const archive = new ZipArchive({ zlib: { level: 9 } });

out.on("close", () => {
  console.log(`wrote ${path.relative(ROOT, OUT)} (${archive.pointer()} bytes)`);
});
archive.on("warning", (err) => {
  if (err.code === "ENOENT") console.warn("warn:", err.message);
  else throw err;
});
archive.on("error", (err) => {
  throw err;
});
archive.pipe(out);

for (const f of files) {
  archive.file(f.src, { name: f.name });
}
archive.append(readme, { name: "README.txt" });

archive.finalize();
