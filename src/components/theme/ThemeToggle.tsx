import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/**
 * ThemeToggle — a single icon button that flips between light and dark.
 *
 * Used as a fixed-position toggle in the top-right corner of the page,
 * always visible regardless of menu state. NOT nested inside the mobile
 * dropdown panel (per the user's request: "separate from the drop down
 * menu and in the top right corner").
 *
 * The button's accessible name updates with the current theme so screen
 * readers always announce the *target* action ("Switch to dark theme"),
 * not the current state. The icon itself crossfades Sun ↔ Moon so the
 * visual feedback is instant even when the underlying theme toggle is
 * a CSS-variable transition.
 *
 * The button is hydration-safe — it renders with a stable server-side
 * label/icon (Sun, light theme default) and only swaps after the
 * useTheme hook hydrates from localStorage. A small `mounted` flag
 * prevents an SSR/CSR mismatch flash on the icon.
 *
 * Two visual variants:
 *   - default (used in the fixed top-right corner): transparent pill
 *     with a strong focus ring, 48x48 minimum touch target.
 *   - panel (legacy, no longer used by TopNav — kept exported in case
 *     future surfaces want a full-width row).
 */
export interface ThemeToggleProps {
  /** "panel" = full-width row, used historically inside the mobile dropdown. */
  variant?: "default" | "panel";
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { resolved, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: render the light-theme icon on the server, then
  // swap after the client has read localStorage.
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIsDark = mounted && resolved === "dark";
  const targetLabel = currentIsDark ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "panel") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={targetLabel}
        title={targetLabel}
        className="flex min-h-[48px] w-full items-center gap-3 rounded px-5 py-3 text-base text-ink transition-colors hover:bg-ink/5 focus-visible:bg-ink/5 focus-visible:outline-none"
      >
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          <Sun
            aria-hidden="true"
            className={`absolute h-4 w-4 transition-all duration-300 ${
              currentIsDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
          />
          <Moon
            aria-hidden="true"
            className={`absolute h-4 w-4 transition-all duration-300 ${
              currentIsDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
            }`}
          />
        </span>
        <span>{currentIsDark ? "Light" : "Dark"} mode</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={targetLabel}
      title={targetLabel}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-paper text-ink shadow-sm transition-all duration-200 hover:border-[color:var(--accent-teal)]/45 hover:bg-paper-2 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <Sun
          aria-hidden="true"
          className={`absolute h-4 w-4 transition-all duration-300 ${
            currentIsDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <Moon
          aria-hidden="true"
          className={`absolute h-4 w-4 transition-all duration-300 ${
            currentIsDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
