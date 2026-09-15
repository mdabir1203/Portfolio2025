/**
 * Bundle dist/client/_worker.js together with dist/client/server.js into a
 * single self-contained file at dist/client/_worker.js, so wrangler can
 * deploy it with --no-bundle without tripping on bare imports.
 *
 * Externals: anything provided by the Cloudflare runtime (node:*, cloudflare
 * modules) plus bare specifiers we know live in node_modules but can't be
 * resolved under PnP. We mark them external and let Pages' runtime resolve
 * them.
 */
const esbuild = require("esbuild");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const ENTRY = path.join(ROOT, "dist/client/_worker.entry.js");

// Write a small entry that re-exports the worker, but imports server.js
// inline so esbuild bundles everything together.
const entrySrc = `import './server.js';\nimport { default as w } from './_worker.raw.js';\nexport default w;\n`;
fs.writeFileSync(ENTRY, entrySrc);

// Rename the existing _worker.js to _worker.raw.js so we can import it.
const rawPath = path.join(ROOT, "dist/client/_worker.raw.js");
if (!fs.existsSync(rawPath)) {
  fs.copyFileSync(
    path.join(ROOT, "dist/client/_worker.js"),
    rawPath,
  );
}

const result = esbuild.buildSync({
  entryPoints: [ENTRY],
  outfile: path.join(ROOT, "dist/client/_worker.js"),
  bundle: true,
  format: "esm",
  target: "es2022",
  platform: "neutral",
  // Banner to add a comment that this was auto-bundled.
  banner: {
    js: "/* eslint-disable */\n// AUTO-BUNDLED by scripts/bundle-worker.cjs\n",
  },
  // Allow minification for production.
  minify: true,
  // Source maps off for production.
  sourcemap: false,
  // Log level.
  logLevel: "info",
  // Write a metafile so we can introspect.
  metafile: true,
  // Treat warning as error? No — wrangler will tell us.
});

if (result.errors?.length) {
  for (const e of result.errors) console.error(e);
  process.exit(1);
}

console.log("[bundle-worker] Wrote bundled _worker.js");

// Clean up the temporary entry and the .raw.js
try {
  fs.unlinkSync(ENTRY);
  fs.unlinkSync(rawPath);
} catch {}
