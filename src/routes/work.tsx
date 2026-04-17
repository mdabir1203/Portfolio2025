import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Target, Cog, ShieldCheck } from "lucide-react";

type CaseStudy = {
  slug: string;
  brand: string;
  role: string;
  period: string;
  tagline: string;
  problem: string;
  approach: string[];
  outcomes: { value: string; label: string; tone: "teal" | "lime" | "amber" }[];
  stack: string[];
  link?: { label: string; href: string };
};

const studies: CaseStudy[] = [
  {
    slug: "wavelink",
    brand: "Wavelink",
    role: "Chief Technical Advisor",
    period: "Jan 2025 — Present",
    tagline: "Smart NFC networking that replaces paper business cards.",
    problem:
      "Early-stage venture needed to ship a GTM motion fast: company registration, partnership funnel, and a 2025–26 roadmap aligned to KPIs — without burning runway.",
    approach: [
      "Streamlined company registration & policy implementation for 100% compliance.",
      "Engineered a partnership acquisition funnel with systematic lead generation.",
      "Led data-driven promotional campaigns to optimise reach and engagement.",
      "Co-authored the 2025–26 roadmap, aligning ops to long-term KPIs.",
    ],
    outcomes: [
      { value: "100%", label: "Compliance from day one", tone: "teal" },
      { value: "0", label: "Paper waste per tap", tone: "lime" },
      { value: "GDPR", label: "Privacy-first by design", tone: "amber" },
    ],
    stack: ["GTM Strategy", "NFC", "GDPR", "Pipeline Design"],
    link: { label: "Explore Wavelink", href: "https://wave-link-cards.vercel.app/" },
  },
  {
    slug: "deep-blue-digital",
    brand: "Deep Blue Digital",
    role: "Co-Founder",
    period: "Sep 2024 — Aug 2025",
    tagline: "AI-driven commerce automation for 50+ sellers.",
    problem:
      "Sellers were losing hours on manual payment ops and burning ad spend on unfocused campaigns. We needed to compress both.",
    approach: [
      "Integrated Engaze.ai-powered payment systems across the seller network.",
      "Built Midjourney + Zapier marketing pipelines to auto-generate creative.",
      "Instrumented funnel analytics to attribute CAC to creative variants.",
    ],
    outcomes: [
      { value: "−40%", label: "Payment processing time", tone: "lime" },
      { value: "−30%", label: "Customer Acquisition Cost", tone: "amber" },
      { value: "+20%", label: "Campaign engagement", tone: "teal" },
    ],
    stack: ["Engaze.ai", "Midjourney", "Zapier", "Funnel Analytics"],
    link: { label: "Visit Deep Blue", href: "https://deep-blue-digital.engaze.ai/" },
  },
  {
    slug: "hnm-it",
    brand: "HNM IT Solutions",
    role: "IT Support Engineer",
    period: "Oct 2023 — Jan 2024 · Frankfurt",
    tagline: "Hardening distributed networks for 99.9% uptime.",
    problem:
      "Distributed environments suffered from unsecured routers and slow incident response — risking data exposure and SLA breaches.",
    approach: [
      "Upgraded and secured network routers across distributed sites.",
      "Built automated diagnostic tests for network configurations.",
      "Documented MTTR playbooks to standardise incident response.",
    ],
    outcomes: [
      { value: "99.9%", label: "Uptime maintained", tone: "teal" },
      { value: "−35%", label: "Mean-Time-to-Resolution", tone: "lime" },
      { value: "100%", label: "System compatibility post-upgrade", tone: "amber" },
    ],
    stack: ["Network Security", "Automation", "Diagnostics", "SLA Ops"],
  },
];

const toneClass = {
  teal: "text-[color:var(--accent-teal)]",
  lime: "text-[color:var(--accent-lime)]",
  amber: "text-[color:var(--accent-amber)]",
} as const;

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Mohammad Abir Abbas" },
      {
        name: "description",
        content:
          "Case studies: Wavelink GTM, Deep Blue Digital AI commerce, HNM IT network hardening. Measurable outcomes.",
      },
      { property: "og:title", content: "Work — Mohammad Abir Abbas" },
      {
        property: "og:description",
        content: "Three case studies. Measurable outcomes. AI, GTM, and infrastructure.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <header className="mx-auto mb-10 flex max-w-[1100px] items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
          // Case Studies · 2026
        </span>
      </header>

      <section className="mx-auto max-w-[1100px]">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl leading-[0.95] md:text-7xl"
        >
          Selected <em className="text-[color:var(--accent-teal)]">work</em>.
        </motion.h1>
        <p className="mt-4 max-w-xl text-sm text-foreground/70 md:text-base">
          Three deep-dives. Each one: the problem, the approach, the measurable result.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-[1100px] space-y-6">
        {studies.map((s, idx) => (
          <motion.article
            key={s.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className="bento bento-feature grain"
          >
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              {/* Left: narrative */}
              <div>
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  <span>0{idx + 1}</span>
                  <span className="h-px w-8 bg-foreground/20" />
                  <span>{s.period}</span>
                </div>
                <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                  {s.brand}
                </h2>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-teal)]">
                  {s.role}
                </p>
                <p className="mt-4 max-w-md text-base text-foreground/80">{s.tagline}</p>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      <Target className="h-3 w-3" /> Problem
                    </div>
                    <p className="text-foreground/75">{s.problem}</p>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                      <Cog className="h-3 w-3" /> Approach
                    </div>
                    <ul className="space-y-1.5 text-foreground/75">
                      {s.approach.map((a) => (
                        <li key={a} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent-teal)]" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {s.link && (
                  <a
                    href={s.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-1 text-sm text-[color:var(--accent-teal)] transition-all hover:gap-2"
                  >
                    {s.link.label} <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Right: outcomes */}
              <div className="flex flex-col gap-3">
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                  <ShieldCheck className="h-3 w-3" /> Outcomes
                </div>
                {s.outcomes.map((o) => (
                  <div
                    key={o.label}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className={`font-display text-4xl leading-none ${toneClass[o.tone]}`}>
                      {o.value}
                    </div>
                    <div className="mt-1 text-xs text-foreground/60">{o.label}</div>
                  </div>
                ))}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <footer className="mx-auto mt-12 flex max-w-[1100px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        <Link to="/" className="hover:text-foreground">← Home</Link>
        <a href="mailto:abir.abbas@proton.me" className="hover:text-foreground">
          abir.abbas@proton.me
        </a>
      </footer>
    </main>
  );
}
