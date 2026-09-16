// pdf-parse triggers a side-effect on import that reads a test file.
// Avoid that by importing the underlying lib/pdf-parse.js directly.
import { readFileSync } from "node:fs";

const libPath = "node_modules/pdf-parse/lib/pdf-parse.js";
const mod = await import(`./${libPath.replace(/^node_modules\//, "../")}`).catch(async () => {
  // Fallback to require() to handle the CJS module shape.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  return require("../node_modules/pdf-parse/lib/pdf-parse.js");
});

const pdfParse = mod.default || mod;
const buf = readFileSync("public/Abir_Abbas_CV.pdf");
const data = await pdfParse(buf);
const text = data.text;

console.log("pages:", data.numpages);
console.log("size:", buf.length, "bytes");
console.log("---");

const eduIdx = text.indexOf("Education");
if (eduIdx >= 0) {
  console.log("EDUCATION SECTION:");
  console.log(text.substring(eduIdx, eduIdx + 600));
  console.log("---");
}

const needles = [
  "Mechanical Engineering",
  "Chittagong University",
  "Leibniz",
  "Computational Methods",
  "MSc",
  "BSc",
  "42 Wolfsburg",
  "phaeno",
  "English IELTS",
  "Famous Abaya",
  "Wavelink",
];
console.log("Content checks:");
for (const n of needles) {
  console.log((text.includes(n) ? "  PASS " : "  FAIL ") + n);
}
