import ContactForm from "@/components/ContactForm";
import { KofiSupport } from "@/components/KofiSupport";
import { CvDownloadQR } from "@/components/cinematic/CvDownloadQR";
import { Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";

/**
 * ContactSection — dark card on light bg.
 *
 * The card is the only dark element on the page, so it draws the eye
 * without needing a single animation.
 */

// Inline YouTube mark — lucide-react in this version doesn't ship a YouTube icon.
function YoutubeMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}
export function ContactSection({ cvUrl }: { cvUrl?: string }) {
  return (
    <section id="contact" className="cin-work pb-20 pt-8 md:pb-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="cin-contact-card">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="cin-section-eyebrow">// Contact</div>
              <h2 className="cin-section-title mt-4 text-5xl leading-[0.95] md:text-7xl">
                Send a brief.
                <br />
                <em className="text-[color:var(--accent-teal)] not-italic">Get a film.</em>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper md:text-lg">
                One line is enough. Tell me the problem, the deadline, and what success looks like.
                I'll come back with a plan, not a pitch.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="mailto:abir.abbas@proton.me" className="cin-hero-cta cin-hero-cta-primary">
                  <Mail className="h-3.5 w-3.5" />
                  Let's Talk
                </a>
                <a
                  href="https://wa.me/971543618066"
                  target="_blank"
                  rel="noreferrer"
                  className="cin-hero-cta cin-hero-cta-secondary"
                >
                  <Phone className="h-3.5 w-3.5" /> +971 054 361 8066
                </a>
                <a
                  href="https://www.linkedin.com/in/abir-abbas"
                  target="_blank"
                  rel="noreferrer"
                  className="cin-hero-cta cin-hero-cta-secondary"
                >
                  LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href="https://www.youtube.com/@wavelinkd/playlists"
                  target="_blank"
                  rel="noreferrer"
                  className="cin-channel-card group"
                >
                  <span className="cin-channel-card-icon">
                    <YoutubeMark className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
                      Watch the work
                    </span>
                    <span className="mt-0.5 block truncate font-display text-base text-paper">
                      youtube.com/@wavelinkd
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                </a>
                <a
                  href="/cards/abir-referral-card.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="cin-channel-card group"
                >
                  <span className="cin-channel-card-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <path d="M14 14h3v3h-3zM18 18h3v3h-3z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
                      Hand out the card
                    </span>
                    <span className="mt-0.5 block truncate font-display text-base text-paper">
                      Referral card · A6
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                </a>
                <KofiSupport variant="card" />
                <div className="cin-channel-meta sm:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-paper/60">
                    Reach
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/80">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Dubai, UAE · Open to KSA &amp; remote
                    </span>
                    <span>·</span>
                    <span>13 Countries</span>
                    <span>·</span>
                    <span>325K+ Readers</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="flex flex-col gap-5">
                <ContactForm />
                {cvUrl ? (
                  <CvDownloadQR
                    url={cvUrl}
                    variant="prominent"
                    caption="Scan to download CV."
                    subcaption="PDF · 2 pages · 90 KB · watermark baked in"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
