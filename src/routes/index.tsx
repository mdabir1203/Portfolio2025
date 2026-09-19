import { createFileRoute } from "@tanstack/react-router";
import { CinematicLanding } from "@/components/cinematic/CinematicLanding";

const SITE_URL = "https://abir.getwaved.ai";
const RECRUITER_URL = `${SITE_URL}/recruiter`;

export const Route = createFileRoute("/")({
  component: CinematicLanding,
  head: () => ({
    meta: [
      { title: "Mohammad Abir Abbas — Creative Technologist, AI Strategist & Emerging Technology Architect · Dubai UAE" },
      {
        name: "description",
        content:
          "Mohammad Abir Abbas — Creative Technologist, AI Strategist & Emerging Technology Architect in Dubai, UAE. Working at the intersection of AI, product, systems architecture, business strategy and physical operations for founders, SMEs and enterprises across the GCC. Built AbaYa-Track's Delivery Module: a value-weighted production dashboard that surfaced AED 111,246 of trapped backlog in 30 days (11.1:1 V:C). Available Q3 2026 across UAE, KSA, and remote.",
      },
      {
        name: "keywords",
        content:
          "Creative Technologist Dubai, AI Strategist UAE, Emerging Technology Architect GCC, AbaYa-Track, AI case study Dubai, production dashboard GCC, value-to-cost ratio, MD Abir Abbas, Abir Abbas, SmartSwap, MIT Hacknation 2026, ENFP, Myers Briggs ENFP, personality page, technology leverage, GCC founders, GCC SMEs, GCC enterprises",
      },
      { property: "og:title", content: "Mohammad Abir Abbas — Creative Technologist · Dubai UAE" },
      {
        property: "og:description",
        content:
          "AbaYa-Track's Delivery Module: AED 111K backlog recovered, 11.1:1 V:C, Dubai. Real case study, real testimonials. Available Q3 2026.",
      },
      { property: "og:image:alt", content: "Mohammad Abir Abbas — Creative Technologist in Dubai" },
      { name: "twitter:title", content: "Mohammad Abir Abbas — Creative Technologist · Dubai UAE" },
      { name: "twitter:description", content: "AbaYa-Track: AED 111K recovered, 11.1:1 V:C. Creative Technologist in Dubai, available Q3 2026 across UAE, KSA, and remote." },
    ],
    // The parent __root route has a `links` array (canonical, hreflang,
    // alternate vCard, etc.). TanStack Router merges head() with shallow
    // semantics — if a child route returns only `meta`, the parent's
    // `links` is dropped. We re-include the home-page links here.
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "en", href: SITE_URL },
      { rel: "alternate", hrefLang: "ar-AE", href: SITE_URL },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
      { rel: "alternate", type: "text/vcard", href: "/abir.vcf", title: "Mohammad Abir Abbas (vCard)" },
      { rel: "alternate", type: "application/json", href: "/.well-known/tabby.json", title: "Abir Referral System" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "Abir Abbas — llms.txt (AI-crawler readable)" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
});
