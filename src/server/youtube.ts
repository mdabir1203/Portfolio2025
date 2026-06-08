import { createServerFn } from "@tanstack/react-start";

const HANDLE = "wavelinkd";
const UA =
  "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://www.youtube.com/@wavelinkd)";

function extractRssUrl(html: string): string | null {
  const linkRss =
    html.match(
      /<link[^>]+rel=["']alternate["'][^>]+type=["']application\/rss\+xml["'][^>]+href=["']([^"']+)["']/i,
    ) ?? html.match(/<link[^>]+type=["']application\/rss\+xml["'][^>]+href=["']([^"']+)["']/i);
  if (!linkRss?.[1]) return null;
  return linkRss[1].replace(/&amp;/g, "&");
}

function extractChannelIdFromHtml(html: string): string | null {
  const m = html.match(/feeds\/videos\.xml\?channel_id=(UC[a-zA-Z0-9_-]{22})/);
  return m?.[1] ?? null;
}

function parseVideoIdsFromRss(xml: string, limit: number): string[] {
  const out: string[] = [];
  const re = /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (!out.includes(m[1])) out.push(m[1]);
    if (out.length >= limit) break;
  }
  return out;
}

export const fetchWavelinkVideos = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ ids: string[] }> => {
    try {
      const page = await fetch(`https://www.youtube.com/@${HANDLE}`, {
        headers: { "User-Agent": UA },
      });
      if (!page.ok) return { ids: [] };
      const html = await page.text();
      let rssUrl = extractRssUrl(html);
      if (!rssUrl) {
        const cid = extractChannelIdFromHtml(html);
        if (!cid) return { ids: [] };
        rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`;
      }
      // Guard against SSRF: only fetch youtube.com RSS URLs
      try {
        const parsed = new URL(rssUrl);
        if (parsed.hostname !== "www.youtube.com") return { ids: [] };
      } catch { return { ids: [] }; }
      const rss = await fetch(rssUrl, { headers: { "User-Agent": UA } });
      if (!rss.ok) return { ids: [] };
      const xml = await rss.text();
      return { ids: parseVideoIdsFromRss(xml, 3) };
    } catch {
      return { ids: [] };
    }
  },
);
