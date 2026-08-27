import { ArrowUpRight } from "lucide-react";

/**
 * TopNav — calm header with mix-blend-difference on the right-edge links.
 * KillerPortfolio's signature look.
 */
export function TopNav() {
  return (
    <header className="cin-nav fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#hero" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            <span className="text-[color:var(--accent-teal)]">·</span> Abir Abbas
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <a href="#work" className="cin-nav-link">Work</a>
          <a href="#about" className="cin-nav-link">About</a>
          <a href="#path" className="cin-nav-link">Path</a>
          <a
            href="https://www.linkedin.com/in/abir-abbas"
            target="_blank"
            rel="noreferrer"
            className="cin-nav-link inline-flex items-center gap-1"
          >
            LinkedIn <ArrowUpRight className="h-3 w-3" />
          </a>
          <a href="mailto:abir.abbas@proton.me" className="cin-nav-link font-semibold text-ink">
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}
