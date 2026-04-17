import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { fetchMediumPosts, type MediumPost } from "@/server/medium";

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
          // Reading My Mind
        </span>
        <BookOpen className="h-4 w-4 text-[color:var(--accent-teal)]" />
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight">
        Latest from <em className="text-[color:var(--accent-teal)]">Medium</em>
      </h3>
      <ul className="mt-4 flex-1 space-y-2.5">
        {posts === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-4 animate-pulse rounded bg-white/5" />
          ))}
        {posts && posts.length === 0 && (
          <li className="text-xs text-foreground/50">
            Couldn't load articles right now — check back later.
          </li>
        )}
        {posts?.slice(0, 4).map((p) => (
          <li key={p.link}>
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-3 border-b border-white/5 pb-2 text-sm text-foreground/80 hover:text-foreground"
            >
              <span className="line-clamp-2">{p.title}</span>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50 transition group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
      <a
        href="https://medium.com/@md.abir1203"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-teal)] hover:gap-2 transition-all"
      >
        All posts <ArrowUpRight className="h-3 w-3" />
      </a>
    </div>
  );
}
