import { useCallback, useEffect, useState } from "react";

/**
 * useTheme — three-state theme controller (light / dark / system).
 *
 * Persists the user's preference in localStorage under `theme`. The
 * resolved theme (what's actually painted) is `light` or `dark`,
 * derived from the preference and the system color-scheme. The
 * `data-theme` attribute on `<html>` is what Tailwind's `dark:`
 * variant keys off (`@custom-variant dark (&:is(.dark *))`).
 *
 * Anti-flash: the actual class flip happens in a tiny inline script
 * in <head> (see __root.tsx), so the page never paints in the wrong
 * theme on first load. This hook is just the *control surface*.
 *
 * The hook also listens for OS color-scheme changes while in "system"
 * mode so the page reacts automatically if the user flips their OS
 * preference mid-session.
 */

export type ThemePref = "light" | "dark" | "system";
export type ThemeResolved = "light" | "dark";

const STORAGE_KEY = "abir-theme";

function readStoredPref(): ThemePref {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* localStorage might be blocked — fall through to system */
  }
  return "system";
}

function systemResolved(): ThemeResolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolvePref(pref: ThemePref): ThemeResolved {
  return pref === "system" ? systemResolved() : pref;
}

function applyTheme(resolved: ThemeResolved) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
  // Mirror to the meta theme-color so the browser chrome blends in.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      "content",
      resolved === "dark" ? "#021c19" : "#fbfaf6",
    );
  }
}

export interface UseThemeResult {
  /** User-stored preference. */
  pref: ThemePref;
  /** What's actually painted — always "light" or "dark". */
  resolved: ThemeResolved;
  /** Set or cycle the preference. Persists to localStorage. */
  setPref: (next: ThemePref) => void;
  /** Flip between light and dark at the current resolved theme. */
  toggle: () => void;
}

/**
 * Read the stored preference. Safe to call during SSR — returns
 * "system" with `resolved: "light"` (the default paint theme).
 */
export function useTheme(): UseThemeResult {
  const [pref, setPrefState] = useState<ThemePref>("system");
  const [systemDark, setSystemDark] = useState<boolean>(false);

  // Hydrate from localStorage + system preference on mount.
  useEffect(() => {
    const stored = readStoredPref();
    setPrefState(stored);
    setSystemDark(systemResolved() === "dark");
  }, []);

  // Track OS color-scheme changes so "system" mode updates live.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    // Newer Safari uses addEventListener, older Safari < 14 uses addListener.
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Apply the resolved theme whenever pref or system changes.
  const resolved: ThemeResolved =
    pref === "system" ? (systemDark ? "dark" : "light") : pref;

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setPref = useCallback((next: ThemePref) => {
    setPrefState(next);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setPref(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPref]);

  return { pref, resolved, setPref, toggle };
}
