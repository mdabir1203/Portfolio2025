import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";

/**
 * TopNav — calm header with the A monogram on the left and primary nav
 * on the right. The monogram replaces the bare text mark so the brand
 * has a visual identity at every scroll position.
 */
export function TopNav() {
  return (
    <header className="cin-nav fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#hero"
          className="flex items-center gap-2"
          aria-label="Mohammad Abir Abbas — home"
        >
          <BrandMark size={26} variant="primary" />
          <span className="font-display text-[15px] font-medium tracking-tight text-ink">
            Abir Abbas
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
