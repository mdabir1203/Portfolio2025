// Build a clean ATS-friendly PDF from public/cv-ats.md.
// One column, no images, no headers/footers, no tables.
// Uses Helvetica (PDF built-in) so it's universally parseable.
const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "cv-ats.md");
const OUT = path.join(ROOT, "public", "resume-ats.pdf");

function stripMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let i = 0;
  // Skip the leading H1 + horizontal rule.
  while (i < lines.length && !lines[i].startsWith("# ")) i++;
  if (i < lines.length) i++; // title
  if (i < lines.length && lines[i].trim() === "---") i++; // separator
  const raw = lines.slice(i);
  const blocks = [];
  i = 0;
  while (i < raw.length) {
    const ln = raw[i];
    if (ln.trim() === "---") {
      i++;
      continue;
    }
    if (ln.startsWith("### ")) {
      blocks.push({ type: "h3", text: stripMd(ln.slice(4)) });
      i++;
      continue;
    }
    if (ln.startsWith("## ")) {
      blocks.push({ type: "h2", text: stripMd(ln.slice(3)) });
      i++;
      continue;
    }
    if (ln.startsWith("# ")) {
      blocks.push({ type: "h1", text: stripMd(ln.slice(2)) });
      i++;
      continue;
    }
    if (ln.startsWith("- ") || ln.startsWith("* ")) {
      const items = [];
      while (i < raw.length && (raw[i].startsWith("- ") || raw[i].startsWith("* "))) {
        items.push(stripMd(raw[i].slice(2)));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (ln.trim() === "") {
      i++;
      continue;
    }
    const para = [];
    while (
      i < raw.length &&
      raw[i].trim() !== "" &&
      !raw[i].startsWith("#") &&
      !raw[i].startsWith("- ") &&
      !raw[i].startsWith("* ") &&
      raw[i].trim() !== "---"
    ) {
      para.push(raw[i]);
      i++;
    }
    if (para.length) blocks.push({ type: "p", text: stripMd(para.join(" ")) });
  }
  return blocks;
}

const md = fs.readFileSync(SRC, "utf8");
const blocks = parseMarkdown(md);

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 54, bottom: 54, left: 64, right: 64 },
  info: {
    Title: "Mohammad Abir Abbas — AI Architect · Dubai, UAE (Resume ATS)",
    Author: "Mohammad Abir Abbas",
    Subject: "AI Architect · Solutions Engineer · Platform Engineer — Dubai, UAE",
    Keywords: "AI Architect Dubai, AI Architect UAE, Solutions Engineer Dubai, Platform Engineer UAE, Developer Experience, React Native, Cloudflare Workers, LangChain, AutoGPT, RAG, GCC, MENA, Saudi Arabia, Riyadh, NEOM, Remote, Mohammed Abir Abbas, Abir Abbas, mdabir1203, Wavelink, Famous Abaya",
    Creator: "Mohammad Abir Abbas",
    Producer: "abir.getwaved.ai/resume",
  },
});

const ws = fs.createWriteStream(OUT);
doc.pipe(ws);

// Header
doc
  .font("Helvetica-Bold")
  .fontSize(20)
  .fillColor("#111111")
  .text("Mohammad Abir Abbas", { lineGap: 2 });
doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("#444444")
  .text("AI Architect · Solutions Engineer · Platform Engineer", { lineGap: 1 });
doc
  .font("Helvetica")
  .fontSize(9.5)
  .fillColor("#555555")
  .text("Dubai, UAE · Open to KSA & remote · UAE Company Visa (no sponsorship)", { lineGap: 4 });
doc
  .font("Helvetica")
  .fontSize(9.5)
  .fillColor("#555555")
  .text(
    "abir.abbas@proton.me  |  +971 54 361 8066  |  linkedin.com/in/abir-abbas  |  abir.getwaved.ai  |  github.com/mdabir1203  |  medium.com/@md.abir1203",
    { lineGap: 10 }
  );

doc
  .moveTo(64, doc.y)
  .lineTo(548, doc.y)
  .lineWidth(0.5)
  .strokeColor("#cccccc")
  .stroke();
doc.moveDown(0.6);

let firstSectionRendered = false;
for (const b of blocks) {
  switch (b.type) {
    case "h2":
      if (firstSectionRendered) doc.moveDown(0.4);
      firstSectionRendered = true;
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#111111")
        .text(b.text.toUpperCase(), { characterSpacing: 0.5 });
      doc
        .moveTo(64, doc.y + 2)
        .lineTo(548, doc.y + 2)
        .lineWidth(0.5)
        .strokeColor("#dddddd")
        .stroke();
      doc.moveDown(0.4);
      break;
    case "h3":
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111111")
        .text(b.text, { lineGap: 1 });
      doc.moveDown(0.1);
      break;
    case "p":
      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor("#222222")
        .text(b.text, { align: "left", lineGap: 2, paragraphGap: 4 });
      break;
    case "ul":
      for (const it of b.items) {
        doc
          .font("Helvetica")
          .fontSize(10.5)
          .fillColor("#222222")
          .text(`•  ${it}`, {
            indent: 14,
            align: "left",
            lineGap: 1,
            paragraphGap: 2,
          });
      }
      break;
  }
}

doc.end();
ws.on("finish", () => {
  const sz = fs.statSync(OUT).size;
  console.log(`wrote ${path.relative(ROOT, OUT)} (${sz} bytes)`);
});
