// useRelativeTime — return a relative time string ("2h ago", "3d ago")
// that auto-updates every minute. SSR-safe (returns "" on server).

import { useEffect, useState } from "react";

function format(iso: string, now: Date = new Date()): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 0) return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useRelativeTime(iso: string): string {
  const [label, setLabel] = useState<string>(() => format(iso));
  useEffect(() => {
    setLabel(format(iso));
    const id = setInterval(() => setLabel(format(iso)), 60_000);
    return () => clearInterval(id);
  }, [iso]);
  return label;
}

/** True when the post is < 7 days old — used for the "Live" pulse dot. */
export function useIsFresh(iso: string, withinMs = 7 * 24 * 60 * 60 * 1000): boolean {
  const [fresh, setFresh] = useState<boolean>(() => {
    if (!iso) return false;
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && Date.now() - t < withinMs;
  });
  useEffect(() => {
    function check() {
      if (!iso) {
        setFresh(false);
        return;
      }
      const t = new Date(iso).getTime();
      setFresh(Number.isFinite(t) && Date.now() - t < withinMs);
    }
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [iso, withinMs]);
  return fresh;
}
