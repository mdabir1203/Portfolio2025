export function extractRssUrl(html: string): string | null {
  const linkRss =
    html.match(
      /<link[^>]+rel=["']alternate["'][^>]+type=["']application\/rss\+xml["'][^>]+href=["']([^"']+)["']/i,
    ) ?? html.match(/<link[^>]+type=["']application\/rss\+xml["'][^>]+href=["']([^"']+)["']/i);
  if (!linkRss?.[1]) return null;
  return linkRss[1].replace(/&amp;/g, "&");
}

export function extractChannelIdFromHtml(html: string): string | null {
  const m = html.match(/feeds\/videos\.xml\?channel_id=(UC[a-zA-Z0-9_-]{22})/);
  return m?.[1] ?? null;
}

export function parseVideoIdsFromRss(xml: string, limit: number): string[] {
  const out: string[] = [];
  const re = /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (!out.includes(m[1])) out.push(m[1]);
    if (out.length >= limit) break;
  }
  return out;
}
