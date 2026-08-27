/**
 * PathTimeline — light, calm, editorial.
 *
 * Plain list of stops. No pinned scroll, no rail, no animation.
 * Year / Role / Place. Hover shows a hint background.
 */
const STOPS = [
  { year: "2026", role: "Famous Abaya LLC", place: "AI Solution Architect · UAE", note: "Architected the AbaYa-Track Delivery Module: floor events → employee/order map → value engine → delivery dashboard. Recovered AED 111K in trapped backlog (11.1:1 V:C)." },
  { year: "2026", role: "MIT Hacknation 2026", place: "Next Top Project · MIT Sloan AI Club", note: "24-hour global sprint, 1,000+ devs, 65+ countries. Built SmartSwap: intent-driven token swapping for SMB websites, Team Xerox with Abhishek Kumar." },
  { year: "2025", role: "Wavelink", place: "CTA · GCC", note: "NFC digital business cards + Review Stand for personal brands and businesses. Reputation management & verified trust signals for the AI-driven economy." },
  { year: "2024", role: "Deep Blue Digital", place: "Co-founder · Dubai", note: "AI-driven marketing automation. Engaze.ai integration. 50+ sellers." },
  { year: "2023", role: "HNM IT", place: "Frankfurt · IT Support", note: "99.9% uptime. MTTR: industry-leading." },
  { year: "2022", role: "42 Wolfsburg", place: "Peer · C/C++", note: "2 years of intensive peer programming. The fundamentals." },
  { year: "2022", role: "phaeno gGmbH", place: "Robotics mentor", note: "Taught kids to build robots. Built my teaching in return." },
] as const;

export function PathTimeline() {
  return (
    <section id="path" className="cin-timeline py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-14">
          <div>
            <div className="cin-section-eyebrow">// Path</div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-6xl">
              From Wolfsburg
              <br />
              <em>to the Gulf.</em>
            </h2>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>7 stops · 3 languages</div>
          </div>
        </div>

        <ul className="border-t border-rule">
          {STOPS.map((s) => (
            <li
              key={`${s.year}-${s.role}`}
              className="cin-timeline-item"
            >
              <span className="cin-timeline-year">{s.year}</span>
              <div>
                <div className="cin-timeline-role">{s.role}</div>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted md:text-base">
                  {s.note}
                </p>
              </div>
              <span className="cin-timeline-place">
                {s.place}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
