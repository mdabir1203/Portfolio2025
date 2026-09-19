import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, type ThemePref } from "@/hooks/useTheme";

/**
 * ThemeToggle — picks one of three preferences (light / dark / system)
 * and flips between them.
 *
 * Two visual variants:
 *   - default (used in the fixed top-right corner): single icon button
 *     that toggles between Light ↔ Dark. On mobile, tapping it expands
 *     a horizontal row of three icons (Light · Dark · System) revealed
 *     left-to-right with a subtle scale-x. On desktop, the row stays
 *     hidden — the single-icon toggle is enough.
 *   - panel (legacy, no longer used by TopNav — kept exported for future
 *     surfaces that want a full-width row).
 *
 * The button's accessible name always announces the *target* action
 * ("Switch to light theme"), not the current state. The icon itself
 * crossfades Sun ↔ Moon so visual feedback is instant even when the
 * underlying theme toggle is a CSS-variable transition.
 *
 * Hydration-safe: renders Sun/light-theme default on the server, swaps
 * after the useTheme hook hydrates from localStorage. A small `mounted`
 * flag prevents an SSR/CSR mismatch flash on the icon.
 */
export interface ThemeToggleProps {
  /** "panel" = full-width row, used historically inside the mobile dropdown. */
  variant?: "default" | "panel";
}

type ThemeOption = {
  pref: ThemePref;
  label: string;
  short: string;
  Icon: typeof Sun;
};

const OPTIONS: ThemeOption[] = [
  { pref: "light", label: "Light theme", short: "Light", Icon: Sun },
  { pref: "dark", label: "Dark theme", short: "Dark", Icon: Moon },
  { pref: "system", label: "System theme", short: "Auto", Icon: Monitor },
];

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { pref, resolved, setPref, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hydration-safe: render the light-theme icon on the server, then
  // swap after the client has read localStorage.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the horizontal options row when the user clicks/taps outside
  // the toggle container. Avoids the row staying open after a tap on
  // the page content.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        target instanceof Element &&
        !target.closest("[data-theme-toggle-container]")
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentIsDark = mounted && resolved === "dark";
  const activePref: ThemePref = mounted ? pref : "light";
  const targetLabel = currentIsDark ? "Switch to light theme" : "Switch to dark theme";

  const pick = (next: ThemePref) => {
    setPref(next);
    setOpen(false);
  };

  if (variant === "panel") {
    return (
      <div
        role="menuitemradio"
        aria-label="Theme"
        className="flex min-h-[48px] w-full items-center gap-3 rounded px-5 py-3 text-base text-ink"
      >
        <span className="font-medium">Theme</span>
        <span className="ml-auto flex items-center gap-1.5">
          {OPTIONS.map(({ pref: p, short, Icon }) => {
            const isActive = mounted && activePref === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={isActive}
                aria-label={`Use ${short.toLowerCase()} theme`}
                onClick={() => pick(p)}
                className={`inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "bg-accent-teal/15 text-accent-teal"
                    : "text-ink-muted hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {short}
              </button>
            );
          })}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-theme-toggle-container
      className="relative inline-flex items-center"
    >
      {/* Main toggle button — single icon, fixed top-right. */}
      <button
        type="button"
        onClick={() => toggle()}
        aria-label={targetLabel}
        title={targetLabel}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink shadow-sm transition-all duration-200 hover:border-accent-teal/45 hover:bg-paper-2 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          <Sun
            aria-hidden="true"
            className={`absolute h-4 w-4 transition-all duration-300 ${
              currentIsDark
                ? "scale-50 rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          />
          <Moon
            aria-hidden="true"
            className={`absolute h-4 w-4 transition-all duration-300 ${
              currentIsDark
                ? "scale-100 rotate-0 opacity-100"
                : "scale-50 -rotate-90 opacity-0"
            }`}
          />
        </span>
      </button>

      {/* Expand button — opens the horizontal options row. Always
          visible on mobile (and desktop); tap reveals the three
          options to the LEFT of the main toggle so the row reads
          left-to-right ending at the current selection. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Choose theme"
        title="Choose theme"
        className="ml-1 inline-flex h-11 w-7 items-center justify-center rounded-full border border-transparent text-ink-muted transition-all duration-200 hover:border-rule hover:bg-paper-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      {/* Horizontal options row — appears to the LEFT of the toggle,
          reads left-to-right (Light → Dark → Auto). Reveals with a
          scale-x + per-item stagger so the row "slides in" horizontally.
          Hidden on first paint, anchored above/below depending on
          viewport to avoid the page header. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="theme-options"
            role="menu"
            aria-label="Theme options"
            initial={{ opacity: 0, scaleX: 0.4, x: 12 }}
            animate={{
              opacity: 1,
              scaleX: 1,
              x: 0,
              transition: {
                duration: 0.28,
                ease: [0.2, 0.8, 0.2, 1],
                staggerChildren: 0.04,
                delayChildren: 0.04,
              },
            }}
            exit={{
              opacity: 0,
              scaleX: 0.4,
              x: 12,
              transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
            }}
            style={{ transformOrigin: "right center" }}
            className="absolute right-full top-1/2 z-50 mr-2 -translate-y-1/2"
          >
            <div className="flex items-center gap-1 rounded-full border border-rule bg-paper px-1.5 py-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35),0_4px_12px_-6px_rgba(0,0,0,0.18)]">
              {OPTIONS.map(({ pref: p, short, Icon, label }) => {
                const isActive = mounted && activePref === p;
                return (
                  <motion.button
                    key={p}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    aria-label={label}
                    onClick={() => pick(p)}
                    initial={{ opacity: 0, scaleX: 0.6 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.22 }}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "bg-accent-teal/15 text-accent-teal"
                        : "text-ink-muted hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span>{short}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;
