import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import abirPortrait from "@/assets/abir-2026.webp";

/**
 * EditorialHero — calm, type-led. KillerPortfolio style.
 *
 * The hero is one tight cluster: a tiny mono eyebrow, a massive serif
 * name, one sentence, two CTAs, and a meta line. No animation.
 * Whitespace does the work.
 */
export function EditorialHero() {
  return (
    <section id="hero" className="cin-hero pt-28 md:pt-36">
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="cin-hero-eyebrow mb-6 flex flex-wrap items-center gap-3">
              <span className="pulse-dot" />
              <span>Available · Q3 2026</span>
              <span className="text-ink-faint">/</span>
              <span>Ajman, UAE · Open across GCC</span>
            </div>

            <h1 className="cin-hero-name text-[clamp(2.8rem,9vw,7.5rem)]">
              Mohammad
              <br />
              Abir <em>Abbas.</em>
            </h1>

            <p className="cin-hero-pitch mt-8 max-w-2xl text-xl md:text-2xl">
              I deploy <strong>AI workflows</strong> that protect enterprise
              assets and recapture thousands of engineering hours — turning
              {" "}<strong>"magic" tech</strong> into predictable ROI.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="mailto:abir.abbas@proton.me" className="cin-hero-cta cin-hero-cta-primary">
                <Mail className="h-3.5 w-3.5" />
                Let's Talk
              </a>
              <a
                href="https://www.linkedin.com/in/abir-abbas"
                target="_blank"
                rel="noreferrer"
                className="cin-hero-cta cin-hero-cta-secondary"
              >
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={abirPortrait}
                alt="Mohammad Abir Abbas"
                width={72}
                height={72}
                loading="eager"
                className="cin-hero-portrait h-[72px] w-[72px] rounded-full object-cover ring-1 ring-rule"
              />
              <div className="cin-hero-eyebrow">
                <div>// Identity</div>
                <div className="mt-1 text-[10px] text-ink-faint">
                  2026 · Suit · Dubai
                </div>
              </div>
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
                <dd className="mt-1 font-display text-lg">Ajman, UAE</dd>
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
    </section>
  );
}
