/**
 * Capture cinematic frames of the editorial landing for the video.
 *
 * v2: injects a subtle SVG "guide" pointer per section so the viewer
 * always knows where to look. Calm teal pulse, never loud. The arrow
 * is a single visual contract across the whole site — one design
 * language, twelve moments.
 *
 * - Boots a chromium headless via the project's existing puppeteer-core
 *   dep (used by the WhatsApp outreach system, already installed).
 * - Walks the page through 12 hand-picked scroll positions, injects
 *   a custom pointer at each, captures each as a 1920x1080 PNG.
 * - Saves to .record/frames/ for the video pipeline.
 */

import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "frames");
mkdirSync(OUT_DIR, { recursive: true });

// Hand-picked scroll positions + where the guide pointer should sit
// (in viewport-px coords) and what the focal point of the section is.
//
// The pointer is a soft teal pulse with a small chevron arrow — calm,
// not loud. Same color as the site's accent (var(--accent-teal)).
// Same radius everywhere. It says "look here, gently" instead of
// "LOOK HERE NOW." The arrow chevron points DOWN at the focal point
// so the viewer always knows what to read next.
const STOPS = [
  {
    id: "01-hero", y: 0,
    note: "Hero — name + pitch",
    pointer: { x: 470, y: 350, label: "the name" },
  },
  {
    id: "02-work", y: 1100,
    note: "Selected Work",
    pointer: { x: 400, y: 240, label: "AbaYa-Track" },
  },
  {
    id: "03-case-top", y: 2300,
    note: "Delivery Module — the headline",
    pointer: { x: 450, y: 460, label: "the headline" },
  },
  {
    id: "04-case-2", y: 3100,
    note: "Case study — system map",
    pointer: { x: 510, y: 700, label: "4 layers" },
  },
  {
    id: "05-iceberg", y: 4700,
    note: "Where the AED 111K sits",
    pointer: { x: 1100, y: 700, label: "50% recovery" },
  },
  {
    id: "06-about", y: 6300,
    note: "What I actually do",
    pointer: { x: 810, y: 320, label: "capabilities" },
  },
  {
    id: "07-reviews", y: 7300,
    note: "Peer reviews",
    pointer: { x: 510, y: 420, label: "recommendations" },
  },
  {
    id: "08-path", y: 8300,
    note: "From Wolfsburg to the Gulf",
    pointer: { x: 700, y: 460, label: "career path" },
  },
  {
    id: "09-writing", y: 9600,
    note: "I write about the edges",
    pointer: { x: 480, y: 360, label: "latest essay" },
  },
  {
    id: "10-watch", y: 10800,
    note: "I build in public",
    pointer: { x: 480, y: 440, label: "latest video" },
  },
  {
    id: "11-contact", y: 12100,
    note: "Send a brief. Get a film.",
    pointer: { x: 370, y: 240, label: "let's talk" },
  },
  {
    id: "12-footer", y: 13100,
    note: "Footer + Ko-fi",
    pointer: { x: 130, y: 940, label: "Ko-fi" },
  },
];

// SVG pointer — a teal "look here" cursor: a pulsing circle with a
// downward chevron inside, plus a small label that sits ABOVE the
// cursor in the white space (never on top of content). The same
// visual contract for every section. Calm pulse, never loud.
const POINTER_SVG = ({ x, y, label }) => `
<div id="__capture_pointer__" style="
  position: fixed;
  left: ${x}px;
  top: ${y}px;
  width: 0; height: 0;
  pointer-events: none;
  z-index: 2147483646;
">
  <style>
    @keyframes __cp_pulse__ {
      0%, 100% { transform: scale(1);    opacity: 0.85; }
      50%      { transform: scale(1.12); opacity: 1; }
    }
    @keyframes __cp_ring__ {
      0%   { transform: scale(0.5); opacity: 0.55; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes __cp_bob__ {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(4px); }
    }
    .__cp_core__ {
      position: absolute;
      left: -26px; top: -26px;
      width: 52px; height: 52px;
      border-radius: 50%;
      background: rgba(15, 117, 105, 0.95);
      box-shadow: 0 8px 24px rgba(15, 60, 50, 0.32);
      animation: __cp_pulse__ 2.2s ease-in-out infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .__cp_ring__ {
      position: absolute;
      left: -26px; top: -26px;
      width: 52px; height: 52px;
      border-radius: 50%;
      border: 2px solid rgba(15, 117, 105, 0.55);
      animation: __cp_ring__ 1.6s ease-out infinite;
      pointer-events: none;
    }
    .__cp_chev__ {
      width: 18px; height: 12px;
      animation: __cp_bob__ 2.2s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .__cp_label__ {
      position: absolute;
      left: 50%;
      bottom: 60px;
      transform: translateX(-50%);
      font: 600 11px/1.2 'JetBrains Mono', ui-monospace, monospace;
      color: #0f7569;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(15, 117, 105, 0.45);
      border-radius: 999px;
      padding: 5px 11px;
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(15, 60, 50, 0.18);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  </style>
  <div class="__cp_label__">${label}</div>
  <div class="__cp_ring__"></div>
  <div class="__cp_core__">
    <svg class="__cp_chev__" viewBox="0 0 18 12" xmlns="http://www.w3.org/2000/svg">
      <path d="M 1 1 L 9 10 L 17 1" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</div>
`;

async function findChrome() {
  const paths = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    `${process.env.USERPROFILE}\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`,
  ].filter(Boolean);
  const fs = await import("node:fs");
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
  ],
});

try {
  const page = await browser.newPage();
  console.log("[capture] navigating to http://localhost:8080/");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle0", timeout: 60000 });

  // Let the medium + youtube rails fetch and render.
  await new Promise((r) => setTimeout(r, 4000));

  const manifest = [];
  for (const stop of STOPS) {
    console.log(`[capture] ${stop.id} @ y=${stop.y} — ${stop.note}`);
    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: "instant" });
    }, stop.y);
    // Inject the pointer overlay just before the screenshot.
    await page.evaluate((svgHtml) => {
      document.getElementById("__capture_pointer__")?.remove();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = svgHtml.trim();
      document.body.appendChild(wrapper.firstChild);
    }, POINTER_SVG({ x: stop.pointer.x, y: stop.pointer.y, label: stop.pointer.label }));

    // Wait a beat for the pulse animation to settle into a representative frame.
    await new Promise((r) => setTimeout(r, 700));

    const buf = await page.screenshot({ type: "png", fullPage: false });
    const file = resolve(OUT_DIR, `${stop.id}.png`);
    writeFileSync(file, buf);
    manifest.push({ id: stop.id, file, note: stop.note, y: stop.y });

    // Remove the pointer before the next section so it doesn't drift
    // into the wrong frame during scroll.
    await page.evaluate(() => {
      document.getElementById("__capture_pointer__")?.remove();
    });
  }

  writeFileSync(resolve(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`[capture] wrote ${STOPS.length} pointer-guided frames to ${OUT_DIR}`);
} finally {
  await browser.close();
}
