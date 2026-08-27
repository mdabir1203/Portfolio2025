import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";

/**
 * Reel 03 — Capabilities, vertical swipe-stack.
 *
 * Each card takes a full-screen beat. The card animates in from below
 * with a tactile "swipe" (translateY + scale + opacity), holds while
 * in view, and translates out as the next one takes over. No horizontal
 * track — this is the body language people use on social.
 *
 * On touch, this naturally pairs with the Lenis touch-snap behavior.
 * On desktop, vertical scroll is the primary control.
 */
const CAPABILITIES = [
  {
    n: "01",
    title: "AI Agent Workflows",
    body: "Production agents that route, decide, and self-correct — wired into your stack, not bolted on.",
    color: "teal",
    metric: "12+ agents in production",
  },
  {
    n: "02",
    title: "Process Automation",
    body: "The invisible machinery. From invoicing to inventory. Saves hours. Survives the 3am pager.",
    color: "lime",
    metric: "−40% ops cost (avg)",
  },
  {
    n: "03",
    title: "React + React Native",
    body: "Mobile + web from one brain. Real-world apps used by real people every day.",
    color: "amber",
    metric: "7+ shipped apps",
  },
  {
    n: "04",
    title: "Rust / C / C++",
    body: "When the constraint is performance, not hype. Systems that fit in 1MB and boot in 40ms.",
    color: "teal",
    metric: "< 1MB binaries",
  },
  {
    n: "05",
    title: "Cross-cultural GTM",
    body: "13 countries. Three languages. Two hemispheres. I've shipped in all of them.",
    color: "lime",
    metric: "EN · BN · DE · AR",
  },
] as const;

const accentFor = (c: string) =>
  c === "teal"
    ? "var(--accent-teal)"
    : c === "lime"
      ? "var(--accent-lime)"
      : "var(--accent-amber)";

export function CapabilitiesScene() {
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const tx = translations[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Total section height = 100vh header + 5 × 100vh card beats + 30vh tail
  // = 6.3 × 100vh → round to 630vh so the last card is reachable.

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="cin-cap-section relative w-full"
    >
      {/* Header — first beat (intro screen) */}
      <div className="cin-cap-header relative h-screen w-full">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-end gap-6 px-6 pb-16 md:px-10 md:pb-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <span className="mr-3 inline-block h-px w-10 align-middle bg-foreground/30" />
            // Reel 03 · Capabilities
          </div>
          <h2 className="font-display text-5xl leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
            The five things
            <br />
            <span className="text-[color:var(--accent-teal)]">I do best.</span>
          </h2>
          <p className="max-w-2xl text-base text-foreground/70 md:text-lg">
            {tx.hero.pitch}
          </p>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
            ↓ swipe
          </div>
        </div>
      </div>

      {/* Five card beats — each one a full screen */}
      {CAPABILITIES.map((c, i) => (
        <CapabilityBeat
          key={c.n}
          capability={c}
          index={i}
          total={CAPABILITIES.length}
          scrollYProgress={scrollYProgress}
        />
      ))}

      {/* Tail */}
      <div className="cin-cap-tail relative flex h-[30vh] w-full items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
          ↓ next: the case study
        </div>
      </div>
    </section>
  );
}

/**
 * One full-screen beat per capability. The card's progress is computed
 * from the whole section's scrollYProgress, sliced to its own range.
 */
function CapabilityBeat({
  capability,
  index,
  total,
  scrollYProgress,
}: {
  capability: (typeof CAPABILITIES)[number];
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const reduce = useReducedMotion();
  const color = accentFor(capability.color);

  // Each beat owns a slice of the section's progress.
  // Header is the first 1/6.3 of scroll. Card i is at:
  //   start = 1/6.3 + i*(total/6.3)
  //   end   = start + 1/6.3
  // We make the beat occupy the middle 0.4 of its slice so the
  // in/out animations have time to play.
  const slice = 1 / 6.3;
  const start = slice * (1 + index);
  const mid = start + slice * 0.5;
  const end = start + slice;

  // Card comes in from below, holds, leaves upward.
  const y = useTransform(
    scrollYProgress,
    [start, start + slice * 0.15, mid, end - slice * 0.15, end],
    [120, 0, 0, 0, -120],
  );
  const opacity = useTransform(
    scrollYProgress,
    [start, start + slice * 0.1, mid, end - slice * 0.1, end],
    [0, 1, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [start, start + slice * 0.2, mid, end - slice * 0.2, end],
    [0.96, 1, 1, 1, 0.98],
  );

  // The number scrolls independently — feels like it's racing ahead.
  const numY = useTransform(
    scrollYProgress,
    [start, end],
    [40, -40],
  );

  return (
    <div
      className="cin-cap-beat relative h-screen w-full overflow-hidden"
      data-beat={index}
    >
      <motion.div
        className="cin-cap-card-wrap absolute inset-0 flex items-center justify-center px-6 py-10 md:px-10"
        style={reduce ? undefined : { y, opacity, scale }}
      >
        <article
          className="cin-cap-card relative flex h-full w-full max-w-5xl flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-8 backdrop-blur-xl md:p-12"
          style={{
            background:
              "linear-gradient(180deg, oklch(1 0 0 / 3%), oklch(1 0 0 / 1%))",
            boxShadow: `inset 0 0 0 1px ${color}15, 0 30px 60px -30px oklch(0 0 0 / 0.7)`,
          }}
        >
          {/* Sheen */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              padding: 1,
              background: `linear-gradient(135deg, ${color}40 0%, transparent 50%, ${color}20 100%)`,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {/* Noise */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              mixBlendMode: "overlay",
            }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-xs uppercase tracking-[0.4em]"
                style={{ color }}
              >
                // {capability.n}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 18px ${color}`,
                }}
                aria-hidden
              />
            </div>
            <motion.div
              className="font-display text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight"
              style={{ color, y: reduce ? undefined : numY }}
              aria-hidden
            >
              {capability.n}
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <h3 className="font-display text-4xl leading-tight md:text-6xl lg:text-7xl">
              {capability.title}
            </h3>
            <p className="max-w-2xl text-base text-foreground/70 md:text-xl">
              {capability.body}
            </p>
            <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 md:text-xs">
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ background: color }}
                aria-hidden
              />
              {capability.metric}
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
