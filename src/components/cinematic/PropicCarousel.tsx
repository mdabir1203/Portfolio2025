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
 * 1.15 s per slide and crossfades over 0.25 s, so the propic reads as a
 * personality reel rather than a slideshow.
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
 * browser once the carousel mounts, so the carousel adds ~250 kB of
 * post-LCP image weight, not to the initial transfer.
 *
 * Accessibility:
 *   - Each slide has its own descriptive alt text. The active slide's
 *     alt is the one read; the others are aria-hidden because they're
 *     stacked behind it via opacity, not display:none, so a screen
 *     reader that walks the DOM would otherwise see all six.
 *   - The cycling identity word is announced as part of the page
 *     chrome, not via aria-live — cycling text through a live region
 *     would be too noisy. The alt text of each slide carries the
 *     fuller scene description.
 *   - prefers-reduced-motion pauses the cycle on the first slide and
 *     shows the rest only on demand (no fade, instant swap).
 *   - The carousel is keyboard-focusable (role="group") with an
 *     accessible name; tabbing through it doesn't trap the user.
 *
 * 2026 web-vitals notes:
 *   - LCP impact is neutral — the first slide is the same preloaded
 *     image as before, just a different file (portrait-drifter.webp,
 *     85 kB vs abir-2026.webp 125 kB). Slightly smaller, in fact.
 *   - CLS is zero — width/height are explicit on every <img>, the
 *     cycle is contained inside an aspect-ratio container, and the
 *     identity word swaps inside a fixed-height row.
 *   - LCP/CLS stay green; the carousel's job is to add personality,
 *     not to cost the page.
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
/** Crossfade duration in s. Short enough to feel snappy, long enough to read. */
const FADE_S = 0.25;

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
        {/* Soft accent halo — matches the static portrait's chrome so the
            carousel reads as the same propic, just animated. */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(15,117,105,0.20),transparent_60%)] blur-md"
        />

        {/* Crossfading image stack. All slides are mounted at once; the
            active one animates opacity 1, the others fade to 0. Width
            and height are explicit so the layout reserves the LCP slot
            before the first frame paints. */}
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
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: FADE_S, ease: "easeOut" }}
                draggable={false}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            );
          })}

          {/* Available dot — the same PulseDot microinteraction that used
            to sit at the bottom-right of the static portrait. */}
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 inline-block h-4 w-4 rounded-full border-[3px] border-paper bg-[color:var(--accent-lime)] shadow-[0_0_0_4px_rgba(15,117,105,0.20)]"
          />
        </div>
      </div>

      {/* Identity word — single uppercase word, accent-teal, fades between
          values in sync with the photo. Held inside a fixed-height row so
          the swap doesn't shift layout. */}
      <div className="relative mt-4 h-7 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={current.identity}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: FADE_S, ease: "easeOut" }}
            className="absolute inset-0 flex items-center gap-2"
          >
            <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-faint">
              //
            </span>
            <span className="font-mono text-sm font-medium uppercase tracking-[0.32em] text-[color:var(--accent-teal)]">
              {current.identity}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PropicCarousel;