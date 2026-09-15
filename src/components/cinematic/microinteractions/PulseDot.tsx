// PulseDot — a tiny teal "I'm alive" dot that breathes at 1.4s/cycle.
//
// Intended to sit next to chapter numbers ("01", "02"…), KPI eyebrows,
// or anywhere the design needs a "live data" signal without screaming.
//
// Three layered rings so the pulse looks like a sonar hit, not a CSS
// `:hover` ring. Uses framer-motion for the pulse so it pauses cleanly
// when prefers-reduced-motion is on.

import { motion, useReducedMotion } from "framer-motion";

export type PulseDotProps = {
  /** Outer color. Default teal. */
  color?: string;
  /** Pixel size. Default 10. */
  size?: number;
  /** Tailwind className for the wrapper. */
  className?: string;
  /** Label for screen readers. */
  label?: string;
};

export function PulseDot({
  color = "#0f7569",
  size = 10,
  className,
  label = "live",
}: PulseDotProps) {
  const reduce = useReducedMotion();
  const half = size / 2;

  return (
    <span
      className={"relative inline-flex items-center justify-center " + (className ?? "")}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      {/* Sonar ring 1 — outermost */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          style={{ backgroundColor: color, inset: 0 }}
          initial={{ opacity: 0.35, scale: 1 }}
          animate={{ opacity: 0, scale: 2.6 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {/* Sonar ring 2 — secondary, offset start */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          style={{ backgroundColor: color, inset: 0 }}
          initial={{ opacity: 0.25, scale: 1 }}
          animate={{ opacity: 0, scale: 2.0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        />
      )}
      {/* Core dot */}
      <span
        aria-hidden
        className="relative rounded-full"
        style={{
          width: half,
          height: half,
          backgroundColor: color,
          boxShadow: `0 0 0 2px ${color}20`,
        }}
      />
    </span>
  );
}
