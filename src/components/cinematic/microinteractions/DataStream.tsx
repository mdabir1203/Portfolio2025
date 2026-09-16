// DataStream — a thin SVG path connecting N points, with small teal
// "packets" that animate along the path when the component is in view.
// Designed for the "From the floor to the boardroom" 4-layer diagram —
// a literal visualization of the data flow Capture → Map → Model → Deliver.
//
// Enlarged (2026-09-16) to anchor the case-study narrative visually.
// Sized with Fibonacci + golden-ratio proportions so it reads large
// without feeling chunky relative to the rest of the page:
//
//   • Outer height     — 112 px mobile / 144 px desktop    (Fibonacci 89, 144)
//   • SVG path width   — full bleed via preserveAspectRatio="none"
//   • Stroke widths    — 2.4 / 2.6 px                      (Fibonacci 2, 3)
//   • Packet radius    — 2.4 / 5 / 9  (halo : mid : core)   (each ≈ 1.8×, near φ)
//   • Anchor markers   — 2.8 / 7 / 13 (core : ring : halo)  (each ≈ φ)
//   • Label font       — 13 px, letter-spacing 0.28em      (Fibonacci 13)
//   • Packet count     — 5                                (Fibonacci)
//   • Cycle duration   — 6.18 s                           (φ × 3.82 — luxury pacing)
//   • Line position    — y = 50 (centered in viewBox 0..100, with anchors)
//                        and labels anchored 18 px below.
//
// Honors prefers-reduced-motion (static path, no packets). All path math
// runs in an SVG; labels are real HTML for typographic fidelity.

import {
  useRef,
  type ReactNode,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type DataStreamProps = {
  /** Coordinates [x, y] in pixels (relative to 1000×100 viewBox). */
  points: Array<[number, number]>;
  /** Stroke color. Default teal. */
  color?: string;
  /** Packet color. Default teal. */
  packetColor?: string;
  /** Number of packets to dispatch at a time. Default 5 (Fibonacci). */
  packetCount?: number;
  /** Seconds per packet cycle. Default 6.18 (φ × 3.82). */
  duration?: number;
  /** Label slots — drawn at each waypoint, below the SVG. */
  labels?: ReactNode[];
  className?: string;
};

export function DataStream({
  points,
  color = "#0f7569",
  packetColor = "#0f7569",
  packetCount = 5,
  duration = 6.18,
  labels,
  className,
}: DataStreamProps) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });

  // We use SVG <animateMotion> with a path reference so the packets trace
  // the polyline naturally. Browser handles the rAF math. Reduced motion =
  // no packets dispatched at all.

  const pathD =
    "M " + points.map(([x, y]) => `${x},${y}`).join(" L ");

  return (
    <div className={"cin-data-stream relative " + (className ?? "")}>
      <svg
        ref={ref}
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="block h-28 w-full md:h-36"
        aria-hidden
      >
        {/* Background dotted path — denser, thicker (2.4px) than the prior
            1.4px so the line carries visual weight even when packets idle. */}
        <path
          d={pathD}
          stroke={color}
          strokeOpacity="0.45"
          strokeWidth="2.4"
          strokeDasharray="2 6"
          fill="none"
        />

        {/* Solid trace-in path — re-runs on every entry into view. Slower
            (1.8s) ease-out cubic matches the rest of the page's pacing. */}
        {inView && (
          <path
            d={pathD}
            stroke={color}
            strokeWidth="2.6"
            fill="none"
            strokeDasharray="320 1000"
            strokeDashoffset={1000}
            style={{
              transition:
                "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            ref={(el) => {
              if (el) {
                requestAnimationFrame(() => {
                  el.style.strokeDashoffset = "0";
                });
              }
            }}
          />
        )}

        {/* Waypoint anchors — three concentric circles per waypoint.
            Outer halo (12% teal fill), paper-fill ring (teal stroke),
            solid teal core. Anchors feel like physical stations, not
            just line terminations. Ratios 13 : 7 : 2.8 ≈ φ steps. */}
        {points.map(([x, y], i) => (
          <g key={`anchor-${i}`}>
            <circle cx={x} cy={y} r="13" fill={color} fillOpacity="0.12" />
            <circle
              cx={x}
              cy={y}
              r="7"
              fill="#f6f1e8"
              stroke={color}
              strokeWidth="2"
            />
            <circle cx={x} cy={y} r="2.8" fill={color} />
          </g>
        ))}

        {/* Animated packets — three stacked circles per packet position
            (halo 9/16%, mid 5/42%, core 2.4/100%). All share the same
            <animateMotion> path + timing so they trace together. */}
        {!reduce &&
          inView &&
          Array.from({ length: packetCount }).map((_, i) => (
            <g key={i}>
              <circle r="9" fill={packetColor} fillOpacity="0.16">
                <animateMotion
                  dur={`${duration}s`}
                  begin={`${(duration / packetCount) * i}s`}
                  repeatCount="indefinite"
                  path={pathD}
                />
              </circle>
              <circle r="5" fill={packetColor} fillOpacity="0.42">
                <animateMotion
                  dur={`${duration}s`}
                  begin={`${(duration / packetCount) * i}s`}
                  repeatCount="indefinite"
                  path={pathD}
                />
              </circle>
              <circle r="2.4" fill={packetColor}>
                <animateMotion
                  dur={`${duration}s`}
                  begin={`${(duration / packetCount) * i}s`}
                  repeatCount="indefinite"
                  path={pathD}
                />
              </circle>
            </g>
          ))}
      </svg>

      {/* Labels — rendered as real HTML below each waypoint.
          Positioned via left= (x / 1000 × 100)% so they track the SVG
          regardless of container width. Two-line label option via
          multi-element children. */}
      {labels?.map((node, i) => {
        const [x] = points[i] ?? [0];
        const leftPct = (x / 1000) * 100;
        // Tiny x-tweak for the outer labels so they don't clip the edges.
        const edgeShift =
          i === 0 ? "translate(-12%, 0)" :
          i === points.length - 1 ? "translate(-88%, 0)" :
          "translate(-50%, 0)";
        return (
          <div
            key={`label-${i}`}
            className="cin-data-stream-label pointer-events-none absolute font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-ink md:text-[13px]"
            style={{
              left: `${leftPct}%`,
              top: "calc(100% + 14px)",
              transform: edgeShift,
            }}
          >
            {node}
          </div>
        );
      })}
    </div>
  );
}
