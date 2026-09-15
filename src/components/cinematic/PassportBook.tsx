// PassportBook — floating bottom-right widget that "stamps" itself
// as the user scrolls through the portfolio. 14 countries · 14 stamps.
//
// Why this exists:
//   * The site tells the visitor "born in Iran · Bangladeshi roots ·
//     been in 14 countries". The PassportBook is the visual proof of
//     that journey — every section gets one (or two) stamps. As the
//     user scrolls, stamps ink themselves with a wobble animation,
//     like a real passport getting stamped at each border.
//
// Design:
//   * Closed state — a small "passport" button bottom-right with the
//     counter "৩ / ১৪" (Bengali numerals). Click to expand.
//   * Open state — a 7 × 2 grid of stamps, all 14 visible. Visited
//     stamps are fully inked at full opacity. Unvisited stamps are
//     dimmed at 25% with a dashed border.
//   * Each stamp = <HennaStamp /> (Persian-girih + country code +
//     place + Bengali digit) from CulturalBits.
//
// Sections → countries (mapping designed by hand so each section has
// at least one country that fits its content):

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HennaStamp, BengaliDigit } from './CulturalBits';

interface CountryStop {
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
  /** Place inside the stamp. */
  place: string;
  /** Bengali stop number. */
  bengaliIndex: number;
  /** Section id this stamp inks on. */
  sectionId: string;
}

const STOPS: CountryStop[] = [
  { country: 'IR', place: 'Tehran',    bengaliIndex: 1,  sectionId: '#hero' },
  { country: 'BD', place: 'Chittagong', bengaliIndex: 2,  sectionId: '#hero' },
  { country: 'AE', place: 'Dubai',     bengaliIndex: 3,  sectionId: '#work' },
  { country: 'SA', place: 'Riyadh',    bengaliIndex: 4,  sectionId: '#case-study' },
  { country: 'DE', place: 'Wolfsburg', bengaliIndex: 5,  sectionId: '#about' },
  { country: 'NL', place: 'Amsterdam', bengaliIndex: 6,  sectionId: '#about' },
  { country: 'BD', place: 'CUET',      bengaliIndex: 7,  sectionId: '#personality' },
  { country: 'DE', place: 'Hannover',  bengaliIndex: 8,  sectionId: '#reviews' },
  { country: 'FR', place: 'Paris',     bengaliIndex: 9,  sectionId: '#path' },
  { country: 'IT', place: 'Roma',      bengaliIndex: 10, sectionId: '#path' },
  { country: 'TR', place: 'Istanbul',  bengaliIndex: 11, sectionId: '#path' },
  { country: 'GB', place: 'London',    bengaliIndex: 12, sectionId: '#writing' },
  { country: 'US', place: 'MIT Sloan', bengaliIndex: 13, sectionId: '#youtube' },
  { country: 'AE', place: 'JLT',       bengaliIndex: 14, sectionId: '#contact' },
];

interface PassportBookProps {
  /** Hide the widget below this breakpoint (e.g., on tiny screens). */
  hideBelow?: 'sm' | 'md' | 'lg';
}

export function PassportBook({ hideBelow = 'sm' }: PassportBookProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [inked, setInked] = useState<Set<string>>(new Set());

  // IntersectionObserver — when a stop's section is at least 30% visible,
  // mark it as inked. Stamps stay inked for the rest of the session.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        setInked((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const entry of entries) {
            if (entry.intersectionRatio < 0.3) continue;
            const stop = STOPS.find((s) => s.sectionId === `#${entry.target.id}`);
            if (stop && !next.has(stop.sectionId)) {
              next.add(stop.sectionId);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 1] },
    );

    // Observe each unique section id once.
    const seen = new Set<string>();
    STOPS.forEach((s) => {
      if (seen.has(s.sectionId)) return;
      seen.add(s.sectionId);
      const el = document.querySelector(s.sectionId);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const visitedCount = STOPS.filter((s) => inked.has(s.sectionId)).length;

  const hideClass =
    hideBelow === 'sm'
      ? 'hidden sm:flex'
      : hideBelow === 'md'
        ? 'hidden md:flex'
        : 'hidden lg:flex';

  return (
    <div
      className={`cin-passport-book fixed bottom-4 right-4 z-30 ${hideClass} flex-col items-end gap-2`}
      aria-label="Passport — 14 countries, 14 stamps"
      role="region"
    >
      {/* Expanded passport book */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="book"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-[min(92vw,440px)] rounded-lg border border-rule bg-paper-2/95 p-4 shadow-[0_24px_56px_-22px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            {/* Header */}
            <div className="mb-3 flex items-center gap-3 border-b border-rule pb-3">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent-teal text-[color:var(--accent-teal)]"
              >
                {/* Tiny passport glyph */}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <circle cx="12" cy="11" r="3" />
                  <path d="M9 17h6" />
                </svg>
              </span>
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                  // 14 countries · 14 stamps
                </div>
                <div className="font-display text-base text-ink">
                  The route — Iran to Dubai
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close passport book"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
              >
                close ×
              </button>
            </div>

            {/* Grid of stamps — 7 columns × 2 rows on md+, 4 × 4 on sm. */}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7">
              {STOPS.map((stop) => {
                const isInked = inked.has(stop.sectionId);
                return (
                  <div
                    key={`${stop.country}-${stop.bengaliIndex}`}
                    className="flex flex-col items-center gap-1"
                    title={`${stop.place}, ${stop.country} — stop ${stop.bengaliIndex}`}
                  >
                    <div
                      className="relative transition-opacity duration-500"
                      style={{ opacity: isInked ? 1 : 0.25 }}
                    >
                      <HennaStamp
                        country={stop.country}
                        place={stop.place}
                        bengaliIndex={
                          stop.bengaliIndex.toString().replace(
                            /1/g,
                            '১',
                          ).replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯').replace(/0/g, '০')
                        }
                        size={56}
                        inked={isInked}
                      />
                      {/* "Inked today" badge on freshly-stamped stamps. */}
                      {isInked && (
                        <motion.div
                          aria-hidden
                          className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent-teal"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.4 }}
                        />
                      )}
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-faint">
                      {stop.country}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer — counter + Bengali digit. */}
            <div className="mt-3 flex items-center justify-between border-t border-rule pt-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                visited
              </div>
              <div className="flex items-baseline gap-1">
                <BengaliDigit
                  n={visitedCount}
                  className="text-2xl text-[color:var(--accent-teal)]"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                  / ১৪
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closed toggle — small passport badge with counter. */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={
          open
            ? 'Close passport book'
            : `Open passport book — ${visitedCount} of 14 countries visited`
        }
        className="group flex items-center gap-2 rounded-full border border-rule bg-paper-2/95 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-accent-teal hover:text-[color:var(--accent-teal)]"
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <circle cx="12" cy="11" r="3" />
          <path d="M9 17h6" />
        </svg>
        <span className="text-ink">
          <BengaliDigit n={visitedCount} />
          <span className="text-ink-faint"> / ১৪</span>
        </span>
        <span className="hidden text-ink-faint md:inline">route</span>
      </motion.button>
    </div>
  );
}
