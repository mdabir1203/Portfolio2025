// CvDownloadQR — a QR code that anyone can scan with their phone to
// instantly download the CV as a PDF.
//
// Why this exists: every visitor who scans the page with their phone
// is one tap away from having my CV on their device — no app install,
// no email exchange, no login. The QR encodes an absolute URL that
// serves the PDF with `Content-Disposition: attachment` so the phone's
// browser downloads it instead of rendering inline.
//
// The QR is rendered as an inline SVG so it scales cleanly to print and
// to screen. Color matches the editorial palette (off-white paper,
// deep ink modules).
//
// Where it lives:
//   - Prominently in the ContactSection as a tap-to-enlarge card
//   - As a small floating tile (top-right) on every page so visitors
//     never have to hunt for it
//
// Reduced-motion: the floating tile stays static. Hover/tap feedback
// is preserved as it's an accessibility requirement, not motion.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, X, FileText } from "lucide-react";

type Props = {
  /** Absolute URL that the QR encodes. Must be reachable from a phone
   *  on the open internet — pass window.location.origin + "/cv.pdf" or
   *  the production domain. */
  url: string;
  /** Visual variant — "prominent" for a hero card, "tile" for a
   *  small floating button. */
  variant?: "prominent" | "tile";
  /** Optional caption override. */
  caption?: string;
  /** Optional sub-caption override. */
  subcaption?: string;
};

function useQrSvg(url: string, size: number) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 1,
      width: size,
      color: { dark: "#1a1a1a", light: "#f6f1e8" },
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

export function CvDownloadQR({
  url,
  variant = "prominent",
  caption = "Scan to download CV.",
  subcaption = "PDF · 2 pages · 90 KB",
}: Props) {
  const [open, setOpen] = useState(false);
  const svg = useQrSvg(url, variant === "prominent" ? 320 : 140);
  const modalSvg = useQrSvg(url, 480);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape + lock body scroll while modal open.
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onDirectDownload = useCallback(() => {
    // Force a same-tab download. Phone browsers honour the
    // Content-Disposition: attachment header from our server route.
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mohammad-Abir-Abbas-CV.pdf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [url]);

  const urlLabel = useMemo(() => {
    try {
      const u = new URL(url);
      return `${u.host}${u.pathname}`;
    } catch {
      return url;
    }
  }, [url]);

  // ---------- Variant: tile (small floating button) ----------
  if (variant === "tile") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open CV download QR"
          className="group fixed bottom-5 left-5 z-30 flex items-center gap-2 rounded-2xl border border-rule bg-paper px-3 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7569] focus-visible:ring-offset-2"
        >
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-[#f6f1e8]">
            {svg ? (
              <span
                aria-hidden
                dangerouslySetInnerHTML={{ __html: svg }}
                className="block h-full w-full [&>svg]:h-full [&>svg]:w-full"
              />
            ) : (
              <FileText className="h-4 w-4 text-ink/55" />
            )}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/70">
            CV
          </span>
        </button>

        {open ? (
          <QrModal
            dialogRef={dialogRef}
            onClose={() => setOpen(false)}
            svg={modalSvg}
            url={url}
            urlLabel={urlLabel}
            onDirectDownload={onDirectDownload}
            caption={caption}
            subcaption={subcaption}
          />
        ) : null}
      </>
    );
  }

  // ---------- Variant: prominent (hero card) ----------
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full max-w-[420px] flex-col items-start gap-4 rounded-3xl border border-rule bg-paper p-6 text-left shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-[#0f7569] hover:shadow-[0_18px_48px_-16px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7569] focus-visible:ring-offset-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
          // grab my cv
        </span>
        <span className="font-display text-2xl leading-[1.05] tracking-tight text-ink">
          Scan to download.
        </span>
        <span className="flex items-center gap-3">
          <span className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-lg bg-[#f6f1e8] ring-1 ring-rule">
            {svg ? (
              <span
                aria-hidden
                dangerouslySetInnerHTML={{ __html: svg }}
                className="block h-full w-full [&>svg]:h-full [&>svg]:w-full"
              />
            ) : (
              <FileText className="h-6 w-6 text-ink/55" />
            )}
          </span>
          <span className="flex flex-col text-sm text-ink/70">
            <span className="font-medium text-ink">{caption}</span>
            <span className="mt-0.5 text-[12px] text-ink/55">
              {subcaption}
            </span>
            <span className="mt-1 text-[11px] text-ink/45">
              {urlLabel}
            </span>
          </span>
        </span>
      </button>

      {open ? (
        <QrModal
          dialogRef={dialogRef}
          onClose={() => setOpen(false)}
          svg={modalSvg}
          url={url}
          urlLabel={urlLabel}
          onDirectDownload={onDirectDownload}
          caption={caption}
          subcaption={subcaption}
        />
      ) : null}
    </>
  );
}

function QrModal({
  dialogRef,
  onClose,
  svg,
  url,
  urlLabel,
  onDirectDownload,
  caption,
  subcaption,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  svg: string | null;
  url: string;
  urlLabel: string;
  onDirectDownload: () => void;
  caption: string;
  subcaption: string;
}) {
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-qr-title"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-rule bg-paper p-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] md:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink/55 transition hover:bg-paper-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f7569]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55">
          // grab my cv
        </div>
        <h2
          id="cv-qr-title"
          className="mt-2 font-display text-2xl font-medium leading-tight text-ink"
        >
          {caption}
        </h2>
        <p className="mt-1 text-sm text-ink/65">{subcaption}</p>

        <div className="mt-5 flex justify-center">
          <div className="rounded-2xl bg-[#f6f1e8] p-4 ring-1 ring-rule">
            {svg ? (
              <span
                aria-hidden
                dangerouslySetInnerHTML={{ __html: svg }}
                className="block h-[280px] w-[280px] [&>svg]:h-full [&>svg]:w-full"
              />
            ) : (
              <div className="h-[280px] w-[280px]" />
            )}
          </div>
        </div>

        <div className="mt-5 rounded-md border border-rule bg-[#f6f1e8]/60 px-3 py-2 font-mono text-[11px] leading-snug text-ink/70 break-all">
          {url}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={onDirectDownload}
            disabled={!svg}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-[#0f7569] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download CV (PDF)
          </button>
          <p className="text-center text-[11px] text-ink/55">
            Or open the camera on your phone and point it at the QR.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CvDownloadQR;