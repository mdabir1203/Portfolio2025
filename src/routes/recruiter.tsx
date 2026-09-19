import { createFileRoute } from "@tanstack/react-router";
import { RecruiterLanding } from "@/components/cinematic/RecruiterLanding";

const HOWTO_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://abir.getwaved.ai/recruiter#howto-hire",
  name: "How to hire Mohammad Abir Abbas (Creative Technologist · AI Strategist · Emerging Technology Architect, Dubai) in 5 steps",
  description:
    "A short, 24-hour hiring flow for founders, SMEs, technical recruiters and hiring managers who want to bring Mohammad Abir Abbas onto a Creative Technologist, AI Strategist, Emerging Technology Architect, Solutions Engineer, or Platform Engineer role in Dubai, Abu Dhabi, Riyadh, NEOM, or global remote.",
  totalTime: "P1D",
  estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "0" },
  tool: [
    { "@type": "HowToTool", name: "abir.getwaved.ai/connect" },
    { "@type": "HowToTool", name: "abir.abbas@proton.me" },
    { "@type": "HowToTool", name: "WhatsApp +971 54 361 8066" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Send a one-paragraph brief",
      text: "Email abir.abbas@proton.me with the role title, scope, location, salary band, and start date. He replies within 24 hours — usually faster.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Book a 15-minute intro chat",
      text: "Use the calendar at abir.getwaved.ai/connect to grab a 15-minute slot. Use code=intro&audience=recruiter to land on the recruiter-optimized page.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Receive a tailored one-pager",
      text: "After the intro, receive a one-pager mapping the brief to the closest of: AbaYa-Track case study, SmartSwap MIT write-up, RedAGPT architecture, or a new deck.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Loop in engineering",
      text: "Introduce Abir to the engineering manager and one peer. He runs a 60-minute technical deep-dive (system design, AI workflow walkthrough) for free.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Decide and onboard",
      text: "Decision within 5 working days. UAE Company Visa means onboarding in Dubai is 1–2 weeks, not 6. Start date negotiable from Q3 2026.",
    },
  ],
};

export const Route = createFileRoute("/recruiter")({
  // Audience auto-redirect happens on the client (useEffect) so the SSR
  // path is render-safe. The hook in useAudience handles the
  // `?audience=recruiter` deep-link detection in the browser.
  component: RecruiterLanding,
  head: () => ({
    meta: [
      {
        title: "Recruiter Brief — Mohammad Abir Abbas · Creative Technologist Dubai (Q3 2026, no sponsorship)",
      },
      {
        name: "description",
        content:
          "Recruiter brief for Mohammad Abir Abbas — Creative Technologist, AI Strategist & Emerging Technology Architect in Dubai, UAE. Available Q3 2026 across UAE, KSA, and remote. UAE Company Visa, no sponsorship. Recent wins: AbaYa-Track AED 111K recovered (11.1:1 V:C), Wavelink NFC, SmartSwap (MIT Hacknation 2026), RedAGPT (Redis 2024).",
      },
      {
        name: "keywords",
        content:
          "Creative Technologist Dubai, AI Strategist UAE, Emerging Technology Architect GCC, AI Engineer Dubai, Solutions Engineer Dubai, Platform Engineer UAE, Developer Experience, React Native Dubai, hire Creative Technologist, recruiting AI engineer Dubai, GCC AI talent, MENA AI, Saudi Arabia, Riyadh, NEOM, remote AI, GCC founders, GCC SMEs, GCC enterprises, Mohammed Abir Abbas, Abir Abbas, mdabir1203, Wavelink, AbaYa-Track",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://abir.getwaved.ai/recruiter" },
      {
        property: "og:title",
        content: "Recruiter Brief — Mohammad Abir Abbas · Creative Technologist Dubai (Q3 2026, no sponsorship)",
      },
      {
        property: "og:description",
        content:
          "AbaYa-Track AED 111K recovered (11.1:1 V:C), Wavelink NFC, SmartSwap MIT 2026, RedAGPT Redis 2024. Available Q3 2026 — UAE Company Visa, no sponsorship.",
      },
      {
        name: "twitter:title",
        content: "Recruiter Brief — Mohammad Abir Abbas · AI Architect Dubai (Q3 2026, no sponsorship)",
      },
      {
        name: "twitter:description",
        content:
          "AbaYa-Track AED 111K recovered (11.1:1 V:C) · Wavelink · SmartSwap MIT 2026 · RedAGPT Redis 2024. Available Q3 2026 — UAE Company Visa, no sponsorship.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://abir.getwaved.ai/recruiter" },
      { rel: "alternate", hrefLang: "en", href: "https://abir.getwaved.ai/recruiter" },
      { rel: "alternate", hrefLang: "ar-AE", href: "https://abir.getwaved.ai/recruiter" },
      { rel: "alternate", hrefLang: "x-default", href: "https://abir.getwaved.ai/recruiter" },
    ],
  }),
});
