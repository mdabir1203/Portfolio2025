import { describe, it, expect, vi, beforeEach } from "vitest";
import { decodeEntities, pick, parseItems } from "./medium.helpers";

// Unit tests for the pure helpers extracted from medium.ts
// The server function itself wraps fetch and is integration-tested separately.

describe("decodeEntities", () => {
  it("decodes all HTML entities", () => {
    expect(decodeEntities("&amp;&lt;&gt;&quot;&#39;&apos;")).toBe(`&<>"''`);
  });

  it("leaves plain text unchanged", () => {
    expect(decodeEntities("Hello World")).toBe("Hello World");
  });
});

describe("pick", () => {
  it("extracts content between tags", () => {
    expect(pick("<title>Hello</title>", "title")).toBe("Hello");
  });

  it("strips CDATA wrappers", () => {
    expect(pick("<title><![CDATA[My Post]]></title>", "title")).toBe("My Post");
  });

  it("returns null when tag is absent", () => {
    expect(pick("<item></item>", "title")).toBeNull();
  });

  it("decodes entities inside matched content", () => {
    expect(pick("<title>A &amp; B</title>", "title")).toBe("A & B");
  });
});

describe("parseItems", () => {
  const xml = `
    <channel>
      <item>
        <title>Post One</title>
        <link>https://medium.com/@md.abir1203/post-one</link>
        <pubDate>Fri, 01 Jan 2026 00:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Post Two</title>
        <link>http://evil.com/steal</link>
        <pubDate>Thu, 01 Dec 2025 00:00:00 GMT</pubDate>
      </item>
    </channel>
  `;

  it("parses titles and dates", () => {
    const posts = parseItems(xml);
    expect(posts[0].title).toBe("Post One");
    expect(posts[0].pubDate).toContain("2026");
  });

  it("keeps https links and rejects non-https links", () => {
    const posts = parseItems(xml);
    expect(posts[0].link).toBe("https://medium.com/@md.abir1203/post-one");
    expect(posts[1].link).toBe("#");
  });

  it("limits to 5 items", () => {
    const manyItems = Array.from({ length: 10 }, (_, i) =>
      `<item><title>P${i}</title><link>https://medium.com/p${i}</link><pubDate>2026</pubDate></item>`
    ).join("");
    const posts = parseItems(`<channel>${manyItems}</channel>`);
    expect(posts.length).toBeLessThanOrEqual(5);
  });
});
