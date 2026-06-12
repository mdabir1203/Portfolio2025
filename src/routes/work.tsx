import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Target, Cog, ShieldCheck, Mail, X, ZoomIn } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import gccAbayaCaseStudy from "@/assets/case-study-gcc-abaya-bn.png";

type CaseStudy = {
  slug: string;
  brand: string;
  /** Optional trade / business license number shown under the brand. */
  license?: string;
  role: string;
  period: string;
  tagline: string;
  problem: string;
  approach: string[];
  outcomes: { value: string; label: string; tone: "teal" | "lime" | "amber" }[];
  stack: string[];
  link?: { label: string; href: string };
  /** Optional hero infographic or visual for the case study. */
  image?: string;
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
    slug: "gcc-famous-ladies-gowns",
    brand: "Famous Ladies Gowns Tailoring LLC",
    license: "71761",
    role: "Process visibility · GCC manufacturing",
    period: "Abaya production · GCC",
    tagline:
      "A small abaya factory increased output by 38% using end-to-end process visibility—no extra headcount, no major investment.",
    problem:
      "The floor was busy, but output and on-time delivery were inconsistent. Supervisors saw utilization, not where time disappeared between cutting, stitching, sleeves, embroidery, ironing, and packaging—or why the same steps varied sharply across operators.",
    approach: [
      "Introduced lightweight, real-time time tracking per unit via mobile, aligned to the full production chain.",
      "Made throughput, bottlenecks, and micro-delays between tasks visible to the whole team—not only management.",
      "Used the data to rebalance work and reduce idle, untracked time instead of adding capacity or hires.",
    ],
    outcomes: [
      { value: "+38%", label: "Production output", tone: "teal" },
      { value: "−30%", label: "Cycle time", tone: "lime" },
      { value: "92%", label: "On-time delivery (from 65%)", tone: "amber" },
      { value: "0", label: "Additional hires", tone: "teal" },
    ],
    stack: ["Process mapping", "Mobile time tracking", "Shop-floor visibility", "Continuous improvement"],
    image: gccAbayaCaseStudy,
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
  {
    slug: "redagpt",
    brand: "RedAGPT",
    role: "Core Contributor · Open Source",
    period: "Nov 2024 · Redis Side Quest",
    tagline: "Open-source AutoGPT + Langchain toolkit that runs AI-driven vulnerability scans on home and office networks — and generates actionable security reports.",
    problem:
      "Security professionals needed smarter, automated testing tools for home and office networks. Manual vulnerability scanning is slow, inconsistent, and produces raw data that takes hours to interpret. Teams lacked a way to run AI-directed tests and receive structured, severity-ranked remediation guidance in a single workflow.",
    approach: [
      "Collaborated on an open-source toolkit integrating AutoGPT (GPT-3 via Langchain) to autonomously run a series of network and system vulnerability tests with no manual orchestration.",
      "Engineered prompt chains optimised for security-focused Linux environments, enabling the agent to adapt its test sequence based on discovered network topology.",
      "Built a report generation layer that classifies each detected vulnerability by severity and produces concrete remediation recommendations — turning raw scan output into an actionable security brief.",
    ],
    outcomes: [
      { value: "Winner", label: "Redis Side Quest 2024", tone: "teal" },
      { value: "−80%", label: "Documentation search time", tone: "lime" },
      { value: "100%", label: "Semantic accuracy on test bank", tone: "amber" },
    ],
    stack: ["AutoGPT", "Langchain", "GPT-3", "Linux"],
    link: { label: "View on GitHub", href: "https://github.com/shamantechnology/RedAGPT" },
  },
  {
    slug: "smartswap",
    brand: "SmartSwap — AI Personalization Layer",
    role: "AI Architect · Full-stack Lead",
    period: "Feb 2026 · MIT Hacknation",
    tagline: "Drop-in AI personalization engine that turns static storefronts into intent-driven revenue machines. Zero backend required.",
    problem:
      "E-commerce storefronts serve one static experience to visitors with radically different intent. Conversion rates stall at 2–3% industry-wide because brands can't afford the engineering overhead of true personalization. Most leave 30–60% of potential revenue on the table — not from lack of traffic, but from lack of relevance.",
    approach: [
      "Built a client-side intent engine that reads URL signals (UTM params, referrer, campaign tags) and scores each visitor against 7 behavioral personas in under 50ms — no backend, no deploy, no ops.",
      "Dynamically swaps hero image, headline, CTA copy, and section order on arrival, creating a tailored storefront experience from the first pixel rendered.",
      "Added real-time frustration detection — rage clicks, scroll hesitation, exit intent — to trigger recovery flows before bounce, recovering sessions that would otherwise be lost.",
    ],
    outcomes: [
      { value: "Next Best", label: "MIT Hacknation 2026", tone: "teal" },
      { value: "<50ms", label: "Intent resolution, zero backend", tone: "lime" },
      { value: "7", label: "Behavioral personas, drop-in deploy", tone: "amber" },
    ],
    stack: ["URL Signal Scoring", "Behavior Tracking", "Client-side AI", "React"],
    link: { label: "Live Demo", href: "https://smartswap.lovable.app/" },
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
          "Case studies: Wavelink GTM, GCC manufacturing visibility (Famous Ladies Gowns Tailoring LLC), Deep Blue Digital AI commerce, HNM IT network hardening. Measurable outcomes.",
      },
      { property: "og:title", content: "Work — Mohammad Abir Abbas" },
      {
        property: "og:description",
        content:
          "Case studies across GTM, manufacturing visibility, AI commerce, and infrastructure—with measurable outcomes.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed right-6 top-6 z-[60] rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-full max-w-full overflow-auto rounded-xl border border-white/10 shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full case study view"
                className="h-auto w-full max-w-4xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {studies.length} deep-dives. Each one: the problem, the approach, the measurable result.
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
            {s.image ? (
              <div 
                className="group relative mb-6 cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/20 transition-all hover:border-white/20"
                onClick={() => setSelectedImage(s.image!)}
              >
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/10">
                    <ZoomIn className="h-4 w-4" /> View Full Case Study
                  </div>
                </div>
                <img
                  src={s.image}
                  alt={`Case study infographic — ${s.brand}${s.license ? `, license no. ${s.license}` : ""}`}
                  className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ) : null}
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
                {s.license ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                    License no. {s.license}
                  </p>
                ) : null}
                <p
                  className={`font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-teal)] ${s.license ? "mt-2" : "mt-1"}`}
                >
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

      {/* Contact Section */}
      <section className="mx-auto mt-20 max-w-[1100px]">
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
              <Mail className="h-4 w-4" /> // Get in touch
            </div>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Have a project <br /> <em className="text-[color:var(--accent-teal)]">in mind?</em>
            </h2>
            <p className="max-w-md text-sm text-foreground/70">
              Whether you're looking to automate engineering workflows, deploy AI agents, or scale a product—let's talk ROI.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="mx-auto mt-20 flex max-w-[1100px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        <Link to="/" className="hover:text-foreground">← Home</Link>
        <a href="mailto:abir.abbas@proton.me" className="hover:text-foreground">
          abir.abbas@proton.me
        </a>
      </footer>
    </main>
  );
}
