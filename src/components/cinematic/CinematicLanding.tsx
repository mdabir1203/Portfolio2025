import { TopNav } from "@/components/cinematic/TopNav";
import { EditorialHero } from "@/components/cinematic/EditorialHero";
import { WorkGrid } from "@/components/cinematic/WorkGrid";
import { CaseStudySection } from "@/components/cinematic/CaseStudySection";
import { EditorialScene } from "@/components/cinematic/EditorialScene";
import { PeerReviews } from "@/components/cinematic/PeerReviews";
import { PathTimeline } from "@/components/cinematic/PathTimeline";
import { ContactSection } from "@/components/cinematic/ContactSection";
import { Footer } from "@/components/cinematic/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Editorial scrapbook landing. Calm, off-white, type-led.
 *
 * Structure (recruiter-first):
 *  1. TopNav — fixed
 *  2. EditorialHero — name + pitch + identity
 *  3. WorkGrid — mixed-aspect bento of real projects
 *  4. CaseStudySection — AbaYa-Track · The Delivery Module (full boardroom)
 *  5. EditorialScene — about + capabilities + pull-quote
 *  6. PeerReviews — real LinkedIn recommendations with photos
 *  7. PathTimeline — career stops
 *  8. ContactSection — dark contact card
 *  9. Footer — full directory
 */
export function CinematicLanding() {
  const { lang } = useLanguage();
  return (
    <div lang={lang} className="cin-landing relative w-full overflow-x-hidden bg-paper text-ink">
      <TopNav />
      <main className="pt-2">
        <EditorialHero />
        <WorkGrid />
        <CaseStudySection />
        <EditorialScene />
        <PeerReviews />
        <PathTimeline />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
