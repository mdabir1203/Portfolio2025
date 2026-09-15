// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { cvPdfPlugin } from "./vite-cv-pdf-plugin";

/**
 * Some TanStack Start / React 19 hydration paths reference bare
 * `process.env` at module top level. esbuild's `define` pass for
 * pre-bundled deps only accepts JS literals (no object expressions),
 * so we can't shim `process` that way. Instead, we hook the dep
 * optimizer's output and prepend a runtime polyfill to any served
 * file that has a top-level `process.env` reference. Scoped to dev
 * only — production uses esbuild's `define` and ships without the
 * polyfill because all `process.env.X` calls are dead-code-eliminated.
 */
function processPolyfillPlugin() {
  const POLYFILL =
    "var process = (typeof globalThis!=='undefined'&&(globalThis.process||(globalThis.process={env:{},platform:'browser'})))||{env:{},platform:'browser'};\n";
  return {
    name: "process-polyfill-prepend",
    apply: "serve" as const,
    enforce: "pre" as const,
    transform(code: string, id: string) {
      // Only touch pre-bundled dep files (the ones that throw at runtime).
      if (!id.includes("/.vite/deps/")) return null;
      if (!/\bprocess\b/.test(code)) return null;
      // Prepend the shim. Cheap (single var declaration) and idempotent.
      return { code: POLYFILL + code, map: null };
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [processPolyfillPlugin(), cvPdfPlugin()],
    define: {
      // Some TanStack Start / React 19 hydration paths reference process.env.NODE_ENV
      // at runtime. Vite normally replaces this at build time, but the pre-bundled
      // dep cache can leave stale code that throws ReferenceError: process is not defined
      // in the browser. Defining it here as a safe no-op keeps dev hot-reload stable.
      "process.env": "{}",
    },
    optimizeDeps: {
      exclude: ["@mlc-ai/web-llm"],
    },
    build: {
      minify: "esbuild",
      sourcemap: false,
      reportCompressedSize: true,
    },
  },
});
