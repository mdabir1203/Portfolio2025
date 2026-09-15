// Shared content taxonomy for the Medium + YouTube rails.
//
// Both feeds get auto-categorized into one of these keys based on a
// lightweight fuzzy match against the title, snippet, and the original
// RSS <category> tags. The same vocabulary is used for color-coding
// and for the clickable filter chips at the top of each rail.
//
// Add a new category here if a new topic shows up repeatedly — the
// rails pick it up automatically (chips + color stripe).

export const CATEGORIES = {
  'ai-edge': {
    label: 'AI Edge Economics',
    short: 'AI Edge',
    color: '#d8b46a', // amber
    icon: 'sparkle',
    description: 'LLM economics, on-device AI, GPU margins, agent workflows',
  },
  'edge-arch': {
    label: 'Edge Architecture',
    short: 'Edge Arch',
    color: '#0f7569', // teal (matches site accent)
    icon: 'globe',
    description: 'Cloudflare Workers, distributed data, OLTP vs OLAP',
  },
  'mobile': {
    label: 'Mobile / OS',
    short: 'Mobile',
    color: '#6366f1', // indigo
    description: 'HarmonyOS, React Native, mobile platforms',
  },
  'uae-life': {
    label: 'UAE Life',
    short: 'UAE',
    color: '#e76f51', // coral
    description: 'Dubai, KSA, GCC career logistics',
  },
  'security': {
    label: 'Cybersecurity',
    short: 'Security',
    color: '#dc2626', // red
    description: 'AppSec, network, credentials',
  },
  'engineering': {
    label: 'Engineering Practice',
    short: 'Engineering',
    color: '#0ea5e9', // sky
    description: 'Craft, process, spam filters, build systems',
  },
  'iot': {
    label: 'Distributed / IoT',
    short: 'IoT',
    color: '#8b5cf6', // violet
    description: 'EV networks, reliability, infrastructure',
  },
  'general': {
    label: 'General',
    short: 'Other',
    color: '#6b7280', // gray
    icon: 'tag',
    description: 'Anything that does not yet have a strong category',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

const MATCH_RULES: Record<CategoryKey, RegExp> = {
  'ai-edge':
    /\b(ai|gpt|llm|langchain|autogpt|rag|agent|redagpt|napi|npu|on[- ]device|gpu|margin)/i,
  'edge-arch':
    /\b(cloudflare|worker|edge|oltp|olap|distributed[- ]data|atomic[- ]scale)/i,
  'mobile':
    /\b(harmonyos|arkui|react[- ]?native|mobile|ios|android|huawei|app[- ]galary|appgallery)/i,
  'uae-life':
    /\b(dubai|uae|gcc|mena|saudi|riyadh|neom|visa|dataflow|vfs|quadrabay|expat|emirates)/i,
  'security':
    /\b(security|cyber|credential|exploit|attack|vulnerab|hollow|spoofer|reverse[- ]engineer)/i,
  'engineering':
    /\b(spam[- ]filter|product[- ]sense|engineering[- ]practice|software[- ]craft|how[- ]does|build[- ]system)/i,
  'iot':
    /\b(iot|ev|electric[- ]vehicle|charging|reliab|reliable[- ]internet|smart[- ]meter)/i,
  'general': /.*/,
};

/** Pick the best category for a given post/video. Order matters: first match wins. */
export function categorize(title: string, snippet: string, originalTags: string[] = []): CategoryKey {
  const haystack = `${title} ${snippet} ${originalTags.join(' ')}`;
  for (const [key, re] of Object.entries(MATCH_RULES)) {
    if (key === 'general') continue;
    if (re.test(haystack)) return key as CategoryKey;
  }
  return 'general';
}

/** Used by the filter chips. Order = display order in the rail. */
export const CATEGORY_ORDER: CategoryKey[] = [
  'ai-edge',
  'edge-arch',
  'mobile',
  'uae-life',
  'security',
  'engineering',
  'iot',
  'general',
];

/** Human-friendly relative time (e.g. "2h ago", "3d ago", "Aug 31"). */
export function relativeTime(iso: string, now: Date = new Date()): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = now.getTime() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  // Older than a week → fall back to short date.
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** True if `iso` is within the last 7 days — used to flag a "new" badge. */
export function isFresh(iso: string, now: Date = new Date()): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
}

/**
 * Estimate reading time in minutes from a plain-text snippet. Snippet is
 * typically ~180 chars, so we extrapolate: assume a full article is 15x
 * the snippet length and divide by 200 wpm.
 */
export function readingTimeFromSnippet(snippet: string): number {
  if (!snippet) return 4;
  const words = snippet.split(/\s+/).length;
  // Full article is roughly 15× the snippet word count (Medium essays
  // are 1,000–3,000 words).
  const est = words * 15;
  return Math.max(2, Math.round(est / 200));
}
