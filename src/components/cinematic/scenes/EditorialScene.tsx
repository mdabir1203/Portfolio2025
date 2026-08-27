import { motion, useReducedMotion } from "framer-motion";

/**
 * Reel 02 — Editorial density.
 *
 * Magazine-style layout. Three columns, asymmetric. Heavy type, light
 * dividers, a small inset pull-quote, and a meta strip at the bottom.
 * Built for recruiters who want the resume facts in one quick read.
 */
export function EditorialScene() {
  const reduce = useReducedMotion();
  return (
    <section
      id="about"
      className="cin-editorial relative w-full px-6 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="cin-editorial-header mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-foreground/10 pb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              // Reel 02 — In plain text
            </div>
            <h2 className="cin-editorial-title mt-3 font-display text-3xl leading-[0.95] tracking-tight md:text-5xl">
              What I actually do,
              <br />
              <span className="text-foreground/60">in one screen.</span>
            </h2>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <div>Read time · 45 sec</div>
            <div>Last updated · Aug 2026</div>
          </div>
        </header>

        <div className="cin-editorial-grid grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12">
          {/* Column 1 — Pitch (3 cols) */}
          <div className="md:col-span-4">
            <p className="cin-editorial-pitch font-display text-xl leading-snug md:text-2xl">
              I sit between{" "}
              <span className="text-[color:var(--accent-teal)]">
                AI research
              </span>{" "}
              and{" "}
              <span className="text-[color:var(--accent-amber)]">
                shippable product
              </span>
              . My job is to make sure the second one wins.
            </p>
            <p className="cin-editorial-body mt-5 text-sm leading-relaxed text-foreground/70 md:text-base">
              Most "AI projects" die in a demo. I've shipped them across
              factory floors, payment rails, and EdTech. The pattern is
              always the same — instrumentation first, model second, automation
              third, scale fourth. Skip a step and the whole thing leaks.
            </p>
          </div>

          {/* Column 2 — Capabilities (5 cols) */}
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              // Capabilities
            </div>
            <ul className="cin-editorial-list mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
              {CAPABILITIES.map((c) => (
                <li
                  key={c.k}
                  className="cin-editorial-row flex items-baseline gap-4 py-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                    {c.k}
                  </span>
                  <span className="flex-1 font-display text-lg leading-snug md:text-xl">
                    {c.title}
                  </span>
                  <span className="hidden text-right text-xs text-foreground/55 md:block md:max-w-[14rem]">
                    {c.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Pull quote (4 cols) */}
          <aside className="md:col-span-3">
            <motion.blockquote
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="cin-editorial-quote rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-md md:p-6"
            >
              <span className="font-display text-4xl leading-none text-[color:var(--accent-teal)]">
                &ldquo;
              </span>
              <p className="-mt-3 font-display text-lg leading-snug md:text-xl">
                Abir ships the thing the team was about to give up on.
              </p>
              <footer className="mt-4 text-xs text-foreground/55">
                <div className="font-mono uppercase tracking-[0.3em] text-foreground/70">
                  — Anonymous peer review
                </div>
                <div>42 Wolfsburg cohort · 2024</div>
              </footer>
            </motion.blockquote>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3 backdrop-blur-md">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
                  // years shipping
                </div>
                <div className="mt-1 font-display text-2xl">7+</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3 backdrop-blur-md">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
                  // countries
                </div>
                <div className="mt-1 font-display text-2xl">13</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Meta strip */}
        <div className="cin-editorial-meta mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-foreground/10 pt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55">
          <span>·Wavelink 2025→</span>
          <span>·Deep Blue Digital 2024→</span>
          <span>·HNM IT Frankfurt 2023</span>
          <span>·42 Wolfsburg 2022–24</span>
          <span>·phaeno gGmbH 2022</span>
        </div>
      </div>
    </section>
  );
}

const CAPABILITIES = [
  {
    k: "01",
    title: "AI Agent Workflows",
    note: "Production-grade, not a demo",
  },
  {
    k: "02",
    title: "Process Automation",
    note: "Pays for itself in 90 days",
  },
  {
    k: "03",
    title: "React + React Native",
    note: "One brain, two surfaces",
  },
  {
    k: "04",
    title: "Rust · C · C++",
    note: "When perf is the spec",
  },
  {
    k: "05",
    title: "Cross-cultural GTM",
    note: "EN · BN · DE · GCC",
  },
] as const;
