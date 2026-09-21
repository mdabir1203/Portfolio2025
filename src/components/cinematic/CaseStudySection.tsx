/**
 * CaseStudySection — the centerpiece, boardroom edition.
 *
 * The AbaYa-Track Delivery Module case study, rebuilt from the August 2026
 * deck. Editorial scrapbook language: white paper, type-led, the numbers
 * do the talking. Title is the product surface; the "$100K Blind Spot"
 * subtitle is the hook from slide 1 of the deck.
 *
 * 2026-09-21 redesign — "Horizontal Studio Track":
 *   The 4-stage architecture now reads as a horizontal track on desktop
 *   (CSS scroll-snap, one stage per viewport), and a clean vertical
 *   stack on mobile. The earlier "Engineer's Notebook" approach
 *   (wobbly hand-drawn SVG connectors, scribbled margin annotations,
 *   rotated text, strikethroughs, wavy underlines, imperfect ink
 *   stamps) was retired — it broke readability, accessibility, and
 *   the boutique studio design language. The new direction:
 *
 *     · Clean serif display + italic for titles (no rotation, no wobble)
 *     · Generous whitespace between panels
 *     · Subtle horizontal divider between stages
 *     · Sticky progress rail on the right (visible on desktop)
 *     · Proper semantic <article> per stage with aria-labelledby
 *     · Keyboard nav: ←/→ arrow keys move between stages
 *     · prefers-reduced-motion: falls back to vertical stack
 *     · Snap points: stage | stage | stage | stage | close
 *
 *   Below the track: the same Blind Spot, Value Engine, Iceberg,
 *   VIP Lever, ROI, closing line and CTA — unchanged.
 */
import { useEffect, useRef, useState } from "react";
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
 * The system we built — the 4-stage architecture. Each stage gets a
 * clean editorial panel: stage number + name on the left rail, italic
 * serif title + body prose on the right. No rotations, no strikethroughs,
 * no hand-drawn decorations.
 */
const SYSTEM = [
  {
    n: "01",
    layer: "Capture",
    title: "Floor → Event stream",
    body: (
      <>
        Every station on the floor emits a QR-scan event — cutting table,
        embroidery queue, QC station, dispatch. The event is a tuple:{" "}
        <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.78em] text-accent-teal">
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
    body: (
      <>
        Each order is joined to its invoice price, SKU history, tier
        (VIP / Standard), and time-on-floor. Each employee gets a live
        production map: orders touched, time on each, current bottleneck.
      </>
    ),
  },
  {
    n: "03",
    layer: "Model",
    title: "Value engine",
    body: (
      <>
        Five variables — price, SKU history, status, tier, aging —
        collapse into one weighted AED number per order. Same formula
        runs offline in the factory SQL.js cache and online in the
        Cloudflare Worker:{" "}
        <code className="block mt-3 rounded-lg border border-rule bg-paper-2 px-3 py-2 font-mono text-[0.78em] leading-relaxed text-ink md:inline md:whitespace-nowrap">
          0.40·p + 0.20·s + 0.15·st + 0.15·t + 0.10·a
        </code>
      </>
    ),
  },
  {
    n: "04",
    layer: "Deliver",
    title: "The Delivery Module",
    body: (
      <>
        The boardroom view. The bottleneck you saw is the Confirmed →
        Processing handoff: 189 orders, AED 55,119, approved-but-not-started.
        The dashboard points the floor manager at the right orders in
        the right order.
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
      <span className="font-mono text-[10px] tracking-[0.3em] text-ink-faint">{n}</span>
      <span className="opacity-50">·</span>
      <span>{label}</span>
    </div>
  );
}

/* ───────────────────────── HORIZONTAL TRACK ────────────────────────── */

/**
 * HorizontalStudioTrack — the 4-stage architecture presented as a
 * horizontal scroll-snap track on desktop, and a clean vertical stack
 * on mobile. Each panel uses semantic <article> with aria-labelledby,
 * generous whitespace, clean serif typography, and a single accent
 * rule at the bottom. No rotations, no wobble, no decorations that
 * break readability or accessibility.
 *
 * Keyboard: ←/→ arrow keys move focus between panels; the track itself
 * scrolls horizontally via CSS scroll-snap.
 *
 * prefers-reduced-motion: falls back to a vertical stack with a
 * subtle slide-up reveal (the framer-motion default).
 */
function HorizontalStudioTrack() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Observe which panel is in view — powers the sticky progress rail.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const panels = el.querySelectorAll("[data-stage-panel]");
    if (panels.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = Number((e.target as HTMLElement).dataset.stagePanel);
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        }
      },
      { root: el, threshold: [0.5, 0.75] }
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  // Keyboard nav: ←/→ scrolls between panels when the track has focus.
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const panelWidth = el.clientWidth;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: panelWidth, behavior: reduceMotion ? "auto" : "smooth" });
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -panelWidth, behavior: reduceMotion ? "auto" : "smooth" });
      e.preventDefault();
    }
  };

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

      {/* Desktop: horizontal scroll-snap track. */}
      <div
        ref={trackRef}
        role="region"
        aria-label="AbaYa-Track four-stage architecture"
        tabIndex={0}
        onKeyDown={handleKey}
        className="cin-horizontal-track hidden snap-x snap-mandatory overflow-x-auto pb-2 md:flex md:gap-0 md:snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {SYSTEM.map((s) => (
          <article
            key={s.n}
            data-stage-panel={s.n}
            aria-labelledby={`stage-heading-${s.n}`}
            className="flex w-full shrink-0 snap-center items-center px-2 md:px-12 lg:px-20"
          >
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-[180px_1fr] md:gap-16">
              <div className="md:pt-2">
                <div className="font-mono text-[11px] tracking-[0.3em] text-ink-faint">
                  {s.n}
                </div>
                <div className="mt-3 font-mono text-xs uppercase tracking-[0.22em] text-accent-teal">
                  {s.layer}
                </div>
              </div>
              <div>
                <h4
                  id={`stage-heading-${s.n}`}
                  className="font-display text-3xl italic leading-[1.05] text-ink md:text-5xl lg:text-6xl"
                >
                  {s.title}
                </h4>
                <p className="mt-6 max-w-2xl font-display text-base leading-[1.7] text-ink-muted md:text-xl">
                  {s.body}
                </p>
              </div>
            </div>
          </article>
        ))}
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

      {/* Mobile: clean vertical stack — no horizontal scroll on small screens. */}
      <div className="space-y-12 md:hidden">
        {SYSTEM.map((s) => (
          <article
            key={s.n}
            aria-labelledby={`stage-heading-mobile-${s.n}`}
            className="border-b border-rule pb-10 last:border-b-0"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] text-ink-faint">
              {s.n}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-teal">
              {s.layer}
            </div>
            <h4
              id={`stage-heading-mobile-${s.n}`}
              className="mt-4 font-display text-2xl italic leading-[1.1] text-ink md:text-3xl"
            >
              {s.title}
            </h4>
            <p className="mt-4 font-display text-base leading-[1.7] text-ink-muted">
              {s.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── SECTION ROOT ──────────────────────────── */

export function CaseStudySection() {
  return (
    <section id="case-study" className="cin-work border-t border-rule py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Header */}
        <Reveal as="header" stagger={0.1} className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-16">
          <div>
            <ChapterEyebrow n="// Case Study · AbaYa-Track" label="The Delivery Module" />
            <h2 className="cin-section-title mt-3 text-4xl md:text-7xl">
              The Delivery
              <br />
              <em>Module.</em>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink md:text-xl">
              The <strong className="text-ink">AbaYa-Track Delivery Module</strong> is
              a value-weighted production dashboard I built for <strong className="text-ink">Famous
              Abaya LLC</strong> in Dubai, UAE. It surfaced <strong className="text-ink">AED
              111,246</strong> of trapped manufacturing backlog in 30 days at
              an <strong className="text-ink">11.1:1 value-to-cost ratio</strong>,
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
            or vertical stack (mobile). Boutique studio design language:
            clean serif + italic, generous whitespace, no decorations
            that break readability. */}
        <HorizontalStudioTrack />

        {/* The blind spot — the headline stat */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:mt-28 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal as="div" stagger={0.1} className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
              <ChapterEyebrow n="// The Old View" label="unit-count, value-invisible" />
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
                abaya and an AED 850 abaya both count as 1. The
                value is invisible.
              </p>
              <div className="mt-6 border-t border-rule pt-6">
                <ChapterEyebrow n="// The New View" label="value-weighted by SKU + tier" />
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
              <Reveal as="div" stagger={0.08} className="rounded-2xl border border-rule bg-paper-2 p-5">
                <ChapterEyebrow n="// Pipeline" label="" showDot />
                <div className="mt-3 font-display text-4xl leading-none">
                  <CountUp to={1319} duration={1.6} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  units
                </div>
              </Reveal>
              <Reveal as="div" stagger={0.08} className="rounded-2xl border border-rule bg-paper-2 p-5">
                <ChapterEyebrow n="// Pipeline value" label="" showDot />
                <div className="mt-3 font-display text-4xl leading-none text-ink">
                  AED <CountUp to={376625} duration={2.0} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  total weighted
                </div>
              </Reveal>
              <Reveal as="div" stagger={0.08} className="rounded-2xl border border-rule bg-paper-2 p-5">
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
          <Reveal as="div" stagger={0.08} className="mb-8 flex flex-wrap items-end justify-between gap-4">
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
          <Reveal as="div" stagger={0.08} className="mb-8 flex flex-wrap items-end justify-between gap-4">
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

          <Reveal as="div" stagger={0.06} className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
            {/* bar chart */}
            <div className="space-y-4">
              {PIPELINE.map((row) => (
                <div key={row.stage} className="grid grid-cols-[110px_1fr_120px] items-center gap-4 md:grid-cols-[140px_1fr_140px]">
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
              <Reveal as="div" stagger={0.08} className="grid grid-cols-2 gap-3">
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
                <TiltCard className="rounded-2xl border-2 border-accent-teal bg-paper-2 p-5 transition-colors">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-teal">
                    VIP
                  </div>
                  <div className="mt-3 font-display text-4xl leading-none text-accent-teal">
                    AED <CountUp to={641} duration={1.2} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    per unit · 16 in pipeline
                  </div>
                </TiltCard>
              </Reveal>
              <Reveal as="div" stagger={0.08} className="mt-3 rounded-2xl border border-rule bg-paper-2 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                  The 2.3× Math
                </div>
                <div className="mt-2 text-sm text-ink-muted">
                  <strong className="text-ink">5 VIP orders</strong> = AED 3,205.
                  Same value as <strong className="text-ink">11 Standard orders</strong> = AED 3,091.
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
              <Reveal as="div" stagger={0.08} className="rounded-2xl border border-rule bg-paper-2 p-6">
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
                  <div className="mt-3 font-display text-4xl leading-none text-accent-teal">
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
              <Reveal as="div" stagger={0.08} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SCENARIOS.map((s) => (
                  <TiltCard
                    key={s.recovery}
                    className={
                      "rounded-2xl border p-5 " +
                      (s.recommended
                        ? "border-2 border-accent-teal bg-accent-teal/5"
                        : "border-rule bg-paper-2")
                    }
                  >
                    {s.recommended ? (
                      <div className="mb-2 inline-block rounded-full bg-accent-teal px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
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
                        (s.roi >= 0 ? "text-ink" : "text-ink-faint line-through")
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
                days = <strong className="text-ink"><CountUp to={95} duration={1.4} />% ROI</strong> on a
                AED 10K intervention.
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
              Start tracking <em className="text-accent-teal not-italic">value</em>.
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
