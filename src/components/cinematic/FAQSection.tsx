// FAQSection — the recruiter Q&A.
//
// Copy rules (per the user's mandate):
//   * Ogilvy   — headline does 80% of the selling. Long copy > short copy.
//                Specific numbers, names, dates. Show, don't tell.
//   * Kotler   — STP at the top: who is this for, what position is he
//                claiming, why is the value worth your time. The
//                "Positioning line" makes the 4Ps obvious.
//   * Marie Forleo — clarity over cleverness. First-person. The reader
//                can picture the room after reading each answer.
//
// Funky interactivity:
//   * Sticky progress rail (left) — vertical dot navigation, big bold
//     numbers 01-09, highlights the question currently in view.
//   * Big-number chips on each row — oversized serif numerals on the
//     left of every question, accent color, slightly tilted.
//   * Receipt link under each answer — points at the proof (case study,
//     press kit, contact form). Kotler: "show, don't claim."
//   * Hover state — question rows lift 4px on hover with the teal
//     accent underline drawing in.
//   * Giant "?" watermark — sits behind the section at low opacity,
//     pulls the eye to the FAQ block as a distinct chapter.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "./microinteractions/Magnetic";
import { PulseDot } from "./microinteractions/PulseDot";
import type { FAQItem } from "@/data/recruiterFaq";

export type { FAQItem };

interface FAQSectionProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  /** Positioning statement — short, declarative, Kotler STP. */
  positioning?: string;
  intro?: string;
  items: FAQItem[];
  variant?: "paper" | "ink";
  jsonLdId?: string;
}

/* ------------------------------------------------------------------ */
/* Row — one Q+A.                                                      */
/* ------------------------------------------------------------------ */
function FaqRow({
  item,
  index,
  isOpen,
  onToggle,
  isInView,
  variant,
  receipt,
  reduce,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
  variant: "paper" | "ink";
  receipt?: FAQItem["receipt"];
  reduce: boolean;
}) {
  const isInk = variant === "ink";
  const rowRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.article
      ref={rowRef}
      id={`faq-${index + 1}`}
      data-faq-row
      data-index={index + 1}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{
        duration: 0.55,
        delay: 0.04 * index,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={`group relative border-b py-7 transition-all duration-300 md:py-9 ${
        isInk ? "border-paper/10" : "border-ink/10"
      }`}
    >
      {/* Active accent stripe — appears when this row is in view */}
      <span
        aria-hidden
        className="absolute -left-6 top-7 hidden h-[calc(100%-3.5rem)] w-[3px] rounded-full bg-accent-teal transition-opacity duration-500 md:block"
        style={{ opacity: isInView ? 1 : 0 }}
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index + 1}`}
        className={`flex w-full items-start gap-5 text-left transition-transform duration-300 group-hover:-translate-y-[2px] md:gap-7 ${
          isInk ? "text-paper" : "text-ink"
        }`}
      >
        {/* Big number — Ogilvy: typographic hierarchy. */}
        <span
          aria-hidden
          className="cin-faq-num shrink-0 font-serif text-3xl leading-none md:text-4xl"
          style={{
            color: isInView ? '#0f7569' : isInk ? 'rgba(246,241,232,0.4)' : 'rgba(26,26,26,0.4)',
            transform: isInView ? 'rotate(-3deg)' : 'rotate(0deg)',
            transition: 'color 300ms, transform 400ms',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h3
            className={`font-display text-2xl leading-snug md:text-3xl ${
              isInk ? "text-paper" : "text-ink"
            }`}
          >
            {item.q}
          </h3>
        </div>
        {/* Animated chevron — opens from "+" to "×" via rotation */}
        <span
          aria-hidden
          className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "rotate-45 border-accent-teal bg-accent-teal/10 text-accent-teal"
              : isInk
                ? "border-paper/30 text-paper/70 group-hover:border-paper/60"
                : "border-ink/25 text-ink/60 group-hover:border-ink/60"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </span>
      </button>
      {/* Answer panel — slides open */}
      <motion.div
        id={`faq-panel-${index + 1}`}
        initial={false}
        animate={
          isOpen
            ? { height: 'auto', opacity: 1, marginTop: 16 }
            : reduce
              ? { height: 0, opacity: 0, marginTop: 0 }
              : { height: 0, opacity: 0, marginTop: 0 }
        }
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <p
            className={`max-w-3xl text-base leading-relaxed md:text-lg ${
              isInk ? "text-paper/80" : "text-ink/80"
            }`}
          >
            {item.a}
          </p>
          {receipt && (
            <a
              href={receipt.href}
              className={`group/rec inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                isInk
                  ? "border-paper/20 text-paper/80 hover:border-accent-teal hover:text-accent-teal"
                  : "border-ink/15 text-ink/70 hover:border-accent-teal hover:text-accent-teal"
              }`}
            >
              {receipt.label}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover/rec:-translate-y-0.5 group-hover/rec:translate-x-0.5" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export function FAQSection({
  id = "faq",
  eyebrow = "// Recruiter FAQ · 2026",
  heading,
  positioning,
  intro,
  items,
  variant = "paper",
  jsonLdId = "https://abir.getwaved.ai/#faq-page",
}: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const reduce = useReducedMotion();
  const isInk = variant === "ink";
  // Track which question is in view — powers the sticky rail.
  useEffect(() => {
    const rows = document.querySelectorAll('[data-faq-row]');
    if (rows.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the row whose top is closest to the viewport top.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          Math.abs((a.target as HTMLElement).getBoundingClientRect().top) <
          Math.abs((b.target as HTMLElement).getBoundingClientRect().top)
            ? a
            : b,
        );
        const idx = Number((top.target as HTMLElement).dataset.index) - 1;
        if (!Number.isNaN(idx)) setActiveIdx(idx);
      },
      { rootMargin: '-20% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    rows.forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": jsonLdId,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-6 py-20 md:px-12 md:py-28 ${
        isInk ? "bg-ink text-paper" : "bg-paper text-ink"
      }`}
    >
      {/* Giant "?" watermark — pulls the eye, frames the chapter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="cin-faq-watermark select-none font-serif text-[60vw] leading-none md:text-[40vw]"
          style={{
            color: isInk ? 'rgba(15,117,105,0.08)' : 'rgba(15,117,105,0.06)',
          }}
        >
          ?
        </span>
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-[200px_1fr] md:gap-16">
        {/* Sticky left rail — vertical dot nav. */}
        <aside className="hidden md:block">
          <div className="sticky top-32">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
              // questions
            </div>
            <ol className="mt-5 space-y-3">
              {items.map((it, i) => {
                const isActive = i === activeIdx;
                return (
                  <li key={i}>
                    <a
                      href={`#faq-${i + 1}`}
                      className="group flex items-center gap-3 transition-colors"
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span
                        aria-hidden
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300"
                        style={{
                          borderColor: isActive ? '#0f7569' : isInk ? 'rgba(246,241,232,0.25)' : 'rgba(26,26,26,0.2)',
                          background: isActive ? 'rgba(15,117,105,0.1)' : 'transparent',
                        }}
                      >
                        <span
                          className="font-mono text-[9px] font-medium"
                          style={{ color: isActive ? '#0f7569' : isInk ? 'rgba(246,241,232,0.55)' : 'rgba(26,26,26,0.55)' }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                          isActive
                            ? 'text-[color:var(--accent-teal)]'
                            : isInk
                              ? 'text-paper/60 group-hover:text-paper'
                              : 'text-ink/60 group-hover:text-ink'
                        }`}
                      >
                        {isActive ? 'reading' : 'jump to'}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 h-px w-24 bg-[color:var(--ink-faint)] opacity-30" />
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Q {String(activeIdx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </div>
          </div>
        </aside>
        {/* Right column — header + Q&A stack */}
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-teal">
            {eyebrow}
          </div>
          <h2
            className={`mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl ${
              isInk ? "text-paper" : "text-ink"
            }`}
          >
            {heading}
          </h2>
          {/* Positioning line — Kotler STP in one breath. */}
          {positioning && (
            <p
              className={`mt-5 max-w-2xl font-display text-xl leading-snug md:text-2xl ${
                isInk ? "text-accent-teal" : "text-accent-teal"
              }`}
            >
              {positioning}
            </p>
          )}
          {intro && (
            <p
              className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${
                isInk ? "text-paper/75" : "text-ink/75"
              }`}
            >
              {intro}
            </p>
          )}
          <div className="mt-12 border-t border-current/10">
            {items.map((it, i) => (
              <FaqRow
                key={i}
                item={it}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))}
                isInView={i === activeIdx}
                variant={variant}
                receipt={it.receipt}
                reduce={!!reduce}
              />
            ))}
          </div>
          {/* Closing CTA — Ogilvy: end with a call to action. */}
          <div
            className={`mt-12 flex flex-wrap items-center gap-3 rounded-2xl border p-6 md:p-8 ${
              isInk
                ? "border-accent-teal/30 bg-accent-teal/5"
                : "border-accent-teal/30 bg-accent-teal/5"
            }`}
          >
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-teal">
                // next step
              </div>
              <div className="mt-1 font-display text-xl text-ink md:text-2xl dark:text-paper">
                Still on the fence? The fastest path is a 15-minute chat.
              </div>
              <div className="mt-1 text-sm text-ink/70 dark:text-paper/70">
                Email abir.abbas@proton.me · WhatsApp +971 54 361 8066 · 24-hour reply.
              </div>
            </div>
            <Magnetic strength={16}>
              <a
                href="/connect?code=intro&ref=faq&audience=recruiter"
                className="inline-flex items-center gap-2 rounded-md bg-accent-teal px-5 py-3 font-mono text-sm uppercase tracking-[0.12em] text-paper transition hover:bg-accent-teal/85"
              >
                Book a 15-min chat
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

// Re-export FAQItem type and RECRUITER_FAQ data from the standalone
// data file. This keeps the lazy FAQSection chunk small (it doesn't
// need to inline the data array) while consumers can still import
// `RECRUITER_FAQ` from `@/components/cinematic/FAQSection` for back-compat.
export { RECRUITER_FAQ } from "@/data/recruiterFaq";
export type { FAQItem } from "@/data/recruiterFaq";
