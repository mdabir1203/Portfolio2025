// Magnetic — wraps any element. As the cursor approaches, the element
// gently pulls toward it. On leave, it springs back to center.
//
// Desktop only — touch pointers (no hover) are ignored. Honors reduced-
// motion (translate stays at 0; element behaves like a normal CTA).
//
// Why it feels premium: pure CSS hover is binary. Magnetic adds an
// analog responsiveness — the button drifts toward the user rather than
// waiting for them. The same trick award-tier sites use; the difference
// is that here the field is narrow (default 96px) so it doesn't pull
// everything off-target.
//
// Usage:
//   <Magnetic strength={14}>
//     <a href="/connect" className="cta">BOOK A 15-MIN CHAT</a>
//   </Magnetic>
//
// Implementation: ref-based rAF loop that lerps the transform toward
// `target`. Movement capped at `strength`; field is `fieldWidth` from
// the element's center.

import {
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export type MagneticProps = {
  children: ReactNode;
  /** Pull distance in pixels at closest approach. Default 14. */
  strength?: number;
  /** Magnetic field radius in pixels. Default 96. */
  fieldWidth?: number;
  /** Smoothing factor. Lower = snappier. Default 0.2. */
  smoothing?: number;
  className?: string;
};

export function Magnetic({
  children,
  strength = 14,
  fieldWidth = 96,
  smoothing = 0.2,
  className,
}: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const apply = useCallback(() => {
    rafRef.current = null;
    const el = ref.current;
    if (!el) return;
    const cur = currentRef.current;
    const tgt = targetRef.current;
    cur.x += (tgt.x - cur.x) * smoothing;
    cur.y += (tgt.y - cur.y) * smoothing;
    el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
    if (
      Math.abs(tgt.x - cur.x) > 0.15 ||
      Math.abs(tgt.y - cur.y) > 0.15
    ) {
      rafRef.current = requestAnimationFrame(apply);
    }
  }, [smoothing]);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < fieldWidth) {
        const k = 1 - dist / fieldWidth;
        targetRef.current.x = (dx / (dist || 1)) * strength * k;
        targetRef.current.y = (dy / (dist || 1)) * strength * k;
      } else {
        targetRef.current.x = 0;
        targetRef.current.y = 0;
      }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(apply);
      }
    },
    [apply, fieldWidth, reduce, strength]
  );

  const onLeave = useCallback(() => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(apply);
    }
  }, [apply]);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ display: "inline-flex", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
