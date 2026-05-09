import { useEffect, useState } from "react";
import { CirclePlay } from "lucide-react";
import { fetchWavelinkVideos } from "@/server/youtube";

const CHANNEL = "https://www.youtube.com/@wavelinkd";

export default function YoutubeStrip() {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchWavelinkVideos()
      .then((d) => active && setIds(d.ids ?? []))
      .catch(() => active && setIds([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
          // Watch
        </span>
        <a href={CHANNEL} target="_blank" rel="noreferrer" className="text-foreground/40 hover:text-foreground">
          <CirclePlay className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {ids === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded-md border border-white/5 bg-white/5"
            />
          ))}
        {ids !== null &&
          ids.length === 0 && (
            <p className="col-span-3 text-xs text-foreground/50">
              Latest videos will appear here —{" "}
              <a href={CHANNEL} target="_blank" rel="noreferrer" className="text-[color:var(--accent-teal)] underline-offset-2 hover:underline">
                open @wavelinkd
              </a>
              .
            </p>
          )}
        {ids?.map((id) => (
          <a
            key={id}
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noreferrer"
            className="aspect-video overflow-hidden rounded-md border border-white/5 bg-white/[0.02] grayscale transition-all hover:grayscale-0"
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </a>
        ))}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-foreground/40">@wavelinkd</div>
    </>
  );
}
