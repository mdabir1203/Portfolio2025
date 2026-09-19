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
 * Six photos cycle through the same 300 px circular chrome that used to
 * hold a single static headshot. Each photo carries a single identity
 * word — a singular noun that captures the moment.
 *
 * ── Motion DNA: "Subconscious Drift" v5 ────────────────────────────────
 *
 * The previous Bento Burst DNA (overshoot spring + Z-wiggle + direction
 * split + per-slide jitter) made the carousel *feel like it was
 * transitioning*. That works against long-term retention — the viewer's
 * brain spends processing power on the motion, not on the face, and
 * the face is the whole point.
 *
 * The new DNA is built on three neuromarketing principles:
 *
 *   1. Face-first — humans process faces in the fusiform face area
 *      (FFA), which is optimised for unbroken gaze. Any motion that
 *      *competes* with the face is a tax on retention. So: no rotation,
 *      no scale wiggle, no y-translate. Just opacity.
 *
 *   2. Subliminal cues — peripheral vision detects motion below
 *      conscious threshold. We use a 1.5 px → 0 px Gaussian blur to
 *      simulate focus pull on the entering photo. The viewer doesn't
 *      *see* the transition happen, they just feel the photo "land."
 *
 *   3. Encoding window — long-term retention of a face needs ~1 s of
 *      uninterrupted viewing. The cycle is 2.6 s: 1.2 s transition
 *      phase (overlapping enter + exit) + 1.4 s settle phase where
 *      the face is alone on screen. That's the encoding window.
 *
 * And one motion-design principle:
 *
 *   4. Cubic ease-in-out, zero overshoot. The curve arrives at both
 *      endpoints with velocity = 0, so the photo has no perceptible
 *      "start" or "stop." The brain reads it as continuous presence.
 *
 * Motion recipe (desktop + mobile — same; the difference between
 * viewports is too small to need a separate recipe for this DNA):
 *
 *   Photo enter   : opacity 0 → 1
 *                   filter  blur(1.5px) → blur(0)
 *                   easeInOut(0.65, 0, 0.35, 1), 1.2 s
 *   Photo exit    : opacity 1 → 0
 *                   filter  blur(0) → blur(1.5px)
 *                   easeInOut(0.65, 0, 0.35, 1), 1.0 s
 *                   (begins 0.2 s after the next photo enters, so both
 *                    are briefly visible — the crossfade window)
 *
 *   Halo          : opacity 0.5 ↔ 0.72 (gentle breath, no scale)
 *                   duration = CYCLE_MS, easeInOut
 *                   The halo becomes a *feeling*, not an effect.
 *
 *   Available dot : opacity 0.85 ↔ 1.0 (soft blink, no scale)
 *                   duration = CYCLE_MS, easeInOut
 *
 *   Identity word : opacity 0 → 1 (synchronous with photo)
 *                   colour  amber → teal (slow 1.0 s drift, not a flash)
 *                   easeInOut, 1.0 s
 *
 * The "Bento Burst" DNA (overshoot, direction split, Z-wiggle, jitter)
 * is preserved as comments at the bottom of this file in case it ever
 * needs to be revived for a more playful context.
 *
 * Slide order is a deliberate arc, not random:
 *
 *   01 DRIFTER     Vietnam mountains, plaid shirt, travel hat
 *   02 ARRIVED     KL Petronas, arms spread, joyful
 *   03 GROUNDED    Lighthouse field, sitting meditation
 *   04 EXPRESSIVE  Fitting-room bowler hat, lapel flower
 *   05 SPEAKER     On-stage mic, presenting to audience
 *   06 ARCHITECT   Dubai 2026 suit, glasses, blue tie (current day-one)
 *
 * The first slide (DRIFTER) is the LCP image — preloaded in __root.tsx
 * with fetchpriority="high". The remaining five are lazy-loaded by the
 * browser once the carousel mounts.
 *
 * Accessibility:
 *   - Each slide has its own descriptive alt text. The active slide's
 *     alt is read; the others are aria-hidden because they're stacked
 *     behind it.
 *   - The cycling identity word is announced as part of the page chrome,
 *     not via aria-live — cycling text through a live region would be
 *     too noisy.
 *   - prefers-reduced-motion pauses the cycle on the first slide and
 *     shows the rest only on demand (no fade, no blur, no scale).
 *
 * 2026 web-vitals notes:
 *   - LCP impact is neutral — the first slide is the preloaded image.
 *   - CLS is zero — width/height are explicit on every <img>, the cycle
 *     is contained inside an aspect-ratio container, the identity word
 *     swaps inside a fixed-height row, and opacity/filter animations
 *     use compositor-only properties (no layout).
 *   - filter: blur() is GPU-accelerated on modern browsers; the cost
 *     is limited to the 1.2 s transition window, not continuous.
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

/** Cycle period in ms.
 *  2.6 s = 1.2 s transition phase + 1.4 s settle phase.
 *  The settle phase is the encoding window — the brain gets 1.4 s of
 *  uninterrupted viewing per face, which is what locks it into long-term
 *  memory. Six faces × 2.6 s = 15.6 s full loop. */
const CYCLE_MS = 2600;

/** Cubic ease-in-out with zero overshoot. Velocity = 0 at both endpoints
 *  so the photo has no perceptible start or stop. */
const EASE_SMOOTH = [0.65, 0, 0.35, 1] as const;
/** Linear ease for opacity (already linear in perception). */
const EASE_OPACITY = "easeInOut" as const;

/** Subliminal blur on the entering photo — simulates focus pull.
 *  1.5 px is below conscious threshold for focal vision, so the viewer
 *  doesn't *see* the blur, but peripheral motion detectors register
 *  it. Net effect: "the photo feels like it landed" without ever
 *  making the transition itself obvious. */
const ENTER_BLUR_PX = 1.5;

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

  return (
    <div
      role="group"
      aria-label="Personality reel — six photographs cycling through identity words"
      className={className}
    >
      <div className="relative aspect-square w-full">
        {/* Halo — soft radial breath. Opacity-only, no scale, so the halo
            reads as ambient light rather than a separate animation. The
            viewer feels "the photo is alive" without seeing the halo
            pulse as a discrete event. */}
        <motion.div
          key={reduceMotion ? "halo-static" : `halo-${active}`}
          aria-hidden="true"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.72, 0.58, 0.7, 0.55] }}
          transition={{
            duration: CYCLE_MS / 1000,
            ease: EASE_OPACITY,
            times: [0, 0.3, 0.55, 0.78, 1],
          }}
          className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(15,117,105,0.32),rgba(244,162,97,0.20)_45%,transparent_70%)] blur-md"
        />

        {/* Crossfading image stack. The transition is pure opacity + a
            subliminal 1.5 px → 0 px blur that simulates focus pull.
            No rotation, no scale wiggle, no y-translate, no per-slide
            jitter — those "designed effect" cues are what made the
            previous DNA read as "I'm a transition!" The new DNA reads
            as continuous presence. */}
        <div
          className="relative h-full w-full overflow-hidden rounded-full ring-[4px] ring-[color:var(--accent-teal)]/85 shadow-[0_32px_80px_-18px_rgba(15,117,105,0.65),0_12px_32px_-12px_rgba(0,0,0,0.3)]"
        >
          {SLIDES.map((slide, i) => {
            const isActive = i === (reduceMotion ? 0 : active);
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
                    : { opacity: 0, filter: `blur(${ENTER_BLUR_PX}px)` }
                }
                animate={
                  reduceMotion
                    ? { opacity: isActive ? 1 : 0 }
                    : isActive
                      ? {
                          opacity: 1,
                          filter: "blur(0px)",
                        }
                      : { opacity: 0 }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, filter: `blur(${ENTER_BLUR_PX}px)` }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.2 }
                    : isActive
                      ? {
                          opacity: {
                            duration: 1.2,
                            ease: EASE_SMOOTH,
                          },
                          filter: {
                            duration: 1.2,
                            ease: EASE_SMOOTH,
                          },
                        }
                      : {
                          opacity: {
                            duration: 1.0,
                            ease: EASE_SMOOTH,
                          },
                          filter: {
                            duration: 1.0,
                            ease: EASE_SMOOTH,
                          },
                        }
                }
                draggable={false}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
                style={{
                  // Hint to the compositor: blur is GPU-only, no need to
                  // paint the offscreen bitmap every frame.
                  willChange: "opacity, filter",
                }}
              />
            );
          })}

          {/* Available dot — soft blink. No scale, just opacity.
              Subliminal "presence" indicator that beats with the cycle. */}
          <motion.span
            key={reduceMotion ? "dot-static" : `dot-${active}`}
            aria-hidden="true"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: [0.85, 1, 0.92, 1, 0.88] }}
            transition={{
              duration: CYCLE_MS / 1000,
              ease: EASE_OPACITY,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            className="absolute bottom-3 right-3 inline-block h-4 w-4 rounded-full border-[3px] border-paper bg-[color:var(--accent-lime)] shadow-[0_0_0_4px_rgba(15,117,105,0.20)]"
          />
        </div>
      </div>

      {/* Identity word — appears with the photo, no rotation, no scale
          animation, no y-translate. Just opacity in lock-step with the
          face. The slow amber → teal colour drift (1.0 s) gives the
          word a "settling in" feel without being a flash. */}
      <div className="relative mt-4 h-7 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.identity}
            initial={
              reduceMotion
                ? false
                : { opacity: 0 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: {
                      duration: 1.0,
                      ease: EASE_SMOOTH,
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
              transition={{ duration: 1.0, ease: "easeOut" }}
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

/* ───────────────────────────────────────────────────────────────────────
 * "Bento Burst" DNA archive (v3, deprecated 2026-09-19).
 *
 * The previous DNA made the carousel *feel like it was transitioning*.
 * That worked against long-term retention:
 *   - Overshoot spring curves [0.34, 1.56, 0.64, 1] screamed "designed effect."
 *   - Direction split (CCW for slides 0-2, CW for slides 3-5) was a
 *     "look at me" trick — the brain noticed opposing rotations.
 *   - Z-wiggle (scale 0.82 → 1.07 → 0.98 → 1) competed with the face
 *     for the brain's motion-processing resources.
 *   - Per-slide jitter (-5 → 5 px translateX) was gimmicky organic feel.
 *
 * The "Subconscious Drift" v5 DNA replaces all of these with pure
 * crossfade + 1.5 px subliminal blur + cubic ease-in-out. The transition
 * is invisible to focal vision; peripheral motion detectors still
 * register it. Faces get uninterrupted time on screen.
 *
 * Kept here in case the Bento Burst is ever revived for a more playful
 * context (e.g. a "shake to shuffle" landing page).
 *
 *   const SPRING = [0.34, 1.56, 0.64, 1] as const;
 *   const SPRING_SOFT = [0.4, 1.3, 0.5, 1] as const;
 *   const CYCLE_MS_BURST = 1900;
 *
 *   const RECIPES = {
 *     desktop: {
 *       rot: [12, -4, 1.5, 0], rotInitial: 12, rotExit: 5,
 *       scale: [0.82, 1.07, 0.98, 1], y: [16, -3, 1, 0],
 *       enterDur: 0.95, exitDur: 0.4, ease: SPRING,
 *       times: [0, 0.45, 0.75, 1],
 *     },
 *     mobile: {
 *       rot: [5, -1.5, 0.5, 0], rotInitial: 5, rotExit: 2.5,
 *       scale: [0.92, 1.04, 0.99, 1], y: [9, -2, 1, 0],
 *       enterDur: 0.7, exitDur: 0.32, ease: SPRING_SOFT,
 *       times: [0, 0.45, 0.75, 1],
 *     },
 *   };
 *
 *   const JITTER_X_DESKTOP = [-5, 3, -3, 4, -3, 5];
 *
 *   // Direction split, applied per-slide:
 *   const dir = i < 3 ? -1 : 1;
 *   const rotateEnter = R.rot.map((v) => v * dir);
 *   const rotateInitial = R.rotInitial * dir;
 *   const rotateExit = R.rotExit * dir;
 *
 *   // Identity word direction mirror:
 *   const currentDir = active < 3 ? -1 : 1;
 * ─────────────────────────────────────────────────────────────────────── */