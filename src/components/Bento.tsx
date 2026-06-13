import { lazy, Suspense, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Code2,
  Link as LinkIcon,
  Mail,
  Globe2,
  Cpu,
  Workflow,
  Zap,
  TrendingUp,
  Download,
  Trophy,
  CirclePlay,
  BookOpen,
  Factory,
  BriefcaseBusiness,
} from "lucide-react";
import abir from "@/assets/abir.webp";
import IdentityHeroBento from "@/components/IdentityHeroBento";
import TestimonialsMarquee from "@/components/TestimonialsCard";
import ChatWidget from "@/components/ChatWidget";

const MediumCard = lazy(() => import("@/components/MediumCard"));
const YoutubeStrip = lazy(() => import("@/components/YoutubeStrip"));

function useSpotlight() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frameId: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const target = e.target as HTMLElement | null;
        const card = target?.closest<HTMLElement>(".bento");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };

    root.addEventListener("mousemove", onMove);
    return () => {
      root.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameId);
    };
  }, []);
  return ref;
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
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
  const { lang, toggle } = useLanguage();
  const tx = translations[lang];
  return (
    <main
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen px-4 py-6 md:px-8 md:py-10 print:p-0"
    >
      {/* Top bar */}
      <header className="mx-auto mb-6 flex max-w-[1280px] items-center justify-between print:hidden">
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-foreground/70">
          <span className="pulse-dot" /> {tx.nav.available}
        </div>
        <nav className="hidden items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 md:flex">
          <Link to="/work" className="hover:text-foreground">{tx.nav.work}</Link>
          <a href="#stack" className="hover:text-foreground">{tx.nav.stack}</a>
          <a href="mailto:abir.abbas@proton.me" className="hover:text-foreground">{tx.nav.contact}</a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-foreground/70 hover:bg-white/10"
            >
              <Download className="h-3 w-3" /> {tx.nav.resume}
            </button>
            <a
              href="/cv-ats.html"
              download="Abir_Abbas_CV_ATS.html"
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-teal)]/40 bg-[color:var(--accent-teal)]/10 px-3 py-1 text-[color:var(--accent-teal)] hover:bg-[color:var(--accent-teal)]/20"
            >
              <Download className="h-3 w-3" /> {tx.nav.ats}
            </a>
            <button
              onClick={toggle}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-foreground/70 hover:bg-white/10 transition-colors"
            >
              {tx.nav.langSwitch}
            </button>
          </div>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/work"
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 active:scale-95 transition-transform"
          >
            {tx.nav.work}
          </Link>
          <a
            href="mailto:abir.abbas@proton.me"
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent-teal)]/40 bg-[color:var(--accent-teal)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)] active:scale-95 transition-transform"
          >
            <Mail className="h-3 w-3" /> {tx.nav.contact}
          </a>
          <button
            onClick={toggle}
            aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-foreground/60 active:scale-95 transition-transform"
          >
            {tx.nav.langSwitch}
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <section className="mx-auto grid max-w-[1280px] auto-rows-[minmax(120px,auto)] grid-cols-1 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
        {/* HERO — name + pitch (cinematic VFX) */}
        <IdentityHeroBento {...fade(0)} />

        {/* PORTRAIT */}
        <motion.div
          {...fade(0.05)}
          className="group bento relative !p-0 sm:col-span-2 md:col-span-2 md:row-span-2"
        >
          <img
            src={abir}
            alt="Mohammad Abir Abbas — Creative Technologist and AI Architect"
            className="h-full w-full object-cover grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-focus-within:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bento)] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)]">
                Now
              </div>
              <div className="text-sm text-foreground/90">CTA · Wavelink</div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <a
                href="https://www.linkedin.com/in/abir-abbas"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 p-2 transition hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@wavelinkd"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 p-2 transition hover:bg-white/10"
                aria-label="Wavelink on YouTube"
              >
                <CirclePlay className="h-4 w-4" />
              </a>
              <a
                href="https://medium.com/@md.abir1203"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 p-2 transition hover:bg-white/10"
                aria-label="Medium articles"
              >
                <BookOpen className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* METRIC 1 */}
        <motion.div {...fade(0.1)} className="bento sm:col-span-2 md:col-span-2 active:scale-[0.97] transition-transform cursor-default">
          <Tag>{tx.metrics.m1tag}</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-lime)]">40%</span>
            <TrendingUp className="h-5 w-5 text-[color:var(--accent-lime)]" />
          </div>
          <p className="mt-2 text-xs text-foreground/60">{tx.metrics.m1label}</p>
        </motion.div>

        {/* METRIC 2 */}
        <motion.div {...fade(0.15)} className="bento sm:col-span-2 md:col-span-2 active:scale-[0.97] transition-transform cursor-default">
          <Tag>{tx.metrics.m2tag}</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-amber)]">−30%</span>
          </div>
          <p className="mt-2 text-xs text-foreground/60">{tx.metrics.m2label}</p>
        </motion.div>

        {/* METRIC 3 */}
        <motion.div {...fade(0.2)} className="bento md:col-span-2 active:scale-[0.97] transition-transform cursor-default">
          <Tag>{tx.metrics.m3tag}</Tag>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-6xl leading-none text-[color:var(--accent-teal)]">−35%</span>
          </div>
          <p className="mt-2 text-xs text-foreground/60">{tx.metrics.m3label}</p>
        </motion.div>

        {/* ROLE / NOW */}
        <motion.div {...fade(0.1)} id="work" className="bento sm:col-span-4 md:col-span-4">
          <div className="flex items-center justify-between">
            <Tag>{tx.building.tag}</Tag>
            <span className="font-mono text-[10px] text-foreground/40">{tx.building.period}</span>
          </div>
          <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            {tx.building.title1}{" "}
            <span className="text-foreground/50">{tx.building.title2}</span>
          </h3>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
            {tx.building.tags.map((t) => (
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
              {tx.building.cta} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wave-link-cards.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground hover:gap-2 transition-all"
            >
              {tx.building.explore} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* CONTACT CTA */}
        <motion.div
          {...fade(0.15)}
          className="bento bento-feature flex flex-col justify-between sm:col-span-2 md:col-span-2"
        >
          <Tag>{tx.contact.tag}</Tag>
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
              {tx.contact.brief} <ArrowUpRight className="h-3 w-3" />
            </div>
          </a>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="mailto:abir.abbas@proton.me" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Email"><Mail className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/in/abir-abbas" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="LinkedIn"><LinkIcon className="h-4 w-4" /></a>
            <a href="https://github.com/mdabir1203" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Github"><Code2 className="h-4 w-4" /></a>
            <a href="https://www.youtube.com/@wavelinkd" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Wavelink on YouTube"><CirclePlay className="h-4 w-4" /></a>
            <a href="https://medium.com/@md.abir1203" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 hover:bg-white/10" aria-label="Medium articles"><BookOpen className="h-4 w-4" /></a>
          </div>
        </motion.div>

        {/* CAPABILITIES */}
        <motion.div {...fade(0.1)} id="stack" className="bento sm:col-span-2 md:col-span-2">
          <Tag>{tx.capabilities.tag}</Tag>
          <ul className="mt-4 space-y-3 text-sm">
            {[Cpu, Workflow, Zap, Code2, Globe2].map((Icon, i) => (
              <li key={i} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-[color:var(--accent-teal)]" />
                {tx.capabilities.items[i]}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* TIMELINE */}
        <motion.div {...fade(0.15)} className="bento sm:col-span-2 md:col-span-2">
          <Tag>{tx.path.tag}</Tag>
          <ol className="mt-4 space-y-3 font-mono text-xs text-foreground/70">
            {tx.path.items.map(([year, role]) => (
              <li key={role} className="flex gap-3">
                <span className="text-foreground/40">{year}</span> {role}
              </li>
            ))}
          </ol>
        </motion.div>

        {/* MEDIUM */}
        <motion.div {...fade(0.2)} className="bento sm:col-span-4 md:col-span-4">
          <Suspense fallback={<div className="h-48 w-full animate-pulse rounded-xl bg-white/5" />}>
            <MediumCard />
          </Suspense>
        </motion.div>

        {/* LANGUAGES */}
        <motion.div {...fade(0.25)} className="bento sm:col-span-4 md:col-span-2">
          <Tag>{tx.spoken.tag}</Tag>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {tx.spoken.langs.map((x) => (
              <div key={x.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="font-display text-2xl">{x.l}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">{x.s}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AWARDS */}
        <motion.div {...fade(0.1)} className="bento sm:col-span-4 md:col-span-4">
          <Tag>{tx.recognition.tag}</Tag>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tx.recognition.items.map((item, i) => (
              <div key={item.name} className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${i === 0 ? 'bg-[color:var(--accent-teal)]/10 text-[color:var(--accent-teal)]' : 'bg-[color:var(--accent-amber)]/10 text-[color:var(--accent-amber)]'}`}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl leading-tight">{item.name}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-foreground/50">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GCC EXECUTIVE SIGNAL — AbayaTrack / Famous Ladies Gowns */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="bento bento-feature grain sm:col-span-4 md:col-span-4 border-[color:var(--accent-amber)]/25 bg-[color:var(--accent-amber)]/[0.02]"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-[color:var(--accent-amber)]" />
                <Tag>{tx.abayatrack.tag}</Tag>
              </div>
              <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                {tx.abayatrack.title1}{" "}
                <span className="text-[color:var(--accent-amber)]">{tx.abayatrack.title2}</span>
              </h3>
              <p className="mt-2 max-w-lg text-sm text-foreground/70">{tx.abayatrack.desc}</p>
              <Link
                to="/work"
                className="mt-4 inline-flex items-center gap-1 text-sm text-[color:var(--accent-amber)] transition-all hover:gap-2"
              >
                {tx.abayatrack.cta} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:w-72 shrink-0">
              {tx.abayatrack.metrics.map(({ v, l, tone }) => (
                <div key={l} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className={`font-display text-3xl leading-none ${
                    tone === "amber" ? "text-[color:var(--accent-amber)]" :
                    tone === "lime" ? "text-[color:var(--accent-lime)]" :
                    "text-[color:var(--accent-teal)]"
                  }`}>{v}</div>
                  <div className="mt-1 text-[10px] text-foreground/55">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* GCC OPEN TO WORK — executive recruiter hook */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          className="bento sm:col-span-4 md:col-span-2 flex flex-col justify-between"
        >
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-[color:var(--accent-lime)]" />
            <Tag>{tx.gcc.tag}</Tag>
          </div>
          <div className="mt-4 space-y-3">
            {tx.gcc.items.map((line) => (
              <div key={line} className="flex items-start gap-2 text-sm text-foreground/75">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent-lime)]" />
                {line}
              </div>
            ))}
          </div>
          <a
            href="mailto:abir.abbas@proton.me?subject=Executive%20Opportunity%20%E2%80%94%20GCC"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--accent-lime)]/30 bg-[color:var(--accent-lime)]/[0.06] py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--accent-lime)] transition-all hover:bg-[color:var(--accent-lime)]/10 active:scale-95"
          >
            <Mail className="h-3.5 w-3.5" /> {tx.gcc.cta}
          </a>
        </motion.div>

        {/* YOUTUBE — latest from @wavelinkd via public RSS */}
        <motion.div {...fade(0.15)} className="bento sm:col-span-2 md:col-span-2">
          <Suspense
            fallback={
              <div>
                <div className="flex items-center justify-between">
                  <Tag>// Watch</Tag>
                  <div className="h-4 w-4 animate-pulse rounded bg-white/10" aria-hidden />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="aspect-video animate-pulse rounded-md bg-white/5" />
                  ))}
                </div>
                <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/5" aria-hidden />
              </div>
            }
          >
            <YoutubeStrip />
          </Suspense>
        </motion.div>

        {/* ATS CV CTA for Recruiters */}
        <motion.div
          {...fade(0.2)}
          className="bento sm:col-span-2 md:col-span-2 flex flex-col justify-between border-[color:var(--accent-teal)]/20 bg-[color:var(--accent-teal)]/[0.02]"
        >
          <div>
            <Tag>{tx.recruiter.tag}</Tag>
            <h3 className="mt-3 font-display text-2xl leading-tight">
              {tx.recruiter.title1} <br />
              <span className="text-[color:var(--accent-teal)]">{tx.recruiter.title2}</span>
            </h3>
            <p className="mt-2 text-xs text-foreground/60">{tx.recruiter.desc}</p>
          </div>
          <a
            href="/cv-ats.html"
            download="Abir_Abbas_CV_ATS.html"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--accent-teal)] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-4 w-4" /> {tx.recruiter.cta}
          </a>
        </motion.div>
      </section>

      {/* Testimonials */}
      <TestimonialsMarquee />

      <footer className="mx-auto mt-6 flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-24 md:mb-0">
        <span>{tx.footer.rights}</span>
        <span>{tx.footer.tagline}</span>
      </footer>

      {/* Sticky mobile CTA — highest-conversion element on mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-[color:var(--bento)]/95 p-2.5 backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.5)]">
          <a
            href="mailto:abir.abbas@proton.me"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[color:var(--accent-teal)] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[color:var(--ink)] active:scale-95 transition-transform"
          >
            <Mail className="h-4 w-4" /> {tx.mobileCta}
          </a>
          <a
            href="https://www.linkedin.com/in/abir-abbas"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-foreground/70 active:scale-95 transition-transform"
            aria-label="LinkedIn"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="/cv-ats.html"
            download="Abir_Abbas_CV_ATS.html"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-foreground/70 active:scale-95 transition-transform"
            aria-label="Download CV"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>
      <ChatWidget />
    </main>
  );
}
