import type { MediumPost } from "./medium";

export function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export function pick(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!m) return null;
  return decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim());
}

export function parseItems(xml: string): MediumPost[] {
  const items = xml.split("<item>").slice(1, 6);
  return items.map((raw) => {
    const rawLink = pick(raw, "link") ?? "#";
    let link = "#";
    try {
      const u = new URL(rawLink);
      if (u.protocol === "https:") link = rawLink;
    } catch { /* leave as "#" */ }
    return {
      title: pick(raw, "title") ?? "Untitled",
      link,
      pubDate: pick(raw, "pubDate") ?? "",
    };
  });
}
