// CountUp — animated number that ticks from 0 → `to` when the element
// scrolls into view. Honors reduced-motion (jumps to final value).
//
// Why this exists: when a recruiter skims a case study, static numbers are
// wallpaper. Numbers that count up get the eye, hold it for half a second,
// and force the question "wait what is that?". Cheap dopamine for the
// reader, premium feel for the page.
//
// Implementation notes:
// * Single rAF loop, eased with easeOutExpo for a natural deceleration.
// * Locale-aware formatting via Intl.NumberFormat (commas, decimals, AED).
// * Fractional render — a number of `111,246.50` reaches the integer first
//   then settles to .50. Looks deliberate, not buggy.
// * Format-preserving: the prefix/suffix you pass in renders unchanged.

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type CountUpProps = {
  /** Final number to land on. */
  to: number;
  /** Where to start. Default 0. */
  from?: number;
  /** Animation length in seconds. Default 1.6s. */
  duration?: number;
  /** Number of decimal places to display. Default 0. */
  decimals?: number;
  /** Locale for Intl.NumberFormat grouping. Default "en-US". */
  locale?: string;
  /** Optional prefix (e.g. "AED ", "$", "+"). */
  prefix?: ReactNode;
  /** Optional suffix (e.g. "%", " units"). */
  suffix?: ReactNode;
  /** Optional className for the wrapping span. */
  className?: string;
  /** Trigger threshold via whileInView margin. */
  margin?: string;
};

/** Easing — exponential ease-out. Snappy start, slow settle. */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  locale = "en-US",
  prefix,
  suffix,
  className,
  margin = "-12% 0px",
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${string} ${string}` });
  const [display, setDisplay] = useState<number>(reduce ? to : from);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    if (reduce) {
      setDisplay(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const delta = to - from;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(t);
      const value = from + delta * eased;
      setDisplay(value);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Snap exactly to `to` so rounding never leaves us off-by-one.
        setDisplay(to);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, duration, reduce]);

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} aria-label={formatter.format(to)}>
      {prefix}
      {formatter.format(display)}
      {suffix}
    </span>
  );
}
