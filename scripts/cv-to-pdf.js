import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

/**
 * Regenerates public/Abir_Abbas_CV.pdf from public/cv-ats.html using a headless
 * Chromium-based browser. The HTML's @media print / @page CSS drives the layout.
 *
 * Usage: npm run cv:pdf
 */

const root = process.cwd();
const srcHtml = path.resolve(root, "public/cv-ats.html");
const outPdf = path.resolve(root, "public/Abir_Abbas_CV.pdf");

if (!fs.existsSync(srcHtml)) {
  console.error(`[cv:pdf] Source not found: ${srcHtml}`);
  process.exit(1);
}

// Candidate browser locations, in priority order. First existing one wins.
const candidates = [
  process.env.CHROME_PATH,
  // Windows
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${os.homedir()}/AppData/Local/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  // Linux (PATH-resolved names also handled below)
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
].filter(Boolean);

const browser =
  candidates.find((p) => fs.existsSync(p)) ??
  // Fall back to a name on PATH (Linux/CI).
  ["google-chrome", "chromium", "chromium-browser", "microsoft-edge"].find((name) => {
    try {
      execFileSync(name, ["--version"], { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  });

if (!browser) {
  console.error(
    "[cv:pdf] No Chromium-based browser found. Set CHROME_PATH to a chrome/edge/brave executable and retry.",
  );
  process.exit(1);
}

const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-pdf-"));

try {
  execFileSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${outPdf}`,
      pathToFileURL(srcHtml).href,
    ],
    { stdio: "ignore" },
  );

  const sizeKb = Math.round(fs.statSync(outPdf).size / 1024);
  console.log(`[cv:pdf] Wrote public/Abir_Abbas_CV.pdf (${sizeKb} KB) using ${path.basename(browser)}`);
} catch (err) {
  console.error(`[cv:pdf] Failed to generate PDF: ${err.message}`);
  process.exit(1);
} finally {
  fs.rmSync(profileDir, { recursive: true, force: true });
}
