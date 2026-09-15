import { createServerFn } from "@tanstack/react-start";
import { parseItems } from "./medium.helpers";
import { categorize, type CategoryKey } from "@/components/cinematic/categories";

export type MediumPost = {
  title: string;
  link: string;
  pubDate: string;
  /** Short, plain-text preview, max ~180 chars. */
  snippet: string;
  /** Up to 3 tags / categories from the feed (lowercased by Medium). */
  categories: string[];
  /** Auto-categorized against the shared portfolio taxonomy (8 keys). */
  category: CategoryKey;
  /** Estimated reading time in minutes (from snippet word count). */
  readingTime: number;
};

export const fetchMediumPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ posts: MediumPost[] }> => {
    try {
      const res = await fetch("https://medium.com/feed/@md.abir1203", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
      });
      if (!res.ok) return { posts: [] };
      const xml = await res.text();
      const raw = parseItems(xml);
      const posts: MediumPost[] = raw.map((p) => {
        const category = categorize(p.title, p.snippet, p.categories);
        const readingTime = estimateReadingTime(p.snippet, p.title);
        return { ...p, category, readingTime };
      });
      return { posts };
    } catch {
      return { posts: [] };
    }
  },
);

/** Estimate reading time from the snippet — Medium essays are 1k–3k words,
 *  so we extrapolate from the ~180-char snippet. */
function estimateReadingTime(snippet: string, title: string): number {
  if (!snippet) return 4;
  const words = `${title} ${snippet}`.split(/\s+/).length;
  // Full essay is roughly 18x the snippet word count.
  const est = words * 18;
  return Math.max(2, Math.round(est / 200));
}
