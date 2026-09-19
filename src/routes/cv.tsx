// /cv — returns the CV as a PDF with Content-Disposition: attachment
// so phones and desktops alike download (instead of rendering inline).
//
// Why this is a TanStack server route and not just a static file:
//   - `public/Abir_Abbas_FullStackDeveloper_CV_2026.pdf` is also exposed at its raw path for
//     direct linking, but `/cv` is the stable, short URL the QR code
//     encodes. Same handler in dev (Vite middleware plugin) and prod
//     (this route) so behaviour is identical end-to-end.
//   - The attachment header forces a download rather than an inline
//     render. iOS Safari / Android Chrome handle this consistently
//     when the response is application/pdf.
//   - We log every hit so we can see real-world scan counts in the
//     analytics.
//
// Path is intentionally extension-less: TanStack's file-routing
// doesn't accept dots in route segments, and `/cv` reads cleaner
// than `/cv-download` anyway.

import { createFileRoute } from "@tanstack/react-router";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const PDF_REL = path.resolve(process.cwd(), "public/Abir_Abbas_FullStackDeveloper_CV_2026.pdf");

export const Route = createFileRoute("/cv")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const stamp = new Date().toISOString();
        const ua = request.headers.get("user-agent") ?? "unknown";
        // eslint-disable-next-line no-console
        console.log(`[cv] ${stamp} ${request.method} /cv ua="${ua.slice(0, 80)}"`);

        if (!existsSync(PDF_REL)) {
          return new Response("CV not found", { status: 404 });
        }
        const buf = await readFile(PDF_REL);
        const s = await stat(PDF_REL);
        return new Response(buf, {
          status: 200,
          headers: {
            "content-type": "application/pdf",
            "content-length": String(s.size),
            // The `filename*` form lets us keep the Unicode em-dash
            // for prettier download names while still falling back
            // to plain ASCII for older clients.
            "content-disposition":
              'attachment; filename="Abir_Abbas_FullStackDeveloper_CV_2026.pdf"; ' +
              "filename*=UTF-8''Abir_Abbas_FullStackDeveloper_CV_2026.pdf",
            "cache-control": "public, max-age=3600",
            "x-content-type-options": "nosniff",
            "referrer-policy": "strict-origin-when-cross-origin",
          },
        });
      },
      HEAD: async () => {
        if (!existsSync(PDF_REL)) return new Response(null, { status: 404 });
        const s = await stat(PDF_REL);
        return new Response(null, {
          status: 200,
          headers: {
            "content-type": "application/pdf",
            "content-length": String(s.size),
            "content-disposition": 'attachment; filename="Abir_Abbas_FullStackDeveloper_CV_2026.pdf"',
          },
        });
      },
    },
  },
});