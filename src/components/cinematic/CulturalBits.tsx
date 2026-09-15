// CulturalBits — small inline SVG primitives that give the page
// a sense of cultural place without slipping into cliché.
//
// Four reusable bits:
//   * <PersianGirih />     — geometric tile pattern (Iranian/Persian)
//   * <CompassRose />      — rotating compass needle (wanderer motif)
//   * <RickshawWheel />    — spinning wheel (Bangladeshi rickshaw)
//   * <HennaStamp />       — passport stamp medallion (14 countries)
//
// All four are hand-drawn SVG, zero asset deps, framer-motion driven.
// Honors prefers-reduced-motion in the parent.
//
// The cultural references are honest: Bangladeshi rickshaw, Persian
// girih (the geometric tile work of Isfahan), Bengali numerals ১ ২ ৩ ৪,
// and a 14-country stamp book. None of this is decorative for its own
// sake — every bit either signals motion, anchors place, or marks
// progress.

import { motion, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/* 1. PersianGirih — repeating geometric tile pattern.                */
/*    Inspired by Isfahan's girih/khatam work. Pure SVG, no images.    */
/* ------------------------------------------------------------------ */
export function PersianGirih({
  className = '',
  /** Pattern color — defaults to ink-faint teal. */
  color = '#0f7569',
  /** Pattern opacity — keep low so it sits behind text. */
  opacity = 0.06,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 80 80"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* A single tile of the girih pattern. We tile it across the whole box. */}
        <pattern
          id="cin-girih-tile"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          {/* The "girih" — interlocking bow-tie, hexagram outline, and dot. */}
          <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
            <path d="M0 20 L20 0 L40 20 L20 40 Z" />
            <path d="M20 0 L20 40" />
            <path d="M0 20 L40 20" />
            <circle cx="20" cy="20" r="3" fill={color} stroke="none" />
            <path d="M0 0 L10 10 M30 10 L40 0 M0 40 L10 30 M30 30 L40 40" />
          </g>
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#cin-girih-tile)"
        opacity={opacity}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. CompassRose — a tiny SVG compass with a rotating needle.        */
/*    Used in the ManifestoBar to point at the active chapter.         */
/* ------------------------------------------------------------------ */
export function CompassRose({
  className = '',
  /** Angle in degrees — 0 = North (chapter I), 90 = East (chapter II), etc. */
  angle = 0,
  size = 28,
  /** Stroke color (defaults to teal accent). */
  color = '#0f7569',
  /** Optional label that appears under the compass. */
  label,
}: {
  className?: string;
  angle?: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden
        animate={{ rotate: angle }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 120, damping: 18 }
        }
        style={{ originX: '50%', originY: '50%' }}
      >
        {/* Outer ring */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.35"
        />
        {/* Inner ring */}
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.25"
        />
        {/* Cardinal ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="16"
            y1="2"
            x2="16"
            y2="5"
            stroke={color}
            strokeWidth="1"
            transform={`rotate(${deg} 16 16)`}
            opacity="0.55"
          />
        ))}
        {/* North needle (red-tipped) */}
        <polygon points="16,4 19,16 16,18 13,16" fill={color} />
        {/* South needle (grey) */}
        <polygon
          points="16,28 19,16 16,14 13,16"
          fill={color}
          opacity="0.35"
        />
        {/* Center pin */}
        <circle cx="16" cy="16" r="1.5" fill={color} />
      </motion.svg>
      {label && (
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
          {label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. RickshawWheel — the spinning wheel of a Bangladeshi rickshaw.  */
/*    Used as a tiny decorative accent in the splash / spinner.       */
/* ------------------------------------------------------------------ */
export function RickshawWheel({
  className = '',
  size = 36,
  color = '#0f7569',
  /** Spins when true (default). Set false for static. */
  spinning = true,
  /** Speed multiplier — 1 = one revolution per 2s. */
  speed = 1,
}: {
  className?: string;
  size?: number;
  color?: string;
  spinning?: boolean;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const animate = !spinning || reduce ? {} : { rotate: 360 };
  const transition = !spinning || reduce
    ? { duration: 0 }
    : {
        duration: 2 / speed,
        ease: 'linear' as const,
        repeat: Infinity,
      };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      animate={animate}
      transition={transition}
      style={{ originX: '50%', originY: '50%' }}
    >
      {/* Outer rim */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Hub */}
      <circle cx="20" cy="20" r="3" fill={color} />
      {/* 8 spokes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <line
            key={i}
            x1="20"
            y1="20"
            x2="20"
            y2="3"
            stroke={color}
            strokeWidth="1"
            transform={`rotate(${angle} 20 20)`}
            opacity="0.7"
          />
        );
      })}
      {/* Decorative inner ring (the "tin-chakka" pattern). */}
      <circle
        cx="20"
        cy="20"
        r="11"
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        opacity="0.45"
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. HennaStamp — a passport-stamp medallion for the 14 countries.   */
/*    Circular ink mark with country code + roman + Bengali numeral.  */
/* ------------------------------------------------------------------ */
export interface StampProps {
  /** ISO 3166-1 alpha-2 country code (BD, IR, AE, …). */
  country: string;
  /** City / place inside the stamp. */
  place: string;
  /** Bengali numeral (১-১৪) showing which of the 14 stops this is. */
  bengaliIndex: string;
  /** Optional ink color (defaults per country below). */
  color?: string;
  /** Render size in px. */
  size?: number;
  className?: string;
  /** When true, draws a slight wobble / rotation like a real stamp. */
  inked?: boolean;
}

const STAMP_COLORS: Record<string, string> = {
  BD: '#006a4e', // Bangladesh flag green
  IR: '#239f40', // Iran flag green
  AE: '#00732f', // UAE green
  DE: '#1a1a1a', // Germany black/red/gold — black for ink
  SA: '#006c35', // Saudi green
  US: '#bf0a30',
  FR: '#0055a4',
  GB: '#012169',
  BE: '#fae042',
  CH: '#d52b1e',
  AT: '#ed2939',
  NL: '#ae1c28',
  IT: '#008c45',
  TR: '#e30a17',
};

export function HennaStamp({
  country,
  place,
  bengaliIndex,
  size = 72,
  className = '',
  inked = false,
  color,
}: StampProps) {
  const reduce = useReducedMotion();
  const ink = color ?? STAMP_COLORS[country] ?? '#0f7569';
  const rotation = inked ? (reduce ? 0 : -8) : 0;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      initial={inked ? { scale: 1.4, opacity: 0, rotate: -28 } : false}
      animate={
        inked
          ? { scale: 1, opacity: 0.9, rotate: rotation }
          : { scale: 1, opacity: 0.85, rotate: rotation }
      }
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Outer dashed ring — looks like a passport stamp border. */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={ink}
        strokeWidth="1.5"
        strokeDasharray="3 4"
        opacity="0.85"
      />
      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke={ink}
        strokeWidth="1"
        opacity="0.7"
      />
      {/* Country code */}
      <text
        x="50"
        y="38"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontWeight="700"
        fontSize="11"
        fill={ink}
        letterSpacing="2"
      >
        {country}
      </text>
      {/* Place */}
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, serif"
        fontStyle="italic"
        fontSize="9"
        fill={ink}
        letterSpacing="0.5"
      >
        {place}
      </text>
      {/* Bengali numeral — the "stop number". */}
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, serif"
        fontWeight="700"
        fontSize="13"
        fill={ink}
      >
        {bengaliIndex}
      </text>
      {/* Centre ink dot */}
      <circle cx="50" cy="50" r="2" fill={ink} opacity="0.4" />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. BengaliDigit — small inline utility for showing a Bengali       */
/*    numeral (১-১৪) inside chapter markers, counters, etc.           */
/* ------------------------------------------------------------------ */
const BENGALI_MAP: Record<number, string> = {
  1: '১', 2: '২', 3: '৩', 4: '৪', 5: '৫',
  6: '৬', 7: '৭', 8: '৮', 9: '৯', 10: '১০',
  11: '১১', 12: '১২', 13: '১৩', 14: '১৪',
};

export function BengaliDigit({ n, className = '' }: { n: number; className?: string }) {
  return (
    <span className={`font-serif ${className}`} aria-label={`${n}`}>
      {BENGALI_MAP[n] ?? String(n)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 6. NakshiAccent — a thin embroidered divider (Bangladeshi nakshi  */
/*    kantha pattern). Used as a soft section divider.                */
/* ------------------------------------------------------------------ */
export function NakshiAccent({
  className = '',
  color = '#0f7569',
  width = 200,
}: {
  className?: string;
  color?: string;
  width?: number;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={16}
      viewBox="0 0 200 16"
      aria-hidden
    >
      {/* Mirrored diamond-and-dot — a single motif from nakshi kantha. */}
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        <path d="M100 2 L108 8 L100 14 L92 8 Z" />
        <circle cx="100" cy="8" r="1.2" fill={color} stroke="none" />
        <path d="M70 8 L80 4 M120 8 L130 4 M70 8 L80 12 M120 8 L130 12" />
        <path d="M40 8 L48 5 M40 8 L48 11 M152 8 L160 5 M152 8 L160 11" />
        <circle cx="20" cy="8" r="1" fill={color} stroke="none" />
        <circle cx="180" cy="8" r="1" fill={color} stroke="none" />
      </g>
    </svg>
  );
}
