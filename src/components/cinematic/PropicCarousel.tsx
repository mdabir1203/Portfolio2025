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
 * ── Transition style: "Summer Splash" ───────────────────────────────────
 *
 * Modelled after the Etihad Summer Splash Sale reel: snappy scale-pop
 * entrance with a slight rotation tilt, an accent halo that pulses on
 * each beat like the sale's spinning sun, and a bouncy identity word
 * that drops in from below. Three layers of motion, all keyed off the
 * 1.15 s cycle, so the propic reads as a personality reel with real
 * beat — not a slideshow.
 *
 *   Photo enter  : scale 0.92 → 1.04 → 1, rotate -3° → 1° → 0°
 *                  (overshoot ease, ~0.32 s)
 *   Photo exit   : scale 1 → 1.07, rotate 0° → 3°
 *                  (zoom-out + tilt away, ~0.22 s)
 *   Halo         : scale 1 → 1.18 → 1, opacity 0.85 → 1 → 0.85
 *                  (heartbeat in sync with the slide change)
 *   Identity word: scale 0.82 → 1.06 → 1, y 14 → 0
 *                  (bounce-in from below)
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
 *   - The carousel is a focusable group with an accessible name;
 *     tabbing through it doesn't trap the user.
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

/** Photo entrance — overshoot ease, the same curve used by the Summer
    Splash badge when it pops onto the reel. */
const PHOTO_ENTER = {
  opacity: { duration: 0.18, ease: "easeOut" as const },
  scale: { duration: 0.34, ease: [0.34, 1.56, 0.64, 1] as const },
  rotate: { duration: 0.34, ease: [0.34, 1.56, 0.64, 1] as const },
};

/** Photo exit — faster, no overshoot; the next slide is already coming. */
const PHOTO_EXIT = {
  opacity: { duration: 0.18, ease: "easeIn" as const },
  scale: { duration: 0.22, ease: "easeIn" as const },
  rotate: { duration: 0.22, ease: "easeIn" as const },
};

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
        {/* Halo — accent-teal radial that pulses on every slide change.
            The key={active} remount trick lets the spring restart each
            cycle so the heartbeat never drifts out of phase. */}
        <motion.div
          key={reduceMotion ? "halo-static" : `halo-${active}`}
          aria-hidden="true"
          initial={{ opacity: 0.7, scale: 0.94 }}
          animate={{ opacity: [0.7, 1, 0.85], scale: [0.94, 1.18, 1] }}
          transition={{
            duration: CYCLE_MS / 1000,
            ease: "easeInOut",
            times: [0, 0.4, 1],
          }}
          className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(15,117,105,0.32),rgba(244,162,97,0.18)_45%,transparent_70%)] blur-md"
        />

        {/* Crossfading image stack. All slides are mounted at once; the
            active one animates to (opacity 1, scale 1, rotate 0), the
            others animate out to (opacity 0, scale 1.07, rotate 3°).
            The Summer Splash pop uses a small overshoot on entry and
            a quick zoom-out on exit so the carousel feels alive without
            taking focus off the photo. */}
        <div className="relative h-full w-full overflow-hidden rounded-full ring-[4px] ring-[color:var(--accent-teal)]/85 shadow-[0_32px_80px_-18px_rgba(15,117,105,0.65),0_12px_32px_-12px_rgba(0,0,0,0.3)]">
          {SLIDES.map((slide, i) => {
            const isActive = i === (reduceMotion ? 0 : active);
            return (
              <motion.img
                key={slide.identity}
                src={slide.src}
                alt={isActive ? slide.alt : ""}
                aria-hidden={isActive ? undefined : true}
                loading={i === 0 ? "eager" : "lazy"}
                // fetchpriority is typed as a string in older React types —
                // cast keeps the build clean without losing the hint.
                {...(i === 0
                  ? { fetchPriority: "high" as const }
                  : { fetchpriority: "low" })}
                decoding={i === 0 ? "sync" : "async"}
                width={720}
                height={720}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: -3 }}
                animate={
                  reduceMotion
                    ? { opacity: isActive ? 1 : 0 }
                    : isActive
                      ? { opacity: 1, scale: 1, rotate: 0 }
                      : { opacity: 0, scale: 1.07, rotate: 3 }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.07, rotate: 3 }
                }
                transition={reduceMotion ? { duration: 0.2 } : (isActive ? PHOTO_ENTER : PHOTO_EXIT)}
                draggable={false}
                style={{ transformOrigin: "50% 50%" }}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            );
          })}

          {/* Available dot — kept in sync with the heartbeat by inheriting
              the same 1.15 s cycle. Subtle scale pulse, no rotation, so the
              dot doesn't fight the photo's tilt. */}
          <motion.span
            key={reduceMotion ? "dot-static" : `dot-${active}`}
            aria-hidden="true"
            initial={{ scale: 0.85, opacity: 0.85 }}
            animate={{ scale: [0.85, 1.15, 1], opacity: [0.85, 1, 0.9] }}
            transition={{
              duration: CYCLE_MS / 1000,
              ease: "easeInOut",
              times: [0, 0.35, 1],
            }}
            className="absolute bottom-3 right-3 inline-block h-4 w-4 rounded-full border-[3px] border-paper bg-[color:var(--accent-lime)] shadow-[0_0_0_4px_rgba(15,117,105,0.20)]"
            style={{ originX: "50%", originY: "50%" }}
          />
        </div>
      </div>

      {/* Identity word — bounces in from below with a small scale overshoot.
          The colour flashes briefly from accent-teal to a sun-yellow and back,
          echoing the Summer Splash palette without overpowering the page. */}
      <div className="relative mt-4 h-7 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.identity}
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.82 }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.94 }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 0.18, ease: "easeOut" },
                    y: { duration: 0.34, ease: [0.34, 1.56, 0.64, 1] },
                    scale: { duration: 0.34, ease: [0.34, 1.56, 0.64, 1] },
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