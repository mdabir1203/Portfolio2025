import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { LanguageProvider } from "@/contexts/LanguageContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://abir.getwaved.ai";
const FULL_NAME = "Mohammad Abir Abbas";
const GIVEN_NAME = "Mohammad Abir";
const FAMILY_NAME = "Abbas";
const ALIASES = [
  "Abir Abbas",
  "M. Abir Abbas",
  "Mohammad Abir",
  "Abir",
  "mdabir1203",
];
const TITLE = "Mohammad Abir Abbas — AI Architect, Solutions & Platform Engineer in Dubai, UAE";
const DESCRIPTION =
  "Mohammad Abir Abbas — AI Architect and Solutions Engineer in Dubai, UAE. I design AI agent workflows, process automation, and platform tooling that ship to GCC production — Dubai, Abu Dhabi, Saudi Arabia, and global remote teams. Built AbaYa-Track (AED 111K recovered, 11.1:1 V:C). Available Q3 2026.";

const ALTERNATE_NAMES = [
  "Mohammad Abir Abbas",
  "Abir Abbas",
  "M Abir Abbas",
  "mdabir1203",
  "Mohammad Abir",
];

// ── Person schema (the canonical "who I am" record) ────────────────────────
const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: FULL_NAME,
  givenName: GIVEN_NAME,
  familyName: FAMILY_NAME,
  additionalName: ALIASES,
  alternateName: ALTERNATE_NAMES,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  jobTitle: "AI Architect, Solutions & Platform Engineer",
  description: DESCRIPTION,
  email: "mailto:abir.abbas@proton.me",
  telephone: "+971-54-361-8066",
  nationality: { "@type": "Country", name: "Bangladesh" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  homeLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2048,
      longitude: 55.2708,
    },
  },
  workLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
  },
  knowsLanguage: [
    { "@type": "Language", name: "English", alternateName: "en" },
    { "@type": "Language", name: "Bengali", alternateName: "bn" },
    { "@type": "Language", name: "Arabic", alternateName: "ar" },
    { "@type": "Language", name: "German", alternateName: "de" },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "AI Agent Workflows",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Process Automation",
    "Solutions Engineering",
    "Platform Engineering",
    "Developer Experience (DevEx)",
    "Cross-platform Mobile Development",
    "Edge Computing",
    "Cloudflare Workers",
    "React",
    "React Native",
    "TypeScript",
    "Node.js",
    "Rust",
    "C",
    "C++",
    "Go-to-Market Strategy",
    "GCC Markets",
    "United Arab Emirates",
    "Saudi Arabia",
    "Riyadh",
    "NEOM",
    "Dubai",
    "Abu Dhabi",
    "MENA",
    "Cross-cultural Communication",
    "Multilingual Product Engineering",
    "Network Security",
    "GDPR Compliance",
    "PDPL",
    "Data Localisation",
    "Mentorship",
    "Technical Writing",
    "Distributed Systems",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "AI Architect",
    occupationLocation: {
      "@type": "City",
      name: "Dubai",
      containedInPlace: { "@type": "Country", name: "United Arab Emirates" },
    },
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      name: "AED",
      currency: "AED",
      minValue: 18000,
      maxValue: 25000,
      duration: "P1M",
      description: "Mid-level Dubai market rate, 2026",
    },
    skills: [
      "AI Agent Workflows",
      "LangChain",
      "AutoGPT",
      "React",
      "React Native",
      "TypeScript",
      "Cloudflare Workers",
      "Rust",
      "Process Automation",
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/abir-abbas",
    "https://github.com/mdabir1203",
    "https://medium.com/@md.abir1203",
    "https://www.youtube.com/@wavelinkd",
    "https://smartswap.lovable.app/",
    "https://github.com/shamantechnology/RedAGPT",
  ],
  award: [
    "Redis Side Quest Winner 2024 — RedAGPT (AutoGPT + Langchain + network security)",
    "MIT Hacknation 2026 Next Best — SmartSwap (client-side intent engine)",
  ],
  alumniOf: [
    { "@type": "EducationalOrganization", name: "42 Wolfsburg", sameAs: "https://www.42wolfsburg.de/" },
    { "@type": "EducationalOrganization", name: "Chittagong University of Engineering & Technology" },
    { "@type": "EducationalOrganization", name: "Leibniz University Hannover" },
  ],
  worksFor: [
    { "@type": "Organization", name: "Wavelink", sameAs: "https://wavelink.com" },
    { "@type": "Organization", name: "Famous Abaya LLC", sameAs: "https://github.com/mdabir1203/famousabaya" },
  ],
  memberOf: [
    { "@type": "Organization", name: "GCC AI Talent Network" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "recruiter",
    email: "mailto:abir.abbas@proton.me",
    telephone: "+971-54-361-8066",
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Place", name: "Global (Remote)" },
    ],
    availableLanguage: ["English", "Bengali", "Arabic", "German"],
  },
  knows: [
    { "@type": "Person", name: "AI/ML Community — Dubai" },
    { "@type": "Person", name: "GCC Enterprise Architecture" },
  ],
  subjectOf: [
    { "@type": "CreativeWork", name: "AbaYa-Track (AED 111K Delivery Module)", url: "https://github.com/mdabir1203/famousabaya" },
    { "@type": "CreativeWork", name: "SmartSwap (MIT Hacknation 2026)", url: "https://smartswap.lovable.app/" },
    { "@type": "CreativeWork", name: "RedAGPT (Redis Side Quest 2024)", url: "https://github.com/shamantechnology/RedAGPT" },
  ],
};

// ── WebSite schema (so Google can attach sitelinks + a Knowledge Panel) ────
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mohammad Abir Abbas",
  alternateName: "Abir Abbas — AI Architect",
  description: DESCRIPTION,
  inLanguage: ["en", "ar", "bn"],
  author: { "@id": `${SITE_URL}/#person` },
  publisher: { "@id": `${SITE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ── ProfilePage schema (signals "this is a person profile, not a product") ─
const PROFILE_PAGE_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: ["en", "ar"],
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#person` },
  primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 },
  lastReviewed: new Date().toISOString().slice(0, 10),
  significantLink: [
    SITE_URL,
    "https://www.linkedin.com/in/abir-abbas",
    "https://github.com/mdabir1203",
    "https://medium.com/@md.abir1203",
    "https://www.youtube.com/@wavelinkd",
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "section.hero p", "[data-speakable]"],
  },
  keywords:
    "AI Architect Dubai, AI Architect UAE, AI Engineer Dubai, Solutions Engineer Dubai, Platform Engineer UAE, Developer Experience, React Native Dubai, Cloudflare Workers, AI agent workflows, GCC AI talent, Saudi Arabia AI, Riyadh AI, NEOM, remote AI engineer, multilingual engineer, MENA AI",
};

// ── BreadcrumbList (for the home route) ────────────────────────────────────
const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${SITE_URL}/#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
    { "@type": "ListItem", position: 3, name: "Connect", item: `${SITE_URL}/connect` },
  ],
};

// ── FAQ schema (semantic Q&A — every question a recruiter actually asks) ───
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Mohammad Abir Abbas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mohammad Abir Abbas is an AI Architect, Solutions Engineer, and Platform Engineer based in Dubai, UAE. He deploys AI agent workflows, process automation, and cross-cultural product engineering for GCC enterprise and global remote teams. MIT Hacknation 2026 Next Best, Redis Side Quest Winner 2024, 325K+ Medium readers.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Abir Abbas based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dubai, United Arab Emirates. Available for on-site roles across the UAE (Dubai, Abu Dhabi) and Saudi Arabia (Riyadh, NEOM). Open to global remote roles.",
      },
    },
    {
      "@type": "Question",
      name: "What is Abir's most recent production impact?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AbaYa-Track's Delivery Module (2026): a value-weighted production dashboard for a Dubai abaya factory that surfaced AED 111,246 of trapped backlog in 30 days at an 11.1:1 value-to-cost ratio. Combined production output rose 38%, on-time delivery moved from 65% to 92% with zero additional hires.",
      },
    },
    {
      "@type": "Question",
      name: "Does Abir need visa sponsorship in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Mohammad Abir Abbas holds a UAE Company Visa and is available immediately in Dubai.",
      },
    },
    {
      "@type": "Question",
      name: "Which languages does Abir work in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "English (IELTS 7.5), Bengali (Native), Arabic (working proficiency, GCC-market ready), and German (Goethe A2). Comfortable shipping in multilingual product teams.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies does Abir work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI agent workflows (LangChain, AutoGPT, GPT-4/4o, RAG), React, React Native, TypeScript, Node.js, Cloudflare Workers, Rust, C/C++, PostgreSQL, Redis. He has shipped systems on the Cloudflare edge, Electron, and Express.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of roles is Abir looking for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mid-level roles in AI Architecture, Solutions Engineering, Platform Engineering, or Developer Experience. UAE (Dubai/Abu Dhabi), Saudi Arabia (Riyadh/NEOM), or global remote. Salary band: AED 18,000 – 25,000 / month in the GCC.",
      },
    },
    {
      "@type": "Question",
      name: "Has Abir won any industry awards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MIT Hacknation 2026 Next Best Project (SmartSwap). Redis Side Quest Winner 2024 (RedAGPT).",
      },
    },
    {
      "@type": "Question",
      name: "How can recruiters reach Abir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email abir.abbas@proton.me, WhatsApp +971 54 361 8066, LinkedIn linkedin.com/in/abir-abbas, or the connect form at abir.getwaved.ai/connect. UAE Company Visa held; no sponsorship needed.",
      },
    },
  ],
};

const JSON_LD = JSON.stringify([PERSON_LD, WEBSITE_LD, PROFILE_PAGE_LD, BREADCRUMB_LD, FAQ_LD]);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: FULL_NAME },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "rating", content: "general" },
      { name: "distribution", content: "global" },
      { name: "copyright", content: FULL_NAME },
      { name: "theme-color", content: "#006a4e" },
      {
        name: "keywords",
        content:
          "AI Architect Dubai, AI Architect UAE, AI Engineer Dubai, AI Architect GCC, Solutions Engineer Dubai, Platform Engineer UAE, Developer Experience Dubai, React Native Dubai, Cloudflare Workers developer, AI agent workflows, LangChain engineer, process automation GCC, MENA AI talent, Saudi Arabia AI architect, Riyadh AI engineer, NEOM, multilingual engineer, Bengali AI engineer, Bangladeshi AI engineer, remote AI engineer, MLOps, RAG engineer, edge AI, AbaYa-Track, SmartSwap, RedAGPT, Mohammad Abir Abbas, Abir Abbas, mdabir1203, Wavelink",
      },
      { name: "subject", content: "AI Architect & Solutions Engineer portfolio" },
      { name: "Classification", content: "Technology, AI, Software Engineering" },
      { name: "designer", content: FULL_NAME },
      { name: "owner", content: FULL_NAME },
      { name: "reply-to", content: "abir.abbas@proton.me" },
      { name: "category", content: "AI Architecture, Solutions Engineering, Platform Engineering" },

      // Open Graph
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_AE" },
      { property: "og:locale:alternate", content: "bn_BD" },
      { property: "og:site_name", content: "Mohammad Abir Abbas" },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:secure_url", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Mohammad Abir Abbas — AI Architect, Solutions & Platform Engineer in Dubai, UAE" },
      { property: "og:determiner", content: "" },
      { property: "og:see_also", content: "https://github.com/mdabir1203" },
      { property: "og:see_also", content: "https://medium.com/@md.abir1203" },
      { property: "og:see_also", content: "https://www.youtube.com/@wavelinkd" },
      { property: "profile:first_name", content: GIVEN_NAME },
      { property: "profile:last_name", content: FAMILY_NAME },
      { property: "profile:username", content: "abir-abbas" },
      { property: "profile:gender", content: "male" },

      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:site", content: "@mdabir1203" },
      { name: "twitter:creator", content: "@mdabir1203" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:image:alt", content: "Mohammad Abir Abbas — AI Architect, Solutions & Platform Engineer in Dubai, UAE" },
      { name: "twitter:label1", content: "Role" },
      { name: "twitter:data1", content: "AI Architect · Solutions Engineer · Platform Engineer" },
      { name: "twitter:label2", content: "Location" },
      { name: "twitter:data2", content: "Dubai, UAE (open to KSA & remote)" },
      { name: "twitter:label3", content: "Availability" },
      { name: "twitter:data3", content: "Q3 2026 — UAE Company Visa, no sponsorship needed" },

      // Geo (Dubai primary, GCC-wide service area)
      { name: "geo.region", content: "AE-DU" },
      { name: "geo.placename", content: "Dubai, United Arab Emirates" },
      { name: "geo.position", content: "25.2048;55.2708" },
      { name: "ICBM", content: "25.2048, 55.2708" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "target", content: "AI Architect Dubai, AI Engineer UAE, Solutions Engineer GCC, Platform Engineer, Developer Experience, React Native, Cloudflare Workers, MENA AI, Saudi Arabia, Riyadh, NEOM, remote" },
      { name: "audience", content: "Technical recruiters, hiring managers, engineering leaders in Dubai, Abu Dhabi, Riyadh, NEOM, GCC, and global remote" },
      { name: "recruitment", content: "Open to AI Architect, Solutions Engineer, Platform Engineer, Developer Experience, React Native roles in UAE, KSA, and remote" },
      { name: "visa-status", content: "UAE Company Visa — no sponsorship required" },
      { name: "abstract", content: "AI Architect in Dubai shipping production AI agent workflows, process automation, and platform tooling across GCC and global remote teams." },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "en", href: SITE_URL },
      { rel: "alternate", hrefLang: "ar-AE", href: SITE_URL },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
      { rel: "alternate", type: "application/json", href: "/.well-known/tabby.json", title: "Abir Referral System" },
      { rel: "alternate", type: "text/vcard", href: "/abir.vcf", title: "Mohammad Abir Abbas (vCard)" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Anti-flash: apply RTL before first paint if user previously chose Arabic */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}`,
          }}
        />
        {/* JSON-LD Person schema for AI crawlers and rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x6ad3xj66m");`,
          }}
        />
        {/* Ko-fi floating chat widget — loaded globally so visitors on
            any route (the editorial CinematicLanding, the dark Bento
            /work, and the QR /connect) can support the work without
            scrolling back up. The editorial landing additionally has a
            design-system-aligned card in the contact section; this
            floating widget is the loud secondary surface. */}
        <script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{kofiWidgetOverlay.draw('mohammadabirabbas',{'type':'floating-chat','floating-chat.donateButton.text':'Support me','floating-chat.donateButton.background-color':'#00b9fe','floating-chat.donateButton.text-color':'#fff'});}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  );
}
