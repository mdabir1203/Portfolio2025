import junyubImg from "/images/junyub-kim.webp";
import sabbirImg from "/images/sabbir-shubho.webp";
import martjeImg from "/images/martje-lott.webp";

/**
 * PeerReviews — the three real LinkedIn recommendations, with the real
 * photos. Calm editorial cards, no marquee, no chrome.
 */
const REVIEWS = [
  {
    name: "Junyub Kim",
    role: "Strategic Planner at General Motors · Software Developer",
    img: junyubImg,
    body: "Abir is a pioneering and passionate individual, consistently demonstrating innovative thinking in addressing challenges. His technical talent, paired with his reliable, results-oriented mindset, makes him a perfect fit for any business-focused role. His dedication to excellence and collaborative nature would be a tremendous asset to any organization.",
    relation: "42 Wolfsburg peer",
  },
  {
    name: "Sabbir Ahamed Shubho",
    role: "Embedded Software Developer · Linux Enthusiast",
    img: sabbirImg,
    body: "Mr. Mohammad Abir is very hard worker and talented student. I have known him since my school days. Once he made up his mind on something, he put a great effort no matter how hard that task is. I wish him good luck on his future endeavors.",
    relation: "School-time friend",
  },
  {
    name: "Martje Lott",
    role: "Wissenschaftliche Mitarbeiterin · Universität Hamburg",
    img: martjeImg,
    body: "Herr Mohammad Abir Abbas ist ehrenamtlich bei AIESEC e.V. tätig. Er ist Vorsitzender für das Team Praktikanten im Unternehmen zu vermitteln und das interkulturelle Verständnis zu fördern.",
    relation: "AIESEC supervisor",
  },
] as const;

export function PeerReviews() {
  return (
    <section id="reviews" className="border-t border-rule py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-14">
          <div>
            <div className="cin-section-eyebrow">// Peer Reviews</div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-6xl">
              What they
              <br />
              <em>say about me.</em>
            </h2>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>3 LinkedIn recommendations</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {REVIEWS.map((r) => (
            <article
              key={r.name}
              className="flex h-full flex-col gap-5 rounded-2xl border border-rule bg-paper-2 p-6 transition-colors hover:bg-paper-hi"
            >
              <p className="flex-1 font-display text-lg leading-snug text-ink md:text-xl">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-rule pt-4">
                <img
                  src={r.img}
                  alt={r.name}
                  className="cin-review-avatar h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <div className="font-display text-base leading-tight text-ink md:text-lg">
                    {r.name}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-muted">{r.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
