/**
 * YouTubeRail — categorized live-updates edition.
 *
 * Layout: 1 featured video on the left (the freshest long-form) + 6
 * videos in 2 columns of 3 on the right. The merged feed is channel
 * uploads + a hand-curated "aligned with the experience" list.
 *
 * Above the grid:
 *   - category filter chips (AI Edge / Edge Arch / Mobile / Security)
 *   - a "X new since you last visit" counter
 *   - a small legend distinguishing channel (●) vs curated (★)
 *
 * Each card carries a color stripe for its category, a "new" pill for
 * posts newer than the last visit, a "fresh" pulse for items < 7 days
 * old, and a relative time label that auto-updates every minute.
 */

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Eye, PlayCircle, Star, Clock } from "lucide-react";
import {
  fetchWavelinkVideos,
  type YouTubeVideoWithMeta,
} from "@/server/youtube";
import { RAIL_PLAYLISTS } from "@/data/curatedVideos";
import { SectionShell } from "@/components/cinematic/SectionShell";
import { type CategoryKey, CATEGORIES } from "./categories";
import {
  CategoryBadge,
  CategoryChip,
  CategoryStripe,
  LiveDot,
} from "./FeedBits";
import { useLastVisit, countNewSince } from "@/hooks/useLastVisit";
import { useIsFresh, useRelativeTime } from "@/hooks/useRelativeTime";

const MEDIUM_URL = "https://medium.com/@md.abir1203";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@wavelinkd";
const FEED_KEY = "youtube";
const RAIL_LIMIT = 7;

export function YouTubeRail() {
  const [videos, setVideos] = useState<YouTubeVideoWithMeta[] | null>(null);
  const [channelTitle, setChannelTitle] = useState("Mohammad Abir Abbas");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(
    "all",
  );

  useEffect(() => {
    let active = true;
    fetchWavelinkVideos()
      .then((d) => {
        if (!active) return;
        setVideos(d.videos ?? []);
        if (d.channel?.title) setChannelTitle(d.channel.title);
      })
      .catch(() => active && setVideos([]));
    return () => {
      active = false;
    };
  }, []);

  const loading = videos === null;
  const list = useMemo(() => {
    // Always work on the full merged list (channel + curated) — the rail
    // logic below mixes them deliberately.
    const all = videos ?? [];
    if (activeCategory === "all") return all;
    return all.filter((v) => v.category === activeCategory);
  }, [videos, activeCategory]);

  const { lastVisit, markSeen } = useLastVisit(FEED_KEY);
  const lastVisitMs = lastVisit ? new Date(lastVisit).getTime() : 0;
  const newCount = countNewSince(videos ?? [], lastVisitMs);

  // Prefer a long-form channel video for featured; fall back to any.
  // We deliberately keep the curated videos in the rail so the user
  // always sees the hand-picked shelf, even when the channel has many
  // recent uploads.
  const featured =
    list.find((v) => !v.isShort && v.source === "channel") ??
    list.find((v) => !v.isShort) ??
    list[0];
  const rest = list.filter((v) => v.id !== featured?.id);
  // Reserve curated slots for each configured playlist so both shelves are
  // always visible (AbayaTrack + Wavelink). Top up with channel uploads
  // to make 6 total.
  const curatedByPlaylist: YouTubeVideoWithMeta[] = [];
  const seen = new Set<string>();
  for (const playlist of RAIL_PLAYLISTS) {
    if (curatedByPlaylist.length >= 4) break;
    const slots = 2;
    const picks: YouTubeVideoWithMeta[] = [];
    for (const v of rest) {
      if (picks.length >= slots) break;
      if (seen.has(v.id)) continue;
      if (v.source !== "curated") continue;
      if (v.playlistId !== playlist.id) continue;
      picks.push(v);
      seen.add(v.id);
    }
    curatedByPlaylist.push(...picks);
  }
  const curatedRest = curatedByPlaylist;
  const channelRest = rest.filter(
    (v) => v.source === "channel" && !seen.has(v.id),
  );
  const targetRest = 6;
  const slotsLeft = Math.max(0, targetRest - curatedRest.length);
  const mixedRest = [...curatedRest, ...channelRest.slice(0, slotsLeft)];

  // DEBUG
  if (typeof window !== "undefined") {
    const w = window as unknown as { __ytDebug?: unknown };
    w.__ytDebug = {
      listLen: list.length,
      featuredId: featured?.id,
      featuredTitle: featured?.title,
      curatedCount: list.filter((v) => v.source === "curated").length,
      channelCount: list.filter((v) => v.source === "channel").length,
      restCount: rest.length,
      curatedByPlaylistLen: curatedByPlaylist.length,
      curatedByPlaylistTitles: curatedByPlaylist.map((v) => v.title),
      channelRestLen: channelRest.length,
      mixedRestLen: mixedRest.length,
      mixedRestSources: mixedRest.map((v) => v.source + ":" + (v.title ?? "").slice(0, 30)),
      restSources: rest.map((v) => v.source).reduce((acc: Record<string, number>, s) => {
        acc[s] = (acc[s] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
  const colA = mixedRest.slice(0, Math.ceil(mixedRest.length / 2));
  const colB = mixedRest.slice(Math.ceil(mixedRest.length / 2));

  return (
    <SectionShell
      id="youtube"
      chapter="07"
      tag="Watch"
      title={
        <>
          I build in <em>public</em>.
        </>
      }
      intro={
        <>
          No script, no edit, no filter. The factory floor, the cloud bill, the
          founder moment, the AI agent that did something wild on a Wednesday.
          Plus the two real playlists I publish from on-site — AbayaTrack for
          the build log, Wavelink for the AI-agent workflows.
        </>
      }
    >
      {/* Live-updates status bar — sits above the grid, mirrors MediumRail. */}
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
            category="security"
            active={activeCategory === "security"}
            onClick={() =>
              setActiveCategory(
                activeCategory === "security" ? "all" : "security",
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
            {list.length} {list.length === 1 ? "video" : "videos"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {/* FEATURED — biggest video, magazine-cover treatment. */}
        <div className="md:col-span-7">
          {loading && <FeaturedSkeleton />}

          {!loading && featured && (
            <FeaturedVideo
              video={featured}
              lastVisitMs={lastVisitMs}
              markSeen={markSeen}
            />
          )}

          {!loading && !featured && (
            <div className="flex h-full flex-col justify-center rounded-2xl border border-rule bg-paper-2 p-8 text-center">
              <p className="text-sm text-ink-muted">
                No videos yet — the camera is rolling this week.
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
                {colA.map((v) => (
                  <RailRow
                    key={v.id}
                    video={v}
                    lastVisitMs={lastVisitMs}
                  />
                ))}
              </ul>
              <ul className="flex flex-col">
                {colB.map((v) => (
                  <RailRow
                    key={v.id}
                    video={v}
                    lastVisitMs={lastVisitMs}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer row — channel handle + curated legend + cross-link to Medium */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
          <span>// {channelTitle} · auto-pulled from RSS + channel playlists</span>
          <span className="inline-flex items-center gap-1">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-teal)]"
            />
            channel
          </span>
          {RAIL_PLAYLISTS.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1"
              title={p.title}
            >
              <Star
                aria-hidden
                className="h-2.5 w-2.5 fill-[#d8b46a] text-[#d8b46a]"
              />
              {p.shortLabel}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a
            href={MEDIUM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-ink-muted transition-all hover:gap-2.5 hover:text-[color:var(--accent-teal)]"
          >
            Prefer to read? Latest on Medium <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-ink transition-all hover:gap-2.5 hover:text-[color:var(--accent-teal)]"
          >
            Subscribe to @wavelinkd <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured video — magazine-cover with all the live bits.            */
/* ------------------------------------------------------------------ */
function FeaturedVideo({
  video,
  lastVisitMs,
  markSeen,
}: {
  video: YouTubeVideoWithMeta;
  lastVisitMs: number;
  markSeen: () => void;
}) {
  const fresh = useIsFresh(video.publishedAt);
  const rel = useRelativeTime(video.publishedAt);
  const isNew =
    lastVisitMs > 0 &&
    !!video.publishedAt &&
    new Date(video.publishedAt).getTime() > lastVisitMs;

  return (
    <a
      href={video.link}
      target="_blank"
      rel="noreferrer"
      onClick={markSeen}
      className="group relative block overflow-hidden rounded-2xl border border-rule bg-paper-2 transition-colors hover:border-[color:var(--accent-teal)]/40"
    >
      <CategoryStripe category={video.category} />

      <div className="relative aspect-video w-full overflow-hidden bg-ink/95">
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Ink-dark gradient so play button + label stay readable on any thumb. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.02_270/0.85)] via-transparent to-transparent"
        />
        {/* Play button — always visible, gentle pulse on hover. */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/95 text-ink shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-transform group-hover:scale-110">
            <PlayCircle className="h-9 w-9" strokeWidth={1.5} />
          </div>
        </div>
        {/* Bottom-left meta strip */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-2 p-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-paper/80">
            {fresh && <LiveDot />}
            <CategoryBadge
              category={video.category}
              className="border border-paper/30 bg-ink/40 text-paper backdrop-blur-sm"
            />
            {isNew && (
              <span className="rounded-full border border-[color:var(--accent-teal)] bg-[color:var(--accent-teal)]/20 px-2 py-0.5 text-[color:var(--accent-teal)]">
                new
              </span>
            )}
            {video.source === "curated" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#d8b46a]/20 px-2 py-0.5 text-[#d8b46a]">
                <Star className="h-2.5 w-2.5 fill-current" /> curated
              </span>
            )}
            <span>
              {video.isShort ? "Short" : "Episode"} ·{" "}
              {rel || shortDate(video.publishedAt)}
            </span>
            {video.watchMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {video.watchMinutes} min
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80">
            {video.views > 0 && (
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" /> {views(video.views)}
              </span>
            )}
            {video.starRating && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-paper" />{" "}
                {video.starRating.average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <h3 className="font-display text-2xl leading-snug text-ink transition-colors group-hover:text-[color:var(--accent-teal)] md:text-3xl">
          {video.title}
        </h3>
        {/* The "why this is here" line — first-person voice for curated. */}
        {video.reason && (
          <p
            className="mt-2 font-display text-sm italic md:text-base"
            style={{ color: CATEGORIES[video.category].color }}
          >
            {video.reason}
          </p>
        )}
        {video.description && !video.reason && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted md:text-base">
            {cleanDescription(video.description)}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
            {video.source === "curated"
              ? `via ${video.channel ?? "curated"}`
              : "Watch on YouTube"}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-all group-hover:gap-2.5 group-hover:text-[color:var(--accent-teal)]">
            Play <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Rail row — compact, two-column-friendly.                          */
/* ------------------------------------------------------------------ */
function RailRow({
  video,
  lastVisitMs,
}: {
  video: YouTubeVideoWithMeta;
  lastVisitMs: number;
}) {
  const fresh = useIsFresh(video.publishedAt);
  const rel = useRelativeTime(video.publishedAt);
  const isNew =
    lastVisitMs > 0 &&
    !!video.publishedAt &&
    new Date(video.publishedAt).getTime() > lastVisitMs;

  return (
    <li className="border-b border-rule py-4 first:pt-0 last:border-b-0">
      <a
        href={video.link}
        target="_blank"
        rel="noreferrer"
        className="group relative flex flex-col gap-2 pl-3"
      >
        <CategoryStripe category={video.category} className="h-full" />
        <div className="flex items-center gap-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-rule bg-ink/95">
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-ink/30 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <PlayCircle
                className="h-7 w-7 text-paper"
                strokeWidth={1.5}
              />
            </div>
            {video.isShort && (
              <span className="absolute left-1.5 top-1.5 rounded bg-paper/90 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ink">
                Short
              </span>
            )}
            {video.source === "curated" && (
              <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-[#d8b46a]/90 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ink">
                <Star className="h-2.5 w-2.5 fill-current" /> curated
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            {fresh && <LiveDot />}
            <CategoryBadge category={video.category} />
            {isNew && (
              <span className="rounded-full border border-[color:var(--accent-teal)] bg-[color:var(--accent-teal)]/10 px-1.5 py-px text-[9px] text-[color:var(--accent-teal)]">
                new
              </span>
            )}
          </span>
          <span>{rel || shortDate(video.publishedAt)}</span>
        </div>
        <h4 className="line-clamp-2 font-display text-sm leading-snug text-ink transition-colors group-hover:text-[color:var(--accent-teal)] md:text-base">
          {video.title}
        </h4>
        {video.watchMinutes ? (
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            <Clock className="h-2.5 w-2.5" />
            {video.watchMinutes} min
            {video.views > 0 && (
              <>
                <span className="text-ink-faint/40">·</span>
                <Eye className="h-2.5 w-2.5" /> {views(video.views)}
              </>
            )}
          </div>
        ) : video.views > 0 ? (
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            <Eye className="h-2.5 w-2.5" /> {views(video.views)}
          </div>
        ) : null}
      </a>
    </li>
  );
}

function shortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function views(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function cleanDescription(d: string, maxLen = 220): string {
  if (!d) return "";
  const cutAt = d.search(/⏱|🔗|⏱️|Chapters?:/i);
  const body = (cutAt > 0 ? d.slice(0, cutAt) : d)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (body.length <= maxLen) return body;
  const slice = body.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice) + "…";
}

function FeaturedSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-rule bg-paper-2">
      <div className="aspect-video w-full animate-pulse bg-paper-hi" />
      <div className="space-y-3 p-6 md:p-7">
        <div className="h-7 w-3/4 animate-pulse rounded bg-paper-hi" />
        <div className="h-4 w-full animate-pulse rounded bg-paper-hi" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-paper-hi" />
      </div>
    </div>
  );
}

function RailColumnSkeleton() {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="border-b border-rule py-4 first:pt-0 last:border-b-0"
        >
          <div className="aspect-video w-full animate-pulse rounded-lg bg-paper-hi" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-paper-hi" />
          <div className="mt-1.5 h-5 w-full animate-pulse rounded bg-paper-hi" />
          <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-paper-hi" />
        </li>
      ))}
    </ul>
  );
}
