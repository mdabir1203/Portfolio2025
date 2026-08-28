import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";

/**
 * EditorialScene — the "in plain text" section.
 *
 * Three columns: pitch, capabilities, pull-quote. Magazine layout.
 * Calm, type-led. No pinned scroll.
 */
const CAPABILITIES = [
  { k: "01", title: "AI Agent Workflows", note: "Production-grade, not a demo" },
  { k: "02", title: "Process Automation", note: "Pays for itself in 90 days" },
  { k: "03", title: "React + React Native", note: "One brain, two surfaces" },
  { k: "04", title: "Rust · C · C++", note: "When perf is the spec" },
  { k: "05", title: "Cross-cultural GTM", note: "EN · BN · DE · GCC" },
] as const;

export function EditorialScene() {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="cin-about py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-14">
          <div>
            <div className="cin-section-eyebrow">// About</div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-6xl">
              What I actually do,
              <br />
              <em>in plain text.</em>
            </h2>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>Read time · 45 sec</div>
            <div className="mt-1">Updated · Aug 2026</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12">
          {/* Pitch column */}
          <div className="md:col-span-4">
            <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
              I sit between{" "}
              <em className="text-[color:var(--accent-teal)] not-italic">
                AI research
              </em>{" "}
              and{" "}
              <em className="text-[color:var(--accent-amber)] not-italic">
                shippable product
              </em>
              . My job is to make sure the second one wins.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">
              Most "AI projects" die in a demo. I've shipped them across
              factory floors, payment rails, and EdTech. The pattern is
              always the same — instrumentation first, model second,
              automation third, scale fourth. Skip a step and the whole
              thing leaks.
            </p>
          </div>

          {/* Capabilities column */}
          <div className="md:col-span-5">
            <div className="cin-section-eyebrow mb-4">// Capabilities</div>
            <ul className="divide-y divide-rule border-y border-rule">
              {CAPABILITIES.map((c) => (
                <li
                  key={c.k}
                  className="cin-timeline-item !grid-cols-[50px_1fr] !gap-4 !py-4 md:!py-5"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
                    {c.k}
                  </span>
                  <div>
                    <div className="font-display text-xl leading-tight md:text-2xl">
                      {c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-muted md:text-sm">
                      {c.note}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pull-quote column */}
          <aside className="md:col-span-3">
            <motion.blockquote
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-rule bg-paper-2 p-5 md:p-6"
            >
              <span className="font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                &ldquo;
              </span>
              <p className="-mt-3 font-display text-lg leading-snug text-ink md:text-xl">
                Abir ships the thing the team was about to give up on.
              </p>
              <footer className="mt-4 text-xs text-ink-muted">
                <div className="font-mono uppercase tracking-[0.18em] text-ink">
                  — Peer review
                </div>
                <div>42 Wolfsburg · 2024</div>
              </footer>
            </motion.blockquote>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-rule bg-paper-2 p-3">
                <div className="cin-section-eyebrow text-[10px]">// years</div>
                <div className="mt-1 font-display text-2xl">7+</div>
              </div>
              <div className="rounded-xl border border-rule bg-paper-2 p-3">
                <div className="cin-section-eyebrow text-[10px]">// countries</div>
                <div className="mt-1 font-display text-2xl">13</div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 flex items-center gap-3 border-t border-rule pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted md:mt-16">
          <BrandMark size={22} variant="primary" />
          <span>By Mohammad Abir Abbas · est. 2018 · Dubai</span>
        </div>
      </div>
    </section>
  );
}
