const r = await fetch('http://localhost:8081/');
const html = await r.text();
const nulPos = [];
for (let i = 0; i < html.length; i++) {
  if (html.charCodeAt(i) === 0) nulPos.push(i);
}
console.log('NUL positions:', nulPos.length);
for (const p of nulPos.slice(0, 10)) {
  const s = Math.max(0, p - 40);
  const e = Math.min(html.length, p + 60);
  const snippet = html.slice(s, e);
  const hex = Array.from(snippet).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  console.log(`pos=${p} hex=${hex}`);
}
console.log('---');
// also check char before
for (const p of nulPos) {
  const ch = html.charCodeAt(p - 1);
  const nch = html.charCodeAt(p + 1);
  console.log(`pos=${p}  before=0x${ch.toString(16)}(${String.fromCharCode(ch)}) after=0x${nch.toString(16)}(${String.fromCharCode(nch)})`);
}
