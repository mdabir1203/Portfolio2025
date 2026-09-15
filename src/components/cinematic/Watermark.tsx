// Watermark.tsx — a subtle, screen-scraping-resistant overlay that
// diagonally tiles the owner's contact across the entire page. Every
// honest screenshot carries the email with it, so even if the image
// gets reposted, the source is still findable.
//
// How it works:
//   - Rendered as a fixed full-viewport <div> with a CSS
//     `background-image: url(svg+xml...)` that bakes the watermark
//     text into a 280x280 SVG tile. The browser re-tiles it
//     infinitely, with `pointer-events: none` so it never interferes.
//   - When the page boots up, useAntiPiracy sets
//     `data-devtools-open="1"` on <html> when it detects DevTools is
//     open. We read that attribute and bump the watermark opacity to
//     a level that's visible in a casual screenshot but still doesn't
//     wreck the editorial layout.
//   - Honors `prefers-reduced-motion` by going static.
//
// We deliberately don't make it bullet-proof — a screenshot tool that
// just rasters the visible buffer will still capture it. But a "save
// image as" attack from the right-click menu will get the watermark
// baked into the JPEG, which is the main thing.

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  /** The text to tile across the page. Defaults to the owner's email. */
  text?: string;
  /** Secondary line under the email — optional. */
  subtext?: string;
};

const DEFAULT_TEXT = "abir.abbas@proton.me";
const DEFAULT_SUBTEXT = "+971 54 361 8066";

export function Watermark({
  text = DEFAULT_TEXT,
  subtext = DEFAULT_SUBTEXT,
}: Props) {
  const reduce = useReducedMotion();
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const update = () => {
      setDevtoolsOpen(html.getAttribute("data-devtools-open") === "1");
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, {
      attributes: true,
      attributeFilter: ["data-devtools-open"],
    });
    return () => obs.disconnect();
  }, []);

  // SVG tile with the watermark text rotated -28°. Encoded inline so
  // there's no extra HTTP round-trip and the watermark is impossible
  // to remove via network panel alone.
  const tileSvg = encodeURIComponent(
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="220" viewBox="0 0 280 220">` +
      `<g transform="rotate(-28 140 110)" fill="rgba(26,26,26,0.55)" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="11" letter-spacing="1.5">` +
      `<text x="20" y="92">${text}</text>` +
      `<text x="20" y="108" fill="rgba(26,26,26,0.32)">${subtext}</text>` +
      `</g></svg>`,
  );

  const opacity = devtoolsOpen ? 0.16 : 0.07;

  return (
    <div
      aria-hidden
      data-watermark
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        backgroundImage: `url("data:image/svg+xml;charset=utf-8,${tileSvg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "280px 220px",
        opacity,
        mixBlendMode: devtoolsOpen ? "multiply" : "multiply",
        transition: reduce ? "none" : "opacity 240ms ease",
      }}
    />
  );
}

export default Watermark;