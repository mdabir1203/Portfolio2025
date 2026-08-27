import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import caseStudyImg from "@/assets/case-study-gcc-abaya.png";
import { SectionShell } from "@/components/cinematic/SectionShell";

/**
 * Reel 04 — AbaYa-Track case study.
 *
 * The image is on the left, full-bleed, slowly zooming in (Ken-Burns).
 * Four metrics on the right count up as you scroll through this section.
 * Each metric has its own scrub range; the counters stop once they
 * pass their target value.
 */
const METRICS = [
  { id: "m1", value: 38, suffix: "%", label: "Production output", prefix: "+", color: "var(--accent-amber)" },
  { id: "m2", value: 30, suffix: "%", label: "Cycle time", prefix: "−", color: "var(--accent-lime)" },
  { id: "m3", value: 92, suffix: "%", label: "On-time delivery", prefix: "", color: "var(--accent-teal)" },
  { id: "m4", value: 0, suffix: "", label: "Extra hires needed", prefix: "", color: "var(--accent-amber)" },
] as const;

export function CaseStudyScene() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  // Ken-Burns on the image
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.12, 1.2]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={wrapRef}
      id="work"
      className="cin-case relative w-full px-6 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-7">
          <SectionShell
            chapter="Reel 04"
            tag="// AbaYa-Track"
            title={
              <>
                The factory,
                <br />
                quantified.
              </>
            }
            intro={
              <>
                End-to-end production visibility across a GCC abaya factory.
                Mobile time-tracking per unit. Real-time bottleneck detection.
                Zero additional headcount.
              </>
            }
          >
            <div className="cin-case-frame relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 md:aspect-[16/11]">
              <motion.img
                src={caseStudyImg}
                alt="AbaYa-Track production dashboard for a GCC abaya factory"
                className="cin-case-img absolute inset-0 h-full w-full object-cover"
                style={{
                  scale: reduce ? undefined : imgScale,
                  y: reduce ? undefined : imgY,
                }}
                loading="lazy"
                decoding="async"
              />
              <div className="cin-case-vignette pointer-events-none absolute inset-0" aria-hidden />
              <div className="cin-case-corners pointer-events-none absolute inset-0" aria-hidden>
                <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-[color:var(--accent-teal)]/60" />
                <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-[color:var(--accent-teal)]/60" />
                <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-[color:var(--accent-teal)]/60" />
                <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[color:var(--accent-teal)]/60" />
              </div>
              <div className="cin-case-label absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-lime)]" />
                Live · GCC · Manufacturing
              </div>
            </div>
          </SectionShell>
        </div>

        <div className="md:col-span-5">
          <div className="cin-case-metrics sticky top-24 flex flex-col gap-5 pt-2 md:pt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              // What the numbers said
            </p>
            {METRICS.map((m, i) => (
              <MetricCounter
                key={m.id}
                metric={m}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCounter({
  metric,
  index,
  scrollYProgress,
}: {
  metric: (typeof METRICS)[number];
  index: number;
  scrollYProgress: any;
}) {
  // Stagger each metric's range across the section.
  const start = 0.15 + index * 0.12;
  const end = start + 0.18;
  const fill = useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = fill.on("change", (v: number) => {
      setDisplay(Math.round(v * metric.value));
    });
    return () => unsub();
  }, [fill, metric.value]);

  return (
    <motion.div
      className="cin-case-metric relative overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--bento)] p-5 md:p-6"
      style={{
        boxShadow: `inset 0 0 0 1px ${metric.color}15`,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="cin-case-metric-bar absolute inset-x-0 bottom-0 h-px origin-left"
        style={{
          background: metric.color,
          transform: `scaleX(${Math.min(1, display / Math.max(1, metric.value))})`,
          transition: "transform 0.2s linear",
        }}
        aria-hidden
      />
      <div className="flex items-end justify-between gap-4">
        <div>
          <div
            className="cin-case-metric-value font-display text-5xl leading-none tracking-tight md:text-6xl"
            style={{ color: metric.color }}
          >
            {metric.prefix}
            {display}
            {metric.suffix}
          </div>
          <div className="cin-case-metric-label mt-2 text-sm text-foreground/70 md:text-base">
            {metric.label}
          </div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
}
