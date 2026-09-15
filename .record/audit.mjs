#!/usr/bin/env node
// Audit SEO/GEO of captured pages.
import { readFileSync } from "node:fs";

const record = "C:/Users/mabba/Downloads/Portfolio2025/.record";
const files = {
  "HOME (/)":          `${record}/home.html`,
  "WORK (/work)":      `${record}/work.html`,
  "CONNECT (/connect)":`${record}/connect.html`,
  "CV-ATS (static)":   `${record}/cv.html`,
};

const checks = [
  ["title tag",         /<title>([^<]+)<\/title>/],
  ["meta description",  /name="description" content="([^"]+)"/],
  ["Dubai mention",     /Dubai/],
  ["Ajman mention",     /Ajman|عجمان/],
  ["geo.region",        /geo\.region/],
  ["geo.placename",     /geo\.placename/],
  ["og:type",           /og:type/],
  ["og:title",          /og:title/],
  ["og:image",          /og:image/],
  ["twitter:card",      /twitter:card/],
  ["canonical",         /rel="canonical"/],
  ["JSON-LD present",   /application\/ld\+json/],
  ['Person schema',     /"@type":"Person"/],
  ['WebSite schema',    /"@type":"WebSite"/],
  ['ProfilePage schema',/"@type":"ProfilePage"/],
  ['BreadcrumbList',    /"@type":"BreadcrumbList"/],
  ['FAQPage schema',    /"@type":"FAQPage"/],
  ['speakable',         /Speakable/],
  ['hreflang',          /hreflang/i],
  ['robots',            /name="robots"/],
  ['KSA / Saudi',       /Saudi|KSA|Riyadh|NEOM/],
  ['remote mention',    /[Rr]emote/],
  ['knowsAbout array',  /knowsAbout/],
  ['visa-status',       /visa-status/],
  ['Mohammad Abir Abbas',/Mohammad Abir Abbas/],
  ['mdabir1203',        /mdabir1203/],
  ['Wavelink',          /Wavelink/],
  ['AbaYa-Track',       /AbaYa-Track|AbaYaTrack/],
];

for (const [name, path] of Object.entries(files)) {
  const html = readFileSync(path, "utf8");
  console.log("═══ " + name + " ═══");
  for (const [label, rx] of checks) {
    const m = html.match(rx);
    const isFail = label === "Ajman mention";
    const ok = !!m;
    const mark = isFail ? (ok ? "✗ FAIL" : "✓ pass") : (ok ? "✓ pass" : "✗ FAIL");
    console.log("  " + label.padEnd(22) + " " + mark);
  }
  if (name.startsWith("HOME")) {
    // extract title
    const t = html.match(/<title>([^<]+)<\/title>/);
    const d = html.match(/name="description" content="([^"]+)"/);
    if (t) console.log("  TITLE: " + t[1]);
    if (d) console.log("  DESC : " + d[1].slice(0, 130) + (d[1].length > 130 ? "…" : ""));
  }
  console.log("");
}
