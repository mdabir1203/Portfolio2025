// /c/:code — wildcard. /c/intro, /c/peer, /c/press all resolve here and
// we forward the `code` path segment to /connect.
//
// This is the redirect-only entry point so the QR's URL stays short and
// attribution-friendly (the code lives in the path, not in a query string).
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/c/$code")({
  beforeLoad: ({ params }) => {
    const code = (params as { code?: string }).code ?? "intro";
    throw redirect({ to: "/connect", search: { code, ref: "qr" } });
  },
  component: () => null,
});