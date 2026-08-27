import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * A standard cinematic section frame: a chapter number, a title, a tagline,
 * and a content slot. The whole thing fades in once and reveals the chapter
 * number as a "film slate" when the section enters the viewport.
 */
export function SectionShell({
  chapter,
  tag,
  title,
  intro,
  children,
  id,
}: {
  chapter: string;
  tag: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className="cin-section relative w-full px-6 py-24 md:px-10 md:py-36"
      data-seen={seen}
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="cin-header mb-12 md:mb-20">
          <div className="cin-chapter-row flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55 md:text-[11px]">
            <span className="cin-chapter-bar h-px w-10 bg-foreground/30" aria-hidden />
            <span className="cin-chapter-label">
              {chapter} <span className="mx-2 text-foreground/30">/</span> {tag}
            </span>
          </div>
          <h2 className="cin-section-title mt-5 font-display text-4xl leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {title}
          </h2>
          {intro ? (
            <div className="cin-section-intro mt-5 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
              {intro}
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
