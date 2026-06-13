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
const TITLE = "Mohammad Abir Abbas — Creative Technologist & AI Architect";
const DESCRIPTION =
  "AI Architect and Creative Technologist based in Ajman, UAE. I deploy AI workflows that protect enterprise assets and recapture thousands of engineering hours — turning complex tech into predictable ROI across GCC markets.";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: FULL_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  jobTitle: "Creative Technologist & AI Architect",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ajman",
    addressCountry: "AE",
  },
  sameAs: [
    "https://www.linkedin.com/in/abir-abbas",
    "https://github.com/mdabir1203",
    "https://medium.com/@mdabir1203",
    "https://smartswap.lovable.app/",
    "https://github.com/shamantechnology/RedAGPT",
  ],
  knowsAbout: [
    "AI Agent Workflows",
    "Process Automation",
    "React",
    "React Native",
    "Rust",
    "C",
    "C++",
    "Cross-cultural GTM",
    "GCC Markets",
    "Network Security",
  ],
  award: [
    "Redis Side Quest Winner 2024 — RedAGPT",
    "MIT Hacknation 2026 Next Best — SmartSwap",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Wavelink",
    url: "https://wavelink.com",
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: FULL_NAME },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
      { name: "keywords", content: "AI Architect, Creative Technologist, GCC, UAE, Ajman, AI workflows, process automation, React, Rust, AbayaTrack, Wavelink, SmartSwap, RedAGPT" },

      // Open Graph
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_AE" },
      { property: "profile:first_name", content: "Mohammad Abir" },
      { property: "profile:last_name", content: "Abbas" },
      { property: "profile:username", content: "abir-abbas" },

      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:creator", content: "@mdabir1203" },

      // Geo
      { name: "geo.region", content: "AE-AJ" },
      { name: "geo.placename", content: "Ajman, United Arab Emirates" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
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
        <script dangerouslySetInnerHTML={{ __html: `try{var l=localStorage.getItem('lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}` }} />
        {/* JSON-LD Person schema for AI crawlers and rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x6ad3xj66m");` }} />
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
