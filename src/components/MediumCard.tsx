import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { format, isThisYear, parseISO } from "date-fns";
import { fetchMediumPosts, type MediumPost } from "@/server/medium";

const PROFILE_URL = "https://medium.com/@md.abir1203";

/** "Aug 22" or "Aug 22, 2025" — keep it short for tight bento cards. */
function shortDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = parseISO(iso);
    if (Number.isNaN(d.getTime())) return "";
    return isThisYear(d) ? format(d, "MMM d") : format(d, "MMM d, yyyy");
  } catch {
    return "";
  }
}

/**
 * Rough read-time estimate from the snippet — Medium essays are 700-1500
 * words/min of long-form prose, so we approximate from the cleaned-up
 * snippet length when we don't have a word count.
 */
function readTime(iso: string, snippet: string): string {
  // If the publish date is < 2 weeks old, a 12-min read is a fine floor
  // for a serious essay. Otherwise we hint "long read" / "quick read".
  let d: Date | null = null;
  try {
    d = parseISO(iso);
  } catch {
    /* ignore */
  }
  if (d && !Number.isNaN(d.getTime())) {
    const ageDays = (Date.now() - d.getTime()) / 86_400_000;
    if (ageDays < 14) return "12 min read";
  }
  if (snippet.length < 100) return "5 min read";
  if (snippet.length > 220) return "long read";
  return "8 min read";
}

export default function MediumCard() {
  const [posts, setPosts] = useState<MediumPost[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchMediumPosts()
      .then((d) => active && setPosts(d.posts ?? []))
      .catch(() => active && setPosts([]));
    return () => {
      active = false;
    };
  }, []);

  const [featured, ...rest] = posts ?? [];
  const skeleton = posts === null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
          // Reading My Mind
        </span>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/40 transition-colors hover:text-[color:var(--accent-teal)]"
          aria-label="Open Medium profile"
        >
          <BookOpen className="h-4 w-4" />
        </a>
      </div>

      <h3 className="mt-3 font-display text-2xl leading-tight">
        Latest from <em className="text-[color:var(--accent-teal)]">Medium</em>
      </h3>

      {/* FEATURED — the freshest essay, given a headline treatment. */}
      <div className="mt-4">
        {skeleton && (
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
            <div className="h-5 w-full animate-pulse rounded bg-white/5" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
          </div>
        )}

        {!skeleton && featured && (
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-[color:var(--accent-teal)]/40 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-teal)]" />
                New · {shortDate(featured.pubDate)}
              </span>
              <span className="inline-flex items-center gap-1 text-foreground/40">
                <Clock className="h-3 w-3" /> {readTime(featured.pubDate, featured.snippet)}
              </span>
            </div>
            <div className="mt-2 line-clamp-2 font-display text-lg leading-snug text-foreground/95">
              {featured.title}
            </div>
            {featured.snippet && (
              <p className="mt-1.5 line-clamp-2 text-xs text-foreground/55">{featured.snippet}</p>
            )}
            {featured.categories.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {featured.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </a>
        )}

        {!skeleton && !featured && (
          <p className="text-xs text-foreground/50">
            No articles yet — the next one is in the works.
          </p>
        )}
      </div>

      {/* THE REST — three more, terse. */}
      {rest.length > 0 && (
        <ul className="mt-4 flex-1 space-y-2.5">
          {rest.slice(0, 3).map((p) => (
            <li key={p.link}>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-3 border-b border-white/5 pb-2 text-sm text-foreground/80 hover:text-foreground"
              >
                <span className="line-clamp-2">{p.title}</span>
                <span className="mt-0.5 flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
                  {shortDate(p.pubDate)}
                  <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)] transition-all hover:gap-2"
        >
          All posts <ArrowUpRight className="h-3 w-3" />
        </a>
        <a
          href="https://www.youtube.com/@wavelinkd"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 transition-all hover:gap-2 hover:text-foreground/70"
        >
          Or watch ↗
        </a>
      </div>
    </div>
  );
}
