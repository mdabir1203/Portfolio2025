// PersonalityHero — the ENFP 4-letter centerpiece.
//
// Design studio art direction:
//   * Cinematic Center, editorial scrapbook palette. Fraunces serif + JetBrains
//     mono, matching the rest of the site.
//   * 4-letter mark sits on a single horizontal rule, each letter color-coded
//     (E · N · F · P) with the same oklch palette the polaroid strip uses.
//   * Below it, a 4-column grid of "behaviour" lines — recruiter-readable,
//     no persona, no jargon.
//   * Background carries an EnfpConstellation (R3F) that drifts slowly and
//     reacts to the cursor. Disabled under prefers-reduced-motion.
//   * Massive section padding (py-32 md:py-48) — the gpt-taste iron rule.

import { motion, useReducedMotion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import {
  ENFP_DIMENSIONS,
  ENFP_BEHAVIORS,
  type EnfpDimension,
} from './photos';
import { WavyUnderline } from './LottieBits';

// Constellation is a 3D accent — only loads on the client, and only if the
// device can handle it. Lazy + Suspense keeps the SSR bundle small.
const EnfpConstellation = lazy(() =>
  import('./EnfpConstellation').then((m) => ({ default: m.EnfpConstellation })),
);

const LETTERS: EnfpDimension[] = ['E', 'N', 'F', 'P'];

// One line per letter — the headline the recruiter actually skims.
const HEADLINE_BY_LETTER: Record<EnfpDimension, string> = {
  E: 'Extroverted',
  N: 'Intuitive',
  F: 'Feeling',
  P: 'Perceiving',
};

export function PersonalityHero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="personality-hero"
      className="cin-personality-hero relative isolate overflow-hidden bg-[#f6f1e8] py-24 sm:py-32 md:py-40"
      aria-labelledby="personality-hero-title"
    >
      {/* WebGL accent — slow drifting colored spheres (one per letter).
          Falls back to nothing when the user prefers reduced motion. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {!reduce && (
          <Suspense fallback={null}>
            <EnfpConstellation />
          </Suspense>
        )}
        {/* Warm wash so the constellation reads even on low-contrast panels. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(15,117,105,0.06),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Eyebrow — same editorial scrapbook language as the rest of the site. */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#4a4a4a]">
            // 06 — the personality
          </span>
          <div className="h-px flex-1 bg-[#1a1a1a]/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
            Myers–Briggs Type Indicator
          </span>
        </motion.div>

        {/* Massive 4-letter mark — the centerpiece of the section. */}
        <motion.h1
          id="personality-hero-title"
          className="mt-10 font-serif text-[clamp(3.5rem,11vw,9.5rem)] font-normal leading-[0.92] tracking-[-0.04em] text-[#1a1a1a] md:leading-[0.88]"
          initial={{ opacity: 0.001, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Letter color={ENFP_DIMENSIONS.E.color} letter="E" word={HEADLINE_BY_LETTER.E} index={1} />
          <span className="mx-3 text-[#1a1a1a]/20 md:mx-6">·</span>
          <Letter color={ENFP_DIMENSIONS.N.color} letter="N" word={HEADLINE_BY_LETTER.N} index={2} />
          <span className="mx-3 text-[#1a1a1a]/20 md:mx-6">·</span>
          <Letter color={ENFP_DIMENSIONS.F.color} letter="F" word={HEADLINE_BY_LETTER.F} index={3} />
          <span className="mx-3 text-[#1a1a1a]/20 md:mx-6">·</span>
          <Letter color={ENFP_DIMENSIONS.P.color} letter="P" word={HEADLINE_BY_LETTER.P} index={4} />
        </motion.h1>

        {/* Wavy underline — the same hand-drawn flourish the other sections use. */}
        <motion.div
          className="mt-3 max-w-[280px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WavyUnderline className="h-3 w-full" />
        </motion.div>

        {/* Two-line subhead — Kotler value proposition, Forleo voice. */}
        <motion.div
          className="mt-8 grid max-w-4xl grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
            Four letters I have answered to on every
            <span style={{ color: '#0f7569' }}> Myers–Briggs</span> test since 2017.
            Nineteen photos that show up on <em className="not-italic" style={{ color: '#0f7569' }}>day one.</em>
          </p>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            The letters aren't a label. They're a working pattern — how I run a
            room, why I write the README first, who I sit next to at dinner, and
            which decisions I ship without a meeting. Scroll on. The nineteen
            frames below speak for themselves.
          </p>
        </motion.div>

        {/* Behaviour grid — the four-card recap. */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {LETTERS.map((dim, i) => (
            <BehaviourCard key={dim} dim={dim} delay={0.7 + i * 0.08} />
          ))}
        </div>

        {/* Footer ribbon — single short line. */}
        <motion.div
          className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a6a]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6, delay: 1.05 }}
        >
          <span style={{ color: '#c95f3b' }}>E</span>
          <span style={{ color: '#5d6cc4' }}>N</span>
          <span style={{ color: '#0f7569' }}>F</span>
          <span style={{ color: '#c89241' }}>P</span>
          <span className="text-[#6a6a6a]">— 19 photos · 4 dimensions · 0 personas</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Letter — single coloured letter with its word underneath.          */
/* ------------------------------------------------------------------ */
function Letter({
  color,
  letter,
  word,
  index,
}: {
  color: string;
  letter: string;
  word: string;
  index: number;
}) {
  return (
    <motion.span
      className="inline-block"
      style={{ color }}
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <span className="relative inline-block">
        {letter}
        {/* Tiny index dot — sits at the baseline, the way a printer marks a slug. */}
        <span
          aria-hidden
          className="absolute -right-2 -top-1 font-mono text-[10px] font-medium"
          style={{ color: '#1a1a1a', opacity: 0.35 }}
        >
          0{index}
        </span>
      </span>
      <span className="sr-only"> — {word}</span>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* BehaviourCard — one card per dimension, recruiter-readable.        */
/* ------------------------------------------------------------------ */
function BehaviourCard({ dim, delay }: { dim: EnfpDimension; delay: number }) {
  const d = ENFP_DIMENSIONS[dim];
  const lines = ENFP_BEHAVIORS[dim];
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-md border border-black/5 bg-white/85 p-5 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={
        reduce
          ? undefined
          : { y: -4, boxShadow: '0 24px 48px -22px rgba(0,0,0,0.45)' }
      }
    >
      {/* Letter chip — colored ring, matches the headline mark. */}
      <div className="flex items-baseline gap-3">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-full font-serif text-2xl"
          style={{
            color: d.color,
            border: `1.5px solid ${d.color}`,
            background: 'rgba(255,255,255,0.6)',
          }}
        >
          {d.letter}
        </span>
        <div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: d.color }}
          >
            0{Object.keys(ENFP_DIMENSIONS).indexOf(dim) + 1} of 04
          </div>
          <h3 className="mt-0.5 font-display text-xl leading-tight text-ink">
            {d.word}
          </h3>
        </div>
      </div>

      {/* Forleo punchline — action verb, not a label. */}
      <p
        className="mt-4 font-serif text-base italic leading-snug"
        style={{ color: d.color }}
      >
        "{d.punchline}"
      </p>

      {/* Behaviour list — recruiter-readable, action verbs. */}
      <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-ink-muted">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: d.color }} />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {/* Bottom rule — same accent color, marks the end of the card. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(to right, ${d.color}33, transparent 70%)`,
        }}
      />
    </motion.article>
  );
}
