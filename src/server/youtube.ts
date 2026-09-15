import { createServerFn } from "@tanstack/react-start";
import {
  extractRssUrl,
  extractChannelIdFromHtml,
  parseVideoEntries,
  parseChannelMeta,
  type YouTubeVideoMeta,
  type YouTubeChannelMeta,
} from "./youtube.helpers";
import { categorize, type CategoryKey } from "@/components/cinematic/categories";
import {
  RAIL_PLAYLISTS,
  PLAYLIST_RAIL_LIMIT,
  playlistEntryToMeta,
} from "@/data/curatedVideos";

const HANDLE = "wavelinkd";
const UA = "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://www.youtube.com/@wavelinkd)";
/** Channel ID cached from the first successful page fetch — avoids a full HTML parse on every request. */
const KNOWN_CHANNEL_ID = "UCPM3MAgkXUOFSfysJuAvthQ";

export type YouTubeVideoWithMeta = YouTubeVideoMeta & {
  source: "channel" | "curated";
  category: CategoryKey;
  /** First-person "why this is here" line — surfaced for both playlist
   *  videos and any hand-picked entries. */
  reason?: string;
  /** Playlist id, only set for curated entries. */
  playlistId?: string;
  /** Original channel name — populated for curated entries. */
  channel?: string;
};

export type FetchWavelinkVideosResult = {
  videos: YouTubeVideoWithMeta[];
  channel: YouTubeChannelMeta;
  /** ISO timestamp of the fetch. */
  fetchedAt: string;
  /** Number of playlist entries merged in. */
  playlistCount: number;
  /** Titles of the playlists, in display order. */
  playlistTitles: string[];
};

export const fetchWavelinkVideos = createServerFn({ method: "GET" }).handler(
  async (): Promise<FetchWavelinkVideosResult> => {
    const fetchedAt = new Date().toISOString();
    const channelUploads = await fetchChannelUploads();
    const playlistVideos = await fetchPlaylistVideos();
    const merged = dedupeById([...playlistVideos, ...channelUploads]);
    const channelMeta = (await fetchChannelMeta()) ?? fallbackChannelMeta();
    return {
      videos: merged,
      channel: channelMeta,
      fetchedAt,
      playlistCount: playlistVideos.length,
      playlistTitles: RAIL_PLAYLISTS.map((p) => p.title),
    };
  },
);

/* -------- channel RSS -------- */

async function fetchChannelUploads(): Promise<YouTubeVideoWithMeta[]> {
  try {
    const xml = await fetchRssXml(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${KNOWN_CHANNEL_ID}`,
    );
    if (!xml) return [];
    const entries = parseVideoEntries(xml, 12);
    return entries.map((v) => ({
      ...v,
      source: "channel" as const,
      category: categorize(v.title, v.description ?? "", []),
      channel: HANDLE,
    }));
  } catch {
    return [];
  }
}

async function fetchChannelMeta(): Promise<YouTubeChannelMeta | null> {
  try {
    const xml = await fetchRssXml(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${KNOWN_CHANNEL_ID}`,
    );
    if (!xml) return null;
    return parseChannelMeta(xml);
  } catch {
    return null;
  }
}

/* -------- playlist RSS -------- */

async function fetchPlaylistVideos(): Promise<YouTubeVideoWithMeta[]> {
  const out: YouTubeVideoWithMeta[] = [];
  for (const playlist of RAIL_PLAYLISTS) {
    try {
      const xml = await fetchRssXml(
        `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlist.id}`,
      );
      if (!xml) continue;
      // Take long-form first, then fill remaining with Shorts. Stays
      // inside PLAYLIST_RAIL_LIMIT for the whole playlist.
      const all = parseVideoEntries(xml, 30);
      const longForm = all.filter((v) => !v.isShort);
      const shorts = all.filter((v) => v.isShort);
      const ordered = [...longForm, ...shorts].slice(0, PLAYLIST_RAIL_LIMIT);
      for (const v of ordered) {
        out.push({
          ...playlistEntryToMeta(v, playlist.id, playlist.defaultCategory),
          // Override with a tighter category match per video if categorize() finds one.
          category: categorize(v.title, v.description ?? "", []) || playlist.defaultCategory,
          playlistId: playlist.id,
        });
      }
    } catch {
      /* swallow — keep going with the next playlist */
    }
  }
  return out;
}

/* -------- shared fetch helper -------- */

async function fetchRssXml(knownUrl: string): Promise<string | null> {
  // 1. Try the URL we already know — cheapest, never blocked.
  try {
    const rss = await fetch(knownUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/atom+xml,application/xml,text/xml,*/*",
      },
    });
    if (rss.ok) return await rss.text();
    // eslint-disable-next-line no-console
    console.warn(
      `[fetchRssXml] ${knownUrl} → HTTP ${rss.status}; trying fallback`,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[fetchRssXml] ${knownUrl} → fetch threw`, err);
  }
  // 2. Fallback: scrape the channel page for an RSS link or channel id.
  try {
    const page = await fetch(`https://www.youtube.com/@${HANDLE}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!page.ok) return null;
    const html = await page.text();
    let rssUrl = extractRssUrl(html);
    if (!rssUrl) {
      const cid = extractChannelIdFromHtml(html) ?? KNOWN_CHANNEL_ID;
      rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`;
    }
    // Guard against SSRF: only fetch youtube.com RSS URLs.
    try {
      const parsed = new URL(rssUrl);
      if (parsed.hostname !== "www.youtube.com") return null;
    } catch {
      return null;
    }
    const rss = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!rss.ok) return null;
    return await rss.text();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[fetchRssXml] fallback for ${knownUrl} →`, err);
    return null;
  }
}

function dedupeById(list: YouTubeVideoWithMeta[]): YouTubeVideoWithMeta[] {
  const seen = new Set<string>();
  const out: YouTubeVideoWithMeta[] = [];
  for (const v of list) {
    if (seen.has(v.id)) continue;
    seen.add(v.id);
    out.push(v);
  }
  return out;
}

function fallbackChannelMeta(): YouTubeChannelMeta {
  return {
    id: KNOWN_CHANNEL_ID,
    title: "Mohammad Abir Abbas",
    author: "Mohammad Abir Abbas",
    link: `https://www.youtube.com/channel/${KNOWN_CHANNEL_ID}`,
  };
}
