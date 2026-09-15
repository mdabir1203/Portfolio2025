// useLastVisit — track when the user last saw a feed so the rail can
// show "X new since you last visit" with a count, then update on unmount
// so the next visit has an accurate baseline.
//
// localStorage is preferred so the count survives page reloads. SSR-safe
// via the `typeof window` guard. The first visit always reports 0 new.

import { useEffect, useState } from "react";

const STORAGE_KEY_PREFIX = "abir.feed.lastVisit.";

function readLastVisit(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function writeLastVisit(key: string, ts: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + key, String(ts));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function useLastVisit(feedKey: string): {
  /** Number of items with `publishedAt > lastVisit`. */
  newCount: number;
  /** ISO timestamp of the last visit, or null on first visit. */
  lastVisit: string | null;
  /** Manually reset the baseline (e.g. a "Mark all as seen" button). */
  markSeen: () => void;
} {
  const [lastVisit, setLastVisit] = useState<number | null>(null);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const stored = readLastVisit(feedKey);
    setLastVisit(stored || null);
    // Persist the current visit on unmount, so the count is accurate
    // the next time the rail mounts.
    return () => {
      writeLastVisit(feedKey, Date.now());
    };
  }, [feedKey]);

  function markSeen() {
    const now = Date.now();
    writeLastVisit(feedKey, now);
    setLastVisit(now);
    setNewCount(0);
  }

  return {
    newCount,
    lastVisit: lastVisit ? new Date(lastVisit).toISOString() : null,
    markSeen,
  };
}

/** Count items with `publishedAt > sinceMs`. Used by the rail after it
 *  has the feed data. */
export function countNewSince<T extends { publishedAt?: string; pubDate?: string }>(
  items: T[],
  sinceMs: number,
): number {
  if (!sinceMs) return 0;
  let n = 0;
  for (const it of items) {
    const iso = it.publishedAt ?? it.pubDate ?? "";
    if (!iso) continue;
    const t = new Date(iso).getTime();
    if (Number.isFinite(t) && t > sinceMs) n++;
  }
  return n;
}
