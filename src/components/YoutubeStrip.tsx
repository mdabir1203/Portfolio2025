import { useEffect, useState } from "react";
import { PlayCircle, Eye, Star } from "lucide-react";
import { format, isThisYear, parseISO } from "date-fns";
import { fetchWavelinkVideos, type YouTubeVideoMeta } from "@/server/youtube";

const CHANNEL = "https://www.youtube.com/@wavelinkd";

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

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function YoutubeStrip() {
  const [videos, setVideos] = useState<YouTubeVideoMeta[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchWavelinkVideos()
      .then((d) => active && setVideos(d.videos ?? []))
      .catch(() => active && setVideos([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
          // I Build in Public
        </span>
        <a
          href={CHANNEL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/40 transition-colors hover:text-[color:var(--accent-teal)]"
          aria-label="Open @wavelinkd on YouTube"
        >
          <PlayCircle className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {videos === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded-md border border-white/5 bg-white/5"
            />
          ))}
        {videos !== null && videos.length === 0 && (
          <p className="col-span-3 text-xs text-foreground/50">
            Latest videos will appear here —{" "}
            <a
              href={CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--accent-teal)] underline-offset-2 hover:underline"
            >
              open @wavelinkd
            </a>
            .
          </p>
        )}
        {videos?.slice(0, 3).map((v) => (
          <a
            key={v.id}
            href={v.link}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-video overflow-hidden rounded-md border border-white/5 bg-ink/95"
            aria-label={`${v.title} — open on YouTube`}
          >
            <img
              src={v.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            {/* hover overlay: title + view count */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="line-clamp-2 text-[10px] font-medium leading-tight text-paper">
                {v.title}
              </div>
              {v.views > 0 && (
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/75">
                  <span className="inline-flex items-center gap-0.5">
                    <Eye className="h-2.5 w-2.5" /> {compact(v.views)}
                  </span>
                  {v.starRating && (
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-paper" /> {v.starRating.average.toFixed(1)}
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* play icon on hover (top-right) */}
            <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 opacity-0 transition-opacity group-hover:opacity-100">
              <PlayCircle className="h-3.5 w-3.5 text-ink" strokeWidth={1.5} />
            </div>
            {/* always-visible date pill (bottom-left) */}
            {v.publishedAt && (
              <div className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-paper backdrop-blur-sm">
                {shortDate(v.publishedAt)}
              </div>
            )}
            {v.isShort && (
              <div className="absolute right-1.5 top-1.5 rounded bg-paper/90 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-ink">
                Short
              </div>
            )}
          </a>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        <span>@wavelinkd</span>
        <a
          href={CHANNEL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/40 transition-colors hover:text-[color:var(--accent-teal)]"
        >
          Subscribe →
        </a>
      </div>
    </>
  );
}
