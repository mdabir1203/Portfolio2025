import { FC, useEffect } from 'react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const youtubeChannelUrl = 'https://www.youtube.com/channel/UCPM3MAgkXUOFSfysJuAvthQ';
const mediumNewsletterUrl = 'https://medium.com/@md.abir1203';

const WelcomeModal: FC<WelcomeModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-welcome-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#041b19]/95 p-8 shadow-[0_30px_80px_rgba(0,150,136,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-200 transition hover:bg-emerald-500/20"
          aria-label="Dismiss welcome message"
        >
          ×
        </button>

        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          <span aria-hidden="true">✨</span>
          <span>Welcome</span>
        </div>

        <h2 id="portfolio-welcome-title" className="text-2xl font-semibold text-emerald-50">
          Welcome to AI Alchemist Abir's Portfolio!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-emerald-100/80">
          Thanks for dropping in! Tap a logo below to catch the latest YouTube deep-dives or subscribe for Medium
          newsletter drops. No spam—just thoughtful insights and behind-the-scenes notes about AI, Rust and Security.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-6 text-center transition hover:-translate-y-1 hover:border-red-400/70 hover:bg-red-500/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_16px_35px_rgba(239,83,80,0.35)]">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.8 8.001a2.5 2.5 0 0 0-1.76-1.768C18.33 6 12 6 12 6s-6.33 0-8.04.233A2.5 2.5 0 0 0 2.2 8.001 26.5 26.5 0 0 0 2 12a26.5 26.5 0 0 0 .2 3.999 2.5 2.5 0 0 0 1.76 1.768C5.67 18 12 18 12 18s6.33 0 8.04-.233a2.5 2.5 0 0 0 1.76-1.768A26.5 26.5 0 0 0 22 12a26.5 26.5 0 0 0-.2-3.999ZM10 14.5v-5l4.5 2.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-50">Subscribe on YouTube</p>
              <p className="mt-1 text-xs text-emerald-100/70">Quick visual updates &amp; product drops</p>
            </div>
          </a>

          <a
            href={mediumNewsletterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-6 text-center transition hover:-translate-y-1 hover:border-emerald-300/70 hover:bg-emerald-400/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-[#041b19] shadow-[0_16px_35px_rgba(129,199,132,0.35)]">
              <span className="text-2xl font-black">M</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-50">Join the Medium list</p>
              <p className="mt-1 text-xs text-emerald-100/70">Monthly essays &amp; thoughtful reads</p>
            </div>
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm text-emerald-100/70">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-4 py-2 font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-500/30"
          >
            Continue exploring
          </button>
          <span className="text-xs text-emerald-100/60">No spam, unsubscribe anytime.</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
