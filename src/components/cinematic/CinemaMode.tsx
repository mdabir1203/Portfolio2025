import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * CinemaMode — auto-driven brand-studio tour of the portfolio.
 *
 * Activates when the URL contains `?cinema` (or `?cinema=1`).
 *
 * Choreography:
 *   - For each beat (section + dwell + match-cut setup), the camera eases
 *     into a target scroll position with a hand-tuned cubic-bezier.
 *   - Between sections, the closing beat's "anchor" element zooms to a
 *     fill-the-frame composition, and the next section's opening anchor
 *     inherits the same coordinate — that's the match-cut.
 *   - A persistent HUD shows REC indicator, chapter, timecode, and a thin
 *     scrub bar of upcoming beats.
 *   - Honors `prefers-reduced-motion` by jumping (no easing) — the ffmpeg
 *     capture pipeline always renders with motion on.
 *
 * Beats (rough — actually measured after layout settles):
 *   01 · hero        9.0s   match-cut: name → centered dot
 *   02 · work        7.5s   match-cut: project tile → next title
 *   03 · case-study  18.0s  match-cut: AED 111,246 → "ENFP"
 *   04 · about       6.5s   match-cut: about hero → personality orbit
 *   05 · personality 10.0s  match-cut: centered polaroid → reviewer face
 *   06 · reviews     6.5s   match-cut: quote → "2026"
 *   07 · path        8.0s   match-cut: stop card → essay headline
 *   08 · writing     5.5s   match-cut: essay → video tile
 *   09 · youtube     5.5s   match-cut: video → Q01
 *   10 · faq         8.0s   match-cut: closing CTA → contact pitch
 *   11 · contact     7.0s   match-cut: end on REC ● pulse
 */
type Beat = {
  id: string;
  chapter: string;
  chapterTag: string;
  /** Section anchor on the page (must exist in the DOM). */
  anchor: string;
  /** CSS selector for the element to centre the camera on for this beat.
   *  Falls back to the anchor section when null. */
  focus?: string | null;
  /** Dwell time at the focused element in ms. */
  dwellMs: number;
  /** Scroll duration INTO this beat in ms. */
  intoMs: number;
  /** Scroll duration OUT to the next beat in ms. */
  outMs: number;
  /** Bottom-left caption shown when this beat lands. */
  caption: string;
  /** Optional sub-line under the caption. */
  sub?: string;
};

const BEATS: Beat[] = [
  {
    id: "hero",
    chapter: "01",
    chapterTag: "INTRO",
    anchor: "#hero",
    focus: "h1",
    dwellMs: 4200,
    intoMs: 1400,
    outMs: 1700,
    caption: "Mohammad Abir Abbas.",
    sub: "AI Architect · Dubai",
  },
  {
    id: "work",
    chapter: "02",
    chapterTag: "WORK",
    anchor: "#work",
    focus: "h2",
    dwellMs: 3500,
    intoMs: 1600,
    outMs: 1700,
    caption: "The work, not the wrapping.",
    sub: "Five real projects, all live.",
  },
  {
    id: "case-study",
    chapter: "03",
    chapterTag: "CASE STUDY",
    anchor: "#case-study",
    focus: null,
    dwellMs: 9000,
    intoMs: 2200,
    outMs: 2400,
    caption: "The Delivery Module.",
    sub: "AED 111,246 of trapped backlog recovered in 30 days.",
  },
  {
    id: "about",
    chapter: "04",
    chapterTag: "HOW",
    anchor: "#about",
    focus: "h2",
    dwellMs: 3200,
    intoMs: 1500,
    outMs: 1600,
    caption: "How I think.",
    sub: "ENFP · four letters, one operating system.",
  },
  {
    id: "personality",
    chapter: "05",
    chapterTag: "WHO",
    anchor: "#personality",
    focus: null,
    dwellMs: 4800,
    intoMs: 1600,
    outMs: 1800,
    caption: "Who shows up on day one.",
    sub: "19 polaroids, no captions, no script.",
  },
  {
    id: "reviews",
    chapter: "06",
    chapterTag: "PROOF",
    anchor: "#reviews",
    focus: "article",
    dwellMs: 3500,
    intoMs: 1500,
    outMs: 1700,
    caption: "What they say.",
    sub: "Three reviewers, in their own words.",
  },
  {
    id: "path",
    chapter: "07",
    chapterTag: "PATH",
    anchor: "#path",
    focus: null,
    dwellMs: 4200,
    intoMs: 1500,
    outMs: 1700,
    caption: "From Wolfsburg to the Gulf.",
    sub: "7 stops · 3 languages · 1 thread.",
  },
  {
    id: "writing",
    chapter: "08",
    chapterTag: "ESSAYS",
    anchor: "#writing",
    focus: null,
    dwellMs: 2600,
    intoMs: 1400,
    outMs: 1500,
    caption: "Long-form, on Tuesdays.",
    sub: "Distributed systems, edge, procurement.",
  },
  {
    id: "youtube",
    chapter: "09",
    chapterTag: "FILM",
    anchor: "#youtube",
    focus: null,
    dwellMs: 2600,
    intoMs: 1400,
    outMs: 1500,
    caption: "On camera, since 2022.",
    sub: "Wavelink on YouTube.",
  },
  {
    id: "faq",
    chapter: "10",
    chapterTag: "FAQ",
    anchor: "#faq",
    focus: null,
    dwellMs: 4000,
    intoMs: 1500,
    outMs: 1700,
    caption: "Nine questions, plain English.",
    sub: "Receipts attached to every answer.",
  },
  {
    id: "contact",
    chapter: "11",
    chapterTag: "CONTACT",
    anchor: "#contact",
    focus: null,
    dwellMs: 4500,
    intoMs: 1600,
    outMs: 800,
    caption: "Send a brief. Get a film.",
    sub: "abir.abbas@proton.me · +971 054 361 8066",
  },
];

/** Custom cubic-bezier that mimics a film camera operator:
 *  accelerates quickly out of a beat, decelerates into the next. */
const CAMERA_EASE = (t: number) => {
  // Penner's easeInOutCubic
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/** Read the on-page Y-position to land on, in document coords. */
function computeTargetY(beat: Beat, viewportH: number): number {
  const el = document.querySelector(beat.anchor) as HTMLElement | null;
  if (!el) return window.scrollY;
  const rect = el.getBoundingClientRect();
  const elTop = rect.top + window.scrollY;
  // If a focus element is requested, center it
  if (beat.focus) {
    const focus = el.querySelector(beat.focus) as HTMLElement | null;
    if (focus) {
      const fr = focus.getBoundingClientRect();
      const focusCenter = fr.top + window.scrollY + fr.height / 2;
      return Math.max(0, focusCenter - viewportH / 2);
    }
  }
  // Default: position the section's top one-third of the way down
  return Math.max(0, elTop - viewportH * 0.18);
}

/** Drive a smooth scroll from currentY to targetY over durationMs using CAMERA_EASE. */
function animateScroll(
  fromY: number,
  toY: number,
  durationMs: number,
  onDone: () => void,
  reduceMotion: boolean,
) {
  if (reduceMotion || durationMs <= 0 || Math.abs(toY - fromY) < 1) {
    window.scrollTo(0, toY);
    onDone();
    return;
  }
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = CAMERA_EASE(t);
    const y = fromY + (toY - fromY) * eased;
    window.scrollTo(0, y);
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      onDone();
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function formatTC(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function CinemaMode() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"intro" | "reel" | "done">("intro");
  const [beatIdx, setBeatIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 across the whole reel
  const [elapsedMs, setElapsedMs] = useState(0); // ms since reel start (for TC display)
  const [beatProgress, setBeatProgress] = useState(0); // 0..1 within the active beat
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const totalMs = useMemo(
    () =>
      BEATS.reduce(
        (acc, b) => acc + b.intoMs + b.dwellMs + b.outMs,
        0,
      ),
    [],
  );
  const INTRO_MS = 1800; // brand slate before the reel starts

  // Detect ?cinema
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("cinema");
    if (flag !== null && flag !== "0") {
      // Brief delay so FirstVisitSplash's mount/cleanup lands before we
      // start. Then we run an intro slate for INTRO_MS, then the reel.
      const t = window.setTimeout(() => {
        setActive(true);
        const i = window.setTimeout(() => setPhase("reel"), INTRO_MS);
        // keep the intro timeout id on window in case we need to cancel
        (window as unknown as { __cinemaIntroId?: number }).__cinemaIntroId = i;
      }, 400);
      return () => window.clearTimeout(t);
    }
    return;
  }, []);

  // FirstVisitSplash now honors `?cinema` natively — no manual hiding
  // needed here. This effect is kept as a safety net for the very rare
  // case where the splash is mid-entry when CinemaMode activates.
  useEffect(() => {
    if (!active) return;
    const splash = document.getElementById("first-visit-splash-quote");
    if (splash && splash.parentElement) {
      const parent = splash.parentElement as HTMLElement;
      parent.style.transition = "opacity 240ms ease";
      parent.style.opacity = "0";
      window.setTimeout(() => {
        parent.style.display = "none";
      }, 280);
    }
  }, [active]);

  // Schedule the reel
  const startedAtRef = useRef<number | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!active || phase !== "reel" || paused || done) return;
    const beat = BEATS[beatIdx];
    if (!beat) return;

    const viewportH = window.innerHeight;
    const targetY = computeTargetY(beat, viewportH);
    const startY = window.scrollY;

    // Scroll INTO the beat
    cancelRef.current?.();
    const cancel = animateScroll(
      startY,
      targetY,
      beat.intoMs,
      () => {
        // Begin dwell
        const dwellStart = performance.now();
        const dwell = window.setInterval(() => {
          const t = (performance.now() - dwellStart) / beat.dwellMs;
          if (t >= 1) {
            window.clearInterval(dwell);
            // Scroll OUT
            const nextBeat = BEATS[beatIdx + 1];
            if (!nextBeat) {
              setDone(true);
              return;
            }
            const nextTarget = computeTargetY(nextBeat, viewportH);
            cancelRef.current = animateScroll(
              window.scrollY,
              nextTarget,
              beat.outMs,
              () => {
                setBeatIdx((i) => i + 1);
              },
              !!reduceMotion,
            );
          } else {
            setBeatProgress(t);
          }
        }, 50);
      },
      !!reduceMotion,
    );
    cancelRef.current = cancel;

    startedAtRef.current = startedAtRef.current ?? performance.now();
    return () => {
      cancelRef.current?.();
    };
  }, [active, phase, paused, done, beatIdx, reduceMotion]);

  // Global timecode ticker — uses state so the display updates every frame
  useEffect(() => {
    if (!active || paused || done) return;
    let raf = 0;
    const tick = () => {
      const start = startedAtRef.current;
      if (start !== null) {
        const elapsed = performance.now() - start;
        setElapsedMs(elapsed);
        setProgress(Math.min(1, elapsed / totalMs));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused, done, totalMs]);

  // Keyboard control
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === "Escape") {
        setActive(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (!active) return null;

  const beat = BEATS[beatIdx];
  const nextBeat = BEATS[beatIdx + 1];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden
      data-cinema-mode
    >
      {/* Brand intro slate — first INTRO_MS before the reel starts */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]"
          >
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper/55">
                Reel · 2026
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 font-display text-5xl tracking-tight text-paper md:text-7xl"
              >
                Mohammad Abir Abbas.
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-4 font-mono text-[11px] tracking-[0.32em] text-paper/65"
              >
                AI ARCHITECT · DUBAI
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent film-grade vignette + grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(15, 20, 18, 0.42) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Top-left brand slate */}
      <div className="absolute left-6 top-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-ink/85">
        <span className="flex h-2 w-2 items-center justify-center">
          <span
            className="block h-2 w-2 rounded-full bg-[#c95f3b]"
            style={{
              animation: "cin-blink 1.1s steps(1) infinite",
            }}
          />
        </span>
        <span>REC</span>
        <span className="text-ink/45">·</span>
        <span>MOHAMMAD ABIR ABBAS · PORTFOLIO 2026</span>
      </div>

      {/* Top-right timecode */}
      <div className="absolute right-6 top-5 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/85">
        <span>TC {formatTC(phase === "intro" ? 0 : elapsedMs)}</span>
        <span className="text-ink/45">·</span>
        <span>{Math.round(progress * 100).toString().padStart(2, "0")}%</span>
      </div>

      {/* Bottom-left chapter card */}
      <AnimatePresence mode="wait">
        {beat && (
          <motion.div
            key={`ch-${beat.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-6 max-w-[480px]"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/65">
              {beat.chapter} · {beat.chapterTag}
            </div>
            <div className="mt-2 font-display text-2xl leading-[1.05] tracking-tight text-ink md:text-[28px]">
              {beat.caption}
            </div>
            {beat.sub && (
              <div className="mt-1 text-sm text-ink/65">{beat.sub}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-right next-up + scrub bar */}
      <div className="absolute bottom-8 right-6 flex flex-col items-end gap-3">
        {nextBeat && (
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.28em] text-ink/55">
            <div>NEXT</div>
            <div className="mt-1 text-ink/85">
              {nextBeat.chapter} · {nextBeat.chapterTag}
            </div>
          </div>
        )}
        <div className="flex h-[2px] w-[260px] items-center overflow-hidden bg-ink/15">
          <div
            className="h-full bg-ink/80"
            style={{
              width: `${Math.round(progress * 100)}%`,
              transition: "width 80ms linear",
            }}
          />
        </div>
        <div className="flex gap-1">
          {BEATS.map((b, i) => (
            <span
              key={b.id}
              className="block h-1 w-3"
              style={{
                background:
                  i < beatIdx
                    ? "rgba(15,117,105,0.85)"
                    : i === beatIdx
                      ? "rgba(15,117,105,1)"
                      : "rgba(26,26,26,0.18)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Top centre pause/play cue */}
      {paused && (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-ink/30 bg-paper/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.32em] text-ink/85">
          PAUSED · SPACE TO RESUME
        </div>
      )}

      {/* End slate */}
      {done && (
        <div className="absolute inset-0 flex items-center justify-center bg-paper/85 backdrop-blur-[2px]">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/65">
              END OF REEL
            </div>
            <div className="mt-4 font-display text-4xl text-ink md:text-5xl">
              Available · Q3 2026.
            </div>
            <div className="mt-3 text-sm text-ink/65">
              abir.abbas@proton.me · +971 054 361 8066
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes for REC blink */}
      <style>{`
        @keyframes cin-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

export default CinemaMode;