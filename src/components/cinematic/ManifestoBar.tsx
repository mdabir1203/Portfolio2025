// ManifestoBar — the chapter tracker.
//
// Why this exists (branded storytelling):
//   The site has 11 sections. Without a frame, that's a scroll, not a story.
//   This bar tells the visitor where they are in the narrative at all times
//   and where they're going next. Same `//` editorial scrapbook language as
//   every other section header.
//
//   CHAPTER I — WHO  : Hero · Work · Case study
//   CHAPTER II — HOW : About · Personality
//   CHAPTER III — WHY: Peer reviews · Path
//   CHAPTER IV — NOW : Writing · YouTube · FAQ · Contact
//
// How it works:
//   * Each section in CinematicLanding carries a `data-chapter` attribute
//     (one of "who" | "how" | "why" | "now"). The bar reads those via an
//     IntersectionObserver, picks the chapter whose section occupies the
//     largest share of the viewport, and highlights it.
//   * The bar itself starts hidden (translated above the TopNav) and slides
//     into place once the user has scrolled past the hero — so the first
//     paint is uncluttered.
//   * Click a chapter tab to scroll to its first section.
//   * Honors prefers-reduced-motion (instant translation, no easing).
//   * Hidden on mobile (<md) — the TopNav already has limited space, and a
//     second sticky bar on mobile would crowd the viewport.

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PersianGirih, CompassRose, BengaliDigit } from './CulturalBits';
import { Magnetic } from './microinteractions/Magnetic';
import { PulseDot } from './microinteractions/PulseDot';

export type ChapterId = 'who' | 'how' | 'why' | 'now';

interface ChapterDef {
  id: ChapterId;
  roman: string;
  title: string;
  blurb: string;
  anchor: string;
  sections: string[]; // CSS selectors inside CinematicLanding
}

const CHAPTERS: ChapterDef[] = [
  {
    id: 'who',
    roman: 'I',
    title: 'Who',
    blurb: 'the work',
    anchor: '#hero',
    sections: ['#hero', '#work', '#case-study'],
  },
  {
    id: 'how',
    roman: 'II',
    title: 'How',
    blurb: 'the mind',
    anchor: '#about',
    sections: ['#about', '#personality'],
  },
  {
    id: 'why',
    roman: 'III',
    title: 'Why',
    blurb: 'the proof',
    anchor: '#reviews',
    sections: ['#reviews', '#path'],
  },
  {
    id: 'now',
    roman: 'IV',
    title: 'Now',
    blurb: 'the next step',
    anchor: '#contact',
    sections: ['#writing', '#youtube', '#faq', '#contact'],
  },
];

export function ManifestoBar() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ChapterId>('who');
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLElement | null>(null);

  // Chapter detection — IntersectionObserver watches every `data-chapter`
  // anchor on the page. The chapter with the most visible pixels wins.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targets: { el: Element; chapter: ChapterId; ratio: number }[] = [];
    CHAPTERS.forEach((c) => {
      c.sections.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) targets.push({ el, chapter: c.id, ratio: 0 });
      });
    });
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const t = targets.find((x) => x.el === entry.target);
          if (t) t.ratio = entry.intersectionRatio;
        });
        // Pick the chapter whose aggregate ratio is highest.
        const totals = new Map<ChapterId, number>();
        targets.forEach((t) => {
          totals.set(t.chapter, (totals.get(t.chapter) ?? 0) + t.ratio);
        });
        let best: ChapterId = 'who';
        let bestScore = -1;
        totals.forEach((score, id) => {
          if (score > bestScore) {
            bestScore = score;
            best = id;
          }
        });
        setActive(best);
      },
      {
        // Many samples across the viewport so the chapter updates smoothly.
        threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1],
        rootMargin: '-10% 0px -50% 0px',
      },
    );
    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  }, []);

  // Show/hide the bar — only after the user has scrolled past the hero.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      const hero = document.querySelector('#hero');
      if (!hero) {
        setVisible(window.scrollY > 240);
        return;
      }
      const rect = hero.getBoundingClientRect();
      // Show once the hero's bottom edge has scrolled past 40% of the
      // viewport — feels natural, doesn't compete with the hero.
      setVisible(rect.bottom < window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.aside
      ref={barRef}
      role="navigation"
      aria-label="Story chapters"
      className="cin-manifesto-bar fixed inset-x-0 top-[60px] z-20 hidden overflow-hidden border-b border-rule bg-paper/90 backdrop-blur-md md:block"
      initial={false}
      animate={{
        y: visible ? 0 : -64,
        opacity: visible ? 1 : 0,
      }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
      }
      aria-hidden={!visible}
    >
      {/* Persian girih background — sits behind the chapter tabs at low opacity. */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <PersianGirih className="h-full w-full" opacity={0.05} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-6 px-6 md:px-10">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
          <PulseDot size={7} />
          // the story
        </span>
        <ol className="flex flex-1 items-center divide-x divide-rule">
          {CHAPTERS.map((c) => {
            const isActive = c.id === active;
            return (
              <li key={c.id} className="flex-1">
                <Magnetic strength={8} fieldWidth={140}>
                  <a
                    href={c.anchor}
                    className="group relative flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      color: isActive ? '#0f7569' : 'rgba(26,26,26,0.55)',
                    }}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      aria-hidden
                      className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em]"
                    >
                      {/* Bengali numeral alongside the Roman one — gives the
                          chapter a second cultural anchor (১ ২ ৩ ৪). */}
                      <span aria-hidden>
                        <BengaliDigit n={CHAPTERS.findIndex((x) => x.id === c.id) + 1} />
                      </span>
                      <span>/</span>
                      <span>{c.roman}</span>
                    </span>
                    <span className="font-display text-base leading-none">
                      {c.title}
                    </span>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint lg:inline">
                      {c.blurb}
                    </span>
                    {/* Active underline — slides between chapters via CSS transition on opacity. */}
                    <span
                      aria-hidden
                      className="absolute inset-x-4 bottom-0 h-px transition-opacity duration-500"
                      style={{
                        background: '#0f7569',
                        opacity: isActive ? 1 : 0,
                      }}
                    />
                  </a>
                </Magnetic>
              </li>
            );
          })}
        </ol>
        {/* Compass — points to the active chapter by roman angle.
            4 chapters evenly distributed around 360°. */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <CompassRose
            angle={
              active === 'who' ? 0
              : active === 'how' ? 90
              : active === 'why' ? 180
              : 270
            }
            size={26}
            color="#0f7569"
            label={
              active === 'who' ? 'N · Who'
              : active === 'how' ? 'E · How'
              : active === 'why' ? 'S · Why'
              : 'W · Now'
            }
          />
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint lg:inline">
          scroll ↓
        </span>
      </div>
    </motion.aside>
  );
}

/** Helper exported so CinematicLanding can apply data-chapter without
 *  re-importing the CHAPTERS array and risking drift. */
export const CHAPTER_SELECTORS: Record<ChapterId, readonly string[]> = {
  who: CHAPTERS[0].sections,
  how: CHAPTERS[1].sections,
  why: CHAPTERS[2].sections,
  now: CHAPTERS[3].sections,
};
