// DataStream — a thin SVG path connecting N points, with small teal
// "packets" that animate along the path when the component is in view.
// Designed for the "From the floor to the boardroom" 4-layer diagram —
// a literal visualization of the data flow Capture → Map → Model → Deliver.
//
// Why this matters: the case study's narrative is that the dashboard is
// the *output* of a 4-stage pipeline. Until now that story is told with
// words + cards. A visible flow path makes the engineering depth feel
// earned at a glance.
//
// Honors prefers-reduced-motion (static path, no packets). All path math
// runs in an SVG; no measurement/JS-driven layout.

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type DataStreamProps = {
  /** Coordinates [x, y] in pixels (relative to a 1000x100 viewBox). */
  points: Array<[number, number]>;
  /** Stroke color. Default teal. */
  color?: string;
  /** Packet color. Default teal. */
  packetColor?: string;
  /** Number of packets to dispatch at a time. Default 3. */
  packetCount?: number;
  /** Seconds per packet cycle. Default 4.5. */
  duration?: number;
  /** Label slots — drawn at each point. */
  labels?: ReactNode[];
  className?: string;
};

export function DataStream({
  points,
  color = "#0f7569",
  packetColor = "#0f7569",
  packetCount = 3,
  duration = 4.5,
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
    <svg
      ref={ref}
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      className={"block h-12 w-full " + (className ?? "")}
      aria-hidden
    >
      {/* Background dotted path */}
      <path
        d={pathD}
        stroke={color}
        strokeOpacity="0.35"
        strokeWidth="1.4"
        strokeDasharray="2 4"
        fill="none"
      />
      {inView && (
        <path
          d={pathD}
          stroke={color}
          strokeWidth="1.6"
          fill="none"
          strokeDasharray="200 1000"
          strokeDashoffset={1000}
          style={{
            transition: "stroke-dashoffset 1.4s ease-out",
          }}
          ref={(el) => {
            if (el) {
              // Trigger the trace-in animation on mount / re-view.
              requestAnimationFrame(() => {
                el.style.strokeDashoffset = "0";
              });
            }
          }}
        />
      )}
      {/* Packets */}
      {!reduce &&
        inView &&
        Array.from({ length: packetCount }).map((_, i) => (
          <circle key={i} r="2.5" fill={packetColor}>
            <animateMotion
              dur={`${duration}s`}
              begin={`${(duration / packetCount) * i}s`}
              repeatCount="indefinite"
              path={pathD}
              rotate="auto"
            />
          </circle>
        ))}
      {/* Labels at each point (positioned absolutely via foreignObject) */}
      {labels?.map((node, i) => {
        const [x, y] = points[i] ?? [0, 0];
        return (
          <foreignObject
            key={i}
            x={x - 50}
            y={y + 6}
            width="100"
            height="40"
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                textAlign: "center",
                fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular)",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#4a4a4a",
              }}
            >
              {node}
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}
