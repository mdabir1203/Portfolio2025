import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  decodeEntities,
  pick,
  pickAll,
  parseItems,
  snippetFromDescription,
} from "./medium.helpers";

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

describe("pickAll", () => {
  it("returns all matches in document order", () => {
    const xml = `<a>1</a><b>x</b><a>2</a><a>3</a>`;
    expect(pickAll(xml, "a")).toEqual(["1", "2", "3"]);
  });

  it("returns an empty array when the tag is absent", () => {
    expect(pickAll("<x>1</x>", "a")).toEqual([]);
  });
});

describe("snippetFromDescription", () => {
  it("strips HTML tags", () => {
    const html = "<p>Hello <em>world</em></p>";
    expect(snippetFromDescription(html)).toBe("Hello world");
  });

  it("trims at the 'Continue reading' anchor", () => {
    const html = "<p>Real editorial text here.</p><p>Continue reading on Medium »</p>";
    expect(snippetFromDescription(html)).toBe("Real editorial text here.");
  });

  it("respects the maxLen and ends on a word boundary", () => {
    const long = "word ".repeat(80);
    const out = snippetFromDescription(long, 60);
    expect(out.length).toBeLessThanOrEqual(61);
    expect(out.endsWith("…")).toBe(true);
    // The slice we kept should not end mid-word
    expect(out.replace(/…$/, "").endsWith("word")).toBe(true);
  });

  it("collapses whitespace", () => {
    expect(snippetFromDescription("<p>a\n\n   b\t\t c</p>")).toBe("a b c");
  });

  it("returns an empty string for empty input", () => {
    expect(snippetFromDescription("")).toBe("");
  });
});

describe("parseItems", () => {
  const xml = `
    <channel>
      <item>
        <title>Post One</title>
        <link>https://medium.com/@md.abir1203/post-one</link>
        <pubDate>Fri, 01 Jan 2026 00:00:00 GMT</pubDate>
        <description><![CDATA[<div><p>Hello there reader.</p><p>Continue reading on Medium »</p></div>]]></description>
        <category><![CDATA[software-engineering]]></category>
        <category><![CDATA[ai]]></category>
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
    const manyItems = Array.from(
      { length: 10 },
      (_, i) =>
        `<item><title>P${i}</title><link>https://medium.com/p${i}</link><pubDate>2026</pubDate></item>`,
    ).join("");
    const posts = parseItems(`<channel>${manyItems}</channel>`);
    expect(posts.length).toBeLessThanOrEqual(5);
  });

  it("extracts a plain-text snippet and drops the 'Continue reading' boilerplate", () => {
    const posts = parseItems(xml);
    expect(posts[0].snippet).toBe("Hello there reader.");
    expect(posts[0].snippet).not.toMatch(/Continue reading/);
  });

  it("captures up to 3 categories per post", () => {
    const posts = parseItems(xml);
    expect(posts[0].categories).toEqual(["software-engineering", "ai"]);
  });

  it("falls back to empty snippet + categories when fields are missing", () => {
    const posts = parseItems(xml);
    expect(posts[1].snippet).toBe("");
    expect(posts[1].categories).toEqual([]);
  });
});
