// scripts/fix-wrangler-json.js
//
// Post-build fixup for Cloudflare Workers deployment with TanStack Start SSR.
//
//   1. Configure dist/client/wrangler.json to use the official TanStack Start
//      Workers SSR entry (@tanstack/react-start/server-entry) instead of the
//      Cloudflare Pages _worker.js pattern. Wrangler 3.x/4.x cannot bundle the
//      _worker.js → server.js import chain because the SSR bundle traces into
//      client chunks that import React (unresolvable by wrangler's esbuild).
//
//   2. Write dist/client/_worker.js as a thin static-asset + SSR router.
//      Imports @tanstack/react-start/server-entry via a dynamic import so wrangler
//      treats it as an external module (no React/bundle tracing).
//
//   3. Copy SSR server bundle + server assets alongside the worker so the
//      runtime can find its code-split chunks.
//
//   4. Merge dist/server/assets/* → dist/client/assets/*.

import fs from 'node:fs';
const { existsSync, statSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } = fs;
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG   = path.resolve(ROOT, 'dist/client/wrangler.json');
const SERVER   = path.resolve(ROOT, 'dist/server/server.js');
const SERVER_ASSETS = path.resolve(ROOT, 'dist/server/assets');
const WORKER  = path.resolve(ROOT, 'dist/client/_worker.js');
const CLIENT_SERVER = path.resolve(ROOT, 'dist/client/server.js');
const CLIENT_ASSETS  = path.resolve(ROOT, 'dist/client/assets');

const STATIC_RE = /\.(ico|png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|map|txt|pdf|html|xml|json|webmanifest|md)$/;

// Thin Cloudflare Worker: serves static assets from ./dist/client/ via env.ASSETS
// and delegates all other requests to the TanStack Start SSR handler.
// Dynamic import prevents wrangler from tracing into the SSR bundle's React imports.
const WORKER_WRAPPER = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _start = /* @__PURE__ */ await import('@tanstack/react-start/server-entry');
const ssrHandler = (_start as any).default ?? _start;

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    // Serve static assets directly from the Workers static store
    if (
      env.ASSETS &&
      (pathname.startsWith('/assets/') || STATIC_RE.test(pathname))
    ) {
      return env.ASSETS.fetch(request);
    }

    // /cv — serve the CV PDF as a forced download (phones + desktop)
    if (pathname === '/cv') {
      if (!env.ASSETS) return new Response('CV unavailable', { status: 503 });
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

    return ssrHandler.fetch(request, env);
  },
};
`.replace('STATIC_RE', STATIC_RE.source);

const INVALID_TOP_LEVEL = [
  'assets', 'topLevelName', 'jsx_factory', 'jsx_fragment', 'definedEnvironments',
  'ai_search_namespaces', 'ai_search', 'secrets_store_secrets', 'unsafe_hello_world',
  'flagship', 'worker_loaders', 'ratelimits', 'vpc_services', 'vpc_networks',
  'python_modules', 'configPath', 'userConfigPath', 'legacy_env', 'rules',
  'cloudchamber', 'pipelines', 'logfwdr',
];

let failed = false;
const ok  = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg) => { console.error(`  ✗ ${msg}`); failed = true; };

// ── Step 1: configure wrangler.json for Cloudflare Workers SSR ──────────────────
if (!existsSync(CONFIG)) {
  bad('dist/client/wrangler.json missing — vite build did not run.');
} else {
  try {
    const raw = readFileSync(CONFIG, 'utf-8');
    const cfg = JSON.parse(raw);

    // Switch from Cloudflare Pages mode (pages_build_output_dir) to
    // Cloudflare Workers SSR mode (main entry point).
    delete cfg.pages_build_output_dir;
    cfg.main = '@tanstack/react-start/server-entry';

    // Ensure nodejs_compat for TanStack packages that use Node.js APIs
    cfg.compatibility_flags = cfg.compatibility_flags || [];
    if (!cfg.compatibility_flags.includes('nodejs_compat')) {
      cfg.compatibility_flags.push('nodejs_compat');
    }

    // Keep only the fields wrangler needs for a Workers deployment
    for (const k of INVALID_TOP_LEVEL) delete cfg[k];
    for (const k of Object.keys(cfg)) {
      if (['vars','name','compatibility_date','compatibility_flags','main'].includes(k)) continue;
      if (Array.isArray(cfg[k]) && cfg[k].length === 0) delete cfg[k];
      else if (cfg[k] && typeof cfg[k] === 'object' && !Array.isArray(cfg[k]) && Object.keys(cfg[k]).length === 0) delete cfg[k];
    }

    writeFileSync(CONFIG, JSON.stringify(cfg, null, 2), 'utf-8');
    ok('configured wrangler.json for Cloudflare Workers SSR');
  } catch (err) {
    bad(`failed to update wrangler.json: ${err.message}`);
  }
}

// ── Step 2: write _worker.js ──────────────────────────────────────────────────
try {
  writeFileSync(WORKER, WORKER_WRAPPER, 'utf-8');
  ok(`wrote _worker.js with dynamic @tanstack/react-start/server-entry import`);
} catch (err) {
  bad(`failed to write _worker.js: ${err.message}`);
}

// ── Step 3: copy server.js → dist/client/ ──────────────────────────────────────
if (existsSync(SERVER)) {
  try {
    copyFileSync(SERVER, CLIENT_SERVER);
    ok('copied server.js → dist/client/');
  } catch (err) {
    bad(`failed to copy server.js: ${err.message}`);
  }
} else {
  bad('dist/server/server.js missing — SSR bundle not built.');
}

// ── Step 4: merge server assets → client assets ────────────────────────────────
if (existsSync(SERVER_ASSETS)) {
  try {
    if (!existsSync(CLIENT_ASSETS)) mkdirSync(CLIENT_ASSETS, { recursive: true });
    let merged = 0;
    for (const asset of readdirSync(SERVER_ASSETS)) {
      copyFileSync(path.join(SERVER_ASSETS, asset), path.join(CLIENT_ASSETS, asset));
      merged++;
    }
    ok(`merged ${merged} SSR assets → dist/client/assets`);
  } catch (err) {
    bad(`failed to merge server assets: ${err.message}`);
  }
} else {
  bad('dist/server/assets missing — SSR code-split chunks absent.');
}

if (failed) {
  console.error('[fix-wrangler-json] FAIL');
  process.exit(1);
}
console.log('[fix-wrangler-json] OK — Cloudflare Workers SSR ready.');
