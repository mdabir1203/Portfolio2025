/**
 * MediumRail — categorized live-updates edition of the Medium feed.
 *
 * Layout: 1 featured essay on the left (with pull-quote, reading time,
 * category color stripe) + 6 recent essays on the right in 2 columns of 3.
 * Above the grid: category filter chips and a "X new since you last
 * visit" counter with a live-update pulse.
 *
 * The data is fetched server-side via fetchMediumPosts. Each post is
 * pre-categorized server-side by `categorize()` so the filter is
 * instant (no client-side regex).
 */

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { fetchMediumPosts, type MediumPost } from "@/server/medium";
import { SectionShell } from "@/components/cinematic/SectionShell";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type CategoryKey,
} from "./categories";
import {
  CategoryBadge,
  CategoryChip,
  CategoryStripe,
  LiveDot,
} from "./FeedBits";
import { useLastVisit, countNewSince } from "@/hooks/useLastVisit";
import { useIsFresh, useRelativeTime } from "@/hooks/useRelativeTime";

const PROFILE_URL = "https://medium.com/@md.abir1203";
const FEED_KEY = "medium";
const RAIL_LIMIT = 7;

export function MediumRail() {
  const [posts, setPosts] = useState<MediumPost[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(
    "all",
  );

  useEffect(() => {
    let active = true;
    fetchMediumPosts()
      .then((d) => active && setPosts(d.posts ?? []))
      .catch(() => active && setPosts([]));
    return () => {
      active = false;
    };
  }, []);

  const loading = posts === null;
  const list = useMemo(() => {
    const all = (posts ?? []).slice(0, RAIL_LIMIT);
    if (activeCategory === "all") return all;
    return all.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  // Track last visit for the "X new" counter.
  const { lastVisit, markSeen } = useLastVisit(FEED_KEY);
  const lastVisitMs = lastVisit ? new Date(lastVisit).getTime() : 0;
  const newCount = countNewSince(posts ?? [], lastVisitMs);

  const [featured, ...rest] = list;
  const restCount = Math.min(rest.length, 6);
  const colA = rest.slice(0, Math.ceil(restCount / 2));
  const colB = rest.slice(Math.ceil(restCount / 2), restCount);

  return (
    <SectionShell
      id="writing"
      chapter="06"
      tag="Writing"
      title={
        <>
          I write about the
          <br />
          <em>edges</em>.
        </>
      }
      intro={
        <>
          Long-form pieces on distributed systems, edge runtimes, and the
          procurement layer that decides which AI tools get shortlisted. One
          Tuesday at a time.
        </>
      }
    >
      {/* Live-updates status bar — sits inside the rail, above the cards. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip
            category="ai-edge"
            active={activeCategory === "ai-edge"}
            onClick={() =>
              setActiveCategory(activeCategory === "ai-edge" ? "all" : "ai-edge")
            }
          />
          <CategoryChip
            category="edge-arch"
            active={activeCategory === "edge-arch"}
            onClick={() =>
              setActiveCategory(
                activeCategory === "edge-arch" ? "all" : "edge-arch",
              )
            }
          />
          <CategoryChip
            category="mobile"
            active={activeCategory === "mobile"}
            onClick={() =>
              setActiveCategory(activeCategory === "mobile" ? "all" : "mobile")
            }
          />
          <CategoryChip
            category="uae-life"
            active={activeCategory === "uae-life"}
            onClick={() =>
              setActiveCategory(
                activeCategory === "uae-life" ? "all" : "uae-life",
              )
            }
          />
          <CategoryChip
            category="engineering"
            active={activeCategory === "engineering"}
            onClick={() =>
              setActiveCategory(
                activeCategory === "engineering" ? "all" : "engineering",
              )
            }
          />
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            >
              clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
          {newCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[color:var(--accent-teal)]">
              <LiveDot />
              {newCount} new since you last visit
            </span>
          )}
          {newCount > 0 && (
            <button
              type="button"
              onClick={markSeen}
              className="text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            >
              mark seen
            </button>
          )}
          <span className="text-ink-faint">
            {list.length} {list.length === 1 ? "essay" : "essays"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {/* FEATURED — the freshest essay, biggest card. */}
        <div className="md:col-span-7">
          {loading && <FeaturedSkeleton />}

          {!loading && featured && (
            <FeaturedCard
              post={featured}
              lastVisitMs={lastVisitMs}
              markSeen={markSeen}
            />
          )}

          {!loading && !featured && (
            <div className="flex h-full flex-col justify-center rounded-2xl border border-rule bg-paper-2 p-8 text-center">
              <p className="text-sm text-ink-muted">
                No essays yet — the next one is in the works.
              </p>
            </div>
          )}
        </div>

        {/* RAIL — six more in 2 columns. */}
        <div className="md:col-span-5">
          {loading ? (
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <RailColumnSkeleton />
              <RailColumnSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <ul className="flex flex-col">
                {colA.map((p) => (
                  <RailRow key={p.link} post={p} lastVisitMs={lastVisitMs} />
                ))}
              </ul>
              <ul className="flex flex-col">
                {colB.map((p) => (
                  <RailRow key={p.link} post={p} lastVisitMs={lastVisitMs} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
          // Auto-pulled from the RSS feed · refreshes on every deploy
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a
            href="#watch"
            className="inline-flex items-center gap-1.5 text-ink-muted transition-all hover:gap-2.5 hover:text-[color:var(--accent-teal)]"
          >
            Rather watch? Latest on YouTube <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-ink transition-all hover:gap-2.5 hover:text-[color:var(--accent-teal)]"
          >
            All posts on Medium <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured card with pull-quote treatment.                          */
/* ------------------------------------------------------------------ */
function FeaturedCard({
  post,
  lastVisitMs,
  markSeen,
}: {
  post: MediumPost;
  lastVisitMs: number;
  markSeen: () => void;
}) {
  const fresh = useIsFresh(post.pubDate);
  const rel = useRelativeTime(post.pubDate);
  const isNew = lastVisitMs > 0 && new Date(post.pubDate).getTime() > lastVisitMs;
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noreferrer"
      onClick={markSeen}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper-2 p-6 transition-colors hover:border-[color:var(--accent-teal)]/40 hover:bg-paper-hi md:p-8"
    >
      <CategoryStripe category={post.category} />

      <div className="flex flex-wrap items-center justify-between gap-3 pl-3">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent-teal)]">
          {fresh && <LiveDot />}
          <BookOpen className="h-3.5 w-3.5" />
          Latest essay
        </span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <CategoryBadge category={post.category} />
          {isNew && (
            <span className="rounded-full border border-[color:var(--accent-teal)] bg-[color:var(--accent-teal)]/10 px-2 py-0.5 text-[color:var(--accent-teal)]">
              new
            </span>
          )}
          <span>{rel || formatDate(post.pubDate)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime} min
          </span>
        </div>
      </div>

      {/* Pull quote — short headline-style line above the title. */}
      {post.snippet && (
        <p
          className="mt-5 max-w-2xl font-display text-2xl italic leading-[1.2] text-ink-muted md:text-3xl"
          style={{ color: `${CATEGORIES[post.category].color}` }}
        >
          “{firstSentence(post.snippet)}”
        </p>
      )}

      <h3 className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-ink md:text-4xl lg:text-5xl">
        {post.title}
      </h3>

      {post.snippet && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {post.snippet}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
          Read on Medium
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-all group-hover:gap-2.5 group-hover:text-[color:var(--accent-teal)]">
          Open essay <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Rail row — compact, two-column-friendly.                          */
/* ------------------------------------------------------------------ */
function RailRow({
  post,
  lastVisitMs,
}: {
  post: MediumPost;
  lastVisitMs: number;
}) {
  const fresh = useIsFresh(post.pubDate);
  const rel = useRelativeTime(post.pubDate);
  const isNew = lastVisitMs > 0 && new Date(post.pubDate).getTime() > lastVisitMs;
  return (
    <li className="border-b border-rule py-4 first:pt-0 last:border-b-0">
      <a
        href={post.link}
        target="_blank"
        rel="noreferrer"
        className="group relative flex flex-col gap-1.5 pl-3"
      >
        <CategoryStripe category={post.category} className="h-full" />
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            {fresh && <LiveDot />}
            <CategoryBadge category={post.category} />
            {isNew && (
              <span className="rounded-full border border-[color:var(--accent-teal)] bg-[color:var(--accent-teal)]/10 px-1.5 py-px text-[9px] text-[color:var(--accent-teal)]">
                new
              </span>
            )}
          </span>
          <span>{rel || formatDate(post.pubDate)}</span>
        </div>
        <h4 className="line-clamp-3 font-display text-base leading-snug text-ink transition-colors group-hover:text-[color:var(--accent-teal)] md:text-lg">
          {post.title}
        </h4>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          <Clock className="h-2.5 w-2.5" />
          {post.readingTime} min
        </div>
      </a>
    </li>
  );
}

function firstSentence(s: string): string {
  const idx = s.search(/[.!?]\s/);
  if (idx < 0) return s.length > 140 ? s.slice(0, 137) + "…" : s;
  const cut = s.slice(0, idx + 1);
  return cut.length > 180 ? cut.slice(0, 177) + "…" : cut;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function FeaturedSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-paper-hi" />
        <div className="h-3 w-32 animate-pulse rounded bg-paper-hi" />
      </div>
      <div className="mt-5 h-8 w-3/4 animate-pulse rounded bg-paper-hi" />
      <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-paper-hi" />
      <div className="mt-6 h-3 w-full animate-pulse rounded bg-paper-hi" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-paper-hi" />
    </div>
  );
}

function RailColumnSkeleton() {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="border-b border-rule py-4 first:pt-0 last:border-b-0">
          <div className="h-3 w-20 animate-pulse rounded bg-paper-hi" />
          <div className="mt-2 h-5 w-full animate-pulse rounded bg-paper-hi" />
          <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-paper-hi" />
        </li>
      ))}
    </ul>
  );
}
