// vite-cv-pdf-plugin.ts — Vite middleware that serves the CV PDF at
// the friendly URL `/cv.pdf` with `Content-Disposition: attachment`
// so phones and desktops both download (instead of render inline).
//
// Why a custom route:
//   - `public/Abir_Abbas_FullStackDeveloper_CV_2026.pdf` is also exposed at its raw path.
//   - The CV download QR encodes `/cv.pdf` — a stable, short URL.
//   - Mobile browsers (iOS Safari, Android Chrome) inconsistently
//     respect Content-Disposition on .pdf URLs. Adding it explicitly
//     makes the behaviour predictable.
//
// In production, the same route is mirrored by Cloudflare Pages
// `_redirects` + a Worker that adds the header — see
// cloudflare/_redirects and cloudflare/src/index.ts. The dev
// behaviour here MUST match the prod behaviour so the QR code
// works the same way in both environments.

import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const PDF_PATH = path.resolve(
  process.cwd(),
  "public/Abir_Abbas_FullStackDeveloper_CV_2026.pdf",
);

export function cvPdfPlugin(): Plugin {
  return {
    name: "cv-pdf-route",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/cv.pdf", (req, res, next) => {
        if (!fs.existsSync(PDF_PATH)) {
          // Fall through so Vite's 404 handler renders the dev SPA.
          next();
          return;
        }
        const stat = fs.statSync(PDF_PATH);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", String(stat.size));
        res.setHeader("Content-Disposition", 'attachment; filename="Abir_Abbas_FullStackDeveloper_CV_2026.pdf"');
        res.setHeader("Cache-Control", "public, max-age=3600");
        // Light anti-leech headers — discourage hot-linking.
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        fs.createReadStream(PDF_PATH).pipe(res);
      });
    },
  };
}