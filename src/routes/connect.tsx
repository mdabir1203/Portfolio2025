// QR landing route — /connect (or /c/:code after path rewrite).
// Focused single-screen experience built off the editorial system.
// One job: book a 15-min chat. Proof + CTA + email drop. That's it.
//
// Layered over the editorial palette so the page feels like a
// sibling of the portfolio, not a sales landing page.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { InteractiveQR } from "@/components/cinematic/InteractiveQR";
import { KofiSupport } from "@/components/KofiSupport";
import { useVisitorCode } from "@/hooks/useVisitorCode";
import { Calendar, Download, FileText, ArrowUpRight } from "lucide-react";
import { subscribeReferral } from "@/server/referral";

const PROOF_TILES = [
  {
    kpi: "AED 111,246",
    label: "Trapped backlog recovered in 30 days",
    sub: "Famous Abaya LLC · Delivery Module",
  },
  {
    kpi: "11.1 : 1",
    label: "Value-to-cost ratio on a AED 10K build",
    sub: "Floor events → boardroom dashboard",
  },
  {
    kpi: "Next Top Project",
    label: "MIT Hacknation 2026",
    sub: "24-hour sprint · 1,000+ devs · 65+ countries",
  },
];

const PROOF_RESULTS = [
  { metric: "1,319", unit: "units mapped", detail: "across 4 production stages" },
  { metric: "AED 376,625", unit: "pipeline value", detail: "in 30 days" },
  { metric: "70.5%", unit: "completion rate", detail: "after 4-layer system went live" },
];

export const Route = createFileRoute("/connect")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : "intro",
    ref: typeof search.ref === "string" ? search.ref : "qr",
  }),
  head: () => ({
    meta: [
      { title: "Connect with Abir Abbas · Creative Technologist Dubai · 15 minutes that pay for themselves" },
      {
        name: "description",
        content:
          "Book a 15-min chat with Dubai-based Creative Technologist Mohammad Abir Abbas. Currently AI Solution Architect at Famous Abaya LLC. Recovered AED 111K of trapped manufacturing backlog in 30 days at 11.1:1 V:C. UAE Company Visa, no sponsorship.",
      },
      {
        name: "keywords",
        content:
          "hire Creative Technologist Dubai, contact AI Strategist UAE, AI consultation Dubai, Mohammad Abir Abbas contact, Abir Abbas hiring, Creative Technologist GCC, connect Creative Technologist Riyadh, NEOM, remote AI consultation, technology leverage, GCC founders, GCC SMEs, GCC enterprises",
      },
      { property: "og:title", content: "Connect with Abir Abbas · Creative Technologist Dubai · 15 minutes that pay for themselves" },
      { property: "og:url", content: "https://abir.getwaved.ai/connect" },
      { property: "og:description", content: "15 minutes with a Dubai Creative Technologist who recovered AED 111K of trapped backlog in 30 days. UAE Company Visa, no sponsorship." },
      { name: "twitter:title", content: "Connect with Abir Abbas · Creative Technologist Dubai" },
      { name: "twitter:description", content: "15 minutes with a Dubai Creative Technologist who recovered AED 111K of trapped backlog in 30 days. UAE Company Visa, no sponsorship." },
    ],
    links: [
      { rel: "canonical", href: "https://abir.getwaved.ai/connect" },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const visitorCode = useVisitorCode(search.code);
  const [shareUrl, setShareUrl] = useState<string>("https://abir.getwaved.ai/connect");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The QR must encode the live URL the visitor is actually looking at, so
  // the code in the QR matches the code in the URL bar. SSR-safe — the
  // initial state is the canonical intro URL and we replace on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // If the URL came in via /c/:code wildcard, search.code is the wildcard
    // value. We mirror that into the share URL so the QR preserves whatever
    // attribution the visitor already has.
    const params = new URLSearchParams();
    if (visitorCode && visitorCode !== "INTRO") {
      params.set("code", visitorCode.toLowerCase());
    }
    params.set("ref", search.ref ?? "qr");
    const live = `${window.location.origin}/connect?${params.toString()}`;
    setShareUrl(live);
  }, [visitorCode, search.ref]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await subscribeReferral({
        data: {
          email,
          name: name || undefined,
          code: search.code,
          ref: search.ref,
          ts: Date.now(),
        },
      });
      setSubmitted(true);
    } catch (err) {
      // Graceful fallback: show the Loom + cal anyway so the user gets value
      // even if the server function is in a degraded state. Don't dump the
      // error to the UI — keep the editorial calm.
      console.error("subscribe failed:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 md:px-8 md:py-20">
        {/* Top: brand stamp */}
        <header className="mb-12 flex items-center justify-between border-b border-rule pb-6">
          <Link to="/" className="flex items-center gap-3" aria-label="Home">
            <BrandMark size={28} variant="primary" />
            <span className="font-display text-base font-medium tracking-tight text-ink">
              Abir Abbas
            </span>
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
            15 SECONDS · 3 PROMISES
          </span>
        </header>

        {/* Headline: the ask, not a CV */}
        <section className="mb-12">
          <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
            Fifteen minutes that
            <br />
            <em className="text-[color:var(--accent-teal)] not-italic">pay for themselves.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            You scanned a QR. I'm <strong className="text-ink">Mohammad Abir Abbas</strong>, AI
            Architect at Famous Abaya LLC. Three options below — pick whichever feels easiest right
            now.
          </p>

          {/* Per-visitor referral ticket — a flat, calm, 2-up panel.
              Renders on every page load, including when the URL was a bare
              /c/intro. The code is yours for the session: forward the page
              and your attribution travels with it. */}
          <div
            role="group"
            className="mt-7 flex flex-col gap-4 rounded-2xl border border-rule bg-paper-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
            aria-label="Your personal referral code"
          >
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                // your referral code
              </div>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-2xl font-medium tracking-[0.16em] text-ink sm:text-3xl">
                  INTRO-{visitorCode}
                </span>
                <span className="rounded-full border border-rule bg-paper px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                  session-only
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                Forward this page — your code rides along. If they book a call, the next Loom has
                your name at the top.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl).catch(() => undefined);
                }
              }}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-md border border-rule bg-paper px-3 py-2 text-xs font-medium text-ink transition hover:border-[color:var(--accent-teal)] hover:text-[color:var(--accent-teal)] sm:self-auto"
              aria-label="Copy your personal referral link"
            >
              Copy link
            </button>
          </div>
        </section>

        {/* Proof tiles — the only "show off" moment */}
        <section className="mb-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
          {PROOF_TILES.map((t) => (
            <div key={t.kpi} className="bg-paper p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                // {t.sub.split("·")[0].trim()}
              </div>
              <div className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl">
                {t.kpi}
              </div>
              <div className="mt-2 text-sm text-ink-muted">{t.label}</div>
              <div className="mt-1 text-xs text-ink-faint">{t.sub}</div>
            </div>
          ))}
        </section>

        {/* Optional: deeper proof, expandable */}
        <details className="mb-12 rounded-2xl border border-rule bg-paper-2 p-6">
          <summary className="cursor-pointer text-sm font-medium text-ink">
            Show me the receipts
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PROOF_RESULTS.map((r) => (
              <div key={r.metric}>
                <div className="font-display text-xl text-ink">{r.metric}</div>
                <div className="text-xs text-ink-muted">{r.unit}</div>
                <div className="mt-1 text-[11px] text-ink-faint">{r.detail}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Full case study:{" "}
            <a
              href="/#case-study"
              className="underline decoration-1 underline-offset-2 hover:text-ink"
            >
              The Delivery Module — abir.getwaved.ai
            </a>
          </p>
        </details>

        {/* Three options. Pick one. */}
        <section className="mb-12">
          <div className="cin-section-eyebrow mb-4">// pick one</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href="https://cal.com/abir-abbas/15min"
              className="cin-hero-cta cin-hero-cta-primary justify-center"
            >
              <Calendar className="h-4 w-4" />
              Book 15 minutes
            </a>
            <a
              href="/loom-case-study.mp4"
              className="cin-hero-cta cin-hero-cta-secondary justify-center"
            >
              <FileText className="h-4 w-4" />
              30-sec Loom
            </a>
            <a href="/abir.vcf" className="cin-hero-cta cin-hero-cta-secondary justify-center">
              <Download className="h-4 w-4" />
              vCard to phone
            </a>
          </div>
        </section>

        {/* Email drop → follow-up */}
        <section className="rounded-2xl border border-rule bg-paper-2 p-6 md:p-8">
          {!submitted ? (
            <>
              <div className="cin-section-eyebrow mb-2">// or get a follow-up</div>
              <h2 className="font-display text-2xl text-ink">
                Drop your email and I'll send{" "}
                <em className="text-[color:var(--accent-teal)] not-italic">
                  the next three useful things
                </em>{" "}
                over 7 days.
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                No newsletter. Unsubscribe in one tap. Average open rate of these three: I've never
                measured, but the people I send them to actually reply.
              </p>

              <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="flex-1 rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-[color:var(--accent-teal)] focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-[2] rounded-md border border-rule bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-[color:var(--accent-teal)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-[color:var(--accent-teal)] disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Send me the Loom"}
                </button>
              </form>
              {error && (
                <p className="mt-3 text-xs text-[color:var(--accent-rose,#b94a4a)]">{error}</p>
              )}
              <p className="mt-3 text-[11px] text-ink-faint">
                Schedule: <strong>Day 0</strong> · the Loom. <strong>Day 3</strong> · the boardroom
                one-pager. <strong>Day 7</strong> · a personal note + my cal.
              </p>
            </>
          ) : (
            <div className="py-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-teal)]">
                // on the way
              </div>
              <h2 className="mt-2 font-display text-2xl text-ink">Check your inbox.</h2>
              <p className="mt-3 text-sm text-ink-muted">
                The Loom should land in ~30 seconds. If it doesn't, the spam filter ate it — or just{" "}
                <a
                  href="https://cal.com/abir-abbas/15min"
                  className="underline decoration-1 underline-offset-2 hover:text-ink"
                >
                  grab a slot
                </a>{" "}
                and we'll talk live.
              </p>
              <button
                onClick={() => navigate({ to: "/" })}
                className="mt-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
              >
                Browse the full portfolio <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </section>

        {/* Footer: same as portfolio but tighter */}
        <footer className="mt-12 border-t border-rule pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BrandMark size={20} variant="primary" />
              <span>© 2026 Abbas</span>
            </div>
            <div>Dubai · abir.abbas@proton.me · +971 054 361 8066</div>
          </div>
          <div className="mt-3">
            <KofiSupport variant="inline" />
          </div>
        </footer>
      </div>
    </main>
  );
}
