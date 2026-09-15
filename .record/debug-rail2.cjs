const puppeteer = require("puppeteer-core");

(async () => {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900 });

  // Intercept the serverFn call and dump the JSON body.
  await p.setRequestInterception(true);
  p.on("request", (req) => {
    if (req.url().includes("_serverFn")) {
      console.log("INTERCEPTED:", req.method(), req.url().slice(0, 140));
    }
    req.continue();
  });
  p.on("response", async (res) => {
    if (res.url().includes("_serverFn")) {
      try {
        const t = await res.text();
        console.log("RESPONSE:", res.url().slice(-40), "status:", res.status(), "len:", t.length);
        if (t.length < 60000) console.log("BODY:", t.slice(0, 4000));
      } catch (e) {
        console.log("RESPONSE ERR:", e.message);
      }
    }
  });

  await p.goto("http://localhost:8080/", {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 6000));

  await b.close();
})();
