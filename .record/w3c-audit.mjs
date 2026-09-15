// W3C HTML validator client + local WHATWG checks
// Run: node .record/w3c-audit.mjs

const BASE = 'http://localhost:8081';
const ROUTES = ['/', '/work', '/connect', '/recruiter', '/llms.txt', '/sitemap.xml', '/robots.txt', '/abir.vcf'];

const W3C_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (W3C audit script; +abir.getwaved.ai)',
  'Content-Type': 'text/html; charset=utf-8',
  'Accept': 'application/json',
};

async function fetchLocal(path) {
  const r = await fetch(BASE + path, {
    headers: { 'User-Agent': 'Mozilla/5.0 W3C-audit' },
  });
  return { status: r.status, contentType: r.headers.get('content-type') || '', body: await r.text() };
}

async function validateW3C(html) {
  const r = await fetch('https://validator.w3.org/nu/?out=json', {
    method: 'POST',
    headers: W3C_HEADERS,
    body: html,
  });
  if (!r.ok) {
    const t = await r.text();
    return [{ type: 'fatal', message: `W3C returned ${r.status}: ${t.slice(0, 200)}` }];
  }
  return (await r.json()).messages || [];
}

// --- Local WHATWG-style checks ---
function localChecks(html, path) {
  const issues = [];
  const url = new URL(BASE + path);
  const isHtml = /<!doctype\s+html/i.test(html);
  if (!isHtml && !path.endsWith('.xml') && !path.endsWith('.txt') && !path.endsWith('.vcf')) {
    issues.push({ type: 'error', message: 'Missing <!doctype html>' });
  }
  if (isHtml) {
    if (!/<html\b[^>]*\blang=/i.test(html)) issues.push({ type: 'error', message: '<html> missing lang attribute' });
    if (!/<meta\b[^>]*\bcharset=/i.test(html)) issues.push({ type: 'error', message: 'Missing <meta charset>' });
    if (!/<meta\b[^>]*\bname=["']?viewport/i.test(html)) issues.push({ type: 'warn', message: 'Missing viewport meta' });
    if (!/<title>[\s\S]*?<\/title>/i.test(html)) issues.push({ type: 'error', message: 'Missing <title>' });
    if (!/<meta\b[^>]*\bname=["']?description/i.test(html)) issues.push({ type: 'warn', message: 'Missing meta description' });
    if (!/og:title/i.test(html)) issues.push({ type: 'warn', message: 'Missing og:title' });
    if (!/og:image/i.test(html)) issues.push({ type: 'warn', message: 'Missing og:image' });
    if (!/og:url/i.test(html)) issues.push({ type: 'warn', message: 'Missing og:url' });
    if (!/og:type/i.test(html)) issues.push({ type: 'warn', message: 'Missing og:type' });
    if (!/twitter:card/i.test(html)) issues.push({ type: 'warn', message: 'Missing twitter:card' });
    if (!/rel=["']canonical["']/i.test(html)) issues.push({ type: 'warn', message: 'Missing canonical link' });
    // Heading hierarchy
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count === 0) issues.push({ type: 'warn', message: 'No <h1> found' });
    if (h1Count > 1) issues.push({ type: 'warn', message: `Multiple <h1> (${h1Count})` });
    // <a> without href
    const anchorsNoHref = (html.match(/<a\b(?![^>]*\bhref=)/gi) || []).length;
    if (anchorsNoHref > 0) issues.push({ type: 'warn', message: `${anchorsNoHref} <a> without href` });
    // <img> without alt
    const imgs = html.match(/<img\b[^>]*>/gi) || [];
    const imgsNoAlt = imgs.filter(t => !/\balt=/i.test(t)).length;
    if (imgsNoAlt > 0) issues.push({ type: 'error', message: `${imgsNoAlt} <img> without alt attribute` });
    // <button> without type
    const btns = html.match(/<button\b[^>]*>/gi) || [];
    const btnsNoType = btns.filter(t => !/\btype=/i.test(t)).length;
    if (btnsNoType > 0) issues.push({ type: 'warn', message: `${btnsNoType} <button> without type attribute` });
    // Inline onclick
    if (/\bon\w+\s*=/i.test(html)) {
      const m = html.match(/\bon\w+\s*=/gi) || [];
      issues.push({ type: 'warn', message: `${m.length} inline event handler(s) (on*) found` });
    }
    // lang
    if (/<html\b[^>]*\blang=/i.test(html)) {
      const m = html.match(/<html\b[^>]*\blang=["']?([\w-]+)/i);
      if (m && m[1] === 'en') {
        // ok
      }
    }
    // JSON-LD well-formed
    const jsonldBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (jsonldBlocks.length === 0) {
      issues.push({ type: 'warn', message: 'No JSON-LD blocks found' });
    } else {
      let ok = 0, bad = 0;
      for (const m of jsonldBlocks) {
        try {
          JSON.parse(m[1]);
          ok++;
        } catch (e) {
          bad++;
          issues.push({ type: 'error', message: `JSON-LD parse error: ${e.message}` });
        }
      }
      if (ok > 0) issues.push({ type: 'info', message: `${ok} valid JSON-LD blocks` });
    }
    // aria-hidden, role
    const roleCount = (html.match(/\brole=["']/gi) || []).length;
    const ariaHidden = (html.match(/\baria-hidden=["']/gi) || []).length;
    issues.push({ type: 'info', message: `role= count: ${roleCount}, aria-hidden= count: ${ariaHidden}` });
    // hreflang
    if (path === '/') {
      const hreflangs = (html.match(/\bhreflang=["']/gi) || []).length;
      if (hreflangs < 3) issues.push({ type: 'warn', message: `Only ${hreflangs} hreflang tags (en/ar/x-default expected)` });
    }
  }
  return issues;
}

(async () => {
  let totalErrors = 0, totalWarns = 0;
  for (const path of ROUTES) {
    console.log(`\n=== ${path} ===`);
    let r;
    try { r = await fetchLocal(path); }
    catch (e) { console.log(`  FETCH FAILED: ${e.message}`); continue; }
    console.log(`  status: ${r.status}, content-type: ${r.contentType}, size: ${r.body.length}`);

    // Local checks for HTML pages
    let issues = [];
    if (r.contentType.includes('text/html') || /<!doctype/i.test(r.body)) {
      issues = localChecks(r.body, path);
    }
    // W3C for HTML only
    if (r.contentType.includes('text/html') && r.body.length > 1000) {
      console.log('  → W3C validating…');
      const w3c = await validateW3C(r.body);
      const errs = w3c.filter(m => m.type === 'error');
      const warns = w3c.filter(m => m.type === 'warning' || m.type === 'warn');
      const infos = w3c.filter(m => m.type === 'info');
      totalErrors += errs.length;
      totalWarns += warns.length;
      console.log(`  W3C: ${errs.length} error(s), ${warns.length} warning(s), ${infos.length} info`);
      for (const m of errs) {
        const where = m.lastLine ? `L${m.lastLine}` : '';
        console.log(`    ERROR ${where} ${m.message.slice(0, 300)}`);
      }
      for (const m of warns) {
        const where = m.lastLine ? `L${m.lastLine}` : '';
        console.log(`    WARN  ${where} ${m.message.slice(0, 300)}`);
      }
    }
    // Local
    for (const i of issues) {
      if (i.type === 'error') totalErrors++;
      if (i.type === 'warn') totalWarns++;
      if (i.type !== 'info') {
        console.log(`    local [${i.type}] ${i.message}`);
      }
    }
    for (const i of issues.filter(i => i.type === 'info')) {
      console.log(`    local [info] ${i.message}`);
    }
  }
  console.log(`\n=== TOTALS ===`);
  console.log(`errors: ${totalErrors}, warnings: ${totalWarns}`);
})();
