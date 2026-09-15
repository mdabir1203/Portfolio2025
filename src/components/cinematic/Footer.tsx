import { BrandMark } from "@/components/brand/BrandMark";
import { KofiSupport } from "@/components/KofiSupport";

/**
 * Footer — full directory, OnePageLove style.
 *
 * Four columns of links. The monogram closes the page as a brand signature.
 */
const COLUMNS = [
  {
    title: "Site",
    links: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Path", href: "#path" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/abir-abbas", external: true },
      {
        label: "YouTube · @wavelinkd",
        href: "https://www.youtube.com/@wavelinkd/playlists",
        external: true,
      },
      { label: "GitHub", href: "https://github.com/mdabir1203", external: true },
      { label: "Medium", href: "https://medium.com/@md.abir1203", external: true },
    ],
  },
  {
    title: "Files",
    links: [
      {
        label: "CV (PDF)",
        href: "/Abir_Abbas_CV.pdf",
        external: true,
        download: "Abir_Abbas_CV.pdf",
      },
      {
        label: "Resume (ATS)",
        href: "/resume-ats.pdf",
        external: true,
        download: "Abir_Abbas_Resume_ATS.pdf",
      },
      { label: "Press kit", href: "/press.zip", external: true, download: "Abbas_PressKit.zip" },
      {
        label: "Referral card",
        href: "/cards/abir-referral-card.pdf",
        external: true,
        download: "Abbas_ReferralCard.pdf",
      },
    ],
  },
  {
    title: "Share",
    links: [
      { label: "QR landing", href: "/c/intro" },
      {
        label: "vCard (contact)",
        href: "/abir.vcf",
        external: true,
        download: "Mohammad_Abir_Abbas.vcf",
      },
      { label: "tabby.json (metadata)", href: "/.well-known/tabby.json", external: true },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "abir.abbas@proton.me", href: "mailto:abir.abbas@proton.me" },
      { label: "+971 054 361 8066", href: "tel:+971543618066" },
      { label: "WhatsApp direct", href: "https://wa.me/971543618066", external: true },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="cin-footer py-14 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 border-b border-rule pb-10 md:grid-cols-5 md:gap-10">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="cin-footer-link"
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      {...("download" in l && l.download ? { download: l.download } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.20em] text-ink-muted">
          <div className="flex items-center gap-3">
            <BrandMark size={26} variant="primary" />
            <span>© 2026 Mohammad Abir Abbas · Dubai, UAE</span>
          </div>
          <div>
            <span className="text-ink">·Wavelink 2025→</span>
            <span className="mx-2 text-ink-faint">·</span>
            <span>Deep Blue Digital 2024→</span>
            <span className="mx-2 text-ink-faint">·</span>
            <span>HNM IT 2023</span>
            <span className="mx-2 text-ink-faint">·</span>
            <span>42 Wolfsburg 2022–24</span>
          </div>
        </div>

        {/* Quiet Ko-fi handle — the design-system-aligned handle for the
            support surface, sitting below the directory. The Ko-fi widget
            script (in __root.tsx) draws the floating button globally. */}
        <div className="mt-6">
          <KofiSupport variant="inline" />
        </div>

        {/* AI-crawler surface: llms.txt (canonical AI-readable summary) + sitemap.
            Linked here so it's discoverable in-page, not just in robots.txt. */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <a href="/llms.txt" className="cin-footer-link !text-[10px]">llms.txt</a>
          <span className="text-ink-faint/50">·</span>
          <a href="/sitemap.xml" className="cin-footer-link !text-[10px]">sitemap.xml</a>
          <span className="text-ink-faint/50">·</span>
          <a href="/robots.txt" className="cin-footer-link !text-[10px]">robots.txt</a>
          <span className="text-ink-faint/50">·</span>
          <a href="/abir.vcf" className="cin-footer-link !text-[10px]">vCard</a>
          <span className="text-ink-faint/50">·</span>
          <a href="/.well-known/tabby.json" className="cin-footer-link !text-[10px]">tabby.json</a>
        </div>
      </div>
    </footer>
  );
}
