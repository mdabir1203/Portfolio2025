/**
 * BrandMark — Mohammad Abir Abbas personal monogram.
 *
 * The "A" is constructed from three strokes: two diagonals meeting at a flat apex,
 * and a horizontal crossbar that extends right and curls down into a "D" curve.
 * A teal accent dot sits at the end of the curve — the "period" signature that
 * matches the italic "Abbas." in the headlines.
 *
 * Three variants:
 *   - "primary"  : ink + teal dot, on light backgrounds (default)
 *   - "mono"     : single ink color, no teal dot (favicon, dark bg, social)
 *   - "inverse"  : paper on ink, with teal dot (dark hero / press card)
 *
 * Size is driven by the `size` prop (pixel height). All internal geometry
 * is computed from the SVG viewBox so the mark is crisp at any size.
 */
import * as React from "react";

type Variant = "primary" | "mono" | "inverse";

export interface BrandMarkProps {
  /** Render height in pixels. The viewBox is 64x64 so width auto-scales. */
  size?: number;
  /** Visual variant. */
  variant?: Variant;
  /** Accessible label. Set to `null` to make it decorative (default). */
  title?: string | null;
  /** Optional className applied to the wrapper <svg>. */
  className?: string;
  /** aria-hidden override. */
  decorative?: boolean;
}

// Geometry inside the 64x64 viewBox. Tuned to match the reference mark:
// - Two outer diagonals meeting at a flat apex (8,8) → (32,12) → (56,8)
// - A horizontal crossbar at y=34, running x=10 → x=42
// - A "D" curve from (42,28) curling right to (54,46)
// - A teal dot at the end of the D curve, around (56, 46)
const STROKE = 4;
const DOT_R = 4.5;

export function BrandMark({
  size = 32,
  variant = "primary",
  title = null,
  className,
  decorative = true,
}: BrandMarkProps) {
  const ink =
    variant === "inverse"
      ? "var(--paper, #f7f3ec)"
      : "var(--ink, #0e0e0e)";
  const accent =
    variant === "mono"
      ? "transparent" // dot is invisible for mono
      : variant === "inverse"
        ? "var(--accent-teal, #0c6b58)"
        : "var(--accent-teal, #0c6b58)";

  return (
    <svg
      role={decorative ? "img" : "img"}
      aria-label={decorative ? undefined : title ?? "Mohammad Abir Abbas"}
      aria-hidden={decorative ? "true" : undefined}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
    >
      {!decorative && title ? <title>{title}</title> : null}
      <g
        fill="none"
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Flat apex — short horizontal segment at the top */}
        <path d="M 14 10 L 32 10" />
        {/* Left diagonal */}
        <path d="M 14 10 L 6 54" />
        {/* Right diagonal */}
        <path d="M 32 10 L 40 54" />
        {/* Crossbar */}
        <path d="M 10 34 L 32 34" />
        {/* Right extension of crossbar into the "D" curve */}
        <path d="M 32 34 C 44 34, 52 38, 52 44" />
        {/* D closes back to the crossbar height */}
        <path d="M 52 44 C 52 50, 44 54, 32 54" />
      </g>
      {/* Teal accent dot — the "period" at the end of the mark */}
      {variant !== "mono" && (
        <circle cx={52} cy={44} r={DOT_R} fill={accent} />
      )}
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
  const ink =
    variant === "inverse"
      ? "var(--paper, #f7f3ec)"
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
          color: ink,
          fontSize: size * 0.7,
        }}
      >
        Mohammad Abir Abbas
      </span>
    </div>
  );
}
