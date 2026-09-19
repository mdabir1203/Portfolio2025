// RecruiterLanding — the immersive first-impression screen for technical
// recruiters and hiring managers. Distinctly different from the default
// CinematicLanding: scannable proof points, prioritized contact, salary
// band, visa status, and a fast-path to the calendar.
//
// Hooked by:
//   - /recruiter (always renders this)
//   - /  with audience="recruiter" (via audience detection in CinematicLanding)
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/contexts/LanguageContext";

interface RecruiterSignalProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function Signal({ label, value, sub, highlight }: RecruiterSignalProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-md border p-4 ${
        highlight
          ? "border-accent-teal/60 bg-accent-teal/5"
          : "border-paper/15 bg-paper/5"
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/60">{label}</div>
      <div className="font-display text-2xl text-paper">{value}</div>
      {sub && <div className="font-mono text-[11px] text-paper/70">{sub}</div>}
    </div>
  );
}

interface ProofPointProps {
  metric: string;
  label: string;
  detail: string;
}

function ProofPoint({ metric, label, detail }: ProofPointProps) {
  return (
    <div className="border-l-2 border-accent-teal/40 pl-4">
      <div className="font-display text-3xl text-paper">{metric}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">{label}</div>
      <p className="mt-2 text-sm text-paper/80">{detail}</p>
    </div>
  );
}

export function RecruiterLanding() {
  const t = useT();
  const { lang } = useLanguage();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Format the local Dubai time for the recruiter's clock.
  const dubaiTime = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
    hour12: false,
  }).format(now);

  return (
    <main
      lang={lang}
      className="relative min-h-screen overflow-hidden bg-ink text-paper"
    >
      {/* Eyebrow ribbon — context for the recruiter before they read anything */}
      <div className="border-b border-paper/10 bg-ink/95 px-6 py-3 backdrop-blur md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-accent-teal">RECRUITER BRIEF</span>
            <span className="text-paper/40">/</span>
            <span>Dubai, UAE · {dubaiTime} GST</span>
            <span className="text-paper/40">/</span>
            <span>Available Q3 2026</span>
            <span className="text-paper/40">/</span>
            <span>UAE Company Visa · No sponsorship</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="mailto:abir.abbas@proton.me?subject=Role%20%E2%80%94%20%28your%20company%29"
              className="text-paper/80 transition hover:text-accent-teal"
            >
              abir.abbas@proton.me
            </a>
            <span className="text-paper/30">·</span>
            <a
              href="https://wa.me/971543618066"
              className="text-paper/80 transition hover:text-accent-teal"
            >
              +971 54 361 8066
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 pb-10 pt-16 md:px-12 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-teal">
            // Creative Technologist · AI Strategist · Emerging Technology Architect
          </div>
          <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[1.05] text-paper md:text-7xl">
            Technology is valuable when it creates leverage.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-paper/80 md:text-xl">
            Creative Technologist, AI Strategist &amp; Emerging Technology
            Architect based in Dubai. Open to UAE (Dubai · Abu Dhabi), Saudi
            Arabia (Riyadh · NEOM), and global remote roles. UAE Company Visa
            held — no sponsorship required.
          </p>

          {/* CTAs — three routes, recruiter-relevant */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/connect?code=intro&ref=recruiter&audience=recruiter"
              className="rounded-md bg-accent-teal px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:bg-accent-teal/85"
            >
              Book a 15-min chat →
            </a>
            <a
              href="https://abir.getwaved.ai/Abir_Abbas_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-paper/30 px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:border-accent-teal hover:text-accent-teal"
            >
              Download CV (PDF) ↗
            </a>
            <a
              href="/abir.vcf"
              className="rounded-md border border-paper/30 px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:border-accent-teal hover:text-accent-teal"
            >
              Save Contact (.vcf)
            </a>
            <a
              href="/work?audience=recruiter"
              className="font-mono text-sm uppercase tracking-[0.12em] text-paper/70 underline-offset-4 transition hover:text-accent-teal hover:underline"
            >
              See case studies
            </a>
          </div>

          {/* Top-level signal grid — the only thing a recruiter needs */}
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Signal
              label="Availability"
              value="Q3 2026"
              sub="UAE Company Visa held"
              highlight
            />
            <Signal
              label="Location"
              value="Dubai, UAE"
              sub="Open to KSA · global remote"
            />
            <Signal
              label="Salary band"
              value="AED 18–25K"
              sub="Mid-level Dubai market"
            />
            <Signal
              label="Last shipped"
              value="AED 111K"
              sub="Recovered in 30 days · 11.1:1 V:C"
              highlight
            />
          </div>
        </div>
      </section>

      {/* Proof strip — three quantified outcomes, fast to scan */}
      <section className="border-y border-paper/10 bg-ink/60 px-6 py-14 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
            // Proof — three recent wins, with numbers
          </div>
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
            <ProofPoint
              metric="AED 111,246"
              label="Recovered backlog in 30 days"
              detail="AbaYa-Track Delivery Module (Famous Abaya LLC, Dubai). Value-weighted production dashboard surfaced trapped work-in-progress. 11.1:1 value-to-cost ratio."
            />
            <ProofPoint
              metric="+38% / −30%"
              label="Output up, cycle time down"
              detail="Same factory, same headcount. Production output +38%, cycle time −30%, on-time delivery 65% → 92%. Zero additional hires."
            />
            <ProofPoint
              metric="40% / 30%"
              label="Faster payments, lower CAC"
              detail="Engaze.ai payment integration for 50+ sellers (Deep Blue Digital). CAC cut 30% with AI-driven marketing automation."
            />
          </div>
        </div>
      </section>

      {/* Tech stack — skimmable, anchored to the role keywords recruiters search */}
      <section className="px-6 py-14 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
            // Tech I ship with
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-teal">AI / ML</div>
              <div className="mt-2 text-sm text-paper/80">
                LangChain · AutoGPT · GPT-4/4o · RAG · Multi-agent · MLOps · Edge AI
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-teal">Mobile & Web</div>
              <div className="mt-2 text-sm text-paper/80">
                React · React Native · TypeScript · Next.js · Tailwind · i18n EN/AR/BN/DE
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-teal">Backend & Edge</div>
              <div className="mt-2 text-sm text-paper/80">
                Node.js · Express · Cloudflare Workers · D1 · KV · R2 · Socket.IO · REST
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-teal">Systems & Security</div>
              <div className="mt-2 text-sm text-paper/80">
                Rust · C · C++ · SQLite · PostgreSQL · Redis · PDPL · GDPR · Pen testing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition row — third-party credibility, fast to scan */}
      <section className="border-t border-paper/10 bg-ink/60 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/60">
            // Recognition
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="font-display text-xl text-paper">MIT Hacknation 2026</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-teal">Next Best Project</div>
              <p className="mt-2 text-sm text-paper/70">SmartSwap — client-side intent engine, MIT Sloan AI Club, 1,000+ devs, 65+ countries.</p>
            </div>
            <div>
              <div className="font-display text-xl text-paper">Redis Side Quest 2024</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-teal">Winner</div>
              <p className="mt-2 text-sm text-paper/70">RedAGPT — open-source AutoGPT + Langchain for AI-driven network vulnerability scanning.</p>
            </div>
            <div>
              <div className="font-display text-xl text-paper">325K+</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-teal">Monthly Medium readers</div>
              <p className="mt-2 text-sm text-paper/70">Cross-cultural GTM delivery across 13 countries. English, Bengali, Arabic, German.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA — repeated at the bottom for scroll-through readers */}
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl rounded-lg border border-paper/15 bg-paper/5 p-8 md:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-teal">
            // Ready to talk?
          </div>
          <h2 className="mt-3 max-w-3xl font-display text-3xl text-paper md:text-4xl">
            Send a brief, get a frame. I reply within 24 hours.
          </h2>
          <p className="mt-3 max-w-2xl text-paper/70">
            Roles I'm looking for: <strong className="text-paper">AI Architect</strong>,{" "}
            <strong className="text-paper">Solutions Engineer</strong>,{" "}
            <strong className="text-paper">Platform Engineer</strong>,{" "}
            <strong className="text-paper">Developer Experience</strong>,{" "}
            <strong className="text-paper">React Native</strong> (AI-adjacent). Dubai, Abu Dhabi, Riyadh, NEOM, or remote.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/connect?code=intro&ref=recruiter&audience=recruiter"
              className="rounded-md bg-accent-teal px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:bg-accent-teal/85"
            >
              Book a 15-min chat →
            </a>
            <a
              href="mailto:abir.abbas@proton.me?subject=Role%20%E2%80%94%20%28your%20company%29"
              className="rounded-md border border-paper/30 px-6 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:border-accent-teal hover:text-accent-teal"
            >
              Email directly
            </a>
            <a
              href="https://wa.me/971543618066?text=Hi%20Abir%2C%20I%27m%20hiring"
              className="font-mono text-sm uppercase tracking-[0.12em] text-paper/70 transition hover:text-accent-teal"
            >
              WhatsApp +971 54 361 8066
            </a>
          </div>
          <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">
            abir.abbas@proton.me · UAE Company Visa · No sponsorship · 24h reply
          </div>
        </div>
      </section>

      {/* HowTo JSON-LD — 5-step hiring flow, surfaced for AI Overview extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_LD) }}
      />
    </main>
  );
}

const HOWTO_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://abir.getwaved.ai/recruiter#howto-hire",
  name: "How to hire Mohammad Abir Abbas (Creative Technologist, AI Strategist & Emerging Technology Architect, Dubai) in 5 steps",
  description:
    "A short, 24-hour hiring flow for founders, SMEs, technical recruiters and hiring managers who want to bring Mohammad Abir Abbas onto a Creative Technologist, AI Strategist, Emerging Technology Architect, Solutions Engineer, or Platform Engineer role in Dubai, Abu Dhabi, Riyadh, NEOM, or global remote.",
  totalTime: "P1D",
  estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "0" },
  tool: [
    { "@type": "HowToTool", name: "abir.getwaved.ai/connect" },
    { "@type": "HowToTool", name: "abir.abbas@proton.me" },
    { "@type": "HowToTool", name: "WhatsApp +971 54 361 8066" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Send a one-paragraph brief",
      text: "Email abir.abbas@proton.me with the role title, scope, location, salary band, and start date. He replies within 24 hours — usually faster.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Book a 15-minute intro chat",
      text: "Use the calendar at abir.getwaved.ai/connect to grab a 15-minute slot. Pass code=intro&audience=recruiter to land on the recruiter-optimized page.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Receive a tailored one-pager",
      text: "After the intro, receive a one-pager mapping the brief to the closest of: AbaYa-Track case study, SmartSwap MIT write-up, RedAGPT architecture, or a new deck.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Loop in engineering",
      text: "Introduce Abir to the engineering manager and one peer. He runs a 60-minute technical deep-dive (system design, AI workflow walkthrough) for free.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Decide and onboard",
      text: "Decision within 5 working days. UAE Company Visa means onboarding in Dubai is 1–2 weeks, not 6. Start date negotiable from Q3 2026.",
    },
  ],
};
