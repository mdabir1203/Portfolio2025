import { ArrowUpRight } from "lucide-react";
import abayaImg from "@/assets/case-study-gcc-abaya.png";
import smartswapImg from "@/assets/smartswap-tile.webp";
import deliveryModuleImg from "@/assets/delivery-module-tile.webp";
import wavelinkImg from "@/assets/wavelink-tile.webp";
import redagptImg from "@/assets/redagpt-tile.webp";
import wolfsburgImg from "@/assets/wolfsburg-tile.webp";
import deepblueImg from "@/assets/deepblue-tile.webp";
import hnmImg from "@/assets/hnm-tile.webp";
import phaenoImg from "@/assets/phaeno-tile.webp";

/**
 * WorkGrid — the centerpiece.
 *
 * Mixed-aspect mosaic (tall / wide / narrow), KillerPortfolio-meets-OnePageLove.
 *
 * Every tile now carries a real editorial image card with the project info
 * baked in. The bottom overlay shows the title + meta + an arrow-out link.
 * A small mono "category" pill sits in the top-left of every tile.
 */
const TILES = [
  // Row 1: flagship case studies
  {
    type: "tall",
    title: "AbaYa-Track",
    subtitle: "Delivery Module · 4-layer system",
    img: deliveryModuleImg,
    href: "#case-study",
    pill: "Case Study",
    overlay: "dark",
  },
  {
    type: "wide",
    title: "SmartSwap",
    subtitle: "MIT Hacknation 2026 · Next Top Project",
    img: smartswapImg,
    href: "https://www.youtube.com/watch?v=N76YZo7qKrA",
    pill: "Award",
    overlay: "dark",
  },

  // Row 2: Wavelink (wide) + RedAGPT (narrow) + 42 Wolfsburg (narrow)
  {
    type: "wide",
    title: "Wavelink",
    subtitle: "NFC cards · Review Stand · Reputation",
    img: wavelinkImg,
    href: "https://www.linkedin.com/company/wavelinkdai",
    pill: "Live",
    overlay: "auto",
  },
  {
    type: "narrow",
    title: "RedAGPT",
    subtitle: "Redis Side Quest · 2nd place",
    img: redagptImg,
    href: "https://visanav.netlify.app/",
    pill: "Award",
    overlay: "auto",
  },
  {
    type: "narrow",
    title: "42 Wolfsburg",
    subtitle: "C / C++ · 2y 3m",
    img: wolfsburgImg,
    href: "https://42wolfsburg.de",
    pill: "School",
    overlay: "auto",
  },

  // Row 3: Deep Blue Digital (wide) + HNM IT (narrow) + phaeno (narrow)
  {
    type: "wide",
    title: "Deep Blue Digital",
    subtitle: "Co-founder · Engaze.ai integration",
    img: deepblueImg,
    href: "https://www.linkedin.com/in/abir-abbas",
    pill: "Co-founder",
    overlay: "auto",
  },
  {
    type: "narrow",
    title: "HNM IT",
    subtitle: "Frankfurt · 99.9% uptime",
    img: hnmImg,
    href: "https://hnmsolutions.eu",
    pill: "IT Support",
    overlay: "auto",
  },
  {
    type: "narrow",
    title: "phaeno gGmbH",
    subtitle: "Robotics mentor · Wolfsburg",
    img: phaenoImg,
    href: "https://www.phaeno.de",
    pill: "Mentor",
    overlay: "auto",
  },
] as const;

export function WorkGrid() {
  return (
    <section id="work" className="cin-work py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-14">
          <div>
            <div className="cin-section-eyebrow">// Selected Work</div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-6xl">
              The work,
              <br />
              <em>not the wrapping.</em>
            </h2>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>2022 — 2026</div>
            <div className="mt-1">8 projects shown</div>
          </div>
        </div>

        <div className="cin-work-grid">
          {TILES.map((t, i) => (
            <WorkTile key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Tile = (typeof TILES)[number];

function WorkTile(t: Tile) {
  const sizeClass =
    t.type === "tall"
      ? "cin-work-tile-tall"
      : t.type === "wide"
        ? "cin-work-tile-wide"
        : t.type === "narrow"
          ? "cin-work-tile-narrow"
          : "cin-work-tile-square";

  // `overlay: "dark"` always uses a dark gradient (for dark-image tiles
  // like the SmartSwap, Delivery Module, and 42 Wolfsburg). `"auto"`
  // detects image brightness and adds an inverse overlay only when needed
  // so the editorial type baked into the image stays readable.
  return (
    <a
      href={t.href}
      target={t.href.startsWith("http") ? "_blank" : undefined}
      rel={t.href.startsWith("http") ? "noreferrer" : undefined}
      className={`cin-work-tile cin-work-tile--img group block ${sizeClass} cin-work-tile--${t.overlay}`}
      aria-label={`${t.title} — ${t.subtitle}`}
    >
      <img src={t.img} alt={t.title} loading="lazy" decoding="async" />
      <span className="cin-work-tile-overlay" aria-hidden />

      <span className="cin-work-tile-badge" aria-hidden>
        {t.pill}
      </span>

      <div className="cin-work-tile-label flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="font-display text-lg leading-tight md:text-xl">
            {t.title}
          </div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] md:text-[11px]">
            {t.subtitle}
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-5 md:w-5" />
      </div>
    </a>
  );
}
