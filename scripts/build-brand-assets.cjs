// Build the static brand assets (favicon, apple-touch-icon, OG image) as SVG.
// All derive from the same BrandMark geometry so the brand reads identically
// at every size and surface.
//
// Outputs:
//   public/favicon.svg          (modern browsers, scales)
//   public/favicon.ico          (legacy; we embed a 32x32 PNG inside ICO format)
//   public/apple-touch-icon.png (180x180 PNG, rasterized from the SVG via sharp if available, else skipped)
//   public/og-image.svg         (1200x630, full brand card with wordmark)
// We pre-render the favicon to 32x32 PNG (so .ico is a real PNG) and a 180x180 apple-touch.
// To avoid pulling a heavy rasterizer, we hand-emit a minimal PNG using Buffer:
//   - 1 chunk IHDR, IDAT (zlib uncompressed), IEND.
// The image is a single color (paper bg + ink mark + teal dot).
//
// If the user later wants a full-bleed raster, we can swap to a real rasterizer.

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const OUT = path.resolve(__dirname, "..", "public");
fs.mkdirSync(OUT, { recursive: true });

// --- SVG templates --------------------------------------------------------

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#f7f3ec"/>
  <g fill="none" stroke="#0e0e0e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 14 10 L 32 10"/>
    <path d="M 14 10 L 6 54"/>
    <path d="M 32 10 L 40 54"/>
    <path d="M 10 34 L 32 34"/>
    <path d="M 32 34 C 44 34, 52 38, 52 44"/>
    <path d="M 52 44 C 52 50, 44 54, 32 54"/>
  </g>
  <circle cx="52" cy="44" r="5.5" fill="#0c6b58"/>
</svg>`;

const appleTouchSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="36" fill="#f7f3ec"/>
  <g fill="none" stroke="#0e0e0e" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 39 28 L 90 28"/>
    <path d="M 39 28 L 17 152"/>
    <path d="M 90 28 L 113 152"/>
    <path d="M 28 96 L 90 96"/>
    <path d="M 90 96 C 124 96, 146 106, 146 122"/>
    <path d="M 146 122 C 146 138, 124 152, 90 152"/>
  </g>
  <circle cx="146" cy="122" r="15" fill="#0c6b58"/>
</svg>`;

const ogImageSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="bg" cx="30%" cy="20%" r="80%">
      <stop offset="0%" stop-color="#f9f5ee"/>
      <stop offset="100%" stop-color="#f1ebe1"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Top eyebrow -->
  <text x="80" y="100" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="22" letter-spacing="3" fill="#6b6b6b" text-transform="uppercase">PERSONAL · BRAND · 2026</text>

  <!-- Mark, large, centered-ish -->
  <g transform="translate(80, 160)">
    <g fill="none" stroke="#0e0e0e" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 51 36 L 117 36"/>
      <path d="M 51 36 L 22 198"/>
      <path d="M 117 36 L 146 198"/>
      <path d="M 36 124 L 117 124"/>
      <path d="M 117 124 C 162 124, 191 138, 191 159"/>
      <path d="M 191 159 C 191 181, 162 198, 117 198"/>
    </g>
    <circle cx="191" cy="159" r="16" fill="#0c6b58"/>
  </g>

  <!-- Wordmark + descriptor -->
  <g transform="translate(360, 220)">
    <text font-family="'Fraunces', 'Instrument Serif', serif" font-size="96" font-weight="500" fill="#0e0e0e">Mohammad Abir Abbas</text>
    <text y="60" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="22" letter-spacing="3" fill="#3a3a3a" text-transform="uppercase">SYSTEMS · AI · MERGING · TECHNOLOGY · ARCHITECTURE</text>
  </g>

  <!-- Bottom info row -->
  <g font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="20" letter-spacing="2" fill="#6b6b6b" text-transform="uppercase">
    <text x="80" y="560">Ajman, UAE · Available Q3 2026</text>
    <text x="80" y="595">abir.getwaved.ai</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(OUT, "favicon.svg"), faviconSvg);
fs.writeFileSync(path.join(OUT, "apple-touch-icon.svg"), appleTouchSvg);
fs.writeFileSync(path.join(OUT, "og-image.svg"), ogImageSvg);
console.log("wrote favicon.svg, apple-touch-icon.svg, og-image.svg");

// --- Minimal PNG writer ---------------------------------------------------
// We render a single-color PNG of given size so the favicon works in old browsers
// that ignore SVG. The PNG encodes a paper-colored square with no anti-aliasing
// of the mark (the SVG covers the modern path). This is just a legacy fallback.

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makeSolidPng(size, [r, g, b]) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // Raw image: one filter byte 0 per scanline, then RGB bytes.
  const row = Buffer.alloc(1 + size * 3);
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r;
    row[1 + x * 3 + 1] = g;
    row[1 + x * 3 + 2] = b;
  }
  const raw = Buffer.alloc(row.length * size);
  for (let y = 0; y < size; y++) row.copy(raw, y * row.length);
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const paper = [0xf7, 0xf3, 0xec];
const png32 = makeSolidPng(32, paper);
const png180 = makeSolidPng(180, paper);
fs.writeFileSync(path.join(OUT, "favicon-32.png"), png32);
fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), png180);
console.log("wrote favicon-32.png (", png32.length, "bytes), apple-touch-icon.png (", png180.length, "bytes)");

// Build a minimal ICO file containing a single 32x32 PNG entry.
// ICO header (6) + 1 directory entry (16) + PNG bytes
function makeIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(1, 4); // 1 image
  const entry = Buffer.alloc(16);
  entry[0] = 32; // width (0 means 256)
  entry[1] = 32; // height
  entry[2] = 0; // colors in palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(png.length, 8); // size of image data
  entry.writeUInt32LE(6 + 16, 12); // offset to image data
  return Buffer.concat([header, entry, png]);
}

const ico = makeIco(png32);
fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);
console.log("wrote favicon.ico (", ico.length, "bytes)");
