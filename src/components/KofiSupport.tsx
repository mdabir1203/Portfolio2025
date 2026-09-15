/**
 * KofiSupport — a design-system-aligned Ko-fi support card.
 *
 * Three placements, three shapes:
 *
 *  1. <KofiSupport variant="card" />     — the editorial contact section,
 *                                          a full row inside the dark
 *                                          cin-channel-card grid.
 *  2. <KofiSupport variant="inline" />   — a one-liner for the footer.
 *  3. <KofiSupport variant="qr" />       — a calm link + QR for the
 *                                          /connect page.
 *
 * We deliberately render a styled card instead of relying on the
 * third-party `kofiWidgetOverlay` floating button — the editorial layout
 * has no room for a colored floating overlay. The overlay widget script
 * is still loaded (in __root.tsx) for visitors who want a louder
 * always-visible handle on any route.
 */
import { ArrowUpRight } from "lucide-react";

/** Ko-fi username (kebab/slug form, used in ko-fi.com/<user> URLs). */
const KOFI_USER = "mohammadabirabbas";
const KOFI_URL = `https://ko-fi.com/${KOFI_USER}`;
/** Subtle Ko-fi brand blue for the inline icon. The floating widget in
 *  __root.tsx uses Ko-fi's brighter #00b9fe for visibility — the two
 *  blues coexist on purpose. */
const KOFI_COLOR = "#72a4f2";

/** Lucide doesn't ship a coffee mark — the Ko-fi mark reads as a mug. */
function KofiMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2 5h15a4 4 0 0 1 0 8H6a4 4 0 0 1-4-4V5Zm0 2v2a2 2 0 0 0 2 2h13a2 2 0 0 0 0-4H2Zm17 2a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1v-6h2ZM4 14h1v6h14a1 1 0 0 0 0-2H6a1 1 0 0 0-1-1V14Z" />
    </svg>
  );
}

export function KofiSupport({
  variant = "card",
  className = "",
}: {
  variant?: "card" | "inline" | "qr";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noreferrer"
        className={"cin-footer-link inline-flex items-center gap-1.5 " + className}
        style={{ color: KOFI_COLOR }}
      >
        <KofiMark className="h-3.5 w-3.5" />
        Ko-fi · Buy me a coffee
      </a>
    );
  }

  if (variant === "qr") {
    return (
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noreferrer"
        className={"cin-channel-card group " + className}
      >
        <span className="cin-channel-card-icon" style={{ color: KOFI_COLOR }}>
          <KofiMark className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
            Support the work
          </span>
          <span className="mt-0.5 block truncate font-display text-base text-paper">
            ko-fi.com/{KOFI_USER}
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
      </a>
    );
  }

  // variant === "card" — the dark editorial contact section.
  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noreferrer"
      className={"cin-channel-card group " + className}
    >
      <span className="cin-channel-card-icon" style={{ color: KOFI_COLOR }}>
        <KofiMark className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
          Support the work
        </span>
        <span className="mt-0.5 block truncate font-display text-base text-paper">
          Buy me a coffee on Ko-fi
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
    </a>
  );
}
