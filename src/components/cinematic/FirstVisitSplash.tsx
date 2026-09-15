// FirstVisitSplash — the opener.
//
// Rive-equivalent state machine in Framer Motion:
//   * INPUT  isFirstVisit : boolean (one-shot, stored in sessionStorage)
//   * INPUT  dismissTimer : trigger   (auto-dismiss after entry + 3500ms hold)
//   * INPUT  userDismiss  : trigger   (click / Esc / Skip button)
//   * STATE  entry        : word-by-word stagger reveal (~ 1470ms total)
//   * STATE  settled      : quote holds for 3500ms, attribution fades in
//   * STATE  exit         : paper curtain rises, page revealed
//
// Total visible time before auto-dismiss: ~4970ms (entry ~1470ms + hold 3500ms).
// Long enough to actually read the line, short enough to feel like an
// entrance, not a paywall.
//
// We don't have a .riv file in the repo, so the state machine lives in
// code. Same conceptual model (states + inputs + triggers), but
// React-rendered. Easy to swap for a real Rive component later.
//
// Quote (one line, with a deliberate en-dash for emphasis):
//   "Impossible is something till you attempt."
// Attribution:
//   — the page you've just opened
// Why this quote: it sets the tone for the rest of the site — every
// section after the splash is the proof that the attempt was made.
//
// Reduced-motion behaviour:
//   * No stagger, no rotation. Just a 600ms fade-in, hold ~1200ms, fade-out.

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RickshawWheel, PersianGirih } from './CulturalBits';

const QUOTE_WORDS = ['Impossible', 'is', 'something', 'till you', 'attempt.'];
const ATTRIBUTION = '— the page you\u2019ve just opened';
const STORAGE_KEY = 'abir.first-visit-splash.v1';
const AUTO_DISMISS_MS = 4500;
const ENTRY_STAGGER_MS = 130;
/** Settled-phase duration — the quote holds on screen this long, fully readable,
 *  before the paper-curtain rises and reveals the site. */
const SETTLED_HOLD_MS = 3500;
/** Initial offset before any word starts animating (eyebrow + lead-in). */
const ENTRY_LEADIN_MS = 250;
/** Per-word reveal duration. Last word finishes at
 *  ENTRY_LEADIN_MS + (len-1)·ENTRY_STAGGER_MS + ENTRY_WORD_DURATION_MS. */
const ENTRY_WORD_DURATION_MS = 700;
const EXIT_MS = 600;

type Phase = 'idle' | 'entry' | 'settled' | 'exit' | 'gone';

export function FirstVisitSplash() {
  const reduce = useReducedMotion();
  // SSR-safe: render nothing on the server, decide on the client.
  // This avoids the `typeof window` mismatch that React's hydration
  // catches. The very first paint may be empty, then the splash appears
  // after hydration — that's the right trade-off vs. a hydration warning
  // that breaks React 19's strict-mode checks.
  const [phase, setPhase] = useState<Phase>('idle');
  const skipRef = useRef<HTMLButtonElement | null>(null);

  // Boot the state machine on mount, exactly once per session.
  useEffect(() => {
    // Honour an explicit ?cinema flag (or any ?cinema=...) — the page's
    // CinemaMode overlay takes over the entrance, so the splash would
    // just block the first beat.
    let shouldShow = true;
    try {
      const url = new URL(window.location.href);
      const cinemaFlag = url.searchParams.get('cinema');
      if (cinemaFlag !== null && cinemaFlag !== '0') {
        shouldShow = false;
        // Also mark the splash as seen so subsequent (non-cinema) navigations
        // in the same session don't re-show it.
        try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
      } else {
        shouldShow = !sessionStorage.getItem(STORAGE_KEY);
        if (shouldShow) sessionStorage.setItem(STORAGE_KEY, '1');
      }
    } catch {
      /* private mode / quota — fail silently */
    }
    if (!shouldShow) {
      setPhase('gone');
      return;
    }
    setPhase('entry');
    // Realistic entry-finish time: last word begins at
    //   ENTRY_LEADIN_MS + (N-1)·ENTRY_STAGGER_MS
    // and finishes animating ENTRY_WORD_DURATION_MS later.
    const entryDoneMs = reduce
      ? 600
      : ENTRY_LEADIN_MS +
        (QUOTE_WORDS.length - 1) * ENTRY_STAGGER_MS +
        ENTRY_WORD_DURATION_MS;
    const dismissAfter = reduce ? 600 + 1200 : entryDoneMs + SETTLED_HOLD_MS;
    const exitTimer = window.setTimeout(() => setPhase('exit'), dismissAfter);
    const goneTimer = window.setTimeout(
      () => setPhase('gone'),
      dismissAfter + EXIT_MS + 80,
    );
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
    };
  }, [reduce]);

  // User-dismiss triggers — click / Esc / Skip button.
  useEffect(() => {
    if (phase === 'idle' || phase === 'gone') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        setPhase('exit');
        window.setTimeout(() => setPhase('gone'), EXIT_MS + 40);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  // Move focus to the Skip button once we enter "settled", so keyboard users
  // can dismiss without hunting for the control.
  useEffect(() => {
    if (phase === 'settled') {
      skipRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <AnimatePresence>
      <motion.div
          key="first-visit-splash"
          role="dialog"
          aria-modal="true"
          aria-labelledby="first-visit-splash-quote"
          className="fixed inset-0 z-[100] isolate overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            transition: { duration: EXIT_MS / 1000, ease: [0.2, 0.8, 0.2, 1] },
          }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          onClick={() => {
            if (phase === 'settled' || phase === 'entry') {
              setPhase('exit');
              window.setTimeout(() => setPhase('gone'), EXIT_MS + 40);
            }
          }}
        >
          {/* Paper backdrop — same off-white as the rest of the site. */}
          <div className="absolute inset-0 bg-[#f6f1e8]" />
          {/* Persian girih — low-opacity geometric tile pattern, ties the
              opener to the ManifestoBar's girih background. */}
          <div className="absolute inset-0" aria-hidden>
            <PersianGirih className="h-full w-full" opacity={0.04} />
          </div>
          {/* Editorial scrapbook grain — barely visible, just enough texture. */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
            aria-hidden
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 1.5px)',
              backgroundSize: '4px 4px',
            }}
          />
          {/* Warm vignette in the corners — gives the splash depth. */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 55%, rgba(15,117,105,0.06) 100%)',
            }}
          />

          {/* Top-left cultural accent — a spinning rickshaw wheel that
              settles just before the quote lands. Bangladeshi roots, in
              three lines of SVG. */}
          <motion.div
            className="absolute left-6 top-6 hidden sm:block"
            initial={{ opacity: 0, y: -8 }}
            animate={
              reduce
                ? { opacity: 1, y: 0 }
                : {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.15, duration: 0.5 },
                  }
            }
            aria-hidden
          >
            <RickshawWheel size={48} color="#0f7569" speed={0.5} />
            <div className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
              ঢাকা
            </div>
          </motion.div>

          {/* Center cluster */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
            <div className="mx-auto w-full max-w-4xl text-center">
              {/* Eyebrow — same `// 00` language the rest of the site uses. */}
              <motion.div
                className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[#4a4a4a]"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  reduce
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }
                transition={{ delay: reduce ? 0 : 0.1 }}
              >
                // 00 — the opener
              </motion.div>

              {/* Quote — word-by-word stagger reveal. */}
              <h1
                id="first-visit-splash-quote"
                className="mt-8 font-serif text-[clamp(2.6rem,8vw,6.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[#1a1a1a]"
              >
                <span aria-hidden>
                  {QUOTE_WORDS.map((word, i) => (
                    <motion.span
                      key={`${word}-${i}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 18, rotate: -1.5 }}
                      animate={
                        reduce
                          ? { opacity: 1, y: 0, rotate: 0 }
                          : {
                              opacity: 1,
                              y: 0,
                              rotate: 0,
                              transition: {
                                duration: 0.7,
                                delay: 0.25 + i * (ENTRY_STAGGER_MS / 1000),
                                ease: [0.2, 0.8, 0.2, 1],
                              },
                            }
                      }
                      style={{ marginRight: '0.28em' }}
                    >
                      {/* The word "attempt." gets the teal accent — the punchline. */}
                      {i === QUOTE_WORDS.length - 1 ? (
                        <span style={{ color: '#0f7569' }}>{word}</span>
                      ) : (
                        word
                      )}
                    </motion.span>
                  ))}
                </span>
                {/* Screen-reader-only full quote — no word stagger for AT. */}
                <span className="sr-only">
                  {QUOTE_WORDS.join(' ')} {ATTRIBUTION}
                </span>
              </h1>

              {/* Wavy underline — same flourish as the other sections. */}
              <motion.div
                className="mx-auto mt-6 max-w-[200px]"
                initial={{ opacity: 0 }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        transition: {
                          delay:
                            0.25 + ENTRY_STAGGER_MS * QUOTE_WORDS.length * 0.001,
                          duration: 0.6,
                        },
                      }
                }
              >
                <svg viewBox="0 0 200 14" className="h-3 w-full" aria-hidden>
                  <motion.path
                    d="M2 9 Q 25 1, 50 7 T 100 7 T 150 7 T 198 7"
                    fill="none"
                    stroke="#0f7569"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.0,
                      ease: 'easeInOut',
                      delay:
                        0.25 + ENTRY_STAGGER_MS * QUOTE_WORDS.length * 0.001,
                    }}
                  />
                </svg>
              </motion.div>

              {/* Attribution — fades in once the quote has settled. */}
              <motion.p
                className="mt-7 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a6a]"
                initial={{ opacity: 0 }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        transition: {
                          delay: 0.25 + ENTRY_STAGGER_MS * (QUOTE_WORDS.length + 2) * 0.001,
                          duration: 0.5,
                        },
                      }
                }
              >
                {ATTRIBUTION}
              </motion.p>

              {/* Skip button — fades in last; click to dismiss immediately. */}
              <motion.button
                ref={skipRef}
                type="button"
                className="cin-hero-cta cin-hero-cta-secondary mx-auto mt-12 cursor-pointer"
                initial={{ opacity: 0, y: 6 }}
                animate={
                  reduce
                    ? { opacity: 1, y: 0 }
                    : {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay:
                            0.25 + ENTRY_STAGGER_MS * (QUOTE_WORDS.length + 4) * 0.001,
                          duration: 0.5,
                        },
                      }
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setPhase('exit');
                  window.setTimeout(() => setPhase('gone'), EXIT_MS + 40);
                }}
                aria-label="Skip opener — dismiss splash"
              >
                Enter the site →
              </motion.button>
            </div>
          </div>

          {/* Exit curtain — the page rises into view, paper-style. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-[#0a0a0a]"
            initial={{ scaleY: 0 }}
            animate={
              phase === 'exit'
                ? {
                    scaleY: 1,
                    transition: { duration: EXIT_MS / 1000, ease: [0.7, 0, 0.3, 1] },
                  }
                : { scaleY: 0 }
            }
            style={{ transformOrigin: 'bottom' }}
          />
        </motion.div>
    </AnimatePresence>
  );
}
