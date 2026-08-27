// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
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
