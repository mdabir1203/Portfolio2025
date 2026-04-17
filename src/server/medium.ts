import { createServerFn } from "@tanstack/react-start";

export type MediumPost = {
  title: string;
  link: string;
  pubDate: string;
};

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pick(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return null;
  return decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim());
}

export const fetchMediumPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ posts: MediumPost[] }> => {
    try {
      const res = await fetch("https://medium.com/feed/@md.abir1203", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
      });
      if (!res.ok) return { posts: [] };
      const xml = await res.text();
      const items = xml.split("<item>").slice(1, 6);
      const posts: MediumPost[] = items.map((raw) => ({
        title: pick(raw, "title") ?? "Untitled",
        link: pick(raw, "link") ?? "#",
        pubDate: pick(raw, "pubDate") ?? "",
      }));
      return { posts };
    } catch {
      return { posts: [] };
    }
  },
);
