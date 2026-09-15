// MoodDial — interactive ENFP letter selector.
//
// Design studio art direction:
//   * 4 large letter chips (E · N · F · P) arranged horizontally on a
//     single ink rule, like printer's marks on a manuscript proof.
//   * Click a letter → the punchline + behaviour block under the dial
//     crossfades to that dimension's copy.
//   * Keyboard accessible (Tab + Enter / Space), with arrow-key navigation
//     between letters. Respects prefers-reduced-motion.
//   * Same color palette as the rest of the ENFP system — no new tokens.

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ENFP_DIMENSIONS, ENFP_BEHAVIORS, type EnfpDimension } from './photos';

const LETTERS: EnfpDimension[] = ['E', 'N', 'F', 'P'];

interface MoodDialProps {
  /** Initial letter to highlight. Defaults to 'E' (Extroverted). */
  initial?: EnfpDimension;
  /** Optional eyebrow line. */
  eyebrow?: string;
  /** Optional className for the wrapping section. */
  className?: string;
}

export function MoodDial({
  initial = 'E',
  eyebrow = '// Pick a letter — the strip changes with you',
  className = '',
}: MoodDialProps) {
  const [active, setActive] = useState<EnfpDimension>(initial);
  const reduce = useReducedMotion();
  const buttonsRef = useRef<Record<EnfpDimension, HTMLButtonElement | null>>({
    E: null,
    N: null,
    F: null,
    P: null,
  });

  // Arrow-key navigation between letters.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const i = LETTERS.indexOf(active);
      const next =
        e.key === 'ArrowLeft'
          ? LETTERS[(i - 1 + LETTERS.length) % LETTERS.length]
          : LETTERS[(i + 1) % LETTERS.length];
      setActive(next);
      buttonsRef.current[next]?.focus();
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const d = ENFP_DIMENSIONS[active];

  return (
    <section
      id="personality-dial"
      className={`relative w-full overflow-hidden bg-[#f6f1e8] py-16 md:py-24 ${className}`}
      aria-labelledby="personality-dial-title"
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#4a4a4a]">
            {eyebrow}
          </span>
          <div className="h-px flex-1 bg-[#1a1a1a]/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
            ENFP · 4 of 4
          </span>
        </div>

        <h2
          id="personality-dial-title"
          className="sr-only"
        >
          Pick a letter — the polaroid strip changes with you
        </h2>

        {/* The dial — 4 letter chips on a single rule. */}
        <div
          className="relative mt-8 flex items-stretch justify-between gap-3"
          role="radiogroup"
          aria-label="ENFP letter selector"
        >
          {/* Baseline rule — runs the full width behind the chips. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#1a1a1a]/15"
          />
          {LETTERS.map((letter, i) => {
            const isActive = letter === active;
            const cfg = ENFP_DIMENSIONS[letter];
            return (
              <button
                key={letter}
                ref={(el) => {
                  buttonsRef.current[letter] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive || i === 0 ? 0 : -1}
                onClick={() => setActive(letter)}
                className="group relative z-10 flex flex-1 flex-col items-center gap-2 rounded-full bg-[#f6f1e8] px-2 py-3 outline-none transition-transform duration-300 hover:scale-[1.02] focus-visible:scale-[1.04]"
                style={{
                  // Active chip wears its accent color; idle is a soft neutral.
                  color: isActive ? cfg.color : '#1a1a1a',
                }}
              >
                <span
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full font-serif text-3xl transition-all duration-500 ease-out sm:h-20 sm:w-20 sm:text-4xl"
                  style={{
                    border: isActive ? `2px solid ${cfg.color}` : '1.5px solid rgba(26,26,26,0.18)',
                    background: isActive ? `${cfg.color}10` : '#fff',
                    boxShadow: isActive ? `0 12px 28px -16px ${cfg.color}66` : 'none',
                  }}
                >
                  {cfg.letter}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: isActive ? cfg.color : '#6a6a6a' }}
                >
                  0{i + 1} · {cfg.word}
                </span>
              </button>
            );
          })}
        </div>

        {/* The crossfade block — punchline + behaviours for the active letter. */}
        <div className="relative mt-10 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-md border border-black/5 bg-white/85 p-6 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-8"
            >
              <div className="flex flex-wrap items-baseline gap-4">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: d.color }}
                >
                  {LETTERS.indexOf(active) + 1} / 4 — {d.word}
                </span>
                <div className="h-px flex-1 bg-[#1a1a1a]/15" />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]"
                >
                  punchline
                </span>
              </div>
              <p
                className="mt-3 font-display text-3xl leading-snug md:text-4xl"
                style={{ color: d.color }}
              >
                "{d.punchline}"
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ENFP_BEHAVIORS[active].map((line) => (
                  <div
                    key={line}
                    className="flex gap-2 rounded-sm border-l-2 pl-3 text-sm leading-snug text-ink-muted"
                    style={{ borderColor: d.color }}
                  >
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer hint — keyboard accessible, recruiter-readable. */}
        <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
          <kbd className="rounded border border-[#1a1a1a]/15 bg-white px-1.5 py-0.5 text-[10px]">←</kbd>
          <kbd className="rounded border border-[#1a1a1a]/15 bg-white px-1.5 py-0.5 text-[10px]">→</kbd>
          <span>to switch letters · the strip below updates with the active one</span>
        </div>
      </div>
    </section>
  );
}
