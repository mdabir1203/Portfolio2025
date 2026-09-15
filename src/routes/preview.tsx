// /preview — A focused preview of the chosen personality-section
// variant (Polaroid Strip, B) plus the new Editorial Hero + MoodDial.
// Keeps A and C as quick references for comparison. NOT deployed to production.
//
// Usage: visit /preview on the dev server. The new Editorial Hero is at the
// top, then the MoodDial, then the strip, then A and C as backups.

import { createFileRoute, Link } from '@tanstack/react-router';
import { PersonalityHero } from '@/components/cinematic/Personality/PersonalityHero';
import { MoodDial } from '@/components/cinematic/Personality/MoodDial';
import { PersonalityStrip } from '@/components/cinematic/Personality/PersonalityStrip';
import { PersonalityWall } from '@/components/cinematic/Personality/PersonalityWall';
import { PersonalityCollage } from '@/components/cinematic/Personality/PersonalityCollage';

export const Route = createFileRoute('/preview')({
  head: () => ({
    meta: [
      { title: 'Preview · Personality Section — Mohammad Abir Abbas' },
      { name: 'description', content: 'Preview of the ENFP Personality section (Hero + MoodDial + Polaroid Strip + Wall + Collage). Recruiter-friendly, with friends and Dubai.' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky control bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
              // preview
            </div>
            <div className="font-serif text-base text-white">
              ENFP Personality — Hero · Dial · Strip
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#hero"
              className="rounded-full border border-[#0f7569] bg-[#0f7569]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f7569]"
            >
              D · Hero + MoodDial ✓ picked
            </a>
            <a
              href="#strip"
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              B · Polaroid Strip
            </a>
            <a
              href="#wall"
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              A · Wall
            </a>
            <a
              href="#collage"
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              C · Collage
            </a>
            <Link
              to="/"
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition hover:border-white/40 hover:text-white"
            >
              ← back to site
            </Link>
          </div>
        </div>
      </header>

      {/* Variant D — Editorial Hero + MoodDial (the new chosen chapter). */}
      <div id="hero" className="relative scroll-mt-24">
        <div className="sticky top-[57px] z-30 border-b border-white/10 bg-black/70 px-6 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f7569] font-mono text-[11px] font-bold text-white">
              D
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                variant · chosen · 2026-09-14
              </div>
              <div className="font-serif text-base text-white">
                Editorial Hero + MoodDial — ENFP 4-letter centerpiece
              </div>
            </div>
            <div className="ml-auto hidden text-right sm:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                R3F constellation · 4 behaviour cards
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f7569]">
                3D accent under prefers-reduced-motion
              </div>
            </div>
          </div>
        </div>
        <PersonalityHero />
        <MoodDial />
      </div>

      {/* Variant B — Polaroid Strip (recruiter-natural). */}
      <div id="strip" className="relative scroll-mt-24">
        <div className="sticky top-[57px] z-30 border-b border-white/10 bg-black/70 px-6 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 font-mono text-[11px] font-bold text-white/80">
              B
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                variant · polaroid strip
              </div>
              <div className="font-serif text-base text-white">
                Polaroid Strip — 16 photos, recruiter-natural
              </div>
            </div>
            <div className="ml-auto hidden text-right sm:block">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                3 of me · 3 friends · 5 Dubai · 2 harmonica · 3 bonus alts
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f7569]">
                scrolls horizontally on overflow
              </div>
            </div>
          </div>
        </div>
        <PersonalityStrip />
      </div>

      {/* Variant A — Wall (for comparison). */}
      <div id="wall" className="relative scroll-mt-24">
        <div className="sticky top-[57px] z-30 border-b border-white/10 bg-black/70 px-6 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 font-mono text-[11px] font-bold text-white/80">
              A
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                variant · alternative
              </div>
              <div className="font-serif text-base text-white">Photo Wall — bento grid</div>
            </div>
          </div>
        </div>
        <PersonalityWall />
      </div>

      {/* Variant C — Collage (for comparison). */}
      <div id="collage" className="relative scroll-mt-24">
        <div className="sticky top-[57px] z-30 border-b border-white/10 bg-black/70 px-6 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 font-mono text-[11px] font-bold text-white/80">
              C
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                variant · alternative
              </div>
              <div className="font-serif text-base text-white">About Collage — 2-column</div>
            </div>
          </div>
        </div>
        <PersonalityCollage />
      </div>

      <footer className="border-t border-white/10 bg-black px-6 py-12 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        // preview only — not indexed, not deployed
      </footer>
    </div>
  );
}
