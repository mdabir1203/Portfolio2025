import { describe, it, expect } from "vitest";
import {
  extractRssUrl,
  extractChannelIdFromHtml,
  parseVideoIdsFromRss,
  parseVideoEntries,
  parseChannelMeta,
} from "./youtube.helpers";

describe("extractRssUrl", () => {
  it("extracts RSS href from alternate link tag", () => {
    const html = `<link rel="alternate" type="application/rss+xml" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123">`;
    expect(extractRssUrl(html)).toBe(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCabc123",
    );
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
    const html = `feeds/videos.xml?channel_id=UCabcdefghijklmnopqrstuv`;
    expect(extractChannelIdFromHtml(html)).toBe("UCabcdefghijklmnopqrstuv");
  });

  it("returns null when absent", () => {
    expect(extractChannelIdFromHtml("<html></html>")).toBeNull();
  });
});

describe("parseVideoIdsFromRss (back-compat shim)", () => {
  it("returns up to limit IDs", () => {
    const xml = `
      <yt:videoId>abc1234567a</yt:videoId>
      <yt:videoId>def1234567b</yt:videoId>
      <yt:videoId>ghi1234567c</yt:videoId>
    `;
    expect(parseVideoIdsFromRss(xml, 3)).toEqual(["abc1234567a", "def1234567b", "ghi1234567c"]);
  });
});

const REAL_SAMPLE = `
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <yt:channelId>UCPM3MAgkXUOFSfysJuAvthQ</yt:channelId>
 <title>Mohammad Abir Abbas</title>
 <author><name>Mohammad Abir Abbas</name></author>
 <link rel="alternate" href="https://www.youtube.com/channel/UCPM3MAgkXUOFSfysJuAvthQ"/>
 <entry>
  <yt:videoId>vz-rcpGh7gE</yt:videoId>
  <title>July - August Reflections #wavelink #coding</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/vz-rcpGh7gE"/>
  <published>2026-08-31T11:42:59+00:00</published>
  <media:group>
   <media:thumbnail url="https://i3.ytimg.com/vi/vz-rcpGh7gE/hqdefault.jpg" width="480" height="360"/>
   <media:description>Life went well with a bit of hardship in between.</media:description>
   <media:community>
    <media:starRating count="0" average="0.00" min="1" max="5"/>
    <media:statistics views="59"/>
   </media:community>
  </media:group>
 </entry>
 <entry>
  <yt:videoId>ElGTY0besjc</yt:videoId>
  <title>Inside Dubai Founders HQ: Building Phygital Trust Infrastructure</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=ElGTY0besjc"/>
  <published>2026-08-06T09:27:04+00:00</published>
  <media:group>
   <media:thumbnail url="https://i2.ytimg.com/vi/ElGTY0besjc/hqdefault.jpg" width="480" height="360"/>
   <media:description>Tour the DFHQ campus and explore Wavelink's phygital infrastructure.</media:description>
   <media:community>
    <media:starRating count="2" average="5.00" min="1" max="5"/>
    <media:statistics views="58"/>
   </media:community>
  </media:group>
 </entry>
`;

describe("parseVideoEntries", () => {
  it("parses full metadata per entry", () => {
    const videos = parseVideoEntries(REAL_SAMPLE, 10);
    expect(videos).toHaveLength(2);

    const [first, second] = videos;
    expect(first.id).toBe("vz-rcpGh7gE");
    expect(first.title).toBe("July - August Reflections #wavelink #coding");
    expect(first.link).toBe("https://www.youtube.com/shorts/vz-rcpGh7gE");
    expect(first.publishedAt).toBe("2026-08-31T11:42:59+00:00");
    expect(first.thumbnail).toContain("i3.ytimg.com/vi/vz-rcpGh7gE");
    expect(first.description).toBe("Life went well with a bit of hardship in between.");
    expect(first.views).toBe(59);
    expect(first.starRating).toBeNull(); // count=0 → null
    expect(first.isShort).toBe(true);

    expect(second.isShort).toBe(false);
    expect(second.starRating).toEqual({ count: 2, average: 5.0 });
    expect(second.views).toBe(58);
  });

  it("respects the limit", () => {
    expect(parseVideoEntries(REAL_SAMPLE, 1)).toHaveLength(1);
  });

  it("falls back to a synthetic thumbnail when media:thumbnail is missing", () => {
    const xml = `<entry>
      <yt:videoId>abc1234567a</yt:videoId>
      <title>No thumb</title>
      <link rel="alternate" href="https://www.youtube.com/watch?v=abc1234567a"/>
    </entry>`;
    const [v] = parseVideoEntries(xml, 1);
    expect(v.thumbnail).toBe("https://i.ytimg.com/vi/abc1234567a/hqdefault.jpg");
  });

  it("parses zero views and no star rating without throwing", () => {
    const xml = `<entry>
      <yt:videoId>abc1234567a</yt:videoId>
      <title>x</title>
      <link rel="alternate" href="https://www.youtube.com/watch?v=abc1234567a"/>
    </entry>`;
    const [v] = parseVideoEntries(xml, 1);
    expect(v.views).toBe(0);
    expect(v.starRating).toBeNull();
  });
});

describe("parseChannelMeta", () => {
  it("returns channel-level metadata", () => {
    const meta = parseChannelMeta(REAL_SAMPLE);
    expect(meta).toEqual({
      id: "UCPM3MAgkXUOFSfysJuAvthQ",
      title: "Mohammad Abir Abbas",
      author: "Mohammad Abir Abbas",
      link: "https://www.youtube.com/channel/UCPM3MAgkXUOFSfysJuAvthQ",
    });
  });

  it("returns null when channelId is missing", () => {
    expect(parseChannelMeta("<feed><title>x</title></feed>")).toBeNull();
  });
});
