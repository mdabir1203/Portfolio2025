// Inline SVG/CSS motion bits that look like Lottie without bundling
// lottie-react (saves ~40 KB and avoids the JSON fetch dance).
// They live here so all three Personality variants can compose them
// in different ways to feel like one consistent motion language.
//
// Each "bit" is a small React component that uses framer-motion
// for the choreography. The visual is hand-drawn SVG so it
// renders crisply at any DPI and animates smoothly via transform.

import { motion, useReducedMotion } from 'framer-motion';

const ACCENT = '#0f7569';
const PAPER = '#f6f1e8';

/* ------------------------------------------------------------------ */
/* 1. Passport stamp — a circular ink mark that "stamps" into view.   */
/*    Used in the Photo Wall variant.                                  */
/* ------------------------------------------------------------------ */
export function PassportStamp({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      initial={{ opacity: 0, rotate: -28, scale: 1.6 }}
      whileInView={{ opacity: 0.85, rotate: -14, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <circle cx="60" cy="60" r="46" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="60" cy="60" r="40" fill="none" stroke={ACCENT} strokeWidth="1" />
      <text x="60" y="56" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700" fill={ACCENT} letterSpacing="2">
        DUBAI · UAE
      </text>
      <text x="60" y="70" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill={ACCENT} letterSpacing="1.5">
        ADMITTED 2026
      </text>
      {!reduce && (
        <motion.path
          d="M20 60 L100 60"
          stroke={ACCENT}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      )}
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Drifting clouds — five small SVGs that float across the strip.  */
/*    Used in the Polaroid Strip variant.                             */
/* ------------------------------------------------------------------ */
export function DriftingClouds({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const clouds = [0, 1, 2, 3, 4];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {clouds.map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 80 30"
          className="absolute"
          style={{ top: `${10 + i * 16}%`, left: 0 }}
          width={60 + i * 12}
          height={22 + i * 4}
          initial={{ x: '-10%', opacity: 0 }}
          animate={reduce ? { opacity: 0.18 } : { x: ['-10%', '110%'], opacity: [0, 0.22, 0.22, 0] }}
          transition={{ duration: 24 + i * 4, repeat: Infinity, delay: i * 3.7, ease: 'linear' }}
        >
          <path
            d="M10 22 Q4 22 4 16 Q4 10 12 10 Q14 4 22 4 Q30 4 32 10 Q40 8 44 14 Q56 12 58 20 Q72 18 72 24 Q72 28 64 28 L14 28 Q8 28 10 22 Z"
            fill={ACCENT}
            opacity="0.6"
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Hand-drawn underline that "writes itself" under a heading.      */
/*    Used in all variants as a small flourish.                       */
/* ------------------------------------------------------------------ */
export function WavyUnderline({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 14" className={className} aria-hidden>
      <motion.path
        d="M2 9 Q 25 1, 50 7 T 100 7 T 150 7 T 198 7"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      {!reduce && (
        <motion.circle
          cx="2"
          cy="9"
          r="2.5"
          fill={ACCENT}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Tilted polaroid frame — a "physical" photo card.                */
/*    Shared visual primitive for variants B and C.                   */
/* ------------------------------------------------------------------ */
import type { PersonalityPhoto } from './photos';
import { ENFP_DIMENSIONS } from './photos';

type PolaroidProps = {
  photo: PersonalityPhoto;
  rotation?: number; // degrees
  width?: number; // px
  delay?: number;
  caption?: 'below' | 'overlay' | 'none';
  className?: string;
  /** Index counter shown in the top-right ("01 / 10"). */
  index?: { current: number; total: number };
};

export function Polaroid({
  photo,
  rotation = 0,
  width = 240,
  delay = 0,
  caption = 'below',
  className = '',
  index,
}: PolaroidProps) {
  const reduce = useReducedMotion();
  const ratio = photo.span === 'tall' ? 'aspect-[3/4]' : photo.span === 'wide' ? 'aspect-[4/3]' : 'aspect-square';

  return (
    <motion.figure
      className={`relative inline-block ${className}`}
      style={{ width, transformOrigin: '50% 30%' }}
      initial={{ opacity: 0.001, y: 24, rotate: rotation + (reduce ? 0 : 6) }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, amount: 0.05, margin: '0px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={reduce ? undefined : { rotate: rotation * 0.4, y: -6, transition: { duration: 0.3 } }}
    >
      {/* Soft "sticky-tape" strip at the top — makes it feel taped to the fridge. */}
      <div
        aria-hidden
        className="absolute -top-2 left-1/2 z-20 h-3 w-16 -translate-x-1/2 rotate-[-3deg] bg-[color:var(--paper-hi,#d6cfbe)]/80 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        style={{ opacity: 0.7 }}
      />
      <div
        className="relative overflow-hidden rounded-[2px] border border-black/5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)]"
        style={{ background: '#fff' }}
      >
        {/* Counter chip */}
        {index && (
          <div className="absolute left-2 top-2 z-10 rounded-full border border-black/10 bg-white/85 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
            {String(index.current).padStart(2, '0')} / {String(index.total).padStart(2, '0')}
          </div>
        )}
        {/* "with" tag for friend shots — small, recruiter-friendly. */}
        {photo.with && (
          <div className="absolute right-2 top-2 z-10 rounded-full border border-white/30 bg-black/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            with {photo.with}
          </div>
        )}
        <div className={`${ratio} w-full overflow-hidden bg-[color:var(--paper-2,#ece6d8)]`}>
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        {caption === 'overlay' && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">{photo.place}</div>
            <div className="font-serif text-base italic">{photo.caption}</div>
          </div>
        )}
      </div>
      {caption === 'below' && (
        <figcaption className="mt-3 px-1 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#3a3a3a]">
            {photo.place}
          </div>
          <div className="mt-0.5 font-serif text-[15px] italic text-[#1a1a1a]">
            {photo.caption}
          </div>
          {photo.note && (
            <div className="mt-1 text-[11px] leading-snug text-[#4a4a4a]">
              {photo.note}
            </div>
          )}
          {/* ENFP dim tag — small dot + letter + word in the dimension's color.
              Falls back gracefully if the photo predates the dimension system. */}
          {photo.dimension && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: ENFP_DIMENSIONS[photo.dimension].color }}
              />
              <span
                className="font-mono text-[9px] uppercase tracking-[0.22em]"
                style={{ color: ENFP_DIMENSIONS[photo.dimension].color }}
              >
                {photo.dimension} · {ENFP_DIMENSIONS[photo.dimension].word}
              </span>
            </div>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Confetti burst — used on the "Pick a variant" CTA.              */
/* ------------------------------------------------------------------ */
export function Confetti({ trigger }: { trigger: number }) {
  const pieces = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <motion.span
          key={`${trigger}-${i}`}
          className="absolute left-1/2 top-1/2 block h-2 w-2"
          style={{
            background: i % 2 ? ACCENT : '#d8b46a',
            borderRadius: i % 3 ? '1px' : '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: Math.cos((i / pieces.length) * Math.PI * 2) * (60 + (i * 6) % 60),
            y: Math.sin((i / pieces.length) * Math.PI * 2) * (60 + (i * 6) % 60) - 40,
            opacity: 0,
            rotate: (i * 35) % 360,
          }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export const PERSONALITY_ACCENT = ACCENT;
export const PERSONALITY_PAPER = PAPER;
