import { useEffect, useState } from "react";

/**
 * Film-style fixed overlays: a pulsing REC dot top-left, a live timecode
 * top-right, and a vertical chapter strip on the right edge. Reads as
 * a film slate across the whole site. Reduced-motion users get a static
 * version (no timecode ticking, no REC pulse).
 */
export function FilmChrome() {
  const reduce =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [tc, setTc] = useState(formatTC(new Date()));
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTc(formatTC(new Date())), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <>
      <div className="cin-chrome-rec pointer-events-none fixed left-4 top-4 z-30 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55 md:left-6 md:top-6">
        <span
          className={
            "cin-chrome-rec-dot h-1.5 w-1.5 rounded-full bg-[color:var(--accent-lime)] " +
            (reduce ? "" : "animate-pulse")
          }
        />
        REC · GCC
      </div>
      <div className="cin-chrome-tc pointer-events-none fixed right-4 top-4 z-30 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55 md:right-6 md:top-6">
        {tc}
      </div>
      <div className="cin-chrome-strip pointer-events-none fixed right-1 top-1/2 z-30 hidden -translate-y-1/2 [writing-mode:vertical-rl] font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 md:block">
        abir abbas · portfolio · 2026
      </div>
      <div className="cin-chrome-bottom pointer-events-none fixed bottom-3 left-4 z-30 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/35 md:left-6">
        ·A·A·
      </div>
    </>
  );
}

function formatTC(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s} · DXB`;
}
