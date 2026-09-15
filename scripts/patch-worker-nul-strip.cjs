#!/usr/bin/env node
// Patch dist/client/_worker.js to strip U+0000 (NUL) bytes from
// text/html responses. The TanStack Router SSR serializer can emit
// NUL bytes in the hydration script's match IDs, which the W3C HTML
// validator flags as parse errors (and WHATWG HTML5 §13.2.5.1
// replaces with U+FFFD).
//
// We keep the original handler import; we wrap it in a tiny
// response transform.
//
// Idempotent: re-running replaces the wrapper with the same wrapper.

const fs = require('node:fs');
const path = require('node:path');

const WORKER = path.resolve(__dirname, '..', 'dist', 'client', '_worker.js');

const ORIGINAL = `import ssrHandler from './server.js';
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (
      env.ASSETS &&
      (path.startsWith('/assets/') ||
        /\\.(ico|png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|map|txt|pdf|html|xml|json|webmanifest|md)$/.test(path))
    ) {
      return env.ASSETS.fetch(request);
    }
    return ssrHandler.fetch(request, env, ctx);
  }
};
`;

const PATCHED = `import ssrHandler from './server.js';

// HTML5 §13.2.5.1: U+0000 in stream is a parse error.
// TanStack Router's SSR match serialization can emit NUL bytes in
// hydration script IDs. Strip them from text/html responses before
// the page leaves the worker so the bytes never reach a parser.
async function stripNulFromHtml(response) {
  const ct = response.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return response;
  // Read once; if no NULs, return original response (no copy).
  const original = await response.text();
  if (original.indexOf('\\u0000') === -1) {
    return new Response(original, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
  const cleaned = original.replace(/\\u0000/g, '');
  const headers = new Headers(response.headers);
  if (headers.has('content-length')) {
    headers.set('content-length', String(new TextEncoder().encode(cleaned).length));
  }
  return new Response(cleaned, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (
      env.ASSETS &&
      (path.startsWith('/assets/') ||
        /\\.(ico|png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|map|txt|pdf|html|xml|json|webmanifest|md)$/.test(path))
    ) {
      return env.ASSETS.fetch(request);
    }
    const res = await ssrHandler.fetch(request, env, ctx);
    return stripNulFromHtml(res);
  }
};
`;

if (!fs.existsSync(WORKER)) {
  console.error(`[patch-worker] ${WORKER} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const current = fs.readFileSync(WORKER, 'utf8');
if (current === PATCHED) {
  console.log('[patch-worker] already patched, skipping.');
  process.exit(0);
}
// Detect unpatched: must start with `import ssrHandler` and not contain `stripNulFromHtml`
if (!current.startsWith("import ssrHandler") || current.includes('stripNulFromHtml')) {
  console.warn('[patch-worker] _worker.js unexpected shape — leaving untouched.');
  console.warn('  first 80:', current.slice(0, 80));
  process.exit(0);
}

fs.writeFileSync(WORKER, PATCHED, 'utf8');
console.log(`[patch-worker] patched ${WORKER} to strip NUL bytes from HTML.`);
