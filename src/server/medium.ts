import { createServerFn } from "@tanstack/react-start";
import { parseItems } from "./medium.helpers";

export type MediumPost = {
  title: string;
  link: string;
  pubDate: string;
};

export const fetchMediumPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ posts: MediumPost[] }> => {
    try {
      const res = await fetch("https://medium.com/feed/@md.abir1203", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
      });
      if (!res.ok) return { posts: [] };
      const xml = await res.text();
      return { posts: parseItems(xml) };
    } catch {
      return { posts: [] };
    }
  },
);
