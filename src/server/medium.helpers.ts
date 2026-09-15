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

export function pickAll(xml: string, tag: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    out.push(decodeEntities(m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim()));
  }
  return out;
}

/**
 * Reduce a Medium `<description>` HTML payload to a clean, single-line
 * preview snippet. We strip the wrapper div, the trailing "Continue reading"
 * anchor, and collapse all whitespace so the output is safe to render as
 * plain text in a card.
 */
export function snippetFromDescription(html: string, maxLen = 180): string {
  if (!html) return "";
  // Drop the "Continue reading …" anchor + everything after it — that's
  // boilerplate, not editorial copy.
  const cutAt = html.search(/Continue reading/i);
  const body = (cutAt > 0 ? html.slice(0, cutAt) : html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (body.length <= maxLen) return body;
  // Word-boundary trim so the snippet never ends mid-word.
  const slice = body.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice) + "…";
}

export function parseItems(xml: string): MediumPost[] {
  const items = xml.split("<item>").slice(1, 6);
  return items.map((raw) => {
    const rawLink = pick(raw, "link") ?? "#";
    let link = "#";
    try {
      const u = new URL(rawLink);
      if (u.protocol === "https:") link = rawLink;
    } catch {
      /* leave as "#" */
    }
    return {
      title: pick(raw, "title") ?? "Untitled",
      link,
      pubDate: pick(raw, "pubDate") ?? "",
      snippet: snippetFromDescription(pick(raw, "description") ?? ""),
      categories: pickAll(raw, "category").slice(0, 3),
    };
  });
}
