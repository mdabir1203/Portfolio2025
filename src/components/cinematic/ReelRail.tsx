import { useEffect, useState } from "react";

/**
 * ReelRail — vertical dot indicator on the right edge.
 *
 * Each dot is one reel. The active dot fills with the accent color and
 * shows a thin scroll-progress fill inside. The user always knows where
 * they are in the film.
 *
 * Click a dot → smooth-scroll to that reel.
 *
 * Hidden on mobile (< md) — too cluttered for thumbs.
 */
const REELS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "manifesto", label: "Manifesto" },
  { id: "capabilities", label: "Capabilities" },
  { id: "work", label: "Case Study" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
] as const;

export function ReelRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const compute = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const overall = docH > 0 ? Math.max(0, Math.min(1, scrollY / docH)) : 0;
      setProgress(overall);

      // Determine which reel is dominant. We map the page into N bands
      // by document height. Works because each scene is approximately
      // the same weight; the user feels the rail tick as they scroll.
      const band = overall * REELS.length;
      setActive(Math.min(REELS.length - 1, Math.floor(band)));
    };

    compute();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        compute();
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      aria-label="Reel index"
      className="cin-reel-rail pointer-events-none fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <ol className="flex flex-col items-center gap-3">
        {REELS.map((r, i) => {
          const isActive = i === active;
          return (
            <li key={r.id} className="cin-reel-rail-item pointer-events-auto group">
              <a
                href={`#${r.id}`}
                className="cin-reel-rail-link flex items-center gap-3"
                aria-label={`Jump to ${r.label}`}
              >
                <span
                  className={
                    "cin-reel-rail-label whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] transition-all duration-300 " +
                    (isActive
                      ? "cin-reel-rail-label-active text-foreground opacity-100 translate-x-0"
                      : "text-foreground/45 opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100")
                  }
                >
                  {r.label}
                </span>
                <span
                  className={
                    "cin-reel-rail-dot relative block h-2 w-2 rounded-full transition-all duration-300 " +
                    (isActive
                      ? "cin-reel-rail-dot-active h-6 bg-[color:var(--accent-teal)]"
                      : "bg-foreground/25 group-hover:bg-foreground/50")
                  }
                  style={
                    isActive
                      ? { boxShadow: "0 0 10px var(--accent-teal)" }
                      : undefined
                  }
                  aria-hidden
                />
              </a>
            </li>
          );
        })}
      </ol>
      {/* global scroll progress bar (subtle) */}
      <div className="cin-reel-rail-progress mt-4 h-20 w-px overflow-hidden rounded-full bg-foreground/10">
        <div
          className="cin-reel-rail-progress-fill w-full bg-[color:var(--accent-teal)]"
          style={{
            height: `${progress * 100}%`,
            transform: "translateY(0)",
            boxShadow: "0 0 6px var(--accent-teal)",
            transition: "height 0.05s linear",
          }}
          aria-hidden
        />
      </div>
    </nav>
  );
}
