import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import portraitDrifter from "@/assets/portrait-drifter.webp";
import portraitArrived from "@/assets/portrait-arrived.webp";
import portraitGrounded from "@/assets/portrait-grounded.webp";
import portraitExpressive from "@/assets/portrait-expressive.webp";
import portraitSpeaker from "@/assets/portrait-speaker.webp";
import portraitArchitect from "@/assets/abir-2026.webp";

/**
 * PropicCarousel — the hero propic, but alive.
 *
 * Six photos cycle through the same 300px circular chrome that used to
 * hold a single static headshot. Each photo carries a single identity
 * word — a singular noun that captures the moment. The cycle runs at
 * 1.15 s per slide.
 *
 * ── Motion DNA: "Bento Burst" v3 — Direction Split + Z Wiggle ───────
 *
 * Inspired by the "Summer Splash Transitions" motion sheet, which
 * encodes five entrance recipes on a bento grid:
 *
 *   Hero        : scale 0.85 → 1.03 → 1,    opacity 0→1, 0.8 s, overshoot
 *                 loopPulse  scale 1 ↔ 1.02, 4 s ease-in-out
 *   Accent      : translateX -60 → 0,        opacity 0→1, 0.8 s, cubic(0.25,1,0.5,1)
 *                 loopBob    translateY 0 ↔ -10, rotate -1.5° ↔ 1.5°, 3.5 s
 *   Highlight   : scale 0 → 1.1 → 1,        rotate -90° → 5° → 0°, opacity 0→1
 *                 cubic(0.175, 0.885, 0.32, 1.275), 0.7 s
 *                 loopWiggle rotate -3° ↔ 3°, 2.5 s
 *   Main Subject: translateX 60 → 0,         opacity 0→1, 0.9 s, cubic(0.25,1,0.5,1)
 *                 loopBreathe scaleY 1 ↔ 1.015, 4 s
 *   Closer      : translateY 60 → 0,        opacity 0→1, 0.8 s, cubic(0.2,0.8,0.2,1)
 *
 * The carousel compresses the most dramatic of these — entrancePop —
 * into every 1.9 s cycle (was 1.15 s — slowed down so each photo gets
 * enough on-screen time to read), then layers on two more beats from
 * the sheet: a **direction split** (first 3 slides tilt CCW, last 3
 * tilt CW) and a **Z-axis wiggle** (4-keyframe scale oscillation, was
 * 6 — fewer states per cycle so the eye can follow the photo instead
 * of strobing through micro-bounces).
 *
 *   Direction split
 *     Slides 0-2 (DRIFTER, ARRIVED, GROUNDED)  : rotate initial = -12°
 *                                                enter rotates CCW → settles 0°
 *     Slides 3-5 (EXPRESSIVE, SPEAKER, ARCHITECT): rotate initial = +12°
 *                                                enter rotates CW → settles 0°
 *
 *   Z-axis wiggle (4-keyframe scale oscillation)
 *     [0.82, 1.07, 0.98, 1]    cubic(0.34, 1.56, 0.64, 1), 0.95 s
 *     Reads as the photo dropping in, micro-popping toward the camera,
 *     settling. One breath instead of three.
 *
 *   Photo enter   : scale [0.82, 1.07, 0.98, 1]
 *                   rotate [±12, ∓4, ±1.5, 0]
 *                   y [16, -3, 1, 0]
 *                   opacity 0 → 1
 *                   cubic(0.34, 1.56, 0.64, 1), 0.95 s
 *   Photo exit    : scale 1 → 0.94, rotate 0° → ±5°, y 0 → -8
 *                   (continues in the same rotational direction it entered)
 *                   0.4 s easeIn
 *   Halo          : scale [0.88, 1.20, 1], opacity [0.55, 1, 0.85]
 *                   1.9 s easeInOut, syncs with the slide change
 *   Available dot : scale [0.85, 1.16, 1], opacity [0.85, 1, 0.9]
 *                   1.9 s easeInOut, beats with the halo
 *   Identity word : scale [0.84, 1.06, 0.98, 1], y [14, -2, 1, 0]
 *                   rotate [±4, ∓1.5, ±0.5, 0], opacity 0 → 1
 *                   cubic(0.34, 1.56, 0.64, 1), 0.75 s
 *                   colour flash from sun-yellow (#f4a261) to accent-teal
 *                   over 0.4 s
 *
 * Slide order is a deliberate arc, not random:
 *
 *   01 DRIFTER     Vietnam mountains, plaid shirt, travel hat
 *   02 ARRIVED     KL Petronas, arms spread, joyful
 *   03 GROUNDED    Lighthouse field, sitting meditation
 *   04 EXPRESSIVE  Fitting-room bowler hat, sunglasses, lapel flower
 *   05 SPEAKER     On-stage mic, presenting to audience
 *   06 ARCHITECT   Dubai 2026 suit, glasses, blue tie (current day-one propic)
 *
 * The first slide (DRIFTER) is the LCP image — preloaded in __root.tsx
 * with fetchpriority="high". The remaining five are lazy-loaded by the
 * browser once the carousel mounts.
 *
 * Accessibility:
 *   - Each slide has its own descriptive alt text. The active slide's
 *     alt is the one read; the others are aria-hidden because they're
 *     stacked behind it.
 *   - The cycling identity word is announced as part of the page
 *     chrome, not via aria-live — cycling text through a live region
 *     would be too noisy.
 *   - prefers-reduced-motion pauses the cycle on the first slide and
 *     shows the rest only on demand (no fade, no scale, no rotation).
 *
 * 2026 web-vitals notes:
 *   - LCP impact is neutral — the first slide is the preloaded image.
 *   - CLS is zero — width/height are explicit on every <img>, the
 *     cycle is contained inside an aspect-ratio container, the
 *     identity word swaps inside a fixed-height row, and scale/rotate
 *     animations use transform (compositor-only, no layout).
 */

type Slide = {
  /** The single-word identity shown beneath it. Singular noun, uppercase. */
  identity: string;
  /** Bundled, fingerprinted asset URL. */
  src: string;
  /** Full alt text describing the scene for screen readers. */
  alt: string;
};

const SLIDES: Slide[] = [
  {
    identity: "DRIFTER",
    src: portraitDrifter,
    alt: "Abir in Vietnam — plaid shirt and travel hat, limestone cliffs of Ha Long Bay behind.",
  },
  {
    identity: "ARRIVED",
    src: portraitArrived,
    alt: "Abir in Kuala Lumpur — arms spread beneath the Petronas Twin Towers.",
  },
  {
    identity: "GROUNDED",
    src: portraitGrounded,
    alt: "Abir at the lighthouse — seated cross-legged on the field, red sweater and travel hat.",
  },
  {
    identity: "EXPRESSIVE",
    src: portraitExpressive,
    alt: "Abir in the fitting-room mirror — bowler hat, sunglasses, and a red lapel flower.",
  },
  {
    identity: "SPEAKER",
    src: portraitSpeaker,
    alt: "Abir on stage — laughing into the microphone mid-presentation, audience blurred behind.",
  },
  {
    identity: "ARCHITECT",
    src: portraitArchitect,
    alt: "Abir in Dubai 2026 — suit, glasses, blue tie, professional day-one headshot.",
  },
];

/** Cycle period in ms. 1.9 s per slide ≈ 11.4 s full loop.
    Slowed from 1.15 s → 1.9 s so each photo gets enough on-screen time
    to read; the bounce plays out over a longer window instead of feeling
    like a strobe. */
const CYCLE_MS = 1900;

/** Overshoot ease used by the motion sheet's entranceScale / entrancePop.
    Slightly punchier than the default ease-out, gives the bounce-in. */
const SPRING = [0.34, 1.56, 0.64, 1] as const;
/** Gentler overshoot for mobile — keeps the bounce feel but stops short
    of the values that make text alongside hard to read. */
const SPRING_SOFT = [0.4, 1.3, 0.5, 1] as const;
/** Steadier ease for the loop pulse. */
const SMOOTH = "easeInOut" as const;

/** Match-media hook. Returns false during SSR; updates after mount.
    Used to scale the bounce down on mobile so text stays readable. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

/** Motion recipes by viewport. Slower + fewer-keyframe than v3:
 *   - 4-keyframe pop (was 6) — the wiggle settles in one breath instead
 *     of three, so the eye can follow the photo
 *   - Longer durations: 0.95 s desktop, 0.7 s mobile
 *   - Reduced scale overshoot: 1.10 → 1.07 desktop, 1.06 mobile
 *   - Reduced rotate amplitude: 16° → 12° desktop, 6° → 5° mobile
 *   - Slightly larger drop (y: 16 → 18) to compensate for slower timing
 *     — gives the photo "weight" as it lands
 * Mobile values are still gentler so text stays legible mid-cycle. */
const RECIPES = {
  desktop: {
    rot: [12, -4, 1.5, 0] as const,
    rotInitial: 12,
    rotExit: 5,
    scale: [0.82, 1.07, 0.98, 1] as const,
    y: [16, -3, 1, 0] as const,
    enterDur: 0.95,
    exitDur: 0.4,
    ease: SPRING,
    times: [0, 0.45, 0.75, 1] as const,
  },
  mobile: {
    // gentler 4-keyframe — drop, small pop, settle, rest
    rot: [5, -1.5, 0.5, 0] as const,
    rotInitial: 5,
    rotExit: 2.5,
    scale: [0.92, 1.04, 0.99, 1] as const,
    y: [9, -2, 1, 0] as const,
    enterDur: 0.7,
    exitDur: 0.32,
    ease: SPRING_SOFT,
    times: [0, 0.45, 0.75, 1] as const,
  },
};

/** Per-slide "imperfect" jitter — a small translateX offset that varies
    across the 6 slides so the carousel feels organic, not mechanical.
    Desktop only — mobile drops it so the photo stays centered. */
const JITTER_X_DESKTOP = [-5, 3, -3, 4, -3, 5] as const;

export interface PropicCarouselProps {
  /** Optional extra className applied to the outer wrapper. */
  className?: string;
}

export function PropicCarousel({ className }: PropicCarouselProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return; // freeze on the first slide
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  // Pick the motion recipe for this viewport. SSR defaults to desktop
  // so the first paint uses the full DNA, then swaps on hydration.
  const recipe = isMobile ? RECIPES.mobile : RECIPES.desktop;

  const current = SLIDES[reduceMotion ? 0 : active];
  // Direction split mirror: -1 for first 3 slides (CCW), +1 for last 3 (CW).
  // The identity word reads the same direction as its photo.
  const currentDir = (reduceMotion ? 0 : active) < 3 ? -1 : 1;

  return (
    <div
      role="group"
      aria-label="Personality reel — six photographs cycling through identity words"
      className={className}
    >
      <div className="relative aspect-square w-full">
        {/* Halo — accent-teal + warm-orange radial that pulses on every
            slide change. Key={active} remounts the halo each cycle so the
            heartbeat restarts in phase with the photo. */}
        <motion.div
          key={reduceMotion ? "halo-static" : `halo-${active}`}
          aria-hidden="true"
          initial={{ opacity: 0.55, scale: 0.88 }}
          animate={{ opacity: [0.55, 1, 0.85], scale: [0.88, 1.28, 1] }}
          transition={{
            duration: CYCLE_MS / 1000,
            ease: SMOOTH,
            times: [0, 0.35, 1],
          }}
          className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(15,117,105,0.38),rgba(244,162,97,0.24)_45%,transparent_70%)] blur-md"
        />

        {/* Crossfading image stack. Each slide drops into place with the
            motion sheet's entrancePop recipe (slowed — 0.95 s enter vs
            the original 0.65 s), then layers on:
              • Direction split — first 3 slides tilt CCW (-12° initial),
                last 3 tilt CW (+12° initial). The opposite edges of the
                bento grid.
              • Z-axis wiggle — 4-keyframe scale oscillation
                [0.82, 1.07, 0.98, 1] simulates the photo dropping in,
                micro-popping toward the camera, settling. One breath.
            Exit continues in the same rotational direction it entered,
            so CCW slides leave CCW and CW slides leave CW. */}
        <div
          className="relative h-full w-full overflow-hidden rounded-full ring-[4px] ring-[color:var(--accent-teal)]/85 shadow-[0_32px_80px_-18px_rgba(15,117,105,0.65),0_12px_32px_-12px_rgba(0,0,0,0.3)]"
          style={{ perspective: "1200px" }}
        >
          {SLIDES.map((slide, i) => {
            const isActive = i === (reduceMotion ? 0 : active);
            // Direction split: first 3 slides rotate CCW (-1), last 3 rotate CW (+1)
            const dir = i < 3 ? -1 : 1;
            // Viewport-aware motion recipe — mobile uses gentler values
            const R = recipe;
            // Per-slide "imperfect" jitter — small translateX variation,
            // desktop only so the mobile photo stays centered for reading
            const jitterX = isMobile ? 0 : JITTER_X_DESKTOP[i];
            // Apply direction only to rotation (scale and y wiggle uniformly)
            const rotateEnter = R.rot.map((v) => v * dir);
            const rotateInitial = R.rotInitial * dir;
            const rotateExit = R.rotExit * dir;
            return (
              <motion.img
                key={slide.identity}
                src={slide.src}
                alt={isActive ? slide.alt : ""}
                aria-hidden={isActive ? undefined : true}
                loading={i === 0 ? "eager" : "lazy"}
                {...(i === 0
                  ? { fetchPriority: "high" as const }
                  : { fetchpriority: "low" })}
                decoding={i === 0 ? "sync" : "async"}
                width={720}
                height={720}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: R.scale[0],
                        rotate: rotateInitial,
                        y: R.y[0],
                        x: jitterX,
                      }
                }
                animate={
                  reduceMotion
                    ? { opacity: isActive ? 1 : 0 }
                    : isActive
                      ? {
                          opacity: 1,
                          scale: R.scale,
                          rotate: rotateEnter,
                          y: R.y,
                          x: 0,
                        }
                      : {
                          opacity: 0,
                          scale: 0.92,
                          rotate: rotateExit,
                          y: -10,
                          x: -jitterX * 0.5,
                        }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, rotate: rotateExit, y: -10, x: -jitterX * 0.5 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : isActive
                      ? {
                          opacity: { duration: 0.18, ease: "easeOut" },
                          scale: {
                            duration: R.enterDur,
                            ease: R.ease,
                            times: R.times,
                          },
                          rotate: {
                            duration: R.enterDur,
                            ease: R.ease,
                            times: R.times,
                          },
                          y: {
                            duration: R.enterDur * 0.92,
                            ease: R.ease,
                            times: R.times,
                          },
                          x: {
                            duration: R.enterDur * 0.8,
                            ease: R.ease,
                          },
                        }
                      : {
                          opacity: { duration: 0.16, ease: "easeIn" },
                          scale: { duration: R.exitDur, ease: "easeIn" },
                          rotate: { duration: R.exitDur, ease: "easeIn" },
                          y: { duration: R.exitDur, ease: "easeIn" },
                          x: { duration: R.exitDur, ease: "easeIn" },
                        }
                }
                draggable={false}
                style={{ transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            );
          })}

          {/* Available dot — beats in time with the photo via the same
              1.15 s cycle. Stronger scale range (0.85 -> 1.18 -> 1) so it
              reads as a companion pulse, not a separate animation. */}
          <motion.span
            key={reduceMotion ? "dot-static" : `dot-${active}`}
            aria-hidden="true"
            initial={{ scale: 0.82, opacity: 0.85 }}
            animate={{ scale: [0.82, 1.22, 1], opacity: [0.85, 1, 0.9] }}
            transition={{
              duration: CYCLE_MS / 1000,
              ease: SMOOTH,
              times: [0, 0.35, 1],
            }}
            className="absolute bottom-3 right-3 inline-block h-4 w-4 rounded-full border-[3px] border-paper bg-[color:var(--accent-lime)] shadow-[0_0_0_4px_rgba(15,117,105,0.20)]"
            style={{ originX: "50%", originY: "50%" }}
          />
        </div>
      </div>

      {/* Identity word — drops in with the same direction split + Z-wiggle
          as its photo, so the word tracks the slide it's labelling.
          On mobile the bounce is gentler (4-keyframe vs 6-keyframe) so
          the word stays legible mid-cycle. */}
      <div className="relative mt-4 h-7 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.identity}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: recipe.y[0] + 4,
                    scale: recipe.scale[0],
                    rotate: (currentDir < 0 ? -5 : 5) * (isMobile ? 0.6 : 1),
                  }
            }
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -10,
                    scale: 0.94,
                    rotate: currentDir < 0 ? -3 : 3,
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 0.18, ease: "easeOut" },
                    y: {
                      duration: recipe.enterDur * 0.9,
                      ease: recipe.ease,
                      times: recipe.times,
                    },
                    scale: {
                      duration: recipe.enterDur * 0.95,
                      ease: recipe.ease,
                      times: recipe.times,
                    },
                    rotate: {
                      duration: recipe.enterDur * 0.95,
                      ease: recipe.ease,
                      times: recipe.times,
                    },
                  }
            }
            className="absolute inset-0 flex items-center gap-2"
          >
            <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-faint">
              //
            </span>
            <motion.span
              initial={{ color: "rgb(244, 162, 97)" }}
              animate={{ color: "rgb(15, 117, 105)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-mono text-sm font-medium uppercase tracking-[0.32em]"
            >
              {current.identity}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PropicCarousel;