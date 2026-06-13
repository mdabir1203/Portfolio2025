import { describe, it, expect } from "vitest";
import { extractRssUrl, extractChannelIdFromHtml, parseVideoIdsFromRss } from "./youtube.helpers";

describe("extractRssUrl", () => {
  it("extracts RSS href from alternate link tag", () => {
    const html = `<link rel="alternate" type="application/rss+xml" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123">`;
    expect(extractRssUrl(html)).toBe("https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123");
  });

  it("decodes &amp; in href", () => {
    const html = `<link type="application/rss+xml" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCabc&amp;foo=bar">`;
    expect(extractRssUrl(html)).toContain("channel_id=UCabc&foo=bar");
  });

  it("returns null when no RSS link present", () => {
    expect(extractRssUrl("<html><head></head></html>")).toBeNull();
  });
});

describe("extractChannelIdFromHtml", () => {
  it("extracts a valid UC channel ID", () => {
    // UC + exactly 22 chars = 24-char channel ID (YouTube format)
    const html = `feeds/videos.xml?channel_id=UCabcdefghijklmnopqrstuv`;
    expect(extractChannelIdFromHtml(html)).toBe("UCabcdefghijklmnopqrstuv");
  });

  it("returns null when absent", () => {
    expect(extractChannelIdFromHtml("<html></html>")).toBeNull();
  });
});

describe("parseVideoIdsFromRss", () => {
  const xml = `
    <yt:videoId>abc1234567a</yt:videoId>
    <yt:videoId>def1234567b</yt:videoId>
    <yt:videoId>ghi1234567c</yt:videoId>
    <yt:videoId>jkl1234567d</yt:videoId>
  `;

  it("returns up to limit IDs", () => {
    expect(parseVideoIdsFromRss(xml, 3)).toHaveLength(3);
  });

  it("deduplicates repeated IDs", () => {
    const repeated = `<yt:videoId>abc1234567a</yt:videoId><yt:videoId>abc1234567a</yt:videoId>`;
    expect(parseVideoIdsFromRss(repeated, 5)).toHaveLength(1);
  });

  it("returns empty array for no matches", () => {
    expect(parseVideoIdsFromRss("<rss></rss>", 3)).toEqual([]);
  });

  it("rejects IDs that are not exactly 11 chars (malformed XML safety)", () => {
    const malformed = `<yt:videoId>toolongid12345</yt:videoId>`;
    expect(parseVideoIdsFromRss(malformed, 5)).toHaveLength(0);
  });
});
