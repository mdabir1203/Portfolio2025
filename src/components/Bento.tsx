import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Code2,
  Link as LinkIcon,
  Mail,
  MapPin,
  Sparkles,
  Globe2,
  Cpu,
  Workflow,
  Zap,
  TrendingUp,
  Download,
} from "lucide-react";
import abir from "@/assets/abir.webp";
import MediumCard from "@/components/MediumCard";

function useSpotlight() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".bento");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, []);
  return ref;
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
      {children}
    </span>
  );
}

export default function Bento() {
  const ref = useSpotlight();
  return (
    <main
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen px-4 py-6 md:px-8 md:py-10 print:p-0"
    >
      {/* Top bar */}
      <header className="mx-auto mb-6 flex max-w-[1280px] items-center justify-between print:hidden">
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-foreground/70">
          <span className="pulse-dot" /> AVAILABLE — Q1 2026
        </div>
        <nav className="hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 md:flex">
          <Link to="/work" className="hover:text-foreground">Work</Link>
          <a href="#stack" className="hover:text-foreground">Stack</a>
          <a href="mailto:abir.abbas@proton.me" className="hover:text-foreground">Contact</a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-teal)]/40 bg-[color:var(--accent-teal)]/10 px-3 py-1 text-[color:var(--accent-teal)] hover:bg-[color:var(--accent-teal)]/20"
          >
            <Download className="h-3 w-3" /> Resume
          </button>
        </nav>
        <button
          onClick={() => window.print()}
          aria-label="Download resume"
          className="md:hidden inline-flex items-center gap-1 rounded-full border border-[color:var(--accent-teal)]/40 bg-[color:var(--accent-teal)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)]"
        >
          <Download className="h-3 w-3" /> PDF
        </button>
      </header>

      {/* Bento Grid */}
      <section className="mx-auto grid max-w-[1280px] auto-rows-[minmax(120px,auto)] grid-cols-1 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
        {/* HERO — name + pitch */}
        <motion.div
          {...fade(0)}
          className="bento bento-feature grain sm:col-span-4 md:col-span-4 md:row-span-2"
        >
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <Tag>// Creative Technologist · 2026</Tag>
              <Sparkles className="h-4 w-4 text-[color:var(--accent-teal)]" />
            </div>
            <div>
              <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
                Mohammad <br />
                Abir <em className="text-[color:var(--accent-teal)]">Abbas.</em>
              </h1>
              <p className="mt-5 max-w-xl text-sm text-foreground/70 md:text-base">
                I deploy <span className="text-foreground">AI workflows</span> that protect enterprise assets
                and recapture thousands of engineering hours — turning "magic" tech into{" "}
                <span className="text-foreground">predictable ROI</span>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Chattogram → Relocating</span>
              <span>13 Countries</span>
              <span>269K+ Readers</span>
            </div>
          </div>
        </motion.div>

        {/* PORTRAIT */}
        <motion.div
          {...fade(0.05)}
          className="bento relative !p-0 sm:col-span-2 md:col-span-2 md:row-span-2"
        >
          <img
            src={abir}
            alt="Mohammad Abir Abbas — Creative Technologist and AI Architect"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bento)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)]">
                Now
              </div>
              <div className="text-sm text-foreground/90">CTA · Wavelink</div>
            </div>
            <a
              href="https://www.linkedin.com/in/abir-abbas"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 p-2 transition hover:bg-white/10"
              aria-label="LinkedIn"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* METRIC 1 */}
        <motion.div {...fade(0.1)} className="bento sm:col-span-2 md:col-span-2">
          <Tag>// Engaze.ai integration</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-lime)]">40%</span>
            <TrendingUp className="h-5 w-5 text-[color:var(--accent-lime)]" />
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            Faster payment processing for 50+ sellers at Deep Blue Digital.
          </p>
        </motion.div>

        {/* METRIC 2 */}
        <motion.div {...fade(0.15)} className="bento sm:col-span-2 md:col-span-2">
          <Tag>// Midjourney × Zapier</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-amber)]">−30%</span>
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            Customer Acquisition Cost cut via AI-driven marketing automation.
          </p>
        </motion.div>

        {/* METRIC 3 */}
        <motion.div {...fade(0.2)} className="bento md:col-span-2">
          <Tag>// MTTR</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-teal)]">−35%</span>
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            Mean-time-to-resolution at HNM IT, Frankfurt — 99.9% uptime.
          </p>
        </motion.div>

        {/* ROLE / NOW */}
        <motion.div {...fade(0.1)} id="work" className="bento sm:col-span-4 md:col-span-4">
          <div className="flex items-center justify-between">
            <Tag>// Currently Building</Tag>
            <span className="font-mono text-[10px] text-foreground/40">2025 — Present</span>
          </div>
          <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            Wavelink — smart NFC networking.{" "}
            <span className="text-foreground/50">One tap. Zero paper. GDPR-compliant.</span>
          </h3>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
            {["GTM Strategy", "Pipeline Design", "Process Optimization", "100% Compliance"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/work"
              className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent-teal)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--ink)] hover:gap-2 transition-all"
            >
              See case studies <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wave-link-cards.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground hover:gap-2 transition-all"
            >
              Explore Wavelink <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* CONTACT CTA */}
        <motion.div
          {...fade(0.15)}
          className="bento bento-feature flex flex-col justify-between sm:col-span-2 md:col-span-2"
        >
          <Tag>// Let's talk</Tag>
          <a
            href="mailto:abir.abbas@proton.me"
            className="group mt-2 block"
          >
            <div className="font-display text-2xl leading-tight md:text-3xl">
              abir.abbas
              <br />
              <span className="text-[color:var(--accent-teal)]">@proton.me</span>
            </div>
            <div className="mt-4 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 group-hover:text-foreground">
              Send a brief <ArrowUpRight className="h-3 w-3" />
            </div>
          </a>
          <div className="mt-4 flex gap-2">
            <a href="mailto:abir.abbas@proton.me" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Email"><Mail className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/in/abir-abbas" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="LinkedIn"><LinkIcon className="h-4 w-4" /></a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Github"><Code2 className="h-4 w-4" /></a>
          </div>
        </motion.div>

        {/* CAPABILITIES */}
        <motion.div {...fade(0.1)} id="stack" className="bento sm:col-span-2 md:col-span-2">
          <Tag>// Capabilities</Tag>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Cpu className="h-4 w-4 text-[color:var(--accent-teal)]" /> AI Agent Workflows</li>
            <li className="flex items-center gap-3"><Workflow className="h-4 w-4 text-[color:var(--accent-teal)]" /> Process Automation</li>
            <li className="flex items-center gap-3"><Zap className="h-4 w-4 text-[color:var(--accent-teal)]" /> React / React Native</li>
            <li className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-[color:var(--accent-teal)]" /> Cross-cultural GTM</li>
          </ul>
        </motion.div>

        {/* TIMELINE */}
        <motion.div {...fade(0.15)} className="bento sm:col-span-2 md:col-span-2">
          <Tag>// Path</Tag>
          <ol className="mt-4 space-y-3 font-mono text-xs text-foreground/70">
            <li className="flex gap-3"><span className="text-foreground/40">25→</span> Wavelink · CTA</li>
            <li className="flex gap-3"><span className="text-foreground/40">24→</span> Deep Blue Digital · Co-Founder</li>
            <li className="flex gap-3"><span className="text-foreground/40">23→</span> HNM IT · Frankfurt</li>
            <li className="flex gap-3"><span className="text-foreground/40">22→</span> 42 Wolfsburg · C/C++</li>
            <li className="flex gap-3"><span className="text-foreground/40">22→</span> phaeno gGmbH · Robotics Mentor</li>
          </ol>
        </motion.div>

        {/* MEDIUM */}
        <motion.div {...fade(0.2)} className="bento sm:col-span-4 md:col-span-4">
          <MediumCard />
        </motion.div>

        {/* LANGUAGES */}
        <motion.div {...fade(0.25)} className="bento sm:col-span-4 md:col-span-2">
          <Tag>// Spoken</Tag>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { l: "EN", s: "IELTS 7.5" },
              { l: "BN", s: "Native" },
              { l: "DE", s: "Goethe A2" },
            ].map((x) => (
              <div key={x.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="font-display text-2xl">{x.l}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">{x.s}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bento)] py-4">
        <div className="marquee font-display text-3xl text-foreground/40 md:text-5xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
              <span>AI Architect</span><span>·</span>
              <span className="text-[color:var(--accent-teal)] italic">Creative Technologist</span><span>·</span>
              <span>GTM Strategist</span><span>·</span>
              <span>Automation</span><span>·</span>
              <span className="italic">Wavelink</span><span>·</span>
              <span>13 Countries</span><span>·</span>
              <span>Relocating 2026</span><span>·</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-6 flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        <span>© 2026 — Abir Abbas</span>
        <span>Built for the 3-second glance.</span>
      </footer>
    </main>
  );
}
