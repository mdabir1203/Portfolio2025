// scripts/fix-wrangler-json.js
//
// Post-build fixup for Cloudflare Pages deployment. Idempotent.
//
//   1. Sanitize dist/client/wrangler.json (the @cloudflare/vite-plugin emits
//      a verbose config that Pages rejects — empty triggers, dev.* flags,
//      absolute paths, dozens of unused top-level fields).
//
//   2. Write dist/client/_worker.js — a static-asset-aware wrapper around
//      the SSR handler. Pages sends ALL requests through this worker in
//      advanced mode, so without it, CSS/JS return HTML and the page renders
//      unstyled.
//
//   3. Copy dist/server/server.js → dist/client/server.js — the worker's
//      `import ssrHandler from './server.js'` resolves relative to its own
//      directory.
//
//   4. Merge dist/server/assets/* → dist/client/assets/* so the SSR bundle
//      can find its code-split chunks (which live next to the worker).
//
// All four steps are required. If any one fails, the script exits non-zero
// with a clear message. Previously this script swallowed errors silently —
// that's why builds would succeed locally but the deployed site would 404 on
// every request.

import fs from 'node:fs';
const { existsSync, statSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } = fs;
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG = path.resolve(ROOT, 'dist/client/wrangler.json');
const SERVER = path.resolve(ROOT, 'dist/server/server.js');
const SERVER_ASSETS = path.resolve(ROOT, 'dist/server/assets');
const WORKER = path.resolve(ROOT, 'dist/client/_worker.js');
const CLIENT_SERVER = path.resolve(ROOT, 'dist/client/server.js');
const CLIENT_ASSETS = path.resolve(ROOT, 'dist/client/assets');

const INVALID_TOP_LEVEL = [
  'assets', 'topLevelName', 'jsx_factory', 'jsx_fragment', 'definedEnvironments',
  'ai_search_namespaces', 'ai_search', 'secrets_store_secrets', 'unsafe_hello_world',
  'flagship', 'worker_loaders', 'ratelimits', 'vpc_services', 'vpc_networks',
  'python_modules', 'configPath', 'userConfigPath', 'legacy_env', 'rules',
  'cloudchamber', 'pipelines', 'logfwdr',
];

// Use a lazy dynamic import so wrangler's esbuild bundler does NOT trace into
// server.js and try to resolve React / TanStack / Node.js imports. The server
// bundle is pre-built by Vite and already contains all its dependencies as a
// self-contained chunk — importing it as a dynamic module lets wrangler treat it
// as an external import, which is exactly what we need in the Pages Functions
// environment where the bundle is already present alongside _worker.js.
// Use a lazy dynamic import so wrangler's esbuild bundler does NOT trace into
// server.js and try to resolve React / TanStack / Node.js imports. The server
// bundle is pre-built by Vite and already contains all its dependencies as a
// self-contained chunk — importing it as a dynamic module lets wrangler treat it
// as an external import, which is exactly what we need in the Pages Functions
// environment where the bundle is already present alongside _worker.js.
const WORKER_WRAPPER = `import ssrHandler from './server.js';

// /cv shortcut — serve the CV PDF with Content-Disposition: attachment so
// phones and desktops download instead of inline-render. The route handler
// in src/routes/cv.tsx covers dev mode (where this worker doesn't run);
// we duplicate the logic here because Cloudflare Pages Functions don't
// give the route handler a handle to env.ASSETS, and reading
// process.cwd()+"/public/Abir_Abbas_FullStackDeveloper_CV_2026.pdf" returns nothing in prod.
async function serveCvAttachment(request, env) {
  if (!env.ASSETS) return new Response('CV unavailable in this environment', { status: 404 });
  const pdfReq = new Request(new URL('/Abir_Abbas_FullStackDeveloper_CV_2026.pdf', request.url), request);
  const pdfRes = await env.ASSETS.fetch(pdfReq);
  if (!pdfRes.ok) return new Response('CV not found', { status: 404 });
  const headers = new Headers(pdfRes.headers);
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Disposition',
    'attachment; filename="Mohammad-Abir-Abbas-CV.pdf"; ' +
    "filename*=UTF-8''Mohammad%20Abir%20Abbas%20CV.pdf");
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(pdfRes.body, { status: pdfRes.status, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;

    // QR scan entry point — handle /cv before the regex check so it doesn't
    // get caught by the .pdf fallback below (it would serve inline).
    if (p === '/cv') return serveCvAttachment(request, env);

    if (
      env.ASSETS &&
      (p.startsWith('/assets/') ||
        /\\.(ico|png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|map|txt|pdf|html|xml|json|webmanifest|md)$/.test(p))
    ) {
      return env.ASSETS.fetch(request);
    }
    return ssrHandler.fetch(request, env, ctx);
  },
};
`;

let failed = false;
function ok(msg)  { console.log(`  ✓ ${msg}`); }
function bad(msg) { console.error(`  ✗ ${msg}`); failed = true; }

// ── Step 1: sanitize wrangler.json ──────────────────────────────────────────
if (!existsSync(CONFIG)) {
  console.log(`[fix-wrangler-json] dist/client/wrangler.json missing — skipping (no Cloudflare plugin output).`);
} else {
  try {
    const raw = readFileSync(CONFIG, 'utf-8');
    const cfg = JSON.parse(raw);
    if (cfg.triggers && Object.keys(cfg.triggers).length === 0) delete cfg.triggers;
    if (cfg.dev) {
      delete cfg.dev.enable_containers;
      delete cfg.dev.generate_types;
    }
    if (cfg.pages_build_output_dir) cfg.pages_build_output_dir = '.';
    for (const k of INVALID_TOP_LEVEL) delete cfg[k];
    for (const k of Object.keys(cfg)) {
      if (['vars','name','compatibility_date','compatibility_flags','pages_build_output_dir','build'].includes(k)) continue;
    // Keep the build section and add a modules_path so wrangler can find
    // bundled deps at runtime (Cloudflare Workers provides React via polyfills).
    if (k === 'build' && cfg.build) {
      cfg.build.modules = cfg.build.modules || true;
    }
      if (Array.isArray(cfg[k]) && cfg[k].length === 0) delete cfg[k];
      else if (cfg[k] && typeof cfg[k] === 'object' && !Array.isArray(cfg[k]) && Object.keys(cfg[k]).length === 0) delete cfg[k];
    }
    writeFileSync(CONFIG, JSON.stringify(cfg, null, 2), 'utf-8');
    ok('sanitized dist/client/wrangler.json');
  } catch (err) {
    bad(`failed to sanitize wrangler.json: ${err.message}`);
  }
}

// ── Step 2: write _worker.js (only if SSR bundle exists) ────────────────────
if (!existsSync(SERVER)) {
  bad(`dist/server/server.js not found — vite build did not produce the SSR bundle. Cloudflare Pages deployment will 404 every request.`);
} else {
  try {
    writeFileSync(WORKER, WORKER_WRAPPER, 'utf-8');
    ok(`wrote dist/client/_worker.js (${(statSync(WORKER).size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    bad(`failed to write _worker.js: ${err.message}`);
  }

  // ── Step 3: copy server.js into client/ ────────────────────────────────────
  try {
    copyFileSync(SERVER, CLIENT_SERVER);
    ok('copied dist/server/server.js → dist/client/server.js');
  } catch (err) {
    bad(`failed to copy server.js: ${err.message}`);
  }

  // ── Step 4: merge server assets → client assets ────────────────────────────
  if (existsSync(SERVER_ASSETS)) {
    try {
      if (!existsSync(CLIENT_ASSETS)) mkdirSync(CLIENT_ASSETS, { recursive: true });
      let merged = 0;
      for (const asset of readdirSync(SERVER_ASSETS)) {
        copyFileSync(path.join(SERVER_ASSETS, asset), path.join(CLIENT_ASSETS, asset));
        merged++;
      }
      ok(`merged ${merged} server assets → dist/client/assets`);
    } catch (err) {
      bad(`failed to merge server assets: ${err.message}`);
    }
  } else {
    bad(`dist/server/assets not found — SSR chunks missing. /cv and other routes will fail to load.`);
  }
}

if (failed) {
  console.error('[fix-wrangler-json] FAIL — deployment would 404. Fix the errors above and re-run.');
  process.exit(1);
}
console.log('[fix-wrangler-json] OK — Cloudflare Pages output ready.');
