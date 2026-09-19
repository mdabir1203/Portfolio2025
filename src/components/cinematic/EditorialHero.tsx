import { useEffect, useRef, useState } from "react";
import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Magnetic } from "./microinteractions/Magnetic";
import { PulseDot } from "./microinteractions/PulseDot";
import { PropicCarousel } from "./PropicCarousel";
import { useReducedMotion } from "framer-motion";

/**
 * Typewriter — single-pass text-reveal animation.
 *
 * Renders the full string char-by-char with a blinking caret. On
 * prefers-reduced-motion the full string is shown immediately and the
 * caret is omitted. The caret is decorative (`aria-hidden`); the full
 * text lives in an `.sr-only` span so screen readers announce the whole
 * sentence in one go instead of one character per re-render.
 *
 * Pauses a beat (`delay`) before starting so it doesn't collide with
 * the page-paint fade or the hero eyebrow's PulseDot.
 */
function Typewriter({
  text,
  speed = 38,
  delay = 320,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? text : "");
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown("");
    setDone(false);
    let i = 0;
    let tickId = 0;
    let delayId = 0;
    delayId = window.setTimeout(() => {
      const tick = () => {
        i += 1;
        if (i >= text.length) {
          setShown(text);
          setDone(true);
          return;
        }
        setShown(text.slice(0, i));
        tickId = window.setTimeout(tick, speed);
      };
      tick();
    }, delay);
    return () => {
      window.clearTimeout(delayId);
      window.clearTimeout(tickId);
    };
  }, [text, speed, delay, reduce]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
      {!done && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[3px] bg-current align-baseline"
          style={{ animation: "cin-caret 0.9s steps(1) infinite" }}
        />
      )}
    </span>
  );
}

/**
 * EditorialHero — calm, type-led. KillerPortfolio style.
 *
 * The hero is one tight cluster: a tiny mono eyebrow, a massive serif
 * name, one sentence, two CTAs, and a meta line. No heavy animation —
 * but subtle microinteractions: Magnetic CTAs, micro-parallax on the
 * identity card (desktop), and a PulseDot next to the availability
 * eyebrow.
 */
export function EditorialHero() {
  const reduce = useReducedMotion();
  const identityRef = useRef<HTMLDivElement>(null);

  // Subtle scroll-linked parallax on the identity card. Skipped on touch
  // devices and on reduced-motion.
  const onIdentityScroll = (e: React.WheelEvent) => {
    if (reduce) return;
    const el = identityRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) return; // not visible
    // The further the card is from viewport center, the more we nudge it.
    const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
    const translate = Math.max(-6, Math.min(6, -centerOffset * 8));
    el.style.setProperty("--parallax-y", `${translate.toFixed(1)}px`);
  };

  return (
    <section id="hero" className="cin-hero pt-28 md:pt-36">
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="cin-hero-eyebrow mb-6 flex flex-wrap items-center gap-3">
              <PulseDot size={9} />
              <span>Available · Q3 2026</span>
              <span className="text-ink-faint">/</span>
              <span>Dubai, UAE · Open to KSA &amp; remote</span>
            </div>

            {/* Single operating quote — typewriter-revealed above the H1 so
                it's the first thing the page says. Sits between the eyebrow
                and the name so the eye lands on it before scanning the
                identity line. */}
            <p
              aria-label="Technology is valuable when it creates leverage."
              className="cin-hero-quote font-display text-[clamp(1.5rem,3.4vw,2.4rem)] leading-[1.18] text-ink"
            >
              <span aria-hidden="true" className="mr-2 select-none text-[color:var(--accent-teal)]">“</span>
              <Typewriter
                text="Technology is valuable when it creates leverage."
                speed={42}
                delay={280}
              />
              <span aria-hidden="true" className="ml-1 select-none text-[color:var(--accent-teal)]">”</span>
            </p>

            <h1 className="cin-hero-name mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
              Mohammad
              <br />
              Abir <em>Abbas.</em>
            </h1>

            {/* 2026 AEO answer-first block: 40-60 words, named-entity-dense,
                positioned immediately after the H1 so AI engines that screenshot
                the first paragraph get a quotable, complete answer.

                Realigned with the LinkedIn profile: Creative Technologist,
                AI Strategist & Emerging Technology Architect — focused on
                GCC founders, SMEs and enterprises turning emerging
                technologies into business advantage. */}
            <p className="cin-hero-answer mt-8 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
              <strong className="text-ink">Mohammad Abir Abbas is a
              Creative Technologist, AI Strategist &amp; Emerging
              Technology Architect based in Dubai, UAE</strong> — working
              at the intersection of AI, product, systems architecture,
              business strategy and physical operations. He helps founders,
              SMEs and enterprises across the GCC turn emerging technologies
              into business advantage. The AbaYa-Track Delivery Module
              recovered <strong className="text-ink">AED 111,246</strong> of
              trapped manufacturing backlog in 30 days at 11.1:1
              value-to-cost. Available Q3 2026.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic strength={16}>
                <a href="mailto:abir.abbas@proton.me" className="cin-hero-cta cin-hero-cta-primary">
                  <Mail className="h-3.5 w-3.5" />
                  Let's Talk
                </a>
              </Magnetic>
              <Magnetic strength={14}>
                <a
                  href="https://www.linkedin.com/in/abir-abbas"
                  target="_blank"
                  rel="noreferrer"
                  className="cin-hero-cta cin-hero-cta-secondary"
                >
                  LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="md:col-span-4">
            <div
              ref={identityRef}
              onWheel={onIdentityScroll}
              className="md:pt-2"
              style={{
                transform: reduce
                  ? undefined
                  : "translate3d(0, var(--parallax-y, 0px), 0)",
                willChange: reduce ? undefined : "transform",
              }}
            >
              {/* Portrait carousel — the propic corner is now a 6-photo
                  personality reel (DRIFTER → ARRIVED → GROUNDED →
                  EXPRESSIVE → SPEAKER → ARCHITECT) cycling at 1.15 s/slide.
                  Each photo gets its own chrome (halo, ring, available dot)
                  and a single identity word below it. No square background
                  — the carousel is transparent so the photo floats on the
                  paper directly. */}
              <div className="mb-6">
                <PropicCarousel className="h-[160px] w-[160px] sm:h-[240px] sm:w-[240px] md:h-[300px] md:w-[300px]" />
                <div className="cin-hero-eyebrow mt-2">
                  <div className="text-[10px] text-ink-faint">
                    Dubai · 2026
                  </div>
                </div>
              </div>

              {/* Brand stamp — monogram + role line, sits below the identity row */}
              <div className="mb-6 flex items-center gap-3 border-t border-rule pt-5">
                <BrandMark size={24} variant="primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                  by Mohammad Abir Abbas
                </span>
              </div>
              <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
                Creative Technologist <span className="text-ink-muted">&amp;</span>{" "}
                <em className="text-[color:var(--accent-teal)] not-italic">AI Architect.</em>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                I sit between AI research and shippable product. Most "AI
                projects" die in a demo. I've shipped them across factory
                floors, payment rails, and EdTech.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="cin-hero-eyebrow">Based in</dt>
                  <dd className="mt-1 font-display text-lg">Dubai, UAE</dd>
                </div>
                <div>
                  <dt className="cin-hero-eyebrow">Countries</dt>
                  <dd className="mt-1 font-display text-lg">13</dd>
                </div>
                <div>
                  <dt className="cin-hero-eyebrow">Readers</dt>
                  <dd className="mt-1 font-display text-lg">325K+</dd>
                </div>
                <div>
                  <dt className="cin-hero-eyebrow">Years</dt>
                  <dd className="mt-1 font-display text-lg">7+</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
