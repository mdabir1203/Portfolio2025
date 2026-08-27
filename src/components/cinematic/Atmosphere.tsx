import { useEffect, useState } from "react";

/**
 * Atmosphere — global aurora + grain overlay.
 *
 * - Three slow-drifting aurora blobs (pure CSS radial gradients, animated
 *   via transform — no JS loop).
 * - A grain texture that sits at z-index -5 so it never blocks clicks.
 * - Both are pointer-events: none and aria-hidden.
 *
 * The point is: the entire site feels textured and "alive" without
 * burning a single frame on motion JS. The blobs are basically free.
 */
export function Atmosphere() {
  // Mounted guard so we don't render the blobs during SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div aria-hidden className="cin-atmosphere pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="cin-aurora cin-aurora-a absolute -left-32 top-[20vh] h-[60vh] w-[60vh] rounded-full opacity-50 blur-3xl" />
      <div className="cin-aurora cin-aurora-b absolute right-[-10vh] top-[60vh] h-[50vh] w-[50vh] rounded-full opacity-40 blur-3xl" />
      <div className="cin-aurora cin-aurora-c absolute left-1/2 top-[110vh] h-[70vh] w-[70vh] -translate-x-1/2 opacity-30 blur-3xl" />

      {/* Grain — applied as a full-screen noise via SVG fractal noise. */}
      <svg
        className="cin-grain absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="cin-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cin-noise)" />
      </svg>
    </div>
  );
}
