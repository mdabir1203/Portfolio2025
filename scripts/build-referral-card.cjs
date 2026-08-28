// Build the referral card assets:
//   1. Generate a real scannable QR PNG (encodes the QR landing URL) — quiet zone 4,
//      error correction H (~30% recovery so a tear-off crease doesn't kill the scan).
//   2. Bake that QR into the SVG card so it scans.
//   3. Render a print PDF (A6 landscape) with both sides on two pages, double-sided.
//   4. Re-write `public/.well-known/tabby.json` with the current default URL.
//
// Usage: `node scripts/build-referral-card.cjs [--code=intro] [--base=https://abir.getwaved.ai]`
//   --code: referral code baked into the QR + tear-off stub (default: "intro")
//   --base: base URL (default: https://abir.getwaved.ai)
const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "cards");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Parse CLI flags.
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};
const REFERRAL_BASE = flag("base", "https://abir.getwaved.ai");
const REFERRAL_CODE = flag("code", "intro");
const REFERRAL_PATH = `/c/${REFERRAL_CODE}`;
const REFERRAL_URL = REFERRAL_BASE + REFERRAL_PATH;

(async () => {
  // 1. Generate a 1024x1024 QR PNG. The error-correction level H is critical: a card
  // in a wallet gets a fold or scratch. 30% recovery means the QR still scans.
  const qrPng = await QRCode.toBuffer(REFERRAL_URL, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1024,
    color: { dark: "#0e0e0e", light: "#f7f3ec" },
  });
  fs.writeFileSync(path.join(OUT_DIR, "qr-code.png"), qrPng);
  console.log(
    "wrote",
    path.relative(ROOT, path.join(OUT_DIR, "qr-code.png")),
    `(${qrPng.length} bytes) → ${REFERRAL_URL}`,
  );

  // 2. Re-write the SVG with the QR URL baked into a data URI so the SVG
  //    travels alone. Designers can still open it in Figma/Illustrator.
  //    We read the source-with-placeholders, substitute, then write the final SVG.
  //    The on-disk source file is kept with `ABIR-{CODE}` as the placeholder so
  //    future runs of the build (with different --code) work correctly.
  let svg = fs.readFileSync(path.join(OUT_DIR, "abir-referral-card.svg"), "utf8");
  const dataUri = "data:image/png;base64," + qrPng.toString("base64");
  svg = svg.replace(/href="qr-code\.png"/, `href="${dataUri}"`);
  // Substitute the code placeholder. If the file already has a baked code
  // (from a previous run), restore the placeholder first so the new code wins.
  svg = svg.replace(/ABIR-[A-Z0-9]+/g, "ABIR-{CODE}");
  svg = svg.replace(/ABIR-\{CODE\}/g, "ABIR-" + REFERRAL_CODE.toUpperCase());
  fs.writeFileSync(path.join(OUT_DIR, "abir-referral-card.svg"), svg);
  console.log(
    "wrote",
    path.relative(ROOT, path.join(OUT_DIR, "abir-referral-card.svg")),
    "(with inline QR data URI, code=" + REFERRAL_CODE + ")",
  );

  // 3. Print PDF — A6 landscape, 297×210mm in PDF points (1mm = 2.8346pt).
  const PDF_OUT = path.join(OUT_DIR, "abir-referral-card.pdf");
  const doc = new PDFDocument({
    size: [297 * 2.8346, 210 * 2.8346],
    autoFirstPage: false,
    info: {
      Title: "Mohammad Abir Abbas — Referral Card",
      Author: "Mohammad Abir Abbas",
      Subject: `QR-distributed referral card, A6 double-sided, code=${REFERRAL_CODE}`,
    },
  });
  const ws = fs.createWriteStream(PDF_OUT);
  doc.pipe(ws);

  // Page 1: front
  doc.addPage();
  drawCardPage(doc, "front", qrPng, REFERRAL_CODE);
  // Page 2: back
  doc.addPage();
  drawCardPage(doc, "back", qrPng, REFERRAL_CODE);

  doc.end();
  ws.on("finish", () => {
    const sz = fs.statSync(PDF_OUT).size;
    console.log("wrote", path.relative(ROOT, PDF_OUT), `(${sz} bytes)`);
  });

  // 4. tabby.json — open metadata. Other tools can read this and auto-discover
  //    the referral system without scraping the HTML.
  const wellKnown = path.join(ROOT, "public", ".well-known");
  fs.mkdirSync(wellKnown, { recursive: true });
  const tabbyJson = {
    service: "abir-referral",
    version: "1.0.0",
    issuer: {
      name: "Mohammad Abir Abbas",
      url: "https://abir.getwaved.ai",
      email: "abir.abbas@proton.me",
    },
    contact_card: "https://abir.getwaved.ai/abir.vcf",
    distribution: {
      primary_code: REFERRAL_CODE,
      base_url: `${REFERRAL_BASE}/c/`,
      redirect_url: `${REFERRAL_BASE}/connect`,
      card_svg: "/cards/abir-referral-card.svg",
      card_pdf: "/cards/abir-referral-card.pdf",
      qr_png: "/cards/qr-code.png",
    },
    subscribe: {
      method: "POST",
      url: "https://abir.getwaved.ai/api/referral/subscribe",
      schema: {
        email: "string<email>",
        name: "string<optional>",
        code: "string<default=intro>",
        ref: "string<default=qr>",
      },
    },
    unsubscribe: {
      method: "POST",
      url: "https://abir.getwaved.ai/api/referral/unsubscribe",
    },
    drip: {
      engine: "resend",
      schedule: [
        { day: 0, subject: "Your 30-sec Loom of the AED 111K story" },
        { day: 3, subject: "The boardroom one-pager (PDF attached)" },
        { day: 7, subject: "One question, one calendar link" },
      ],
    },
  };
  fs.writeFileSync(
    path.join(wellKnown, "tabby.json"),
    JSON.stringify(tabbyJson, null, 2),
  );
  console.log("wrote", path.relative(ROOT, path.join(wellKnown, "tabby.json")));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

// ─────────────────────  PDF drawing  ─────────────────────

function drawCardPage(doc, side, qrPng, code) {
  // A6 landscape in PDF points: 297×210mm × 2.8346 = 841.89×595.28pt
  const W = 297 * 2.8346;
  const H = 210 * 2.8346;
  const M = 20 * 2.8346; // 20mm safe margin

  // Page background — paper.
  doc.save();
  doc.rect(0, 0, W, H).fillColor("#f7f3ec").fill();
  doc.restore();

  // Faint cut line at the edge of the page (3mm bleed guide).
  doc.save();
  doc.lineWidth(0.4).strokeColor("#cfcdc6").rect(8.5, 8.5, W - 17, H - 17).stroke();
  doc.restore();

  if (side === "front") {
    // Top hairline + corner sigs
    doc.save();
    doc.lineWidth(0.3).strokeColor("#0e0e0e");
    doc.moveTo(M, M).lineTo(W - M, M).stroke();
    doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#8a8a8a");
    doc.text("DUBAI · 2026", M, M + 4, { characterSpacing: 2.2, width: W - 2 * M });
    doc.text("A6 · DOUBLE-SIDED", M, M + 4, { characterSpacing: 2.2, align: "right", width: W - 2 * M });
    doc.restore();

    // BIG monogram, centered
    const monoSize = 110; // pt
    const monoX = W / 2 - monoSize / 2;
    const monoY = M + 25;
    drawMonogramOnPdf(doc, monoX, monoY, monoSize);

    // Name — italic serif. Helvetica-Oblique is the closest we have in
    // the standard PDF font set; we accept the slight typeface shift.
    const nameY = monoY + monoSize + 30;
    doc.save();
    doc.font("Helvetica-BoldOblique").fontSize(30).fillColor("#0e0e0e");
    doc.text("Mohammad Abir Abbas.", M, nameY, {
      width: W - 2 * M,
      align: "center",
      characterSpacing: -0.5,
    });
    doc.restore();

    doc.save();
    doc.font("Helvetica-Bold").fontSize(7).fillColor("#5a5a5a");
    doc.text("CREATIVE TECHNOLOGIST  ·  AI ARCHITECT", M, nameY + 22, {
      width: W - 2 * M,
      align: "center",
      characterSpacing: 2.5,
    });
    doc.restore();

    // Soft rule under the name
    const ruleY = nameY + 42;
    doc.save();
    doc.lineWidth(0.3).strokeColor("#cfcdc6");
    doc.moveTo(W / 2 - 50, ruleY).lineTo(W / 2 + 50, ruleY).stroke();
    doc.restore();

    // Proof line — italic. The whole point of the card.
    doc.save();
    doc.font("Helvetica-Oblique").fontSize(10).fillColor("#0e0e0e");
    doc.text("Architected the AED 111,246 Delivery Module", M, ruleY + 10, {
      width: W - 2 * M,
      align: "center",
    });
    doc.restore();

    doc.save();
    doc.font("Helvetica").fontSize(7).fillColor("#5a5a5a");
    doc.text("Famous Abaya LLC  ·  11.1:1 V:C  ·  MIT Hacknation 2026", M, ruleY + 26, {
      width: W - 2 * M,
      align: "center",
    });
    doc.restore();

    // Tear-off stub at the bottom
    const stubY = H - 22;
    doc.save();
    doc.lineWidth(0.4).strokeColor("#9a9890").dash(2, { space: 2 });
    doc.moveTo(M, stubY - 4).lineTo(W - M, stubY - 4).stroke();
    doc.undash();
    doc.restore();

    doc.save();
    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("YOUR CODE", M, stubY);
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#0e0e0e");
    doc.text("ABIR-" + code.toUpperCase(), M, stubY + 8, { characterSpacing: 3 });

    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("SCAN", M + 95, stubY);
    doc.font("Helvetica-Oblique").fontSize(11).fillColor("#0e0e0e");
    doc.text("abir.getwaved.ai/c/intro", M + 95, stubY + 8);

    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("✂  TEAR HERE", W - M - 80, stubY + 8, { width: 80, align: "right" });
    doc.restore();
  } else {
    // BACK

    // Top hairline + "from" sig
    doc.save();
    doc.lineWidth(0.3).strokeColor("#0e0e0e");
    doc.moveTo(M, M).lineTo(W - M, M).stroke();
    doc.font("Helvetica-Bold").fontSize(5.5).fillColor("#8a8a8a");
    doc.text("FROM THE DESK OF", M, M + 4, { characterSpacing: 2.2, width: W - 2 * M });
    doc.text("abir.getwaved.ai", M, M + 4, { characterSpacing: 2.2, align: "right", width: W - 2 * M });
    doc.restore();

    // QR (88×88pt) at top-left
    const qrSize = 88;
    doc.image(qrPng, M, M + 18, { width: qrSize, height: qrSize });

    // "SCAN or open" + URL under the QR
    const qrBottom = M + 18 + qrSize + 10;
    doc.save();
    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("SCAN", M, qrBottom, { characterSpacing: 2.2 });
    doc.font("Helvetica-Oblique").fontSize(9).fillColor("#0e0e0e");
    doc.text("or open", M, qrBottom + 10);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0e0e0e");
    doc.text("abir.getwaved.ai/c/intro", M, qrBottom + 21);
    doc.restore();

    // 3 stat tiles
    const statsY = M + 28;
    const statsX = M + 110;
    doc.save();
    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("THE NUMBERS", statsX, statsY, { characterSpacing: 2.2 });
    doc.lineWidth(0.3).strokeColor("#cfcdc6");
    doc.moveTo(statsX, statsY + 6).lineTo(statsX + 148, statsY + 6).stroke();
    doc.restore();

    const statY = statsY + 18;
    drawStat(doc, statsX, statY, "AED 111K", "backlog recovered");
    drawStat(doc, statsX + 50, statY, "11.1:1", "value : cost");
    drawStat(doc, statsX + 100, statY, "MIT", "Hacknation '26");

    // 3 promise lines
    const promiseY = statsY + 60;
    doc.save();
    doc.font("Helvetica-Bold").fontSize(6).fillColor("#8a8a8a");
    doc.text("15 SECONDS, THREE PROMISES", statsX, promiseY, { characterSpacing: 2.2 });
    doc.lineWidth(0.3).strokeColor("#cfcdc6");
    doc.moveTo(statsX, promiseY + 6).lineTo(statsX + 148, promiseY + 6).stroke();
    doc.restore();

    const promises = [
      { bold: "A 30-sec Loom", rest: " of the AED 111K story" },
      { bold: "My live calendar", rest: " — pick a 15-min slot" },
      { bold: "vCard drop", rest: " straight to your phone" },
    ];
    let py = promiseY + 18;
    for (const p of promises) {
      doc.save();
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#0e0e0e");
      const boldWidth = doc.widthOfString(p.bold);
      doc.text(p.bold, statsX, py, { continued: true, width: 148 });
      doc.font("Helvetica").fillColor("#5a5a5a");
      doc.text(p.rest, { width: 148 });
      doc.restore();
      py += 14;
    }

    // Bottom sign-off
    const bottomY = H - 22;
    doc.save();
    doc.lineWidth(0.3).strokeColor("#cfcdc6");
    doc.moveTo(M, bottomY - 4).lineTo(W - M, bottomY - 4).stroke();
    doc.font("Helvetica-Bold").fontSize(6).fillColor("#5a5a5a");
    doc.text("NO NEWSLETTER  ·  NO SPAM  ·  UNSUBSCRIBE WITH ONE TAP", M, bottomY, {
      characterSpacing: 2.2,
      width: W - 2 * M,
      align: "left",
    });
    doc.restore();
  }
}

function drawStat(doc, x, y, value, sub) {
  doc.save();
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#0e0e0e");
  doc.text(value, x, y, { characterSpacing: -0.5 });
  doc.font("Helvetica").fontSize(6.5).fillColor("#5a5a5a");
  doc.text(sub, x, y + 22);
  doc.restore();
}

// BrandMark A monogram, drawn via PDFKit vector primitives.
function drawMonogramOnPdf(doc, x, y, size) {
  const s = size / 64;
  doc.save();
  doc.lineWidth(3 * s);
  doc.lineCap("round");
  doc.lineJoin("round");
  doc.strokeColor("#0e0e0e");

  // flat apex
  doc.moveTo(x + 22 * s, y + 14 * s).lineTo(x + 50 * s, y + 14 * s).stroke();
  // left diagonal
  doc.moveTo(x + 22 * s, y + 14 * s).lineTo(x + 9 * s, y + 80 * s).stroke();
  // right diagonal
  doc.moveTo(x + 50 * s, y + 14 * s).lineTo(x + 63 * s, y + 80 * s).stroke();
  // crossbar
  doc.moveTo(x + 15 * s, y + 50 * s).lineTo(x + 50 * s, y + 50 * s).stroke();
  // D curve top
  doc
    .moveTo(x + 50 * s, y + 50 * s)
    .bezierCurveTo(
      x + 68 * s,
      y + 50 * s,
      x + 80 * s,
      y + 56 * s,
      x + 80 * s,
      y + 65 * s,
    )
    .stroke();
  // D curve bottom
  doc
    .moveTo(x + 80 * s, y + 65 * s)
    .bezierCurveTo(
      x + 80 * s,
      y + 75 * s,
      x + 68 * s,
      y + 80 * s,
      x + 50 * s,
      y + 80 * s,
    )
    .stroke();
  // teal dot
  doc.fillColor("#0c6b58").circle(x + 80 * s, y + 65 * s, 6.5 * s).fill();
  doc.restore();
}
