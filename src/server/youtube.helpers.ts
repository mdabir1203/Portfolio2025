/**
 * Pure XML helpers for the YouTube channel RSS feed.
 *
 * YouTube's `feeds/videos.xml` gives us a rich set of fields per entry:
 *   - <yt:videoId>            → 11-char id
 *   - <title>                 → video title (with #hashtags from Shorts)
 *   - <link rel="alternate">  → watch URL or shorts URL
 *   - <published>             → ISO 8601 timestamp
 *   - <media:title>           → same as <title>
 *   - <media:thumbnail>       → hqdefault.jpg URL (480x360)
 *   - <media:description>     → plain text, may include "⏱️ Chapters"
 *   - <media:community>       → <media:statistics views="N"> + <media:starRating>
 *
 * Everything below is defensive: if a field is missing, we return safe
 * defaults so the renderer doesn't blow up.
 */

export type YouTubeVideoMeta = {
  id: string;
  title: string;
  link: string;
  publishedAt: string; // ISO 8601, e.g. "2026-08-31T11:42:59+00:00"
  description: string;
  thumbnail: string;
  views: number;
  starRating: { count: number; average: number } | null;
  isShort: boolean;
};

export type YouTubeChannelMeta = {
  id: string;
  title: string;
  author: string;
  link: string;
};

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

/**
 * Split a YouTube RSS feed into one YouTubeVideoMeta per <entry>.
 * Stops at `limit` entries (most-recent first; the feed is already sorted).
 *
 * Falls back to a flat `<yt:videoId>` scan if the feed has no <entry>
 * wrappers — this preserves back-compat with the original helper that
 * was ID-only.
 */
export function parseVideoEntries(xml: string, limit: number): YouTubeVideoMeta[] {
  if (xml.includes("<entry>")) {
    const entries = xml.split("<entry>").slice(1);
    const out: YouTubeVideoMeta[] = [];
    for (const raw of entries) {
      if (out.length >= limit) break;
      const v = parseOneEntry(raw);
      if (v && !out.some((o) => o.id === v.id)) out.push(v);
    }
    return out;
  }
  // Flat fallback: no <entry> wrappers (the old test fixture shape).
  // Use a global regex to walk every <yt:videoId> in document order.
  const out: YouTubeVideoMeta[] = [];
  const re = /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (out.length >= limit) break;
    const id = m[1];
    if (out.some((v) => v.id === id)) continue;
    // We don't have the title/desc for a flat-feed ID — synthesize a
    // minimal record so callers can still render a thumbnail link.
    out.push({
      id,
      title: id,
      link: `https://www.youtube.com/watch?v=${id}`,
      publishedAt: "",
      description: "",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      views: 0,
      starRating: null,
      isShort: false,
    });
  }
  return out;
}

function parseOneEntry(raw: string): YouTubeVideoMeta | null {
  const id = matchFirst(raw, /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/);
  if (!id) return null;
  const title = decodeEntities(stripCdata(matchFirst(raw, /<title>([\s\S]*?)<\/title>/) ?? id));
  const link =
    matchFirst(raw, /<link rel="alternate" href="([^"]+)"/) ??
    `https://www.youtube.com/watch?v=${id}`;
  const publishedAt = matchFirst(raw, /<published>([^<]+)<\/published>/) ?? "";
  const description = decodeEntities(
    stripCdata(matchFirst(raw, /<media:description>([\s\S]*?)<\/media:description>/) ?? ""),
  );
  const thumbnail =
    matchFirst(raw, /<media:thumbnail url="([^"]+)"/) ??
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const views = parseInt(matchFirst(raw, /<media:statistics views="(\d+)"/) ?? "0", 10) || 0;
  const starCount = parseInt(matchFirst(raw, /<media:starRating count="(\d+)"/) ?? "0", 10) || 0;
  const starAverage =
    parseFloat(matchFirst(raw, /<media:starRating[^>]+average="([\d.]+)"/) ?? "0") || 0;
  const starRating = starCount > 0 ? { count: starCount, average: starAverage } : null;
  const isShort = /\/shorts\//.test(link);
  return { id, title, link, publishedAt, description, thumbnail, views, starRating, isShort };
}

/** Backward-compat shim — old code used this for ID-only consumers. */
export function parseVideoIdsFromRss(xml: string, limit: number): string[] {
  return parseVideoEntries(xml, limit).map((v) => v.id);
}

/** Channel-level metadata from the feed root (single occurrence, not per-entry). */
export function parseChannelMeta(xml: string): YouTubeChannelMeta | null {
  // The feed has many sibling tags between <feed> and <title> (id, link,
  // channelId, …), so we don't anchor the title to <feed>. Look for
  // <yt:channelId> + the first <title> anywhere in the feed root.
  const id = matchFirst(xml, /<yt:channelId>([^<]+)<\/yt:channelId>/);
  if (!id) return null;
  // Strip the <feed> root and find the first <title> in the remainder.
  const feedBody = xml.replace(/^[\s\S]*?<feed[^>]*>/, "");
  const title = matchFirst(feedBody, /<title>([\s\S]*?)<\/title>/);
  const author = matchFirst(xml, /<author>\s*<name>([\s\S]*?)<\/name>/);
  const link = matchFirst(xml, /<link rel="alternate" href="([^"]+)"/);
  if (!title) return null;
  return {
    id,
    title: decodeEntities(stripCdata(title)),
    author: decodeEntities(stripCdata(author ?? "")),
    link: link ?? "",
  };
}

/* -------- internals -------- */

function matchFirst(s: string, re: RegExp): string | null {
  const m = re.exec(s);
  return m?.[1] ?? null;
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
