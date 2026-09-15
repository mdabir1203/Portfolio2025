/**
 * CaseStudySection — the centerpiece, boardroom edition.
 *
 * The AbaYa-Track Delivery Module case study, rebuilt from the August 2026
 * deck. Editorial scrapbook language: white paper, type-led, the numbers
 * do the talking. Title is the product surface; the "$100K Blind Spot"
 * subtitle is the hook from slide 1 of the deck.
 *
 * Microinteractions layer (added 2026-09-14):
 *   - Reveal       : eyebrow → title → body stagger
 *   - CountUp      : every big number animates from 0 → final
 *   - PulseDot     : sonar heartbeat next to chapter numbers
 *   - TiltCard     : subtle 3D tilt on the 4-layer system cards (desktop)
 *   - TerminalCard : hover/tap reveals a JSON snippet behind each variable
 *   - DataStream   : SVG path + animated packets between Capture → Deliver
 *   - Magnetic     : CTAs drift toward the cursor (desktop)
 */
import { CountUp } from "./microinteractions/CountUp";
import { DataStream } from "./microinteractions/DataStream";
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
 * The system we built. The Delivery Module is not a screen — it's the
 * last stage of a four-stage architecture that maps each employee on the
 * floor to a value-weighted line on the dashboard.
 */
const SYSTEM = [
  {
    n: "01",
    layer: "Capture",
    title: "Floor → Event stream",
    body: "Every station on the floor emits a QR-scan event. Cutting table, embroidery queue, QC station, dispatch. The event is a tuple: (employee_id, station_id, order_id, sku, timestamp).",
  },
  {
    n: "02",
    layer: "Map",
    title: "Employee ↔ Order ↔ Value",
    body: "Each order is joined to its invoice price, SKU history, tier (VIP / Standard), and time-on-floor. Each employee gets a live production map: orders touched, time on each, current bottleneck.",
  },
  {
    n: "03",
    layer: "Model",
    title: "Value engine",
    body: "Five variables — price, SKU history, status, tier, aging — collapse into one weighted AED number per order. Same formula runs offline in the factory SQL.js cache and online in the Cloudflare Worker.",
  },
  {
    n: "04",
    layer: "Deliver",
    title: "The Delivery Module",
    body: "The boardroom view. The bottleneck you saw is the Confirmed → Processing handoff: 189 orders, AED 55,119, approved-but-not-started. The dashboard points the floor manager at the right orders in the right order.",
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

        {/* The system we built — architecture before numbers */}
        <div className="mt-4 md:mt-6">
          <Reveal as="div" stagger={0.1} className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
            <div className="flex-1">
              <ChapterEyebrow n="// 01" label="The System We Built" />
              <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                From the floor to the
                <br />
                <em>boardroom.</em>
              </h3>
            </div>
            <div className="cin-section-eyebrow text-right">
              <div>4 layers · 1 source of truth</div>
            </div>
          </Reveal>

          {/* Animated data flow between the 4 system cards */}
          <div className="mb-2 px-4 md:px-8">
            <DataStream
              points={[
                [120, 50],
                [370, 50],
                [620, 50],
                [880, 50],
              ]}
              labels={["Capture", "Map", "Model", "Deliver"]}
              packetCount={3}
              duration={5}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-3">
            {SYSTEM.map((s, i) => (
              <TiltCard
                key={s.n}
                maxTilt={5}
                className="relative rounded-2xl border border-rule bg-paper-2 p-5 transition-colors hover:bg-paper-hi"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-1.5">
                    <PulseDot size={8} />
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                      {s.n}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-teal)]">
                    {s.layer}
                  </div>
                </div>
                <div className="mt-3 font-display text-xl leading-tight md:text-2xl">
                  {s.title}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted md:text-sm">
                  {s.body}
                </p>
                {i < SYSTEM.length - 1 ? (
                  <div
                    aria-hidden
                    className="absolute -right-2 top-1/2 hidden h-px w-4 bg-rule md:block"
                  />
                ) : null}
              </TiltCard>
            ))}
          </div>
        </div>

        {/* The blind spot — the headline stat */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
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
                <div className="mt-3 font-display text-4xl leading-tight tracking-tight text-[color:var(--accent-teal)] md:text-6xl">
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
              <Reveal as="div" stagger={0.08} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              Start tracking <em className="text-[color:var(--accent-teal)] not-italic">value</em>.
            </p>
          </Reveal>
        </div>

        {/* Magnetic close CTA */}
        <div className="mt-14 flex justify-center">
          <Magnetic strength={18} fieldWidth={120}>
            <a
              href="/Abir_Abbas_CV.pdf"
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
