/**
 * BrandMark — Mohammad Abir Abbas personal monogram (2026 refresh).
 *
 * The mark: a folded green ribbon forming the letter "A", with a red
 * disc and a Dubai skyline silhouette tucked into the interior. The
 * red disc and the flag colour palette tie back to the user's
 * Bangladeshi roots; the skyline ties to the Dubai current chapter.
 *
 * Three variants:
 *   - "primary"  : green ribbon + red disc + skyline, on light bg (default)
 *   - "mono"     : single ink colour, no colour accents (favicon-grade)
 *   - "inverse"  : paper on ink, with red disc (dark hero / press card)
 *
 * Optional `animated` prop adds a 2.6s scale-pulse on the red disc —
 * same heartbeat as the splash's Bangladesh flag, so the brandmark
 * reads as alive on the page. Honours `prefers-reduced-motion`.
 *
 * Geometry is computed from a 64x64 viewBox so the mark is crisp at
 * any size from 16px favicon up to 256px hero scale.
 */
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "primary" | "mono" | "inverse";

export interface BrandMarkProps {
  /** Render HEIGHT in pixels. Width auto-derives (5:4 aspect, see viewBox). */
  size?: number;
  /** Visual variant. Default "primary". */
  variant?: Variant;
  /** Accessible label. Set to a string for non-decorative use. */
  title?: string | null;
  /** Optional className applied to the wrapper <svg>. */
  className?: string;
  /** Decorative mode suppresses the role/aria-label. Default true. */
  decorative?: boolean;
  /** When true, pulses the red disc on a 2.6s cycle. Default true. */
  animated?: boolean;
}

// Brandmark colours — kept in sync with the favicon.svg and the splash
// flag. Hex literals (not CSS vars) so the SVG inlines cleanly in any
// context (PWA manifest, OG image, email signature) without depending
// on the host stylesheet.
const GREEN_TOP = "#1f7a5e";
const GREEN_BOT = "#006a4e";
const RED_DISC = "#f42a41";
const SKYLINE = "#0c3a2a";
const PAPER = "#f6f1e8";
const INK = "#0e0e0e";

/**
 * The A letterform — two filled strokes (paths) that meet at a flat
 * apex and splay outward at the base. Drawn as filled paths so the
 * bottom flares read as ribbon ends, not thin lines.
 *
 * The shape is symmetric around x=32, apex at y=8, base at y=58.
 */
function APaths({ fill, paperBg = false }: { fill: string; paperBg?: boolean }) {
  return (
    <g fill={fill}>
      {/* Left stroke */}
      <path d="M 32 8
               L 38 8
               L 26 52
               Q 25 56 22 56
               L 18 56
               Q 14 56 16 52
               L 28 11
               Q 29 8 32 8 Z"/>
      {/* Right stroke */}
      <path d="M 32 8
               L 26 8
               L 38 52
               Q 39 56 42 56
               L 46 56
               Q 50 56 48 52
               L 36 11
               Q 35 8 32 8 Z"/>
    </g>
  );
}

/**
 * Three-tower Dubai skyline silhouette tucked into the right interior
 * of the A. Towers left→right: stepped tower, Burj Khalifa (tallest
 * with stacked setback profile), slim spire. Designed at a stroke
 * weight that disappears at 16px but reads as architecture at 32px+.
 */
function Skyline({ fill }: { fill: string }) {
  return (
    <g fill={fill} opacity="0.92">
      {/* Stepped tower */}
      <path d="M 41 56 L 41 36 L 44 36 L 44 30 L 46 30 L 46 36 L 48 36 L 48 56 Z"/>
      {/* Burj Khalifa (tallest, centre) */}
      <path d="M 33 56 L 33 26 Q 33 24 35 24 L 35 18 Q 35 17 36 17 L 36 24 L 37 24 L 37 17 Q 37 16 38 16 L 38 24 L 39 24 L 39 18 Q 39 17 40 17 L 40 56 Z"/>
      {/* Slim spire */}
      <path d="M 50 56 L 50 28 L 51 28 L 51 24 L 52 24 L 52 28 L 53 28 L 53 56 Z"/>
    </g>
  );
}

export function BrandMark({
  size = 32,
  variant = "primary",
  title = null,
  className,
  decorative = true,
  animated = true,
}: BrandMarkProps) {
  const reduce = useReducedMotion();

  // Variant → colour map. The ribbon stays green in primary and inverse
  // (it's the brand's anchor colour), the disc and skyline shift to
  // paper-on-ink for inverse, and mono drops all accent colour.
  const ribbonFill = variant === "mono" ? INK : `url(#bm-ribbon)`;
  const discFill = variant === "mono" ? "transparent" : RED_DISC;
  const skylineFill = variant === "mono" ? "transparent" : SKYLINE;
  const paperBgFill =
    variant === "inverse" ? INK :
    variant === "mono"    ? PAPER :
    null;

  // Outer wrapper: same as before — `color: currentColor` for any
  // descendant that wants to fall back. Inverse sets the wrapper to
  // paper so aria/title text reads on dark.
  const wrapperColor =
    variant === "inverse" ? PAPER : INK;

  const a11yProps = decorative
    ? { "aria-hidden": "true" as const }
    : { role: "img" as const, "aria-label": title ?? "Mohammad Abir Abbas" };

  return (
    <svg
      {...a11yProps}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{ display: "block", color: wrapperColor }}
    >
      {!decorative && title ? <title>{title}</title> : null}

      {/* Gradient for the green ribbon — defined once, used in primary
          and inverse variants. mono bypasses this via `fill="currentColor"`. */}
      {variant !== "mono" && (
        <defs>
          <linearGradient id="bm-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={GREEN_TOP} />
            <stop offset="100%" stopColor={GREEN_BOT} />
          </linearGradient>
        </defs>
      )}

      {/* Paper tile background — only when we want a contained "card"
          (mono + primary). Inverse uses ink as the bg, no tile needed. */}
      {paperBgFill && (
        <rect width="64" height="64" rx="12" fill={paperBgFill} />
      )}

      {/* The A letterform. primary uses the gradient; mono uses ink;
          inverse uses paper-on-ink. */}
      {variant === "inverse" ? (
        <APaths fill={PAPER} />
      ) : variant === "mono" ? (
        <APaths fill="currentColor" />
      ) : (
        <APaths fill="url(#bm-ribbon)" />
      )}

      {/* Red disc — Bangladesh flag red, sits on the left interior of
          the A. Animated by default. mono variant skips it. */}
      {discFill !== "transparent" && (
        <motion.circle
          cx="22"
          cy="38"
          r="6"
          fill={discFill}
          style={{ originX: "22px", originY: "38px", originZ: 0 }}
          animate={
            !animated || reduce
              ? { scale: 1 }
              : {
                  scale: [1, 1.045, 1],
                  transition: {
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        />
      )}

      {/* Dubai skyline — right interior of the A. mono variant skips. */}
      {skylineFill !== "transparent" && <Skyline fill={skylineFill} />}
    </svg>
  );
}

/**
 * BrandLockup — Mark + wordmark, horizontal.
 * Use for press kit cover, brand one-pager top, About section author byline.
 */
export function BrandLockup({
  size = 32,
  variant = "primary",
  className,
}: Pick<BrandMarkProps, "size" | "variant" | "className">) {
  const wordmarkColor =
    variant === "inverse"
      ? "var(--paper, #f6f1e8)"
      : "var(--ink, #0e0e0e)";
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        lineHeight: 1,
      }}
    >
      <BrandMark size={size} variant={variant} />
      <span
        style={{
          fontFamily:
            "var(--font-display, 'Fraunces', 'Instrument Serif', serif)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: wordmarkColor,
          fontSize: size * 0.7,
        }}
      >
        Mohammad Abir Abbas
      </span>
    </div>
  );
}
