/**
 * CaseStudySection — the centerpiece, boardroom edition.
 *
 * The AbaYa-Track Delivery Module case study, rebuilt from the August 2026
 * deck. Clean editorial language: white paper, type-led, the numbers
 * do the talking. Title is the product surface; the "$100K Blind Spot"
 * subtitle is the hook from slide 1 of the deck.
 *
 * 2026-09-23 redesign — "Horizontal Studio Track + Scroll Motion":
 *   The 4-stage architecture reads as a horizontal scroll-snap track on
 *   desktop (one stage per viewport), and a clean vertical stack on mobile.
 *   Each stage panel staggers its text elements in as it enters the
 *   horizontal viewport — eyebrow → layer → title → body, blur→focus
 *   pull. The thinking process unfolds as you scroll, step by step.
 *
 *   Design language: clean serif + italic, generous whitespace, sticky
 *   progress rail on the right, keyboard nav (←/→), no decorations that
 *   break readability or coherence with the sections below.
 *
 *   Below the track: the same Blind Spot, Value Engine, Iceberg,
 *   VIP Lever, ROI, closing line and CTA — unchanged.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CountUp } from "./microinteractions/CountUp";
import { Magnetic } from "./microinteractions/Magnetic";
import { PulseDot } from "./microinteractions/PulseDot";
import { Reveal } from "./microinteractions/Reveal";
import { TerminalCard } from "./microinteractions/TerminalCard";
import { TiltCard } from "./microinteractions/TiltCard";

const PIPELINE = [
  { stage: "Completed", units: 934, value: 264580, pct: 70.5, color: "var(--accent-lime)" },
  { stage: "Confirmed", units: 189, value: 55119, pct: 49.5, color: "var(--accent-amber)" },
  { stage: "Queued", units: 143, value: 40523, pct: 36.4, color: "var(--accent-rose)" },
  { stage: "Processing", units: 53, value: 15604, pct: 14.0, color: "var(--accent-teal)" },
] as const;

/**
 * The system we built — the 4-stage architecture as an editorial column.
 * Each stage gets: eyebrow, italic title, body prose. Between stages, a
 * ThinkingBridge animates the cognitive handoff. Below the column, the
 * same numbers/ROI/VIP sections as before.
 */
const SYSTEM = [
  {
    n: "01",
    layer: "Capture",
    title: "Floor → Event stream",
    icon: "aperture" as const,
    bridge: "venn" as const,
    scribble: "(2 days on this tuple)",
    /** Plain text for horizontal track — no JSX decorations. */
    bodyPlain: "Every station on the floor emits a QR-scan event — cutting table, embroidery queue, QC station, dispatch. The event is a tuple: (employee_id, station_id, order_id, sku, timestamp).",
    body: (
      <>
        Every station on the floor emits a{" "}
        <WavyUnderline>QR-scan event</WavyUnderline>. Cutting table,
        embroidery queue, QC station, dispatch. The event is a tuple:{" "}
        <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-[color:var(--accent-teal)]">
          (employee_id, station_id, order_id, sku, timestamp)
        </code>
        .
      </>
    ),
  },
  {
    n: "02",
    layer: "Map",
    title: "Employee ↔ Order ↔ Value",
    icon: "nodes" as const,
    bridge: "formula" as const,
    scribble: "(5 vars, 5 weights, 1 truth)",
    bodyPlain: "Each order is joined to its invoice price, SKU history, tier (VIP / Standard), and time-on-floor. Each employee gets a live production map: orders touched, time on each, current bottleneck. The join is not a SQL JOIN — it's the join that decides what the manager will see.",
    body: (
      <>
        Each order is joined to its invoice price, SKU history, tier (VIP /
        Standard), and time-on-floor. Each employee gets a live production
        map: orders touched, time on each, current bottleneck. The join is
        not a SQL JOIN{" "}
        <span className="font-display text-[1.2em] leading-none text-[color:var(--accent-teal)]">
          ↔
        </span>{" "}
        — it's the join that decides what the manager will see.
      </>
    ),
  },
  {
    n: "03",
    layer: "Model",
    title: "Value engine",
    icon: "gear" as const,
    bridge: "barchart" as const,
    scribble: "(this took 4 evenings)",
    bodyPlain: "Five variables — price, SKU history, status, tier, aging — collapse into one weighted AED number per order. Same formula runs offline in the factory SQL.js cache and online in the Cloudflare Worker: 0.40·p + 0.20·s + 0.15·st + 0.15·t + 0.10·a",
    body: (
      <>
        Five variables — price, SKU history, status, tier, aging — collapse
        into one weighted AED number per order. Same formula runs offline
        in the factory SQL.js cache and online in the Cloudflare Worker:{" "}
        <code className="block mt-2 rounded-lg border border-rule bg-paper-2 px-3 py-2 font-mono text-[0.78em] leading-relaxed text-ink md:inline md:whitespace-nowrap">
          0.40·p + 0.20·s + 0.15·st + 0.15·t + 0.10·a
        </code>
      </>
    ),
  },
  {
    n: "04",
    layer: "Deliver",
    title: "The Delivery Module",
    icon: "plane" as const,
    bridge: null,
    scribble: "(the close)",
    bodyPlain: "The boardroom view. The bottleneck you saw is the Confirmed → Processing handoff: 189 orders, AED 55,119, approved-but-not-started. The dashboard points the floor manager at the right orders in the right order.",
    body: (
      <>
        The boardroom view. The bottleneck you saw is the Confirmed →
        Processing handoff: 189 orders, AED 55,119,{" "}
        <HighlightTape>approved-but-not-started</HighlightTape>. The
        dashboard points the floor manager at the right orders in the
        right order.
      </>
    ),
  },
] as const;

const VARIABLES = [
  {
    k: "01",
    title: "Order price",
    body: "Invoice value at the line item.",
    terminal: '{ weight: 0.40, source: "invoice.aed" }',
  },
  {
    k: "02",
    title: "SKU history",
    body: "Median revenue per model.",
    terminal: '{ weight: 0.20, source: "sku.median_30d" }',
  },
  {
    k: "03",
    title: "Status",
    body: "Stage in the production flow.",
    terminal: '{ weight: 0.15, source: "stage.bucket" }',
  },
  {
    k: "04",
    title: "Tier",
    body: "VIP vs Standard weighting.",
    terminal: '{ weight: 0.15, source: "tier.vip_2.3x" }',
  },
  {
    k: "05",
    title: "Aging",
    body: "Time decay on the order.",
    terminal: '{ weight: 0.10, source: "age.hours * 1.04" }',
  },
] as const;

const SCENARIOS = [
  { recovery: 20, value: 22249, contribution: 7787, roi: -22, recommended: false },
  { recovery: 50, value: 55623, contribution: 19468, roi: 95, recommended: true },
  { recovery: 80, value: 88997, contribution: 31149, roi: 211, recommended: false },
] as const;

/* ─────────────────────────── INLINE EMPH ────────────────────────────── */

/** Wavy underline — hand-drawn marker stroke. */
function WavyUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 z-0 h-[6px] w-full text-[color:var(--accent-teal)]"
        viewBox="0 0 120 6"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 3 C 8 0, 16 6, 24 3 S 40 0, 48 3 S 64 6, 72 3 S 88 0, 96 3 S 112 6, 120 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

/** Highlight tape — translucent teal strip rotated for imperfect marker feel. */
function HighlightTape({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative inline-block px-1.5 py-0.5"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklch, var(--accent-teal) 22%, transparent) 0%, color-mix(in oklch, var(--accent-teal) 30%, transparent) 100%)",
        transform: "rotate(-1.2deg)",
      }}
    >
      <span className="relative z-10">{children}</span>
    </span>
  );
}

/* ─────────────────────────── STAGE ICONS ───────────────────────────── */

/** Hand-drawn SVG glyph that sits next to each stage label. */
function StageIcon({
  name,
  inView,
}: {
  name: "aperture" | "nodes" | "gear" | "plane";
  inView: boolean;
}) {
  const baseStyle = "h-4 w-4 shrink-0 text-ink-muted";
  if (name === "aperture") {
    return (
      <svg viewBox="0 0 16 16" className={baseStyle} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M 8 2.5 L 8 13.5 M 3.4 4.8 L 12.6 11.2 M 3.4 11.2 L 12.6 4.8" />
      </svg>
    );
  }
  if (name === "nodes") {
    return (
      <svg viewBox="0 0 16 16" className={baseStyle} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="3" cy="3.5" r="1.6" />
        <circle cx="13" cy="3.5" r="1.6" />
        <circle cx="8" cy="12" r="1.6" />
        <path d="M 4.3 4.5 L 7 10.6 M 11.7 4.5 L 9 10.6 M 4.6 3.5 L 11.4 3.5" strokeDasharray="1.5 2" />
      </svg>
    );
  }
  if (name === "gear") {
    return (
      <svg viewBox="0 0 16 16" className={baseStyle} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M 8 1.5 L 8 4 M 8 12 L 8 14.5 M 1.5 8 L 4 8 M 12 8 L 14.5 8 M 3.4 3.4 L 5.2 5.2 M 10.8 10.8 L 12.6 12.6 M 3.4 12.6 L 5.2 10.8 M 10.8 5.2 L 12.6 3.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={baseStyle} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 2.5 13.5 L 12 4 L 9.5 1.5 L 0 11 L 1 14 Z" />
      <path d="M 10.2 3.2 L 12.8 5.8" />
      <path d="M 4 9 L 7 12" />
    </svg>
  );
}

/* ─────────────────── KINEMATIC TITLE ─────────────────────────── */

/**
 * KinematicTitle — per-word kinetic typography reveal.
 * Each word of the title enters with blur→focus pull, staggered 130ms apart,
 * triggered when `active` flips true (panel scrolled into view).
 *
 * The effect: the thinking process of "reading the stage title" is itself
 * animated — the words don't just appear, they arrive.
 *
 * Based on the diagonal kinetic opener from FirstVisitSplash.tsx.
 */
function KinematicTitle({
  title,
  active,
  reduce,
}: {
  title: string;
  active: boolean;
  reduce: boolean;
}) {
  const words = title.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.28em] inline-block"
          initial={
            reduce
              ? { opacity: 1 }
              : { opacity: 0, filter: "blur(6px)", x: -16, y: 8 }
          }
          animate={
            active
              ? reduce
                ? { opacity: 1, filter: "blur(0px)", x: 0, y: 0 }
                : {
                    opacity: 1,
                    filter: "blur(0px)",
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.75,
                      delay: i * 0.13,
                      ease: [0.16, 0.84, 0.24, 1],
                    },
                  }
              : reduce
              ? { opacity: 1 }
              : { opacity: 0, filter: "blur(6px)", x: -16, y: 8 }
          }
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

/* ──────────────────────── THINKING BRIDGES ──────────────────────────── */

/**
 * ThinkingBridge — animated cognitive handoff between stages.
 * Each kind is a hand-drawn SVG artifact paired with prose.
 * Elements stagger in with blur→focus pull as the bridge enters view.
 * The thinking process IS animated here — not just shown.
 */
function ThinkingBridge({ kind }: { kind: "venn" | "formula" | "barchart" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const bridgeVariants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 20, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (kind === "venn") {
    return (
      <div ref={ref} className="relative my-10 md:my-14">
        {/* Bridge label row */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={bridgeVariants}
          className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1"
        >
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
            style={{ transform: "rotate(-0.4deg)" }}
          >
            ↓&nbsp; next: MAP
          </div>
          <div
            className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-teal)] md:block"
            style={{ transform: "rotate(-2deg)" }}
          >
            ✱ the join
          </div>
        </motion.div>

        {/* Content row */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
          <motion.svg
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }}
            viewBox="0 0 180 110"
            className="h-28 w-full max-w-[220px] shrink-0 md:h-[120px] md:w-[200px]"
            fill="none"
            stroke="currentColor"
          >
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
              <path d="M 38 18 C 22 22, 18 50, 28 70 C 36 88, 64 92, 80 80 C 96 68, 96 36, 84 22 C 70 8, 52 8, 38 18 Z" className="text-[color:var(--accent-teal)]" />
              <path d="M 80 22 C 64 22, 56 42, 60 64 C 64 86, 88 96, 108 86 C 124 78, 130 50, 118 30 C 108 12, 92 14, 80 22 Z" className="text-[color:var(--accent-amber)]" />
              <path d="M 60 70 C 48 78, 50 96, 68 102 C 86 108, 110 100, 116 86 C 122 72, 112 56, 96 54 C 80 52, 68 60, 60 70 Z" className="text-[color:var(--accent-rose)]" />
            </g>
            <g fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" letterSpacing="0.18em" className="fill-ink">
              <text x="32" y="44">EMP</text>
              <text x="92" y="38">ORDER</text>
              <text x="78" y="100">VALUE</text>
            </g>
            <g fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="7" letterSpacing="0.18em" className="fill-[color:var(--accent-teal)]">
              <text x="60" y="60">↹</text>
            </g>
          </motion.svg>

          <motion.p
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] } } }}
            className="max-w-md font-display text-base leading-[1.65] text-ink-muted md:text-lg"
          >
            The moment{" "}
            <span className="text-ink line-through decoration-[color:var(--accent-rose)] decoration-2">
              SQL joins
            </span>{" "}
            stopped being enough. We need the join to carry weight — not
            just rows.
          </motion.p>
        </div>

        {/* Margin scribble */}
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
          style={{ transform: "rotate(-0.4deg)" }}
        >
          (2 days on this tuple)
        </motion.div>
      </div>
    );
  }

  if (kind === "formula") {
    return (
      <div ref={ref} className="relative my-10 md:my-14">
        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={bridgeVariants}
          className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1"
        >
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
            style={{ transform: "rotate(0.6deg)" }}
          >
            ↓&nbsp; next: MODEL
          </div>
          <div
            className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-teal)] md:block"
            style={{ transform: "rotate(1.2deg)" }}
          >
            ✱ the weights
          </div>
        </motion.div>

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
          <motion.svg
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }}
            viewBox="0 0 220 110"
            className="h-28 w-full max-w-[260px] shrink-0 md:h-[110px] md:w-[240px]"
            fill="none"
            stroke="currentColor"
          >
            <g fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="13" className="fill-ink">
              <text x="14" y="22" className="fill-ink-muted" textDecoration="line-through">
                0.50·p + 0.50·s
              </text>
              <path d="M 12 17 L 122 27" stroke="currentColor" strokeWidth="1.2" className="text-[color:var(--accent-rose)]" />
              <text x="14" y="48" className="fill-ink">0.40·p + 0.20·s</text>
              <text x="14" y="68" className="fill-ink">+ 0.15·st + 0.15·t</text>
              <text x="14" y="88" className="fill-ink">+ 0.10·a</text>
              <text x="148" y="78" className="fill-[color:var(--accent-teal)]" fontSize="18">=</text>
              <path d="M 170 68 L 178 78 L 196 56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="text-[color:var(--accent-teal)]" />
              <text x="166" y="98" fontSize="9" letterSpacing="0.22em" className="fill-[color:var(--accent-teal)]">WORKS</text>
            </g>
          </motion.svg>

          <motion.p
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] } } }}
            className="max-w-md font-display text-base leading-[1.65] text-ink-muted md:text-lg"
          >
            First try was a 50/50 split. Tier collapsed. Status vanished.
            The five variables need five weights, and they need to{" "}
            <span className="text-ink">
              add up to a number the floor manager would believe
            </span>
            .
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
          style={{ transform: "rotate(0.6deg)" }}
        >
          (4 evenings, 11 spreadsheets)
        </motion.div>
      </div>
    );
  }

  // barchart
  return (
    <div ref={ref} className="relative my-10 md:my-14">
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={bridgeVariants}
        className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1"
      >
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
          style={{ transform: "rotate(-0.2deg)" }}
        >
          ↓&nbsp; next: DELIVER
        </div>
        <div
          className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-teal)] md:block"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          ✱ where the AED sits
        </div>
      </motion.div>

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
        <motion.svg
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }}
          viewBox="0 0 200 110"
          className="h-28 w-full max-w-[240px] shrink-0 md:h-[110px] md:w-[220px]"
          fill="none"
          stroke="currentColor"
        >
          <path d="M 12 14 L 12 96 L 188 96" stroke="currentColor" strokeWidth="1.2" className="text-ink-muted" strokeLinecap="round" />
          <path d="M 28 30 L 28 96 L 56 96 L 56 34 Z" className="fill-[color:var(--accent-lime)]/70 stroke-[color:var(--accent-lime)]" strokeWidth="1.2" />
          <path d="M 72 56 L 72 96 L 100 96 L 100 60 Z" className="fill-[color:var(--accent-amber)]/70 stroke-[color:var(--accent-amber)]" strokeWidth="1.2" />
          <path d="M 116 68 L 116 96 L 144 96 L 144 70 Z" className="fill-[color:var(--accent-rose)]/70 stroke-[color:var(--accent-rose)]" strokeWidth="1.2" />
          <path d="M 160 80 L 160 96 L 188 96 L 188 82 Z" className="fill-[color:var(--accent-teal)]/70 stroke-[color:var(--accent-teal)]" strokeWidth="1.2" />
          <path d="M 76 40 C 78 50, 84 56, 86 60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[color:var(--accent-amber)]" fill="none" />
          <path d="M 82 56 L 86 60 L 90 56" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--accent-amber)]" fill="none" />
          <text x="48" y="26" fontSize="9" letterSpacing="0.18em" className="fill-[color:var(--accent-amber)]" fontFamily="ui-monospace, SFMono-Regular, monospace">
            ← 49.5% HERE
          </text>
        </motion.svg>

        <motion.p
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] } } }}
          className="max-w-md font-display text-base leading-[1.65] text-ink-muted md:text-lg"
        >
          Confirmed is where the money is sitting, doing nothing. The model
          makes the bottleneck visible — the dashboard makes it actionable.
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={{ ...bridgeVariants, show: { ...bridgeVariants.show, transition: { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
        className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint"
        style={{ transform: "rotate(-0.2deg)" }}
      >
        (49.5% of trapped value)
      </motion.div>
    </div>
  );
}

/* ──────────────────── FINAL FIGURE (climax) ─────────────────────────── */

/** FinalFigure — animated climax with hand-drawn box, verified stamp, ROI scribbles. */
function FinalFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduce = useReducedMotion();

  const figVariants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 24, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div
      ref={ref}
      className="relative mt-20 md:mt-28"
      style={{ transform: "rotate(-0.5deg)" }}
    >
      {/* Hand-drawn rectangle */}
      <div className="relative mx-2 md:mx-10">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full text-[color:var(--accent-teal)]/70"
          viewBox="0 0 600 200"
          fill="none"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            d="M 14 16 C 120 8, 280 12, 440 10 C 540 8, 588 14, 588 36 C 592 80, 588 132, 586 172 C 586 188, 540 192, 460 190 C 300 188, 140 192, 30 188 C 12 186, 10 160, 12 120 C 14 80, 10 40, 14 16 Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.4 } : {}}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            d="M 18 22 C 124 14, 286 18, 446 16 C 544 14, 584 22, 582 40 C 588 84, 582 134, 580 168"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <motion.div
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={figVariants}
          className="relative px-6 py-10 md:px-12 md:py-14"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            // the final figure
          </div>
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={inView ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-display text-5xl italic leading-[0.95] text-[color:var(--accent-teal)] md:text-8xl"
          >
            <CountUp to={111246} duration={1.8} decimals={0} prefix="AED " />
          </motion.div>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
            <span>recovered in 30 days</span>
            <span aria-hidden>·</span>
            <span>zero additional hires</span>
          </div>
        </motion.div>
      </div>

      {/* Verified circular stamp — rubber-stamp feel, animated rotation + scale */}
      <motion.div
        initial={{ opacity: 0, rotate: -18, scale: 0.7 }}
        animate={
          inView
            ? { opacity: 1, rotate: -12, scale: 1 }
            : {}
        }
        transition={{ duration: 0.6, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mx-2 mt-6 flex flex-wrap items-center gap-6 md:mx-10 md:mt-8"
      >
        <svg viewBox="0 0 120 120" className="h-24 w-24 text-[color:var(--accent-teal)] md:h-28 md:w-28" fill="none">
          <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2.5" opacity="0.7" />
          <text x="60" y="42" textAnchor="middle" fontSize="9" letterSpacing="0.3em" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="700" className="fill-[color:var(--accent-teal)]">
            VERIFIED
          </text>
          <path
            d="M 38 64 L 54 80 L 84 48"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text x="60" y="98" textAnchor="middle" fontSize="7.5" letterSpacing="0.28em" fontFamily="ui-monospace, SFMono-Regular, monospace" className="fill-[color:var(--accent-teal)]">
            09.18.2026
          </text>
        </svg>

        {/* ROI scribbled three times, one circled */}
        <div className="flex flex-col gap-2 font-mono text-base text-ink-muted">
          {["≈ 11.1× ROI", "≈ 11.1× ROI", "≈ 11.1× ROI"].map((text, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: i === 1 ? 1 : 0.4, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={i === 1 ? "relative inline-block text-ink" : "inline-block"}
              style={i === 1 ? { transform: "rotate(-1deg)" } : {}}
              aria-label={text}
            >
              {i === 1 && (
                <svg
                  aria-hidden
                  className="pointer-events-none absolute -left-1 -top-1 h-[calc(100%+8px)] w-[calc(100%+8px)]"
                  viewBox="0 0 80 24"
                  fill="none"
                >
                  <ellipse
                    cx="40"
                    cy="12"
                    rx="38"
                    ry="10"
                    stroke="var(--accent-teal)"
                    strokeWidth="1.5"
                    strokeDasharray="0"
                    opacity="0.7"
                  />
                </svg>
              )}
              {text}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────── HORIZONTAL STUDIO TRACK ─────────────────────── */

/**
 * HorizontalStudioTrack — the 4-stage architecture presented as a
 * horizontal scroll-snap track on desktop (one stage per viewport),
 * and a clean vertical stack on mobile.
 *
 * Motion layer: each stage panel watches the horizontal scroll container
 * via IntersectionObserver. When a panel becomes the primary focus
 * (highest intersectionRatio), its text elements stagger in:
 *   eyebrow (delay 0) → layer (0.1s) → title (0.2s) → body (0.35s)
 * Each element uses blur→focus pull so the thinking process
 * feels like it's being written as you scroll.
 *
 * Keyboard: ←/→ arrow keys move between panels.
 * prefers-reduced-motion: instant opacity fallback.
 */
function HorizontalStudioTrack() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which panel is most visible in the horizontal scroll container.
  // Each panel fires its own IntersectionObserver via a ref map.
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [panelVisible, setPanelVisible] = useState<(boolean | null)[]>(
    SYSTEM.map(() => null)
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const observers: IntersectionObserver[] = [];

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            setPanelVisible((prev) => {
              const next = [...prev];
              next[i] = e.isIntersecting;
              return next;
            });
          }
        },
        { root: el, threshold: [0.4, 0.7] }
      );
      obs.observe(panel);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Derive which stage is "primary" — the one with the highest ratio in view.
  useEffect(() => {
    const dominated = panelVisible.every((v) => v === false || v === null);
    if (dominated) return;
    // Find the panel with the highest true value index.
    let best = 0;
    for (let i = 1; i < panelVisible.length; i++) {
      if (panelVisible[i] === true && panelVisible[best] !== true) {
        best = i;
      } else if (
        panelVisible[i] === true &&
        panelVisible[best] === true &&
        i > best
      ) {
        best = i;
      }
    }
    setActiveIdx(best);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelVisible]);

  // Keyboard nav: ←/→ scrolls between panels when the track has focus.
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const panelWidth = el.clientWidth;
    if (e.key === "ArrowRight") {
      el.scrollBy({
        left: panelWidth,
        behavior: reduce ? "auto" : "smooth",
      });
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({
        left: -panelWidth,
        behavior: reduce ? "auto" : "smooth",
      });
      e.preventDefault();
    }
  };

  // Per-element stagger variants for blur→focus pull.
  const itemVariants = (delay: number) => ({
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 14, filter: "blur(5px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
    },
  });

  return (
    <div className="relative mt-10 md:mt-16">
      {/* Section eyebrow + heading — kept above the track for context. */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-12">
        <div>
          <ChapterEyebrow n="// 01" label="The System We Built" />
          <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
            From the floor to the
            <br />
            <em>boardroom.</em>
          </h3>
        </div>
        <div className="cin-section-eyebrow text-right">
          <div>4 stages · 1 source of truth</div>
        </div>
      </div>

      {/* Desktop: horizontal scroll-snap track — full viewport, no visible scrollbar.
          Each panel is exactly 100vw so snap-aligns to the screen edge. */}
      <div
        ref={trackRef}
        role="region"
        aria-label="AbaYa-Track four-stage architecture"
        tabIndex={0}
        onKeyDown={handleKey}
        className="hidden snap-x snap-mandatory overflow-x-auto md:flex md:gap-0 md:snap-mandatory [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-track]:hidden [&_::-webkit-scrollbar-thumb]:hidden [scrollbar-width:none]"
        style={{ scrollbarWidth: "none" }}
      >
        {SYSTEM.map((s, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={s.n}
              ref={(el) => {
                panelRefs.current[idx] = el;
              }}
              data-stage-panel={s.n}
              className="flex w-[100vw] shrink-0 snap-center items-center px-8 md:px-12 lg:px-16"
            >
              <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-[180px_1fr] md:gap-16">
                {/* Stage number — staggered with delay 0 */}
                <div className="md:pt-2">
                  <motion.div
                    initial="hidden"
                    animate={isActive ? "show" : "hidden"}
                    variants={itemVariants(0)}
                    className="font-mono text-[11px] tracking-[0.3em] text-ink-faint"
                  >
                    {s.n}
                  </motion.div>
                  {/* Layer label — staggered with delay 0.1 */}
                  <motion.div
                    initial="hidden"
                    animate={isActive ? "show" : "hidden"}
                    variants={itemVariants(0.1)}
                    className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-accent-teal"
                  >
                    {s.layer}
                  </motion.div>
                </div>

                {/* Stage content */}
                <div>
                  {/* Title — kinetic per-word reveal with blur→focus pull.
                      Stagger is handled inside KinematicTitle (0, 0.13, 0.26…s per word),
                      triggered when the panel becomes active. */}
                  <h4
                    id={`stage-heading-${s.n}`}
                    className="font-display text-3xl italic leading-[1.05] text-ink md:text-5xl lg:text-6xl"
                  >
                    <KinematicTitle title={s.title} active={isActive} reduce={reduce} />
                  </h4>
                  {/* Body — staggered with delay 0.35 */}
                  <motion.p
                    initial="hidden"
                    animate={isActive ? "show" : "hidden"}
                    variants={itemVariants(0.35)}
                    className="mt-6 max-w-2xl font-display text-base leading-[1.7] text-ink-muted md:text-xl"
                  >
                    {s.bodyPlain}
                  </motion.p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky progress rail — visible only on desktop, shows current stage. */}
      <div
        aria-hidden
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-8"
      >
        {SYSTEM.map((s) => {
          const isActive = s.n === String(activeIdx + 1).padStart(2, "0");
          return (
            <div
              key={s.n}
              className="flex items-center gap-3 transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : 0.45 }}
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-ink-faint">
                {s.n}
              </span>
              <span
                className="block h-px w-10 transition-colors duration-300 lg:w-14"
                style={{
                  background: isActive
                    ? "var(--accent-teal)"
                    : "var(--rule-strong)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll-snap track — left-to-right swipe engagement,
          one stage per swipe. Shows native scrollbar so users know they
          can swipe through stages. */}
      <div
        className="snap-x snap-mandatory overflow-x-auto md:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {SYSTEM.map((s, idx) => (
          <div
            key={s.n}
            className="flex w-[100vw] shrink-0 snap-center snap-always items-center px-6 py-4"
          >
            <article aria-labelledby={`stage-heading-mobile-${s.n}`}>
              <div className="font-mono text-[11px] tracking-[0.3em] text-ink-faint">
                {s.n}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-teal">
                {s.layer}
              </div>
              <h4
                id={`stage-heading-mobile-${s.n}`}
                className="mt-4 font-display text-2xl italic leading-[1.1] text-ink"
              >
                {s.title}
              </h4>
              <p className="mt-3 font-display text-base leading-[1.65] text-ink-muted">
                {s.bodyPlain}
              </p>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── STAGE PANEL ─────────────────────────────────── */

/** One stage in the editorial column — eyebrow, italic title, body prose. */
function StagePanel({
  n,
  layer,
  title,
  body,
  icon,
  scribble,
  index,
}: {
  n: string;
  layer: string;
  title: string;
  body: React.ReactNode;
  icon: "aperture" | "nodes" | "gear" | "plane";
  scribble: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduce = useReducedMotion();

  // Alternate slight rotation for irregular editorial feel
  const tiltDeg = index % 2 === 0 ? -0.3 : 0.4;

  const itemVariants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 16, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div ref={ref} style={{ transform: `rotate(${tiltDeg}deg)` }}>
      <div className="grid grid-cols-[48px_1fr] gap-x-4 md:grid-cols-[64px_1fr] md:gap-x-6">
        {/* Left margin rail — stage icon + number */}
        <div className="flex flex-col items-center pt-2">
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0, duration: 0.6 }}
          >
            <StageIcon name={icon} inView={inView} />
          </motion.div>
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="mt-3 font-mono text-[11px] tracking-[0.3em] text-ink-faint"
          >
            {n}
          </motion.div>
        </div>

        {/* Stage content */}
        <div>
          {/* Layer label */}
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0.08, duration: 0.6 }}
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent-teal)]"
          >
            {layer}
          </motion.div>

          {/* Title */}
          <motion.h4
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-display text-2xl italic leading-[1.1] text-ink md:text-3xl lg:text-4xl"
          >
            {title}
          </motion.h4>

          {/* Body */}
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-4 max-w-2xl font-display text-base leading-[1.7] text-ink-muted md:text-xl"
          >
            {body}
          </motion.div>

          {/* Margin scribble */}
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={itemVariants}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint"
          >
            {scribble}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── SECTION ROOT ──────────────────────────── */

/** Shared eyebrow atom — chapter number + sonar dot + label. */
function ChapterEyebrow({
  n,
  label,
  showDot = true,
}: {
  n: string;
  label: string;
  showDot?: boolean;
}) {
  return (
    <div className="cin-section-eyebrow flex items-center gap-2">
      {showDot && <PulseDot size={9} />}
      <span className="font-mono text-[10px] tracking-[0.3em] text-ink-faint">
        {n}
      </span>
      <span className="opacity-50">·</span>
      <span>{label}</span>
    </div>
  );
}

export function CaseStudySection() {
  return (
    <section id="case-study" className="cin-work border-t border-rule py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Header */}
        <Reveal
          as="header"
          stagger={0.1}
          className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-16"
        >
          <div>
            <ChapterEyebrow
              n="// Case Study · AbaYa-Track"
              label="The Delivery Module"
            />
            <h2 className="cin-section-title mt-3 text-4xl md:text-7xl">
              The Delivery
              <br />
              <em>Module.</em>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink md:text-xl">
              The <strong className="text-ink">AbaYa-Track Delivery Module</strong>{" "}
              is a value-weighted production dashboard I built for{" "}
              <strong className="text-ink">Famous Abaya LLC</strong> in Dubai,
              UAE. It surfaced <strong className="text-ink">AED 111,246</strong> of
              trapped manufacturing backlog in 30 days at an{" "}
              <strong className="text-ink">11.1:1 value-to-cost ratio</strong>,
              lifted production output 38%, moved on-time delivery from 65% to
              92% — and did it with zero additional hires.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-faint md:text-base">
              What shipped is not a chart. It's a four-layer system: floor
              events → employee/order map → value engine → delivery module.
              Each layer is a different engineering decision.
            </p>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>The $100K Blind Spot</div>
            <div className="mt-1">Boardroom Edition · Aug 2026</div>
          </div>
        </Reveal>

        {/* The 4-stage architecture — horizontal studio track (desktop)
            or vertical stack (mobile). Each panel's text staggers in
            on scroll (blur→focus pull) so the thinking process
            unfolds step by step. */}
        <HorizontalStudioTrack />

        {/* The blind spot — the headline stat */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:mt-28 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal
              as="div"
              stagger={0.1}
              className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8"
            >
              <ChapterEyebrow
                n="// The Old View"
                label="unit-count, value-invisible"
              />
              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-display text-7xl leading-none tracking-tight md:text-9xl">
                  <CountUp to={385} duration={1.4} />
                </span>
                <span className="font-mono text-sm uppercase tracking-[0.18em] text-ink-muted">
                  units pending
                </span>
              </div>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted md:text-base">
                Every unit looks the same in the unit-count view. An AED 150
                abaya and an AED 850 abaya both count as 1. The value is
                invisible.
              </p>
              <div className="mt-6 border-t border-rule pt-6">
                <ChapterEyebrow
                  n="// The New View"
                  label="value-weighted by SKU + tier"
                />
                <div className="mt-3 font-display text-4xl leading-tight tracking-tight text-accent-teal md:text-6xl">
                  AED <CountUp to={111246} duration={1.8} decimals={0} />
                </div>
                <p className="mt-3 text-sm text-ink-muted md:text-base">
                  True backlog value, weighted by SKU and tier. 49.5% of it
                  sits in the Confirmed stage — approved but never started.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <div className="grid h-full grid-cols-1 gap-4">
              <Reveal
                as="div"
                stagger={0.08}
                className="rounded-2xl border border-rule bg-paper-2 p-5"
              >
                <ChapterEyebrow n="// Pipeline" label="" showDot />
                <div className="mt-3 font-display text-4xl leading-none">
                  <CountUp to={1319} duration={1.6} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  units
                </div>
              </Reveal>
              <Reveal
                as="div"
                stagger={0.08}
                className="rounded-2xl border border-rule bg-paper-2 p-5"
              >
                <ChapterEyebrow n="// Pipeline value" label="" showDot />
                <div className="mt-3 font-display text-4xl leading-none text-ink">
                  AED <CountUp to={376625} duration={2.0} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  total weighted
                </div>
              </Reveal>
              <Reveal
                as="div"
                stagger={0.08}
                className="rounded-2xl border border-rule bg-paper-2 p-5"
              >
                <ChapterEyebrow n="// Avg unit value" label="" showDot />
                <div className="mt-3 font-display text-4xl leading-none">
                  AED <CountUp to={285} duration={1.4} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  hides wide variance
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* The 5 variables */}
        <div className="mt-20 md:mt-28">
          <Reveal
            as="div"
            stagger={0.08}
            className="mb-8 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <ChapterEyebrow n="// 02" label="The Value Engine" />
              <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                Five variables,
                <br />
                <em>one truth.</em>
              </h3>
            </div>
            <div className="cin-section-eyebrow text-right">
              <div>70% known · 20% predictable · 10% unknown</div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3">
            {VARIABLES.map((v) => (
              <TerminalCard
                key={v.k}
                corner={v.k}
                title={v.title}
                description={v.body}
                terminal={v.terminal}
              />
            ))}
          </div>
        </div>

        {/* The iceberg — pipeline visualization */}
        <div className="mt-20 md:mt-28">
          <Reveal
            as="div"
            stagger={0.08}
            className="mb-8 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <ChapterEyebrow n="// The Iceberg" label="Backlog by stage" />
              <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                Where the <em>AED 111K</em> sits.
              </h3>
            </div>
            <div className="cin-section-eyebrow text-right">
              <div>Backlog by stage</div>
            </div>
          </Reveal>

          <Reveal
            as="div"
            stagger={0.06}
            className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8"
          >
            <div className="space-y-4">
              {PIPELINE.map((row) => (
                <div
                  key={row.stage}
                  className="grid grid-cols-[110px_1fr_120px] items-center gap-4 md:grid-cols-[140px_1fr_140px]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    {row.stage}
                  </div>
                  <div className="relative h-7 overflow-hidden rounded-full bg-paper-hi">
                    <div
                      className="absolute inset-y-0 left-0 transition-[width] duration-1000 ease-out"
                      data-pct={row.pct}
                      style={{
                        width: "0%",
                        background: row.color,
                        animation: `fillBar${Math.round(row.pct)} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                      }}
                    />
                    <style>{`@keyframes fillBar${Math.round(row.pct)}{from{width:0%}to{width:${row.pct}%}}`}</style>
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                        {row.units} units
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg leading-none">
                      AED <CountUp to={row.value} duration={1.4} />
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      {row.pct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-rule pt-6">
              <div className="rounded-xl border-2 border-amber-400/50 bg-amber-50 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-800">
                  Bottleneck
                </div>
                <div className="mt-2 font-display text-xl text-amber-900 md:text-2xl">
                  Confirmed → Processing
                </div>
                <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                  189 orders worth AED 55,119 are approved but not started.
                  Fixing this handoff unlocks 49.5% of trapped value.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The VIP lever */}
        <div className="mt-20 md:mt-28">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <Reveal as="div" stagger={0.08}>
                <ChapterEyebrow n="// 03" label="The VIP Lever" />
                <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                  <em>2.3×</em> more
                  <br />
                  per VIP unit.
                </h3>
                <p className="mt-4 max-w-md text-base text-ink-muted">
                  A VIP unit is worth AED 641. A Standard is worth AED 281.
                  Same counter. Different economics.
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <Reveal
                as="div"
                stagger={0.08}
                className="grid grid-cols-2 gap-3"
              >
                <TiltCard className="rounded-2xl border border-rule bg-paper-2 p-5 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                    Standard
                  </div>
                  <div className="mt-3 font-display text-4xl leading-none">
                    AED <CountUp to={281} duration={1.2} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    per unit · 1,303 in pipeline
                  </div>
                </TiltCard>
                <TiltCard className="rounded-2xl border-2 border-[color:var(--accent-teal)] bg-paper-2 p-5 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-teal)]">
                    VIP
                  </div>
                  <div className="mt-3 font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                    AED <CountUp to={641} duration={1.2} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    per unit · 16 in pipeline
                  </div>
                </TiltCard>
              </Reveal>
              <Reveal
                as="div"
                stagger={0.08}
                className="mt-3 rounded-2xl border border-rule bg-paper-2 p-4"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                  The 2.3× Math
                </div>
                <div className="mt-2 text-sm text-ink-muted">
                  <strong className="text-ink">5 VIP orders</strong> = AED
                  3,205. Same value as{" "}
                  <strong className="text-ink">11 Standard orders</strong>{" "}
                  = AED 3,091.
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* The ROI — business case */}
        <div className="mt-20 md:mt-28">
          <Reveal as="div" stagger={0.08} className="mb-8">
            <ChapterEyebrow n="// 04" label="The Business Case" />
            <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
              The numbers,
              <br />
              <em>unflinched.</em>
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            {/* Left: the investment */}
            <div className="md:col-span-4">
              <Reveal
                as="div"
                stagger={0.08}
                className="rounded-2xl border border-rule bg-paper-2 p-6"
              >
                <ChapterEyebrow n="// The Investment" label="" showDot />
                <div className="mt-4 font-display text-6xl leading-none">
                  AED <CountUp to={10} duration={1.0} />
                  <span className="text-2xl">K</span>
                </div>
                <p className="mt-3 text-sm text-ink-muted">
                  One-time: handoff squad + dashboard layer.
                </p>

                <div className="mt-6 border-t border-rule pt-6">
                  <ChapterEyebrow n="// Trapped value" label="" showDot />
                  <div className="mt-3 font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                    AED <CountUp to={111246} duration={1.8} />
                  </div>
                </div>

                <div className="mt-6 border-t border-rule pt-6">
                  <ChapterEyebrow n="// Value : Cost" label="" showDot />
                  <div className="mt-3 font-display text-6xl leading-none">
                    <CountUp to={11.1} duration={1.4} decimals={1} />
                    <span className="text-ink-muted"> : 1</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: the three recovery scenarios */}
            <div className="md:col-span-8">
              <ChapterEyebrow n="// Recovery Scenarios" label="35% margin" />
              <Reveal
                as="div"
                stagger={0.08}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {SCENARIOS.map((s) => (
                  <TiltCard
                    key={s.recovery}
                    className={
                      "rounded-2xl border p-5 " +
                      (s.recommended
                        ? "border-2 border-[color:var(--accent-teal)] bg-[color:var(--accent-teal)]/5"
                        : "border-rule bg-paper-2")
                    }
                  >
                    {s.recommended ? (
                      <div className="mb-2 inline-block rounded-full bg-[color:var(--accent-teal)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                        ★ Recommended
                      </div>
                    ) : null}
                    <div className="font-display text-4xl leading-none">
                      <CountUp to={s.recovery} duration={1.2} />%
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      recovery
                    </div>
                    <div className="mt-4 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Recovered</span>
                        <span className="font-mono">
                          AED <CountUp to={s.value} duration={1.6} />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-muted">Contribution</span>
                        <span className="font-mono">
                          AED <CountUp to={s.contribution} duration={1.6} />
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "mt-4 border-t border-rule pt-3 font-display text-2xl " +
                        (s.roi >= 0
                          ? "text-ink"
                          : "text-ink-faint line-through")
                      }
                    >
                      ROI {s.roi >= 0 ? "+" : ""}
                      <CountUp to={s.roi} duration={1.4} />%
                    </div>
                  </TiltCard>
                ))}
              </Reveal>
              <p className="mt-4 text-sm text-ink-muted">
                35% contribution margin. 50% backlog value reduction in 30
                days ={" "}
                <strong className="text-ink">
                  <CountUp to={95} duration={1.4} />% ROI
                </strong>{" "}
                on a AED 10K intervention.
              </p>
            </div>
          </div>
        </div>

        {/* The closing line */}
        <div className="mt-20 text-center md:mt-28">
          <Reveal as="div" stagger={0.08}>
            <ChapterEyebrow n="// The New Dashboard" label="the close" />
            <p className="cin-section-title mx-auto mt-4 max-w-3xl text-3xl leading-tight md:text-5xl">
              Stop tracking <em className="text-ink-faint line-through">units</em>.
              <br />
              Start tracking{" "}
              <em className="text-[color:var(--accent-teal)] not-italic">
                value
              </em>
              .
            </p>
          </Reveal>
        </div>

        {/* Magnetic close CTA */}
        <div className="mt-14 flex justify-center">
          <Magnetic strength={18} fieldWidth={120}>
            <a
              href="/Abir_Abbas_FullStackDeveloper_CV_2026.pdf"
              className="cin-hero-cta"
              aria-label="Download the full case study PDF"
            >
              ↓ Download the full case study (PDF)
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
