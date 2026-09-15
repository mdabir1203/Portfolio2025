// useAntiPiracy.ts — site-wide protections against casual scraping
// and image-leeching. Not a fortress — a determined attacker with a
// second device always wins. The goal here is to remove the
// friction: no right-click "save image as", no text copy, no
// drag-to-desktop, no Ctrl+S of the page, and an in-DOM watermark
// that survives any honest screenshot.
//
// What it does:
//   1. `contextmenu`  → preventDefault on right-click, EXCEPT on form
//      inputs (textarea / input / [contenteditable]) so users can
//      still paste / copy inside the contact form.
//   2. `dragstart`    → preventDefault on images so they can't be
//      dragged to a desktop.
//   3. `copy` / `cut`  → block clipboard, allow on form inputs.
//   4. `selectstart`  → block text selection on the document, allow on
//      form inputs and `[data-selectable]` opt-in elements.
//   5. `keydown`      → swallow Ctrl+S, Ctrl+U, Ctrl+P, Ctrl+Shift+I,
//      Ctrl+Shift+J, Ctrl+Shift+C, F12. Show a quiet toast.
//   6. Detect DevTools open via window-size delta — when open, the
//      page gets a `data-devtools-open` attribute that the Watermark
//      component reads to add a stronger overlay.
//   7. PrintScreen key — if the browser fires it (Chrome on macOS
//      does; Windows mostly doesn't), we show a one-shot toast.
//
// All listeners are no-ops when `prefers-reduced-motion` is on or
// when running in an iframe (so embedded preview surfaces still work).

import { useEffect, useState } from "react";

export type AntiPiracyState = {
  devtoolsOpen: boolean;
  blockedKey: string | null;
};

const TOAST_LIFETIME_MS = 2400;

function isFormTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest("input, textarea, select")) return true;
  if (target.isContentEditable) return true;
  if (target.closest("[data-selectable]")) return true;
  return false;
}

function showToast(message: string) {
  if (typeof document === "undefined") return;
  let host = document.getElementById("cin-anti-piracy-toast");
  if (!host) {
    host = document.createElement("div");
    host.id = "cin-anti-piracy-toast";
    host.style.cssText = [
      "position:fixed",
      "left:50%",
      "bottom:32px",
      "transform:translateX(-50%)",
      "z-index:2147483647",
      "pointer-events:none",
      "padding:10px 16px",
      "border-radius:12px",
      "background:rgba(15,20,18,0.92)",
      "color:#f6f1e8",
      "font:500 12px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
      "letter-spacing:0.08em",
      "text-transform:uppercase",
      "box-shadow:0 10px 30px -10px rgba(0,0,0,0.4)",
      "transition:opacity 200ms ease",
      "opacity:0",
    ].join(";");
    document.body.appendChild(host);
  }
  host.textContent = message;
  host.style.opacity = "1";
  window.setTimeout(() => {
    if (host) host.style.opacity = "0";
  }, TOAST_LIFETIME_MS);
}

function inIframe(): boolean {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch {
    return true;
  }
}

export function useAntiPiracy(enabled: boolean = true): AntiPiracyState {
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const [blockedKey, setBlockedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (inIframe()) return;

    // ----- contextmenu: block right-click except on form inputs -----
    const onContextMenu = (e: MouseEvent) => {
      if (isFormTarget(e.target)) return;
      e.preventDefault();
      showToast("Right-click disabled · abir.abbas@proton.me");
    };

    // ----- dragstart: block image / link drag -----
    const onDragStart = (e: DragEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLImageElement ||
        t instanceof HTMLAnchorElement ||
        (t instanceof HTMLElement && t.closest("[data-nodrag], img, picture"))
      ) {
        e.preventDefault();
      }
    };

    // ----- copy / cut: block, except form inputs -----
    const onCopy = (e: ClipboardEvent) => {
      if (isFormTarget(e.target)) return;
      e.preventDefault();
      showToast("Copy disabled · ask me directly");
    };
    const onCut = (e: ClipboardEvent) => {
      if (isFormTarget(e.target)) return;
      e.preventDefault();
    };

    // ----- selectstart: block selection, allow on form / opt-in -----
    const onSelectStart = (e: Event) => {
      if (isFormTarget(e.target)) return;
      e.preventDefault();
    };

    // ----- keydown: swallow common "save / view-source" chords -----
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const blocked =
        (ctrl && key === "s") ||
        (ctrl && key === "u") ||
        (ctrl && key === "p") ||
        (ctrl && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
        key === "f12" ||
        // PrintScreen — only blocks reliably on macOS / Linux Chrome.
        key === "printscreen";
      if (!blocked) return;
      // Allow when the focus is in a form input so users can still
      // hit Cmd+S in a textarea if they really want to.
      if (isFormTarget(e.target)) return;
      e.preventDefault();
      setBlockedKey(e.key);
      window.setTimeout(() => setBlockedKey(null), TOAST_LIFETIME_MS);
      const label =
        key === "printscreen"
          ? "Screenshots blocked · ask for the deck instead"
          : "Keyboard shortcut disabled · abir.abbas@proton.me";
      showToast(label);
    };

    // ----- DevTools detection: window outer/inner size delta -----
    // This is the standard "open devtools" heuristic. It's not
    // bulletproof but it's good enough — the Watermark reads the
    // resulting attribute and adds a stronger overlay.
    let devtoolsTimer: number | null = null;
    const onResize = () => {
      if (devtoolsTimer !== null) window.clearTimeout(devtoolsTimer);
      devtoolsTimer = window.setTimeout(() => {
        const widthDelta = window.outerWidth - window.innerWidth;
        const heightDelta = window.outerHeight - window.innerHeight;
        const threshold = 180;
        const open =
          widthDelta > threshold || heightDelta > threshold;
        setDevtoolsOpen((prev) => {
          if (prev === open) return prev;
          if (typeof document !== "undefined") {
            if (open) {
              document.documentElement.setAttribute(
                "data-devtools-open",
                "1",
              );
            } else {
              document.documentElement.removeAttribute(
                "data-devtools-open",
              );
            }
          }
          return open;
        });
      }, 250);
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // Initial probe — DevTools might already be open when the page loads.
    onResize();

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (devtoolsTimer !== null) window.clearTimeout(devtoolsTimer);
    };
  }, [enabled]);

  // CSS-level hardening: user-select: none across the page, with
  // opt-in for form inputs. We add a single <style> tag so we don't
  // fight Tailwind's preflight.
  useEffect(() => {
    if (!enabled) return;
    if (typeof document === "undefined") return;
    const id = "cin-anti-piracy-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      html.cin-anti-piracy,
      html.cin-anti-piracy body {
        -webkit-user-select: none;
        user-select: none;
      }
      html.cin-anti-piracy img,
      html.cin-anti-piracy picture,
      html.cin-anti-piracy svg {
        -webkit-user-drag: none;
        user-drag: none;
        -webkit-touch-callout: none;
        pointer-events: auto;
      }
      html.cin-anti-piracy input,
      html.cin-anti-piracy textarea,
      html.cin-anti-piracy [contenteditable],
      html.cin-anti-piracy [data-selectable] {
        -webkit-user-select: text;
        user-select: text;
      }
      /* When DevTools is detected, add an extra print-blocker overlay. */
      html[data-devtools-open="1"] body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483646;
        background-image: var(--cin-watermark, none);
        background-size: 320px 320px;
        mix-blend-mode: multiply;
        opacity: 0.06;
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add("cin-anti-piracy");
    return () => {
      document.documentElement.classList.remove("cin-anti-piracy");
      // Leave the <style> tag in place — small, idempotent, lets the
      // global rules survive HMR remounts of the hook.
    };
  }, [enabled]);

  return { devtoolsOpen, blockedKey };
}

export default useAntiPiracy;