import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SectionShell } from "@/components/cinematic/SectionShell";
import ContactForm from "@/components/ContactForm";

/**
 * Reel 06 — Closing.
 *
 * A pinned 100vh moment: the closing line lands as you scroll into the
 * section, then unlocks as you continue. The form sits below on its
 * own scroll. Two rhythms in one section.
 */
export function ContactScene() {
  const reduce = useReducedMotion();
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.95], [0, 1, 1, 0]);
  const subY = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.95], [0, 1, 1, 0]);

  return (
    <>
      <section
        ref={introRef}
        id="contact"
        className="cin-contact-intro relative h-[140vh] w-full"
      >
        <div className="cin-contact-pin sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <div
            className="cin-contact-bg pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(60% 60% at 50% 60%, oklch(0.78 0.14 180 / 0.18) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="mx-auto w-full max-w-5xl px-6 text-center">
            <motion.div
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55"
              style={{ opacity: titleOpacity }}
            >
              Reel 06 · Closing
            </motion.div>
            <motion.h2
              className="cin-contact-title mt-6 font-display text-[clamp(2.4rem,8vw,6.5rem)] leading-[0.95] tracking-tight"
              style={{ y: reduce ? undefined : titleY, opacity: titleOpacity }}
            >
              Send a brief.
              <br />
              <span className="text-[color:var(--accent-teal)]">Get a film.</span>
            </motion.h2>
            <motion.p
              className="cin-contact-sub mx-auto mt-6 max-w-xl text-base text-foreground/70 md:text-lg"
              style={{ y: reduce ? undefined : subY, opacity: subOpacity }}
            >
              One line is enough. Tell me the problem, the deadline, and what success
              looks like. I'll come back with a plan, not a pitch.
            </motion.p>
            <motion.div
              className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-foreground/40"
              style={{ opacity: subOpacity }}
            >
              ↓ keep scrolling
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cin-contact-form-section relative w-full px-6 pb-32 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
