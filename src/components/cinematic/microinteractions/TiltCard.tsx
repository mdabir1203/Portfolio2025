// TiltCard — 3D perspective tilt on hover. Desktop only. Touch skipped.
//
// Tilt is small (max ~7°) so it doesn't disorient. Combined with a soft
// shadow lift, the effect reads as "expensive paper picked up off the
// page", not "spinning rectangle".
//
// Why a small tilt feels premium: 3D parallax is everywhere now. The
// trick that makes this different from the dozens of copy-paste tilt
// components is the easing curve and the **light direction** — the
// highlight isn't just a brightness change; it's a directional sheen
// that matches the tilt angle.

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export type TiltCardProps = {
  children: ReactNode;
  /** Maximum tilt in degrees. Default 6. */
  maxTilt?: number;
  /** Border-radius to mirror on the sheen layer. Default 16. */
  radius?: number;
  /** Background to show through on edge. Default matches paper-2 token. */
  sheenBg?: string;
  className?: string;
};

export function TiltCard({
  children,
  maxTilt = 6,
  radius = 16,
  sheenBg = "#f5f0e7",
  className,
}: TiltCardProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0, sx: 50, sy: 50 });
  const currentRef = useRef({ rx: 0, ry: 0, sx: 50, sy: 50 });

  const apply = useCallback(() => {
    rafRef.current = null;
    const el = rootRef.current;
    if (!el) return;
    const cur = currentRef.current;
    const tgt = targetRef.current;
    cur.rx += (tgt.rx - cur.rx) * 0.18;
    cur.ry += (tgt.ry - cur.ry) * 0.18;
    cur.sx += (tgt.sx - cur.sx) * 0.18;
    cur.sy += (tgt.sy - cur.sy) * 0.18;
    el.style.transform = `perspective(900px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--sheen-x", `${cur.sx.toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${cur.sy.toFixed(1)}%`);
    if (
      Math.abs(tgt.rx - cur.rx) > 0.05 ||
      Math.abs(tgt.ry - cur.ry) > 0.05
    ) {
      rafRef.current = requestAnimationFrame(apply);
    }
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType === "touch") return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Relative position from the card's center, in -1..1.
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      // ry tilts left-right; rx tilts up-down. Invert so the side you
      // hover rises toward you.
      targetRef.current.ry = (px - 0.5) * maxTilt * 2;
      targetRef.current.rx = -(py - 0.5) * maxTilt * 2;
      targetRef.current.sx = px * 100;
      targetRef.current.sy = py * 100;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(apply);
      }
    },
    [apply, maxTilt, reduce]
  );

  const onLeave = useCallback(() => {
    targetRef.current.rx = 0;
    targetRef.current.ry = 0;
    targetRef.current.sx = 50;
    targetRef.current.sy = 50;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(apply);
    }
  }, [apply]);

  const wrapStyle: CSSProperties = {
    position: "relative",
    borderRadius: radius,
    transformStyle: "preserve-3d",
    willChange: "transform",
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={wrapStyle}
    >
      {children}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          pointerEvents: "none",
          background: `radial-gradient(circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,255,255,0.55), transparent 55%)`,
          mixBlendMode: "soft-light",
          opacity: reduce ? 0 : 1,
        }}
      />
    </div>
  );
}
