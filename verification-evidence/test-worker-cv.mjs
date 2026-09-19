// verification-evidence/test-worker-cv.mjs
// End-to-end smoke test of the production worker's /cv handling.
// We mock env.ASSETS with the real Abir_Abbas_FullStackDeveloper_CV_2026.pdf bytes from dist/client/
// and confirm the worker returns a 200 with correct attachment headers.

import { readFileSync, writeFileSync, unlinkSync, mkdtempSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workerPath = resolve(projectRoot, "dist/client/_worker.js");
const pdfPath = resolve(projectRoot, "dist/client/Abir_Abbas_FullStackDeveloper_CV_2026.pdf");

// Strip the `import ssrHandler from './server.js'` and replace ssrHandler.fetch
// calls with a stub. We write the result to a temp file so dynamic import can
// resolve its relative references.
const workerSrc = readFileSync(workerPath, "utf8");
const stubbed = workerSrc
  .replace(/^import ssrHandler from .*?;\s*/m, "")
  .replace(/ssrHandler\.fetch\([^)]*\)/g, "new Response('ssr-stub', { status: 200, headers: { 'content-type': 'text/html' } })");

const tmpDir = mkdtempSync(join(tmpdir(), "wkr-"));
const tmpWorker = join(tmpDir, "_worker.mjs");
writeFileSync(tmpWorker, stubbed, "utf8");

// Load via file: URL so dynamic import works on Windows
const workerModule = await import(pathToFileURL(tmpWorker).href);
const worker = workerModule.default;

const pdfBytes = readFileSync(pdfPath);

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/Abir_Abbas_FullStackDeveloper_CV_2026.pdf") {
        return new Response(pdfBytes, {
          status: 200,
          headers: { "content-type": "application/pdf", "content-length": String(pdfBytes.length) },
        });
      }
      return new Response("not found", { status: 404 });
    },
  },
};

let passed = 0;
let failed = 0;
function check(label, ok, detail = "") {
  if (ok) { console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`); passed++; }
  else    { console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`); failed++; }
}

// ── Test 1: GET /cv returns the PDF with attachment headers ────────────────
{
  const req = new Request("https://example.com/cv", { method: "GET" });
  const res = await worker.fetch(req, env, {});
  check("/cv status === 200", res.status === 200, `got ${res.status}`);
  check("/cv content-type === application/pdf", res.headers.get("content-type") === "application/pdf", res.headers.get("content-type"));
  const cd = res.headers.get("content-disposition") ?? "";
  check("/cv content-disposition includes 'attachment'", cd.includes("attachment"), cd);
  check("/cv content-disposition has ASCII filename", cd.includes('filename="Abir_Abbas_FullStackDeveloper_CV_2026.pdf"'), cd);
  check("/cv content-disposition has UTF-8 filename*", cd.includes("filename*=UTF-8''Abir_Abbas_FullStackDeveloper_CV_2026.pdf"), cd.slice(0, 100));
  check("/cv cache-control === public, max-age=3600", res.headers.get("cache-control") === "public, max-age=3600");
  check("/cv x-content-type-options === nosniff", res.headers.get("x-content-type-options") === "nosniff");
  check("/cv referrer-policy === strict-origin-when-cross-origin", res.headers.get("referrer-policy") === "strict-origin-when-cross-origin");
  const bytes = new Uint8Array(await res.arrayBuffer());
  check("/cv body length matches", bytes.length === pdfBytes.length, `${bytes.length} vs ${pdfBytes.length}`);
  check("/cv body starts with %PDF", bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46, `${String.fromCharCode(...bytes.slice(0, 4))}`);
}

// ── Test 2: /assets/foo.png → routes to env.ASSETS (not ssrHandler) ────────
{
  const req = new Request("https://example.com/assets/foo.png", { method: "GET" });
  const res = await worker.fetch(req, env, {});
  const text = await res.text();
  check("/assets/foo.png routed to env.ASSETS (mocked 404)", res.status === 404 && text === "not found");
}

// ── Test 3: No env.ASSETS → /cv returns 404 ────────────────────────────────
{
  const req = new Request("https://example.com/cv", { method: "GET" });
  const res = await worker.fetch(req, {}, {});
  check("/cv without env.ASSETS returns 404", res.status === 404);
}

// ── Test 4: HEAD /cv also routes to attachment handler ─────────────────────
{
  const req = new Request("https://example.com/cv", { method: "HEAD" });
  const res = await worker.fetch(req, env, {});
  check("HEAD /cv returns 200", res.status === 200);
  check("HEAD /cv content-type === application/pdf", res.headers.get("content-type") === "application/pdf");
}

// Cleanup
try { unlinkSync(tmpWorker); } catch {}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
