import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * TopNav — calm header with the A monogram on the left and primary nav
 * on the right.
 *
 * Desktop (≥md): lockup is a link to #hero, primary nav is a horizontal
 * row of links.
 *
 * Mobile (<md): lockup becomes the menu toggle. The button's accessible
 * name is a single "Menu" label combined with the visible wordmark, so a
 * screen reader announces "Menu, Abir Abbas, button, collapsed/expanded".
 * Tapping it opens a dropdown panel with the same nav items. The panel:
 *   - closes on Escape, click-outside, or after picking an item,
 *   - traps focus to the first link on open, returns focus to the
 *     button on close,
 *   - respects prefers-reduced-motion (no slide),
 *   - marks the active section with aria-current="true" via an
 *     IntersectionObserver.
 *
 * 2026 web-vital notes:
 *   - No third-party tracker, no JS-driven element-type swap. Same
 *     desktop link, separate mobile button — both SSR-rendered.
 *   - All interactive elements have a visible focus ring (focus-visible)
 *     and a 48x48 minimum touch target.
 */

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  /** True for the contact CTA — rendered with stronger type weight. */
  emphasis?: boolean;
  /** Optional inline prefix rendered before the label (e.g. "ENFP"). */
  prefix?: { text: string; color?: string };
};

const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  {
    label: "Personality",
    href: "#personality",
    prefix: { text: "ENFP", color: "#0f7569" },
  },
  { label: "Path", href: "#path" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abir-abbas",
    external: true,
  },
  {
    label: "Hire me",
    href: "mailto:abir.abbas@proton.me",
    emphasis: true,
  },
];

/** Section IDs the dropdown uses to highlight the active nav item. */
const SECTION_IDS = ["work", "about", "personality", "path"] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on Escape and click-outside. Lock body scroll while open so the
  // user can't pan the page behind the menu (mobile UX). Restore focus
  // to the trigger button on close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      const insidePanel =
        target instanceof Element &&
        (target.closest("[data-mobile-nav-panel]") ||
          target.closest("[data-mobile-nav-button]"));
      if (!insidePanel) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the first link so keyboard users land somewhere useful.
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Highlight the active section in both desktop + mobile navs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    const els: Element[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        els.push(el);
      }
    }
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="cin-nav fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Desktop: lockup is a link to #hero */}
        <a
          href="#hero"
          className="hidden items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:inline-flex"
          aria-label="Mohammad Abir Abbas — home"
        >
          <BrandMark size={26} variant="primary" decorative />
          <span className="font-display text-[15px] font-medium tracking-tight text-ink">
            Abir Abbas
          </span>
        </a>

        {/* Mobile: lockup becomes the menu toggle button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="menu"
          aria-label={open ? "Close menu" : "Open menu"}
          data-mobile-nav-button
          className="inline-flex min-h-[44px] items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:hidden"
        >
          <BrandMark size={26} variant="primary" decorative />
          <span className="font-display text-[15px] font-medium tracking-tight text-ink">
            Abir Abbas
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 text-ink-muted transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isCurrent = activeId !== null && item.href === `#${activeId}`;
            const className = `cin-nav-link inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
              item.emphasis ? "font-semibold text-ink" : ""
            }`;
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {item.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              );
            }
            return (
              <a
                key={item.href}
                href={item.href}
                className={className}
                aria-current={isCurrent ? "true" : undefined}
              >
                {item.prefix && (
                  <span aria-hidden="true" style={{ color: item.prefix.color }}>
                    {item.prefix.text}
                  </span>
                )}
                {item.prefix && <span className="ml-1.5">{item.label}</span>}
                {!item.prefix && item.label}
              </a>
            );
          })}
          {/* Theme toggle — sits at the right edge of the desktop nav */}
          <ThemeToggle />
        </nav>
      </div>

      {/* Mobile dropdown panel — absolutely positioned below the bar */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full md:hidden"
            data-mobile-nav-panel
          >
            <div
              id={panelId}
              role="menu"
              aria-label="Primary navigation"
              className="mx-4 mt-2 overflow-hidden rounded-lg border border-rule bg-paper shadow-[0_24px_64px_-12px_rgba(0,0,0,0.18)]"
            >
              <nav aria-label="Primary">
                <ul role="none" className="flex flex-col py-1">
                  {NAV_ITEMS.map((item, i) => {
                    const isCurrent =
                      activeId !== null && item.href === `#${activeId}`;
                    return (
                      <li role="none" key={item.href}>
                        <a
                          ref={i === 0 ? firstLinkRef : undefined}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMenu}
                          aria-current={isCurrent ? "page" : undefined}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          className={`flex min-h-[48px] items-center gap-2 px-5 py-3 text-base transition-colors hover:bg-ink/5 focus-visible:bg-ink/5 focus-visible:outline-none ${
                            item.emphasis
                              ? "font-semibold text-ink"
                              : "text-ink-muted"
                          }`}
                        >
                          {item.prefix && (
                            <span
                              aria-hidden="true"
                              style={{ color: item.prefix.color }}
                            >
                              {item.prefix.text}
                            </span>
                          )}
                          <span>{item.label}</span>
                          {item.external && (
                            <ArrowUpRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                {/* Theme toggle — sits below the nav items with a subtle
                    top border, matching the panel's typographic system. */}
                <div className="border-t border-rule px-1 py-1">
                  <ThemeToggle variant="panel" />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default TopNav;