import { useEffect, useState } from "react";
import { TopNav } from "@/components/cinematic/TopNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ManifestoBar } from "@/components/cinematic/ManifestoBar";
import { FirstVisitSplash } from "@/components/cinematic/FirstVisitSplash";
import { PassportBook } from "@/components/cinematic/PassportBook";
import { EditorialHero } from "@/components/cinematic/EditorialHero";
import { WorkGrid } from "@/components/cinematic/WorkGrid";
import { CaseStudySection } from "@/components/cinematic/CaseStudySection";
import { EditorialScene } from "@/components/cinematic/EditorialScene";
import { PeerReviews } from "@/components/cinematic/PeerReviews";
import { PathTimeline } from "@/components/cinematic/PathTimeline";
import { ContactSection } from "@/components/cinematic/ContactSection";
import { MediumRail } from "@/components/cinematic/MediumRail";
import { YouTubeRail } from "@/components/cinematic/YouTubeRail";
import { Footer } from "@/components/cinematic/Footer";
import { FAQSection, RECRUITER_FAQ } from "@/components/cinematic/FAQSection";
import { PersonalitySection } from "@/components/cinematic/Personality/PersonalitySection";
import { CinemaMode } from "@/components/cinematic/CinemaMode";
import { CvDownloadQR } from "@/components/cinematic/CvDownloadQR";
import { Watermark } from "@/components/cinematic/Watermark";
import { useAntiPiracy } from "@/hooks/useAntiPiracy";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudience } from "@/hooks/useAudience";
import { RecruiterLanding } from "@/components/cinematic/RecruiterLanding";

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
 * 12. FAQSection — 9 question/answer pairs, 40-60 word direct answers, named-entity-dense
 * 13. ContactSection — dark contact card
 * 14. Footer — full directory
 *
 * First-visit opener: FirstVisitSplash shows the quote
 *   "Impossible is something till you attempt."
 * exactly once per session (sessionStorage flag), then auto-dismisses or
 * takes a click anywhere to skip.
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
        <EditorialHero />
        <WorkGrid />
        <CaseStudySection />
        <EditorialScene />
        <PersonalitySection />
        <PeerReviews />
        <PathTimeline />
        <MediumRail />
        <YouTubeRail />
        <FAQSection
          id="faq"
          eyebrow="// Recruiter FAQ · 2026"
          heading="The nine questions you should ask me first."
          positioning="The engineer who ships to production. Not the demo."
          intro="If you can't make it past the first thirty seconds of this page, I'm not your candidate. Nine direct answers, in plain English, with the receipt attached to each one."
          items={RECRUITER_FAQ}
        />
        <ContactSection cvUrl={cvUrl} />
      </main>
      <Footer />
      {/* Watermark — subtle contact-tile overlay that survives
          honest screenshots. Sits BELOW the CinemaMode HUD so
          recording the reel doesn't capture it twice. */}
      <Watermark />
      {/* Floating CV QR — always one tap away, bottom-left. Pairs
          with the existing InteractiveQR referral tile (bottom-right). */}
      <CvDownloadQR url={cvUrl} variant="tile" caption="Scan to download CV." />
      <CinemaMode />
    </div>
  );
}
