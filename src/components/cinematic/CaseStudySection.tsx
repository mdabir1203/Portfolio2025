/**
 * CaseStudySection — the centerpiece, boardroom edition.
 *
 * The AbaYa-Track Delivery Module case study, rebuilt from the August 2026
 * deck. Editorial scrapbook language: white paper, type-led, the numbers
 * do the talking. Title is the product surface; the "$100K Blind Spot"
 * subtitle is the hook from slide 1 of the deck.
 */
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const PIPELINE = [
  { stage: "Completed", units: 934, value: 264580, pct: 70.5, color: "var(--accent-lime)" },
  { stage: "Confirmed", units: 189, value: 55119, pct: 49.5, color: "var(--accent-amber)" },
  { stage: "Queued", units: 143, value: 40523, pct: 36.4, color: "var(--accent-rose)" },
  { stage: "Processing", units: 53, value: 15604, pct: 14.0, color: "var(--accent-teal)" },
];

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
  { k: "01", title: "Order price", body: "Invoice value at the line item." },
  { k: "02", title: "SKU history", body: "Median revenue per model." },
  { k: "03", title: "Status", body: "Stage in the production flow." },
  { k: "04", title: "Tier", body: "VIP vs Standard weighting." },
  { k: "05", title: "Aging", body: "Time decay on the order." },
];

const SCENARIOS = [
  { recovery: 20, value: 22249, contribution: 7787, roi: -22, recommended: false },
  { recovery: 50, value: 55623, contribution: 19468, roi: 95, recommended: true },
  { recovery: 80, value: 88997, contribution: 31149, roi: 211, recommended: false },
] as const;

export function CaseStudySection() {
  const reduce = useReducedMotion();
  return (
    <section id="case-study" className="cin-work border-t border-rule py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-16">
          <div>
            <div className="cin-section-eyebrow">// Case Study · AbaYa-Track · The Delivery Module</div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-7xl">
              The Delivery
              <br />
              <em>Module.</em>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              A value-weighted production dashboard that surfaced
              <strong className="text-ink"> AED 111,246</strong> of trapped
              backlog behind 385 "units pending" — and unlocked a
              <strong className="text-ink"> 11.1 : 1</strong> value-to-cost
              ratio in 30 days.
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
        </div>

        {/* The system we built — architecture before numbers */}
        <RevealOnView>
          <div className="mt-4 md:mt-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
              <div>
                <div className="cin-section-eyebrow">// The System We Built</div>
                <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                  From the floor to the
                  <br />
                  <em>boardroom.</em>
                </h3>
              </div>
              <div className="cin-section-eyebrow text-right">
                <div>4 layers · 1 source of truth</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-3">
              {SYSTEM.map((s, i) => (
                <div
                  key={s.n}
                  className="group relative rounded-2xl border border-rule bg-paper-2 p-5 transition-colors hover:bg-paper-hi"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                      {s.n}
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
                </div>
              ))}
            </div>
          </div>
        </RevealOnView>

        {/* The blind spot — the headline stat */}
        <RevealOnView>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <div className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
                <div className="cin-section-eyebrow">// The Old View</div>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="font-display text-7xl leading-none tracking-tight md:text-9xl">
                    385
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
                  <div className="cin-section-eyebrow">// The New View</div>
                  <div className="mt-3 font-display text-4xl leading-tight tracking-tight text-[color:var(--accent-teal)] md:text-6xl">
                    AED 111,246
                  </div>
                  <p className="mt-3 text-sm text-ink-muted md:text-base">
                    True backlog value, weighted by SKU and tier. 49.5% of it
                    sits in the Confirmed stage — approved but never started.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grid h-full grid-cols-1 gap-4">
                <div className="rounded-2xl border border-rule bg-paper-2 p-5">
                  <div className="cin-section-eyebrow">// Pipeline</div>
                  <div className="mt-3 font-display text-4xl leading-none">1,319</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    units
                  </div>
                </div>
                <div className="rounded-2xl border border-rule bg-paper-2 p-5">
                  <div className="cin-section-eyebrow">// Pipeline value</div>
                  <div className="mt-3 font-display text-4xl leading-none text-ink">
                    AED 376,625
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    total weighted
                  </div>
                </div>
                <div className="rounded-2xl border border-rule bg-paper-2 p-5">
                  <div className="cin-section-eyebrow">// Avg unit value</div>
                  <div className="mt-3 font-display text-4xl leading-none">AED 285</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    hides wide variance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnView>

        {/* The 5 variables */}
        <RevealOnView>
          <div className="mt-20 md:mt-28">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="cin-section-eyebrow">// The Value Engine</div>
                <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                  Five variables,
                  <br />
                  <em>one truth.</em>
                </h3>
              </div>
              <div className="cin-section-eyebrow text-right">
                <div>70% known · 20% predictable · 10% unknown</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3">
              {VARIABLES.map((v) => (
                <div
                  key={v.k}
                  className="rounded-2xl border border-rule bg-paper-2 p-5 transition-colors hover:bg-paper-hi"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                    {v.k}
                  </div>
                  <div className="mt-3 font-display text-xl leading-tight md:text-2xl">
                    {v.title}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted md:text-sm">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnView>

        {/* The iceberg — pipeline visualization */}
        <RevealOnView>
          <div className="mt-20 md:mt-28">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="cin-section-eyebrow">// The Iceberg</div>
                <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                  Where the <em>AED 111K</em> sits.
                </h3>
              </div>
              <div className="cin-section-eyebrow text-right">
                <div>Backlog by stage</div>
              </div>
            </div>

            <div className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
              {/* bar chart */}
              <div className="space-y-4">
                {PIPELINE.map((row) => (
                  <div key={row.stage} className="grid grid-cols-[110px_1fr_120px] items-center gap-4 md:grid-cols-[140px_1fr_140px]">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      {row.stage}
                    </div>
                    <div className="relative h-7 overflow-hidden rounded-full bg-paper-hi">
                      <motion.div
                        initial={reduce ? { width: `${row.pct}%` } : { width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-y-0 left-0"
                        style={{ background: row.color }}
                      />
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                          {row.units} units
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg leading-none">
                        AED {row.value.toLocaleString()}
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
            </div>
          </div>
        </RevealOnView>

        {/* The VIP lever */}
        <RevealOnView>
          <div className="mt-20 md:mt-28">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <div className="cin-section-eyebrow">// The VIP Lever</div>
                <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                  <em>2.3×</em> more
                  <br />
                  per VIP unit.
                </h3>
                <p className="mt-4 max-w-md text-base text-ink-muted">
                  A VIP unit is worth AED 641. A Standard is worth AED 281.
                  Same counter. Different economics.
                </p>
              </div>

              <div className="md:col-span-7">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-rule bg-paper-2 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                      Standard
                    </div>
                    <div className="mt-3 font-display text-4xl leading-none">
                      AED 281
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      per unit · 1,303 in pipeline
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-[color:var(--accent-teal)] bg-paper-2 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-teal)]">
                      VIP
                    </div>
                    <div className="mt-3 font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                      AED 641
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      per unit · 16 in pipeline
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-rule bg-paper-2 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                    The 2.3× Math
                  </div>
                  <div className="mt-2 text-sm text-ink-muted">
                    <strong className="text-ink">5 VIP orders</strong> = AED 3,205.
                    Same value as <strong className="text-ink">11 Standard orders</strong> = AED 3,091.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnView>

        {/* The ROI — business case */}
        <RevealOnView>
          <div className="mt-20 md:mt-28">
            <div className="mb-8">
              <div className="cin-section-eyebrow">// The Business Case</div>
              <h3 className="cin-section-title mt-3 text-3xl md:text-5xl">
                The numbers,
                <br />
                <em>unflinched.</em>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              {/* Left: the investment */}
              <div className="md:col-span-4">
                <div className="rounded-2xl border border-rule bg-paper-2 p-6">
                  <div className="cin-section-eyebrow">// The Investment</div>
                  <div className="mt-4 font-display text-6xl leading-none">
                    AED 10K
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">
                    One-time: handoff squad + dashboard layer.
                  </p>

                  <div className="mt-6 border-t border-rule pt-6">
                    <div className="cin-section-eyebrow">// Trapped value</div>
                    <div className="mt-3 font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                      AED 111,246
                    </div>
                  </div>

                  <div className="mt-6 border-t border-rule pt-6">
                    <div className="cin-section-eyebrow">// Value : Cost</div>
                    <div className="mt-3 font-display text-6xl leading-none">
                      11.1<span className="text-ink-muted"> : 1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: the three recovery scenarios */}
              <div className="md:col-span-8">
                <div className="cin-section-eyebrow">// Recovery Scenarios · 35% margin</div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {SCENARIOS.map((s) => (
                    <div
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
                        {s.recovery}%
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                        recovery
                      </div>
                      <div className="mt-4 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-ink-muted">Recovered</span>
                          <span className="font-mono">
                            AED {s.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-muted">Contribution</span>
                          <span className="font-mono">
                            AED {s.contribution.toLocaleString()}
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
                        {s.roi}%
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink-muted">
                  35% contribution margin. 50% backlog value reduction in 30
                  days = <strong className="text-ink">+95% ROI</strong> on a
                  AED 10K intervention.
                </p>
              </div>
            </div>
          </div>
        </RevealOnView>

        {/* The closing line */}
        <RevealOnView>
          <div className="mt-20 text-center md:mt-28">
            <div className="cin-section-eyebrow">// The New Dashboard</div>
            <p className="cin-section-title mx-auto mt-4 max-w-3xl text-3xl leading-tight md:text-5xl">
              Stop tracking <em className="text-ink-faint line-through">units</em>.
              <br />
              Start tracking <em className="text-[color:var(--accent-teal)] not-italic">value</em>.
            </p>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}

function RevealOnView({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
