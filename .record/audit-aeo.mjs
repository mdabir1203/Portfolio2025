#!/usr/bin/env node
// AEO/GEO/SEO audit of the rendered portfolio HTML.
import { readFileSync } from "node:fs";

const files = {
  "HOME (/)":           `${process.cwd()}/.record/preview-home.html`,
  "RECRUITER":          `${process.cwd()}/.record/preview-recruiter.html`,
};

const checks = [
  // 2026 AEO
  ["FAQPage JSON-LD",         /"@type":"FAQPage"/],
  ["FAQPage mainEntity",      /FAQPage[^]*mainEntity/],
  ["HowTo JSON-LD",           /"@type":"HowTo"/],
  ["HowTo 5 steps",           /HowTo[^]*position[\s\S]*?5/],
  ["ItemList JSON-LD",        /"@type":"ItemList"/],
  ["ItemList items",          /itemListElement/],
  ["Person JSON-LD",          /"@type":"Person"/],
  ["ProfilePage JSON-LD",     /"@type":"ProfilePage"/],
  ["WebSite JSON-LD",         /"@type":"WebSite"/],
  ["BreadcrumbList",          /"@type":"BreadcrumbList"/],
  ["Speakable",               /Speakable/],
  ["ItemList 5 case studies", /AbaYa-Track[\s\S]*?SmartSwap[\s\S]*?Wavelink[\s\S]*?Deep Blue Digital[\s\S]*?RedAGPT/],
  // 2026 AEO content patterns
  ["Answer-first <p> after H1",/cin-hero-answer[\s\S]*?AI Architect[\s\S]*?Dubai/],
  ["AED 111,246 mention",     /AED 111,?246/],
  ["11.1:1 V:C mention",      /11\.1:1/],
  ["MIT Hacknation 2026",     /MIT Hacknation 2026/],
  ["Redis 2024",              /Redis 2024|Redis Side Quest/],
  ["GCC + MENA",              /GCC|MENA/],
  ["KSA / Riyadh / NEOM",     /Riyadh|NEOM/],
  ["Dubai in title",          /<title>[^<]*Dubai/i],
  ["hreflang en/ar-AE",       /hreflang="(en|ar-AE)"/],
  ["geo.region AE-DU",        /AE-DU/],
  ["visa-status meta",        /visa-status/],
  ["robots meta",             /name="robots"/],
  // 2026 watchouts
  ["No Ajman",                /Ajman|عجمان/],  // expect ZERO
  ["llms.txt linked",          /llms\.txt/],
];

let pass = 0, fail = 0;
for (const [name, path] of Object.entries(files)) {
  const html = readFileSync(path, "utf8");
  console.log("\n═══ " + name + " ═══");
  for (const [label, rx] of checks) {
    const m = html.match(rx);
    const isAjman = label === "No Ajman";
    const ok = !!m;
    const mark = isAjman
      ? (ok ? "✗ FAIL" : "✓ pass")
      : (ok ? "✓ pass" : "✗ FAIL");
    console.log("  " + label.padEnd(30) + " " + mark);
    if (isAjman ? !ok : ok) pass++; else fail++;
  }
}
console.log("\n──── TOTAL: " + pass + " pass, " + fail + " fail ────");
process.exit(fail > 0 ? 1 : 0);
