/**
 * PathTimeline — light, calm, editorial.
 *
 * Plain list of stops. Year / Role / Place. Subtle microinteraction:
 * each year marker carries a PulseDot that hints "live data", and
 * stops slide up faintly on scroll into view. Honors reduced-motion.
 */
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { PulseDot } from "./microinteractions/PulseDot";

const STOPS = [
  { year: "2018", role: "BSc Mechanical Engineering", place: "Chittagong University of Engineering & Technology · BD", note: "Where it started. First degree, five years, the first time I saw engineering as a way to ship things that mattered." },
  { year: "2019", role: "MSc Computational Methods of Engineering", place: "Leibniz University Hannover · DE", note: "Numerical methods on top of mechanical foundations. The pivot that made everything since possible — Germany, then the Gulf." },
  { year: "2026", role: "Famous Abaya LLC", place: "AI Solution Architect · UAE", note: "Architected the AbaYa-Track Delivery Module: floor events → employee/order map → value engine → delivery dashboard. Recovered AED 111K in trapped backlog (11.1:1 V:C)." },
  { year: "2026", role: "MIT Hacknation 2026", place: "Next Top Project · MIT Sloan AI Club", note: "24-hour global sprint, 1,000+ devs, 65+ countries. Built SmartSwap: intent-driven token swapping for SMB websites, Team Xerox with Abhishek Kumar." },
  { year: "2025", role: "Wavelink", place: "CTA · GCC", note: "NFC digital business cards + Review Stand for personal brands and businesses. Reputation management & verified trust signals for the AI-driven economy." },
  { year: "2024", role: "Deep Blue Digital", place: "Co-founder · Dubai", note: "AI-driven marketing automation. Engaze.ai integration. 50+ sellers." },
  { year: "2023", role: "HNM IT", place: "Frankfurt · IT Support", note: "99.9% uptime. MTTR: industry-leading." },
  { year: "2022", role: "42 Wolfsburg", place: "Peer · C/C++", note: "2 years of intensive peer programming. The fundamentals." },
  { year: "2022", role: "phaeno gGmbH", place: "Robotics mentor", note: "Taught kids to build robots. Built my teaching in return." },
] as const;

export function PathTimeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <section id="path" className="cin-timeline py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6 md:mb-14">
          <div>
            <div className="cin-section-eyebrow flex items-center gap-2">
              <PulseDot size={9} />
              <span>// Path</span>
            </div>
            <h2 className="cin-section-title mt-3 text-4xl md:text-6xl">
              From Wolfsburg
              <br />
              <em>to the Gulf.</em>
            </h2>
          </div>
          <div className="cin-section-eyebrow text-right">
            <div>9 stops · 3 languages</div>
          </div>
        </div>

        <ul className="border-t border-rule" ref={ref as React.RefObject<HTMLUListElement>}>
          {STOPS.map((s, i) => (
            <motion.li
              key={`${s.year}-${s.role}`}
              className="cin-timeline-item"
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: reduce ? 0 : i * 0.06,
              }}
            >
              <span className="cin-timeline-year flex items-center gap-2">
                <PulseDot size={7} label={`stop ${i + 1}`} />
                {s.year}
              </span>
              <div>
                <div className="cin-timeline-role">{s.role}</div>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted md:text-base">
                  {s.note}
                </p>
              </div>
              <span className="cin-timeline-place">
                {s.place}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
