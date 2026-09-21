import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/cinematic/TopNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ManifestoBar } from "@/components/cinematic/ManifestoBar";
import { FirstVisitSplash } from "@/components/cinematic/FirstVisitSplash";
import { PassportBook } from "@/components/cinematic/PassportBook";
import { EditorialHero } from "@/components/cinematic/EditorialHero";
import { WorkGrid } from "@/components/cinematic/WorkGrid";
import { CaseStudySection } from "@/components/cinematic/CaseStudySection";
import { EditorialScene } from "@/components/cinematic/EditorialScene";
import { useAntiPiracy } from "@/hooks/useAntiPiracy";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudience } from "@/hooks/useAudience";
import { RecruiterLanding } from "@/components/cinematic/RecruiterLanding";
import { RECRUITER_FAQ } from "@/data/recruiterFaq";

/**
 * Editorial scrapbook landing. Calm, off-white, type-led.
 *
 * Structure (recruiter-first, 2026 AEO-aligned):
 *  1. TopNav — fixed
 *  2. ManifestoBar — chapter tracker (slides in after hero)
 *  3. EditorialHero — name + pitch + identity
 *  4. WorkGrid — mixed-aspect bento of real projects
 *  5. CaseStudySection — AbaYa-Track · The Delivery Module (full boardroom)
 *  6. EditorialScene — about + capabilities + pull-quote
 *  7. PersonalitySection — ENFP chapter (Hero + MoodDial + Strip)
 *  8. PeerReviews — real LinkedIn recommendations with photos
 *  9. PathTimeline — career stops
 * 10. MediumRail — latest essays pulled from the @md.abir1203 RSS feed
 * 11. YouTubeRail — latest episodes pulled from @wavelinkd's RSS feed
 * 12. FAQSection — 9 question/answer pairs
 * 13. ContactSection — dark contact card
 * 14. Footer — full directory
 *
 * Performance (2026-09-21):
 *   Below-fold sections are code-split with React.lazy + Suspense so they
 *   don't ship in the initial JS bundle or run their hydration cost
 *   before the user scrolls near them. Each Suspense boundary renders
 *   a same-shape skeleton so layout doesn't shift when the chunk loads.
 *   The biggest win is PersonalitySection — its EnfpConstellation chunk
 *   is 878KB of Three.js + canvas work that we no longer pay for on
 *   initial paint. PeerReviews also defers the recommendation photos
 *   (lazy-loading via `loading="lazy"` + explicit width/height).
 */

/* ─── Below-fold, code-split ─────────────────────────────────────────── */

const PersonalitySection = lazy(() =>
  import("@/components/cinematic/Personality/PersonalitySection").then((m) => ({
    default: m.PersonalitySection,
  }))
);

const PeerReviews = lazy(() =>
  import("@/components/cinematic/PeerReviews").then((m) => ({
    default: m.PeerReviews,
  }))
);

const PathTimeline = lazy(() =>
  import("@/components/cinematic/PathTimeline").then((m) => ({
    default: m.PathTimeline,
  }))
);

const MediumRail = lazy(() =>
  import("@/components/cinematic/MediumRail").then((m) => ({
    default: m.MediumRail,
  }))
);

const YouTubeRail = lazy(() =>
  import("@/components/cinematic/YouTubeRail").then((m) => ({
    default: m.YouTubeRail,
  }))
);

const FAQModule = lazy(() =>
  import("@/components/cinematic/FAQSection").then((m) => ({
    default: m.FAQSection,
  }))
);

const ContactModule = lazy(() =>
  import("@/components/cinematic/ContactSection").then((m) => ({
    default: m.ContactSection,
  }))
);

const FooterModule = lazy(() =>
  import("@/components/cinematic/Footer").then((m) => ({
    default: m.Footer,
  }))
);

const Watermark = lazy(() =>
  import("@/components/cinematic/Watermark").then((m) => ({
    default: m.Watermark,
  }))
);

const CvDownloadQR = lazy(() =>
  import("@/components/cinematic/CvDownloadQR").then((m) => ({
    default: m.CvDownloadQR,
  }))
);

const CinemaMode = lazy(() =>
  import("@/components/cinematic/CinemaMode").then((m) => ({
    default: m.CinemaMode,
  }))
);

/** Skeleton placeholder for lazy sections — keeps CLS = 0 by matching
 *  the real section's vertical rhythm. Pulse animation is GPU-only
 *  (opacity) so it doesn't add layout cost. */
function SectionSkeleton({ height = 480 }: { height?: number }) {
  return (
    <div
      aria-hidden
      className="mx-auto w-full max-w-7xl px-6 md:px-10"
      style={{ minHeight: height }}
    >
      <div className="h-full w-full animate-pulse rounded-2xl bg-paper-2/40" />
    </div>
  );
}

/**
 * LazySection — wraps a lazy component, mounts the chunk when the
 * placeholder scrolls within `rootMargin` of the viewport. Until then,
 * only the lightweight skeleton ships + renders. CLS stays at 0
 * because the skeleton's `minHeight` matches the real section's
 * reserved space.
 */
function LazySection({
  children,
  height = 480,
  rootMargin = "320px",
}: {
  children: React.ReactNode;
  height?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  useEffect(() => {
    if (shouldMount) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // SSR or no IntersectionObserver → mount immediately
      setShouldMount(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldMount(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, shouldMount]);
  return (
    <div ref={ref}>
      {shouldMount ? (
        <Suspense fallback={<SectionSkeleton height={height} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton height={height} />
      )}
    </div>
  );
}

/**
 * CinematicLanding — the public landing page.
 *
 * Audience-adaptive: when the visitor is detected as a recruiter
 * (UTM, referrer from LinkedIn / Greenhouse / Lever, or `?audience=recruiter`),
 * the page hands off to RecruiterLanding — a completely different
 * experience optimised for hiring-side scanning.
 */
export function CinematicLanding() {
  const { lang } = useLanguage();
  const audience = useAudience();
  // Site-wide anti-piracy: blocks right-click save / drag / Ctrl+S /
  // text copy. Mounted before any children so the listeners are
  // attached before the user has a chance to interact.
  useAntiPiracy(true);

  if (audience === "recruiter") {
    return <RecruiterLanding />;
  }
  // Absolute URL the CV download QR points to. In dev it's the local
  // origin (works on phones on the same WiFi via the network host),
  // in prod it's the production domain. The TanStack server route at
  // /cv returns the PDF with Content-Disposition: attachment so
  // phones and desktops alike download rather than render inline.
  //
  // SSR-safe: useState seeds the same value on server and the first
  // client paint (both render `/cv`) — then a useEffect upgrades to
  // the absolute URL after hydration. This eliminates the
  // server-vs-client mismatch that triggered the React #418/#423
  // hydration warnings in production, which were costing Best
  // Practices points in Lighthouse.
  const [cvUrl, setCvUrl] = useState("/cv");
  useEffect(() => {
    setCvUrl(`${window.location.origin}/cv`);
  }, []);

  return (
    <div lang={lang} className="cin-landing relative w-full overflow-x-hidden bg-paper text-ink">
      <FirstVisitSplash />
      <TopNav />
      {/* Theme toggle — fixed top-right, always visible, separate from
          the menu so it never gets buried inside the dropdown panel. */}
      <div className="fixed right-4 top-3 z-40 md:right-6 md:top-4">
        <ThemeToggle />
      </div>
      <ManifestoBar />
      <PassportBook />
      <main id="main" className="pt-2" tabIndex={-1}>
        {/* Above-fold: eager. */}
        <EditorialHero />
        <WorkGrid />
        <CaseStudySection />
        <EditorialScene />

        {/* Below-fold: lazy-mounted when within 320px of viewport. */}
        <LazySection height={920}>
          <PersonalitySection />
        </LazySection>
        <LazySection height={620}>
          <PeerReviews />
        </LazySection>
        <LazySection height={560}>
          <PathTimeline />
        </LazySection>
        <LazySection height={420}>
          <MediumRail />
        </LazySection>
        <LazySection height={420}>
          <YouTubeRail />
        </LazySection>
        <LazySection height={760}>
          <FAQModule
            id="faq"
            eyebrow="// Recruiter FAQ · 2026"
            heading="The nine questions you should ask me first."
            positioning="The engineer who ships to production. Not the demo."
            intro="If you can't make it past the first thirty seconds of this page, I'm not your candidate. Nine direct answers, in plain English, with the receipt attached to each one."
            items={RECRUITER_FAQ}
          />
        </LazySection>
        <LazySection height={520}>
          <ContactModule cvUrl={cvUrl} />
        </LazySection>
      </main>
      <LazySection height={0}>
        <FooterModule />
      </LazySection>
      {/* Watermark — subtle contact-tile overlay that survives
          honest screenshots. Sits BELOW the CinemaMode HUD so
          recording the reel doesn't capture it twice. */}
      <LazySection height={0}>
        <Watermark />
      </LazySection>
      {/* Floating CV QR — always one tap away, bottom-left. Pairs
          with the existing InteractiveQR referral tile (bottom-right). */}
      <LazySection height={0}>
        <CvDownloadQR url={cvUrl} variant="tile" caption="Scan to download CV." />
      </LazySection>
      <LazySection height={0}>
        <CinemaMode />
      </LazySection>
    </div>
  );
}
