// Real channel playlists used in the YouTube rail.
//
// Two playlists on @wavelinkd — the channel's full build log in public:
//
//  1. AbayaTrack — "Edge-Native Telemetry & Workflow Analytics"
//     The on-site deployment story at Famous Abaya. One tap, every station.
//  2. Wavelink   — "AI Agent Workflows & LLM Automation"
//     The systems-architecture side: AI agents, the trust graph, the
//     automation loops that wrap a real product in production.
//
// The YouTube RSS feed at
// `https://www.youtube.com/feeds/videos.xml?playlist_id=...` is the
// single source of truth — no API key, no scraping, no rate limits.

import type { CategoryKey } from '@/components/cinematic/categories';

/** Channel playlists used in the YouTube rail. Add more here as Abir
 *  creates them; the rail will dedupe by video id. */
export const RAIL_PLAYLISTS: Array<{
  id: string;
  title: string;
  /** Short label shown in the rail footer. */
  shortLabel: string;
  /** The category that the playlist is "about" — used as the default
   *  for videos that don't match any of the regex rules in `categorize()`. */
  defaultCategory: CategoryKey;
}> = [
  {
    id: 'PLiMUBe7mFRXfsQdNPqhrJDDv3M53nbedR',
    title: 'AbayaTrack: Edge-Native Telemetry & Workflow Analytics',
    shortLabel: 'AbayaTrack',
    defaultCategory: 'iot',
  },
  {
    id: 'PLiMUBe7mFRXeEzfr9moUKPx-jRrThCsR1',
    title: 'AI Agent Workflows & LLM Automation',
    shortLabel: 'Wavelink',
    defaultCategory: 'ai',
  },
];

/** A short, first-person "why this is here" line per playlist. Surfaces
 *  on the rail footer so a recruiter can see the editorial intent. */
export const PLAYLIST_BLURB: Record<string, string> = {
  'PLiMUBe7mFRXfsQdNPqhrJDDv3M53nbedR':
    'The real AbayaTrack build log — from the first on-site deployment to the 38% output lift. One tap, every station, in production.',
  'PLiMUBe7mFRXeEzfr9moUKPx-jRrThCsR1':
    'The systems-architecture side: AI agents, the trust graph, the automation loops that wrap a real product in production.',
};

/** How many playlist videos to surface in the rail (the featured slot is
 *  always the most recent long-form). Keeps the rail under the chosen
 *  1 + 6 layout regardless of playlist size. */
export const PLAYLIST_RAIL_LIMIT = 6;

/** Convert a playlist RSS entry into the YouTubeVideoMeta shape the rail
 *  expects. Mirrors `parseVideoEntries` output but stamps the source
 *  and category up front. */
export function playlistEntryToMeta(
  v: {
    id: string;
    title: string;
    link: string;
    publishedAt: string;
    description: string;
    thumbnail: string;
    views: number;
    starRating: { count: number; average: number } | null;
    isShort: boolean;
  },
  playlistId: string,
  defaultCategory: CategoryKey,
) {
  return {
    ...v,
    source: 'curated' as const,
    category: defaultCategory,
    reason: PLAYLIST_BLURB[playlistId] ?? 'From the channel playlist.',
    channel: 'Mohammad Abir Abbas',
  };
}
