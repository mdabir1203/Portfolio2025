// Interactive QR — the page is its own QR. Tap the floating tile to enlarge
// to a full-viewport modal with Save / Share / Copy actions.
//
// Why this exists: every visitor who lands on /connect is a potential
// distributor. If they can save *their own* QR with *their own* referral
// code baked in, the page becomes self-replicating. The QR is rendered
// client-side from the live URL so the code matches what the visitor sees.
//
// Behavior:
// - Floating tile (120x120) is fixed bottom-right, paper-on-paper, a tiny
//   inline QR. It breathes (pulse 2.4s) so it reads as alive without being loud.
// - Tap → full-viewport modal with 480x480 SVG QR, the full URL, and three
//   actions: Save (downloads PNG), Share (navigator.share if available),
//   Copy (URL to clipboard).
// - Modal dismisses on backdrop click or Escape key.
// - Reduced-motion: tile stays static, no pulse.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Share2, Copy, X, QrCode as QrCodeIcon } from "lucide-react";

type Props = {
  /** The full URL the QR should encode. Pass the live window.location.href
   *  so the code matches whatever the visitor sees. */
  url: string;
  /** Display label above the floating tile. Defaults to "Your QR". */
  label?: string;
  /** Optional referral code to render in the ticket-stamp. Pure visual. */
  code?: string;
};

/** Render a QR code as an inline SVG string. Returns null until the
 *  library resolves. Memoized by URL so re-renders don't reflow. */
function useQrSvg(url: string, size: number) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H", // 30% recovery — same as the print card
      margin: 1,
      width: size,
      color: { dark: "#0e0e0e", light: "#f7f3ec" },
    })
      .then((s) => {
        if (!cancelled) setSvg(s);
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url, size]);
  return svg;
}

/** Convert an SVG string into a PNG data URL via an offscreen canvas. */
async function svgStringToPng(
  svgString: string,
  pixelSize: number,
): Promise<{ pngBlob: Blob; dataUrl: string }> {
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image load failed"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    // Paint the paper-tone background so the PNG has the same warm off-white
    // as the rest of the editorial palette (avoids stark-white look when
    // saved to camera roll and shared to chat).
    ctx.fillStyle = "#f7f3ec";
    ctx.fillRect(0, 0, pixelSize, pixelSize);
    ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
    const dataUrl = canvas.toDataURL("image/png");
    const pngBlob = await (await fetch(dataUrl)).blob();
    return { pngBlob, dataUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function InteractiveQR({ url, label = "Your QR", code }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareUnsupported, setShareUnsupported] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // 120 = tile QR, 480 = modal QR. Both share the same encoded URL.
  const tileSvg = useQrSvg(url, 120);
  const modalSvg = useQrSvg(url, 480);

  // Detect navigator.share support once on mount. Web Share API is mobile-first.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      setShareUnsupported(true);
    }
  }, []);

  // Close on Escape, focus the modal when it opens for keyboard a11y.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while modal is open so the underlying page doesn't
    // scroll on mobile when the user drags the QR.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be blocked in insecure contexts or if the user
      // denied permission. Fall through silently — the visible URL below
      // the QR is selectable manually.
    }
  }, [url]);

  const onSave = useCallback(async () => {
    if (!modalSvg) return;
    try {
      const { pngBlob } = await svgStringToPng(modalSvg, 1024);
      const fileName = `abir-referral-${code ?? "intro"}.png`;
      const file = new File([pngBlob], fileName, { type: "image/png" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(pngBlob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after a tick so the click handler can resolve.
      window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      // Also expose as File for potential future use.
      void file;
    } catch {
      // Surface silently — the user can long-press the QR on mobile to save
      // the rendered image, or use Copy URL.
    }
  }, [modalSvg, code]);

  const onShare = useCallback(async () => {
    if (shareUnsupported || !modalSvg) return;
    try {
      const { pngBlob } = await svgStringToPng(modalSvg, 1024);
      const file = new File([pngBlob], "abir-referral.png", {
        type: "image/png",
      });
      // navigator.share can take files on mobile; on desktop the share is
      // text-only and the file is silently dropped.
      const navAny = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      const data: ShareData = {
        title: "Abir Abbas — AI Architect",
        text: "Fifteen minutes that pay for themselves. Scan my QR.",
        url,
      };
      if (navAny.canShare?.({ ...data, files: [file] })) {
        await navigator.share({ ...data, files: [file] });
      } else {
        await navigator.share(data);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // User dismissed the share sheet — no-op.
    }
  }, [modalSvg, url, shareUnsupported]);

  const memoizedUrl = useMemo(() => url, [url]);

  return (
    <>
      {/* Floating tile — fixed bottom-right, paper-on-paper so it doesn't
          clash with the editorial palette. Sits above the page so it's
          always one tap away. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open your personal QR code"
        className="group fixed bottom-5 right-5 z-30 flex flex-col items-center gap-1.5 rounded-2xl border border-rule bg-paper p-2.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ color: "var(--ink)" }}
      >
        <span
          aria-hidden
          className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-lg bg-[#f7f3ec] motion-safe:animate-[qr-pulse_2.4s_ease-in-out_infinite]"
        >
          {tileSvg ? (
            <span
              aria-hidden
              dangerouslySetInnerHTML={{ __html: tileSvg }}
              className="block h-full w-full [&>svg]:h-full [&>svg]:w-full"
            />
          ) : (
            <QrCodeIcon className="h-7 w-7 text-ink-faint" />
          )}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
          {label}
        </span>
      </button>

      {/* Modal — full viewport, paper background, editorial type. */}
      {open ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="interactive-qr-title"
          tabIndex={-1}
          onClick={(e) => {
            // Click on backdrop closes; click inside the card does not.
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-sm"
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-rule bg-paper p-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] md:p-9"
            style={{ color: "var(--ink)" }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-paper-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-teal)]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
              // your personal referral
            </div>
            <h2
              id="interactive-qr-title"
              className="mt-2 font-display text-2xl font-medium leading-tight text-ink"
            >
              This QR is{" "}
              <em className="not-italic text-[color:var(--accent-teal)]">
                yours.
              </em>
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Forward it. Every scan carries your code. If they book a call, the
              next Loom I send has your name at the top.
            </p>

            {/* QR plate — paper-toned, soft inner border, the BrandMark stamp
                in the dead center so a printed card still brands itself. */}
            <div className="mt-6 flex items-center justify-center">
              <div
                className="relative flex h-[280px] w-[280px] items-center justify-center rounded-2xl border border-rule bg-[#f7f3ec] md:h-[320px] md:w-[320px]"
                aria-label="Personal QR code"
              >
                {modalSvg ? (
                  <span
                    aria-hidden
                    dangerouslySetInnerHTML={{ __html: modalSvg }}
                    className="block h-[240px] w-[240px] md:h-[280px] md:w-[280px]"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="block h-7 w-7 animate-pulse rounded-full bg-ink-faint/30"
                  />
                )}
              </div>
            </div>

            {/* Visible URL — selectable so even if Copy is blocked, the user
                can long-press / triple-click. */}
            <div className="mt-5 rounded-md border border-rule bg-paper-2 px-3 py-2 font-mono text-[11px] leading-snug text-ink-muted break-all">
              {memoizedUrl}
            </div>

            {/* Three actions: Save / Share / Copy. Stack on mobile, row on
                larger screens. Share is hidden on desktop where the Web
                Share API isn't useful. */}
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={onSave}
                disabled={!modalSvg}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-ink px-3 py-2.5 text-xs font-medium text-paper transition hover:bg-[color:var(--accent-teal)] disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Save PNG
              </button>
              {!shareUnsupported ? (
                <button
                  type="button"
                  onClick={onShare}
                  disabled={!modalSvg}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-rule bg-paper px-3 py-2.5 text-xs font-medium text-ink transition hover:border-[color:var(--accent-teal)] hover:text-[color:var(--accent-teal)] disabled:opacity-50"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {shared ? "Sent" : "Share"}
                </button>
              ) : (
                <span className="hidden" aria-hidden />
              )}
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-rule bg-paper px-3 py-2.5 text-xs font-medium text-ink transition hover:border-[color:var(--accent-teal)] hover:text-[color:var(--accent-teal)]"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy URL"}
              </button>
            </div>

            {code ? (
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Code · {code.toUpperCase()}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Local keyframes for the floating-tile pulse. Scoped to this
          component, prefers-reduced-motion respected via motion-safe. */}
      <style>{`
        @keyframes qr-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(85, 145, 165, 0); }
          50%      { box-shadow: 0 0 0 6px rgba(85, 145, 165, 0.10); }
        }
      `}</style>
    </>
  );
}
