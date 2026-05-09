import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
      {children}
    </span>
  );
}

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function SplitNameReveal({
  text,
  startIndex,
  className,
  accent,
}: {
  text: string;
  startIndex: number;
  className?: string;
  accent?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {Array.from(text).map((char, i) => {
        const global = startIndex + i;
        return (
          <motion.span
            key={`${text}-${i}`}
            className={
              accent
                ? "identity-surname relative inline-block not-italic"
                : "inline-block"
            }
            initial={
              reduce
                ? false
                : { opacity: 0, y: "0.4em", rotateX: -72, filter: "blur(10px)" }
            }
            whileInView={
              reduce ? undefined : { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }
            }
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: global * 0.038,
              duration: 0.72,
              ease: easeOutExpo,
            }}
            style={{ transformOrigin: "50% 100%" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
}

function AmbientParticles({ count = 28 }: { count?: number }) {
  const reduce = useReducedMotion();
  const specs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(Math.sin(i * 1.7) * 0.5 + 0.5) * 92 + 4}%`,
        top: `${(Math.cos(i * 1.3) * 0.5 + 0.5) * 88 + 6}%`,
        w: 1 + (i % 3),
        dur: 10 + (i % 7) * 1.4,
        delay: (i * 0.17) % 6,
      })),
    [count],
  );

  if (reduce) return null;

  return (
    <div className="identity-particles pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {specs.map((p) => (
        <motion.span
          key={p.id}
          className="identity-particle absolute rounded-full bg-[color:var(--accent-teal)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.w,
            height: p.w,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.08, 0.35, 0.1, 0.28, 0.08],
            y: [0, -14, -4, -22, 0],
            x: [0, 3, -2, 4, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

const pitchContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.85 },
  },
};

const pitchWord = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

function PitchLine() {
  const reduce = useReducedMotion();
  const words =
    'I deploy AI workflows that protect enterprise assets and recapture thousands of engineering hours — turning "magic" tech into predictable ROI.'.split(
      /(\s+)/,
    );

  const emphasis = new Set(["AI", "workflows", "predictable", "ROI."]);

  if (reduce) {
    return (
      <p className="mt-5 max-w-xl text-sm text-foreground/70 md:text-base">
        I deploy <span className="text-foreground">AI workflows</span> that protect enterprise assets and
        recapture thousands of engineering hours — turning &quot;magic&quot; tech into{" "}
        <span className="text-foreground">predictable ROI</span>.
      </p>
    );
  }

  return (
    <motion.p
      className="mt-5 max-w-xl text-sm text-foreground/70 md:text-base"
      variants={pitchContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
    >
      {words.map((chunk, i) => {
        if (/^\s+$/.test(chunk)) {
          return <span key={i}>{chunk}</span>;
        }
        const highlight = emphasis.has(chunk);
        return (
          <motion.span
            key={i}
            variants={pitchWord}
            className={highlight ? "inline text-foreground" : "inline"}
          >
            {chunk}
          </motion.span>
        );
      })}
    </motion.p>
  );
}

type IdentityHeroBentoProps = Omit<HTMLMotionProps<"div">, "children">;

export default function IdentityHeroBento({ className, ...rest }: IdentityHeroBentoProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });

  const glare = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, oklch(1 0 0 / 0.14), transparent 55%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * -11);
    rx.set((py - 0.5) * 8);
  };

  const onLeave = () => {
    if (reduce) return;
    mx.set(50);
    my.set(42);
    rx.set(0);
    ry.set(0);
  };

  const nameLine1 = "Mohammad";
  const nameLine2a = "Abir ";
  const nameLine2b = "Abbas.";
  const i0 = 0;
  const i1 = i0 + nameLine1.length;
  const i2 = i1 + nameLine2a.length;

  return (
    <motion.div
      ref={rootRef}
      {...rest}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`bento bento-feature grain bento-hero-vfx group/hero sm:col-span-4 md:col-span-4 md:row-span-2 ${className ?? ""}`}
      style={{ perspective: reduce ? undefined : 1400 }}
    >
      <div className="identity-vfx-root relative flex h-full min-h-[280px] flex-col justify-between gap-6 overflow-hidden md:min-h-0">
        <div className="identity-tech-grid pointer-events-none absolute inset-0 z-0" aria-hidden />
        <div className="identity-scan-line pointer-events-none absolute inset-x-0 top-0 z-0" aria-hidden />
        <AmbientParticles />

        <motion.div
          className="identity-hero-tilt relative z-[2] flex h-full flex-col justify-between gap-6"
          style={
            reduce
              ? undefined
              : {
                  rotateX: rx,
                  rotateY: ry,
                  transformStyle: "preserve-3d",
                }
          }
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/hero:opacity-100"
            style={{ background: reduce ? undefined : glare }}
            aria-hidden
          />

          <div className="relative z-[2] flex items-center justify-between">
            <Tag>// Creative Technologist · 2026</Tag>
            <motion.span
              initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -40 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 18 }}
            >
              <Sparkles className="h-4 w-4 text-[color:var(--accent-teal)]" />
            </motion.span>
          </div>

          <div className="relative z-[2]">
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight md:text-7xl [perspective:1200px]">
              <span className="block overflow-visible">
                <SplitNameReveal text={nameLine1} startIndex={i0} />
              </span>
              <br />
              <span className="block overflow-visible">
                <SplitNameReveal text={nameLine2a} startIndex={i1} />
                <em className="text-[color:var(--accent-teal)]">
                  <SplitNameReveal text={nameLine2b} startIndex={i2} accent />
                </em>
              </span>
            </h1>
            <PitchLine />
          </div>

          <motion.div
            className="relative z-[2] flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.15, duration: 0.55, ease: easeOutExpo }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Chattogram → Relocating
            </span>
            <span>13 Countries</span>
            <span>325K+ Global Readers</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
