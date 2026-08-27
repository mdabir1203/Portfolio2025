import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionShell } from "@/components/cinematic/SectionShell";

const TIMELINE = [
  { y: "2025", role: "Wavelink", role2: "CTA", body: "Smart NFC networking. One tap. Zero paper. GDPR-compliant." },
  { y: "2024", role: "Deep Blue Digital", role2: "Co-Founder", body: "AI-driven marketing automation. Engaze.ai integration. 50+ sellers." },
  { y: "2023", role: "HNM IT", role2: "Frankfurt · IT Support", body: "99.9% uptime. Mean-time-to-resolution: industry-leading." },
  { y: "2022", role: "42 Wolfsburg", role2: "Peer · C/C++", body: "2 years of intensive peer programming. The fundamentals." },
  { y: "2022", role: "phaeno gGmbH", role2: "Robotics Mentor", body: "Taught kids to build robots. Built my teaching in return." },
] as const;

export function PathScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end end"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={wrapRef}
      id="path"
      className="cin-path relative w-full px-6 py-24 md:px-10 md:py-36"
    >
      <SectionShell
        chapter="Reel 05"
        tag="// Path"
        title={
          <>
            From Wolfsburg
            <br />
            to the Gulf.
          </>
        }
        intro="Five stops. Three languages. One throughline: building things that ship."
      >
        <div className="cin-path-rail relative mt-12 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-[200px_1fr]">
          {/* rail */}
          <div className="cin-path-rail-track relative hidden md:block">
            <div className="absolute left-0 top-0 h-full w-px bg-foreground/15" />
            <motion.div
              className="cin-path-rail-fill absolute left-0 top-0 w-px origin-top bg-[color:var(--accent-teal)]"
              style={{ height: fillHeight }}
            />
          </div>

          <ol className="flex flex-col gap-16 md:gap-24">
            {TIMELINE.map((stop, i) => (
              <PathItem key={`${stop.y}-${stop.role}`} stop={stop} index={i} />
            ))}
          </ol>
        </div>
      </SectionShell>
    </section>
  );
}

function PathItem({ stop, index }: { stop: (typeof TIMELINE)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 30%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.7, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <motion.li
      ref={ref}
      className="cin-path-item relative grid grid-cols-[60px_1fr] items-start gap-6 md:grid-cols-1"
      style={{ opacity }}
    >
      <motion.div className="md:hidden" style={{ x }}>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--accent-teal)]">
          {stop.y}
        </div>
      </motion.div>
      <motion.div className="hidden md:block" style={{ x }}>
        <div className="font-mono text-sm uppercase tracking-[0.3em] text-[color:var(--accent-teal)]">
          {stop.y}
        </div>
        <div className="mt-1 h-px w-8 bg-foreground/20" />
      </motion.div>
      <motion.div style={{ x }}>
        <h3 className="font-display text-2xl leading-tight md:text-4xl">
          {stop.role}
        </h3>
        <div className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-foreground/55">
          {stop.role2}
        </div>
        <p className="mt-3 max-w-xl text-sm text-foreground/70 md:text-base">
          {stop.body}
        </p>
      </motion.div>
    </motion.li>
  );
}
