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
 * into every 1.15 s cycle, then layers on two more beats from the
 * sheet: a **direction split** (first 3 slides tilt CCW, last 3
 * tilt CW — like the Accent and Main-Subject tiles entering from
 * opposite edges of the bento) and a **Z-axis wiggle** (scale
 * pulses 0.78 → 1.13 → 0.94 → 1.06 → 0.99 → 1, simulating the photo
 * wobbling toward and away from the camera as it lands).
 *
 *   Direction split
 *     Slides 0-2 (DRIFTER, ARRIVED, GROUNDED)  : rotate initial = -16°
 *                                                enter rotates CCW → settles 0°
 *     Slides 3-5 (EXPRESSIVE, SPEAKER, ARCHITECT): rotate initial = +16°
 *                                                enter rotates CW → settles 0°
 *
 *   Z-axis wiggle (5-keyframe scale oscillation)
 *     [0.78, 1.13, 0.94, 1.06, 0.99, 1]    cubic(0.34, 1.56, 0.64, 1), 0.65 s
 *     Reads as the photo popping toward the camera, then bouncing
 *     back away, then settling — the depth-pulse the sheet implies
 *     with its loopBob + loopBreathe recipes.
 *
 *   Photo enter   : scale [0.78, 1.13, 0.94, 1.06, 0.99, 1]
 *                   rotate [±16, ∓8, ±4, ∓2, ±1, 0]  (Z wiggle on top)
 *                   y [14, -4, 2, -1, 0]
 *                   opacity 0 → 1
 *                   cubic(0.34, 1.56, 0.64, 1), 0.65 s
 *   Photo exit    : scale 1 → 0.92, rotate 0° → ±7°, y 0 → -10
 *                   (continues in the same rotational direction it entered)
 *                   0.28 s easeIn
 *   Halo          : scale [0.88, 1.28, 1], opacity [0.55, 1, 0.85]
 *                   1.15 s easeInOut, syncs with the slide change
 *   Available dot : scale [0.82, 1.22, 1], opacity [0.85, 1, 0.9]
 *                   1.15 s easeInOut, beats with the halo
 *   Identity word : scale [0.78, 1.12, 0.96, 1], y [18, -4, 1, 0]
 *                   rotate [±5, ∓2.5, ±1, 0], opacity 0 → 1
 *                   cubic(0.34, 1.56, 0.64, 1), 0.55 s
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

/** Cycle period in ms. 1.15 s per slide ≈ 6.9 s full loop. */
const CYCLE_MS = 1150;

/** Overshoot ease used by the motion sheet's entranceScale / entrancePop.
    Slightly punchier than the default ease-out, gives the bounce-in. */
const SPRING = [0.34, 1.56, 0.64, 1] as const;
/** Steadier ease for the loop pulse. */
const SMOOTH = "easeInOut" as const;

export interface PropicCarouselProps {
  /** Optional extra className applied to the outer wrapper. */
  className?: string;
}

export function PropicCarousel({ className }: PropicCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return; // freeze on the first slide
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

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

        {/* Crossfading image stack. Each slide slams into place with the
            motion sheet's entrancePop recipe, then layers on:
              • Direction split — first 3 slides tilt CCW (-16° initial),
                last 3 tilt CW (+16° initial). The opposite edges of the
                bento grid.
              • Z-axis wiggle — 5-keyframe scale oscillation
                [0.78, 1.13, 0.94, 1.06, 0.99, 1] simulates the photo
                wobbling toward and away from the camera as it lands.
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
            // 5-keyframe wiggle — overshoot + counter-overshoot + tiny settle wiggle
            const ROT_KEYS = [16, -8, 4, -2, 1, 0] as const;
            const SCALE_KEYS = [0.78, 1.13, 0.94, 1.06, 0.99, 1] as const;
            const Y_KEYS = [14, -4, 2, -1, 0, 0] as const;
            // Apply direction only to rotation (scale and y wiggle uniformly)
            const rotateEnter = ROT_KEYS.map((v) => v * dir);
            const rotateInitial = 16 * dir;
            const rotateExit = 7 * dir;
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
                        scale: SCALE_KEYS[0],
                        rotate: rotateInitial,
                        y: Y_KEYS[0],
                      }
                }
                animate={
                  reduceMotion
                    ? { opacity: isActive ? 1 : 0 }
                    : isActive
                      ? {
                          opacity: 1,
                          scale: SCALE_KEYS,
                          rotate: rotateEnter,
                          y: Y_KEYS,
                        }
                      : {
                          opacity: 0,
                          scale: 0.92,
                          rotate: rotateExit,
                          y: -10,
                        }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, rotate: rotateExit, y: -10 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : isActive
                      ? {
                          opacity: { duration: 0.18, ease: "easeOut" },
                          scale: {
                            duration: 0.65,
                            ease: SPRING,
                            // 6-keyframe: pop, overshoot, counter, mini-bounce, settle
                            times: [0, 0.32, 0.55, 0.74, 0.88, 1],
                          },
                          rotate: {
                            duration: 0.65,
                            ease: SPRING,
                            times: [0, 0.32, 0.55, 0.74, 0.88, 1],
                          },
                          y: {
                            duration: 0.6,
                            ease: SPRING,
                            times: [0, 0.32, 0.55, 0.74, 0.88, 1],
                          },
                        }
                      : {
                          opacity: { duration: 0.16, ease: "easeIn" },
                          scale: { duration: 0.28, ease: "easeIn" },
                          rotate: { duration: 0.28, ease: "easeIn" },
                          y: { duration: 0.28, ease: "easeIn" },
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
          Slides 0-2 tilt CCW (-5° initial), slides 3-5 tilt CW (+5°).
          Scale wiggles [0.76, 1.14, 0.94, 1.06, 1] in time with the
          photo's Z-pulse. Colour briefly flashes from sun-yellow (#f4a261)
          back to accent-teal over 0.4 s. */}
      <div className="relative mt-4 h-7 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.identity}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 18,
                    scale: 0.76,
                    rotate: currentDir < 0 ? -5 : 5,
                  }
            }
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                : {
                    opacity: 1,
                    y: [18, -4, 2, -1, 0, 0],
                    scale: [0.76, 1.14, 0.94, 1.06, 0.99, 1],
                    rotate: currentDir < 0
                      ? [-5, 3, -1.5, 1, -0.5, 0]
                      : [5, -3, 1.5, -1, 0.5, 0],
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -12,
                    scale: 0.92,
                    rotate: currentDir < 0 ? -4 : 4,
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 0.18, ease: "easeOut" },
                    y: { duration: 0.6, ease: SPRING, times: [0, 0.32, 0.55, 0.74, 0.88, 1] },
                    scale: { duration: 0.6, ease: SPRING, times: [0, 0.32, 0.55, 0.74, 0.88, 1] },
                    rotate: { duration: 0.6, ease: SPRING, times: [0, 0.32, 0.55, 0.74, 0.88, 1] },
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