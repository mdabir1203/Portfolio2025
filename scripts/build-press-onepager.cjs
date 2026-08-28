// Build a one-page brand sheet PDF for the press kit.
// Single letter page, calm off-white paper, type-led.
const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "press", "brand-onepager.pdf");

fs.mkdirSync(path.dirname(OUT), { recursive: true });

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 56, bottom: 56, left: 64, right: 64 },
  info: {
    Title: "Mohammad Abir Abbas — Press One-Pager",
    Author: "Mohammad Abir Abbas",
    Subject: "Brand summary for press & partnerships",
  },
});

const ws = fs.createWriteStream(OUT);
doc.pipe(ws);

// ── Brand mark (top-left, ~64px) ─────────────────────────────────────────
// Drawn with PDFKit vector primitives so it stays crisp at any zoom.
function drawBrandMark(x, y, size) {
  // Map our SVG viewBox (0..64) to the page (size px on the y axis).
  const s = size / 64;
  doc.save();
  doc.lineWidth(4 * s);
  doc.lineCap("round");
  doc.lineJoin("round");
  doc.strokeColor("#0e0e0e");
  // flat apex
  doc.moveTo(x + 14 * s, y + 10 * s).lineTo(x + 32 * s, y + 10 * s).stroke();
  // left diagonal
  doc.moveTo(x + 14 * s, y + 10 * s).lineTo(x + 6 * s, y + 54 * s).stroke();
  // right diagonal
  doc.moveTo(x + 32 * s, y + 10 * s).lineTo(x + 40 * s, y + 54 * s).stroke();
  // crossbar
  doc.moveTo(x + 10 * s, y + 34 * s).lineTo(x + 32 * s, y + 34 * s).stroke();
  // D curve top
  doc
    .moveTo(x + 32 * s, y + 34 * s)
    .bezierCurveTo(
      x + 44 * s,
      y + 34 * s,
      x + 52 * s,
      y + 38 * s,
      x + 52 * s,
      y + 44 * s
    )
    .stroke();
  // D curve bottom
  doc
    .moveTo(x + 52 * s, y + 44 * s)
    .bezierCurveTo(
      x + 52 * s,
      y + 50 * s,
      x + 44 * s,
      y + 54 * s,
      x + 32 * s,
      y + 54 * s
    )
    .stroke();
  // teal accent dot
  doc
    .fillColor("#0c6b58")
    .circle(x + 52 * s, y + 44 * s, 4.5 * s)
    .fill();
  doc.restore();
}

drawBrandMark(64, 50, 64);

// Eyebrow
doc
  .font("Helvetica-Bold")
  .fontSize(8)
  .fillColor("#6b6b6b")
  .text("PRESS · BRAND SHEET · 2026", 144, 60, { characterSpacing: 2 });

doc.moveDown(1.6);

// Big name
doc
  .font("Helvetica-Bold")
  .fontSize(34)
  .fillColor("#0e0e0e")
  .text("Mohammad Abir Abbas", 64, 150, { lineGap: 0 });

// Italic teal last-name
doc
  .font("Helvetica-Oblique")
  .fontSize(34)
  .fillColor("#0c6b58")
  .text("is a Creative Technologist who ships.", 64, 192, {
    lineGap: 4,
  });

// Role
doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("#3a3a3a")
  .text(
    "AI Architect  ·  Process Automation  ·  React + React Native  ·  GCC Manufacturing",
    64,
    248,
    { lineGap: 6 }
  );

// Divider
doc
  .moveTo(64, 290)
  .lineTo(548, 290)
  .lineWidth(0.5)
  .strokeColor("#cccccc")
  .stroke();

// Two columns
const left = 64;
const right = 312;
const colW = 240;
let yL = 310;
let yR = 310;

function colH(x, y, eyebrow, title, body) {
  doc.x = x;
  doc.y = y;
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#6b6b6b").text(eyebrow, {
    characterSpacing: 1.5,
  });
  doc.moveDown(0.2);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#0e0e0e").text(title, { lineGap: 1 });
  doc.moveDown(0.1);
  doc.font("Helvetica").fontSize(9.5).fillColor("#2a2a2a").text(body, {
    width: colW,
    lineGap: 1.5,
    paragraphGap: 0,
  });
  return doc.y;
}

yL = colH(
  left,
  yL,
  "ROLE · 2026",
  "AI Solution Architect",
  "Famous Abaya LLC (Dubai). Architected the AbaYa-Track Delivery Module that recovered AED 111K in trapped backlog in 30 days. 11.1:1 value-to-cost."
);
yL += 14;

yL = colH(
  left,
  yL,
  "FLAGSHIP PROJECT",
  "AbaYa-Track · Delivery Module",
  "Floor QR events → employee/order map → value engine → boardroom dashboard. Offline-first, Cloudflare-edge. Stack: Node 18, Express 5, Socket.IO 4, sql.js, Cloudflare Workers, D1, R2."
);
yL += 14;

yL = colH(
  left,
  yL,
  "AWARD",
  "SmartSwap · MIT Hacknation 2026",
  "Next Top Project. 24-hour global sprint, 1,000+ devs, 65+ countries, MIT Sloan AI Club. Built intent-driven token swapping for SMB websites with Abhishek Kumar (Team Xerox)."
);

yR = colH(
  right,
  yR,
  "OTHER WORK",
  "Wavelink · RedAGPT · Deep Blue",
  "Wavelink (smart NFC, GCC, 2025→). RedAGPT (2nd place, Redis Side Quest 2024). Deep Blue Digital co-founder (50+ sellers, Engaze.ai integration)."
);
yR += 14;

yR = colH(
  right,
  yR,
  "FOUNDATIONS",
  "42 Wolfsburg · Hannover · CUET",
  "MSc Computational Methods of Engineering, University of Hannover (2019). 42 Wolfsburg peer-programming school (C/C++, 2y 3m). BSc Mechanical Engineering, CUET (2018)."
);
yR += 14;

yR = colH(
  right,
  yR,
  "CONTACT",
  "Available · Dubai · Global remote",
  "abir.abbas@proton.me\n+971 054 361 8066\nlinkedin.com/in/abir-abbas\nabir.getwaved.ai\nyoutube.com/@wavelinkd"
);

// Footer rule
doc.x = 64;
doc.y = Math.max(yL, yR) + 18;
doc
  .moveTo(64, doc.y)
  .lineTo(548, doc.y)
  .lineWidth(0.5)
  .strokeColor("#dddddd")
  .stroke();
doc.moveDown(0.5);

// Brand mark in the bottom-right corner (small signature).
drawBrandMark(548 - 24, doc.y, 24);
doc
  .font("Helvetica")
  .fontSize(7.5)
  .fillColor("#6b6b6b")
  .text(
    "© 2026 Mohammad Abir Abbas · Press kit current as of August 2026 · For interviews, partnerships, and speaking, reach abir.abbas@proton.me",
    64,
    doc.y + 6,
    { characterSpacing: 0.5, lineGap: 1, width: 480 }
  );

doc.end();
ws.on("finish", () => {
  const sz = fs.statSync(OUT).size;
  console.log(`wrote ${path.relative(ROOT, OUT)} (${sz} bytes)`);
});
