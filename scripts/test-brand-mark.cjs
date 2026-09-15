// Quick render test for the BrandMark SVG geometry.
// Generates a 512x512 PNG so I can eyeball it next to the reference screenshot.
const fs = require("node:fs");
const path = require("node:path");

// Crude inline rasterizer: parse the viewBox paths manually by stroking them
// into an SVG string, then write the SVG. We'll use a headless render if puppeteer
// is missing, we just write the SVG.
const OUT_DIR = path.join(__dirname, "..", "press", "brand-test");
fs.mkdirSync(OUT_DIR, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" fill="#f7f3ec"/>
  <g fill="none" stroke="#0e0e0e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 14 10 L 32 10"/>
    <path d="M 14 10 L 6 54"/>
    <path d="M 32 10 L 40 54"/>
    <path d="M 10 34 L 32 34"/>
    <path d="M 32 34 C 44 34, 52 38, 52 44"/>
    <path d="M 52 44 C 52 50, 44 54, 32 54"/>
  </g>
  <circle cx="52" cy="44" r="4.5" fill="#0c6b58"/>
</svg>`;

fs.writeFileSync(path.join(OUT_DIR, "brand-mark-test.svg"), svg);
console.log("wrote", path.join(OUT_DIR, "brand-mark-test.svg"));
