const puppeteer = require("puppeteer-core");

(async () => {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900 });
  p.on("console", (m) => console.log("PAGE:", m.text()));
  p.on("pageerror", (e) => console.log("PAGEERR:", e.message));
  await p.goto("http://localhost:8080/", {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 6000));

  const data = await p.evaluate(() => {
    const cards = [
      ...document.querySelectorAll(
        '#watch a[href*="youtube.com/watch"], #watch a[href*="youtube.com/shorts/"]',
      ),
    ];
    return cards.slice(0, 25).map((a) => {
      const title = a.querySelector("h3, h4")?.textContent?.trim()?.slice(0, 60);
      const hasStar = a.textContent.toLowerCase().includes("curated");
      const isShort = a.textContent.includes("Short") || a.href.includes("/shorts/");
      return { title, hasStar, isShort, href: a.href.split("?v=")[1] || a.href.split("/shorts/")[1] };
    });
  });
  console.log("YOUTUBE CARDS:");
  console.log(JSON.stringify(data, null, 2));

  const total = await p.evaluate(
    () =>
      document.querySelectorAll(
        '#watch a[href*="youtube.com/watch"], #watch a[href*="youtube.com/shorts/"]',
      ).length,
  );
  console.log("Total video cards:", total);

  // Count how many have the curated star
  const curatedCount = data.filter((d) => d.hasStar).length;
  console.log("Curated cards:", curatedCount);

  // Pull the network request the client made for the videos
  const fetchLog = await p.evaluate(() => {
    return performance
      .getEntriesByType("resource")
      .filter((r) => r.name.includes("serverFn") || r.name.includes("fetchWavelink"))
      .map((r) => ({ name: r.name, dur: Math.round(r.duration) }));
  });
  console.log("Network:", JSON.stringify(fetchLog, null, 2));

  // Now actually call the server function and inspect the data.
  const direct = await p.evaluate(async () => {
    // We can't import the module here. Instead, look at window.__NEXT_DATA__ or
    // any global state. The simplest: re-derive from the page DOM by looking
    // at the "X videos" counter and the rail layout.
    const totalEl = [...document.querySelectorAll("span")].find(
      (s) => /\b\d+\s+videos?\b/i.test(s.textContent ?? ""),
    );
    return {
      counter: totalEl?.textContent?.trim(),
    };
  });
  console.log("Counter:", direct);

  // Try to fetch the server function directly.
  const result = await p.evaluate(async () => {
    try {
      const r = await fetch(
        "/_serverFn/eyJmaWxlIjoiL0BpZC9zcmMvc2VydmVyL3lvdXR1YmUudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0IjoiZmV0Y2hXYXZlbGlua1ZpZGVvc19jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
        { headers: { Accept: "application/json" } },
      );
      const t = await r.text();
      return { status: r.status, length: t.length, body: t.slice(0, 6000) };
    } catch (e) {
      return { error: String(e) };
    }
  });
  console.log("DIRECT FETCH:", JSON.stringify(result, null, 2));

  // Scroll to the watch section and check what's in the rail
  const rail = await p.evaluate(() => {
    const watch = document.getElementById("watch");
    if (!watch) return null;
    const rect = watch.getBoundingClientRect();
    return { y: rect.top + window.scrollY, h: rect.height };
  });
  console.log("Watch section:", rail);

  await b.close();
})();
