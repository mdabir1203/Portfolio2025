import { useRef } from "react";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";
import { SectionShell } from "@/components/cinematic/SectionShell";

/**
 * Reel 02 — Manifesto.
 *
 * The whole section is pinned. The text starts at full opacity, then a
 * clip-path mask rolls across as you scroll — a "wipe" that reveals the
 * final statement. Three sentences, three beats.
 */
export function ManifestoScene() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Beat 1: 0.00–0.40 — slower, more time to read
  const beat1Y = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.4], [60, 0, 0, -60]);
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.3, 0.4], [0, 1, 1, 0]);
  const beat1Clip = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Beat 2: 0.40–0.75
  const beat2Y = useTransform(scrollYProgress, [0.4, 0.48, 0.65, 0.75], [60, 0, 0, -60]);
  const beat2Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const beat2Clip = useTransform(scrollYProgress, [0.4, 0.6], [0, 100]);

  // Beat 3: 0.75–1.00
  const beat3Y = useTransform(scrollYProgress, [0.75, 0.82, 0.95, 1], [60, 0, 0, -30]);
  const beat3Opacity = useTransform(scrollYProgress, [0.75, 0.8, 0.95, 1], [0, 1, 1, 0.5]);
  const beat3Clip = useTransform(scrollYProgress, [0.75, 0.92], [0, 100]);

  return (
    <div
      ref={wrapRef}
      id="manifesto"
      className="cin-manifesto relative h-[300vh] w-full"
    >
      <div className="cin-manifesto-pin sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="cin-manifesto-grid absolute inset-0 opacity-30"
            aria-hidden
          />
        </div>

        <div className="cin-manifesto-stage relative mx-auto w-full max-w-5xl px-6">
          <Beat
            y={beat1Y}
            opacity={beat1Opacity}
            clip={beat1Clip}
            number="01."
            text="AI is a tool. The craftsmanship is in how you wire it."
          />
          <Beat
            y={beat2Y}
            opacity={beat2Opacity}
            clip={beat2Clip}
            number="02."
            text="Predictable ROI beats clever demos — every time."
          />
          <Beat
            y={beat3Y}
            opacity={beat3Opacity}
            clip={beat3Clip}
            number="03."
            text="I build systems that protect what you've earned."
            accent
          />
        </div>

        <div className="cin-manifesto-tag absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/45 md:left-10">
          Reel 02 · Manifesto
        </div>
      </div>
    </div>
  );
}

function Beat({
  y,
  opacity,
  clip,
  number,
  text,
  accent,
}: {
  y: any;
  opacity: any;
  clip: any;
  number: string;
  text: string;
  accent?: boolean;
}) {
  const clipPath = useTransform(clip, (v: number) => `inset(0 ${100 - v}% 0 0)`);
  return (
    <motion.div
      className="cin-manifesto-beat absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{ y, opacity }}
    >
      <span className="cin-manifesto-number mb-6 font-mono text-xs uppercase tracking-[0.4em] text-foreground/45">
        {number}
      </span>
      <p
        className={
          "cin-manifesto-text font-display text-3xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl " +
          (accent ? "text-[color:var(--accent-teal)]" : "text-foreground")
        }
        style={{ clipPath: clipPath as unknown as string }}
      >
        {text}
      </p>
    </motion.div>
  );
}
