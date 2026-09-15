// Quick debug: call the YouTube RSS feeds the same way the server function
// does, and print what we get for both playlists. Helps diagnose why the
// rail isn't surfacing curated entries.
const rss = [
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCPM3MAgkXUOFSfysJuAvthQ",
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLiMUBe7mFRXfsQdNPqhrJDDv3M53nbedR",
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLiMUBe7mFRXeEzfr9moUKPx-jRrThCsR1",
];

const UA =
  "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://www.youtube.com/@wavelinkd)";

for (const url of rss) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    const xml = await r.text();
    const ids = [...xml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g)].map(
      (m) => m[1],
    );
    const titles = [...xml.matchAll(/<media:title>([^<]+)<\/media:title>/g)].map(
      (m) => m[1].replace(/&amp;/g, "&"),
    );
    const shortCount = [...xml.matchAll(/<link rel="alternate" href="https:\/\/www\.youtube\.com\/shorts\//g)].length;
    console.log(`\n${url.split("?")[1]}`);
    console.log(`  Status: ${r.status}, total: ${ids.length}, shorts: ${shortCount}`);
    titles.slice(0, 5).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  } catch (e) {
    console.log(`\n${url}`);
    console.log(`  ERROR: ${e.message}`);
  }
}
