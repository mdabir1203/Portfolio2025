// /c — the QR referral landing (folder-based, supports /c/intro /c/peer /c/press).
// Captures the `code` path segment via the `c/$code` child route (see ./code.tsx).
// This file just makes /c and /c/ work as entry points.
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/c/")({
  beforeLoad: () => {
    throw redirect({ to: "/connect", search: { code: "intro", ref: "qr" } });
  },
  component: () => null,
});
