import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import { MapPin, ArrowUpRight, Mail } from "lucide-react";

function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslations as translations } from "@/i18n/translations";

/* ------------------------------------------------------------------
 * 3D wireframe particle field â€” the only R3F scene in the site.
 * Pure imperatively-driven; no React state on the render path.
 * ---------------------------------------------------------------- */
function NeuralField({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      const r = 1.0 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.16;
      ref.current.rotation.x = Math.sin(t * 0.22) * 0.16;
    }
    if (matRef.current) {
      matRef.current.opacity = 0.55 + Math.sin(t * 0.9) * 0.18;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.022}
        color="#b6f7e6"
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

function HeroScene3D({ reduce }: { reduce: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <Suspense fallback={null}>
        <NeuralField reduce={reduce} />
      </Suspense>
    </Canvas>
  );
}

/* ------------------------------------------------------------------
 * Bento cell â€” glassmorphism 2.0 card primitive.
 * - Soft translucent background
 * - Gradient border (1px via mask-image)
 * - Noise overlay
 * - Soft shadow / glow
 * ---------------------------------------------------------------- */
function BentoCell({
  children,
  className = "",
  tone = "default",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "amber" | "lime" | "teal";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className">) {
  const accent =
    tone === "amber"
      ? "var(--accent-amber)"
      : tone === "lime"
        ? "var(--accent-lime)"
        : tone === "teal"
          ? "var(--accent-teal)"
          : "var(--foreground)";
  return (
    <div
      className={
        "cin-bento relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.025] p-5 backdrop-blur-xl md:p-6 " +
        className
      }
      style={{
        backgroundImage:
          "linear-gradient(180deg, oklch(1 0 0 / 3%), oklch(1 0 0 / 1%))",
        boxShadow:
          "0 1px 0 oklch(1 0 0 / 6%) inset, 0 24px 60px -30px oklch(0 0 0 / 0.6), 0 0 0 1px " +
          accent +
          "10",
      }}
      {...rest}
    >
      {/* gradient border sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${accent}40 0%, transparent 50%, ${accent}20 100%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* noise grain */}
      <span
        aria-hidden
        className="cin-bento-noise pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="cin-bento-kbd inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
 * CinematicHero â€” the hybrid landing hero.
 *
 * Top half (visible above the fold, no scroll needed):
 *   - Massive kinetic serif name
 *   - One-line pitch
 *   - Two CTAs
 *   - Right-side status panel (glass card): now / available / location
 *   - 3D neural field as ambient background (no parallax, just presence)
 *
 * Below-the-fold bento grid (the recruiter scan layer):
 *   - 6 asymmetric bento cells in a 12-col grid:
 *     identity | stack | metric | available | work | awards
 *
 * Below the grid: pinned 3-beat scroll choreography.
 * ---------------------------------------------------------------- */
export function CinematicHero() {
  const reduceRaw = useReducedMotion();
  const reduce = reduceRaw === true;
  const { lang } = useLanguage();
  const tx = translations[lang];

  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Scroll-locked choreography
  const titleY = useTransform(scrollYProgress, [0, 0.55], [0, -28]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.55, 0.7], [1, 1, 1, 0.2]);
  const meshOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.85, 0.6, 0.0]);
  const bentoY = useTransform(scrollYProgress, [0.05, 0.5], [0, -80]);
  const bentoOpacity = useTransform(scrollYProgress, [0.05, 0.5, 0.7], [1, 1, 0]);

  // Surname glow shadow
  const surnameGlowPx = useTransform(scrollYProgress, [0, 0.4, 0.7], [16, 28, 8]);
  const surnameGlowAlpha = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.35, 0.85, 0.2]);
  const surnameTextShadow = useMotionTemplate`0 0 ${surnameGlowPx}px oklch(0.78 0.14 180 / ${surnameGlowAlpha})`;

  // Cursor-tracking glare
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const glare = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, oklch(0.86 0.14 180 / 0.16), transparent 60%)`;

  const stack = [
    "TypeScript",
    "React 19",
    "R3F",
    "Node",
    "Cloudflare",
    "Rust",
    "Postgres",
    "D1",
    "Tailwind 4",
  ];

  return (
    <div
      ref={wrapRef}
      className="cin-hero relative w-full"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* ============== Layer 1: ambient 3D field (no pinning) ============== */}
      <div className="cin-hero-mesh pointer-events-none fixed inset-0 -z-10">
        <motion.div className="absolute inset-0" style={{ opacity: meshOpacity }}>
          {reduce ? <StaticMesh /> : <HeroScene3D reduce={reduce} />}
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, transparent 0%, oklch(0.16 0.018 175 / 0.4) 60%, oklch(0.16 0.018 175 / 0.95) 100%)",
          }}
        />
      </div>

      {/* Cursor glare */}
      <motion.div
        className="cin-hero-glare pointer-events-none fixed inset-0 -z-10"
        style={{ background: reduce ? undefined : glare }}
        aria-hidden
      />

      {/* ============== Layer 2: title block (above the fold) ============== */}
      <section className="cin-hero-title-section relative w-full px-6 pb-12 pt-28 md:px-10 md:pb-20 md:pt-36">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="cin-hero-tag-row mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55 md:text-[11px]"
            style={{ opacity: titleOpacity }}
          >
            <span className="cin-hero-tag flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-lime)] shadow-[0_0_10px_var(--accent-lime)]" />
              {tx.hero.tag}
            </span>
            <span className="text-foreground/30">Â·</span>
            <span className="text-foreground/55">{tx.hero.location}</span>
          </motion.div>

          <motion.div
            className="cin-hero-title-wrap"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <h1 className="cin-hero-name font-display text-[clamp(2.8rem,10vw,8rem)] leading-[0.92] tracking-tight">
              <span className="block">Mohammad</span>
              <span className="block">
                Abir{" "}
                <motion.em
                  className="not-italic text-[color:var(--accent-teal)]"
                  style={{ textShadow: surnameTextShadow as unknown as string }}
                >
                  Abbas.
                </motion.em>
              </span>
            </h1>
          </motion.div>

          <motion.div
            className="cin-hero-pitch-wrap mt-8 grid max-w-5xl grid-cols-1 gap-8 md:mt-10 md:grid-cols-12"
            style={{ opacity: titleOpacity }}
          >
            <p className="cin-hero-pitch col-span-1 max-w-2xl text-lg leading-relaxed text-foreground/75 md:col-span-7 md:text-xl">
              I deploy AI workflows that protect enterprise assets and
              recapture thousands of engineering hours â€” turning{" "}
              <span className="text-foreground">"magic" tech</span> into{" "}
              <span className="text-foreground">predictable ROI.</span>
            </p>
            <div className="cin-hero-cta-row col-span-1 flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
              <a
                href="mailto:abir.abbas@proton.me"
                className="group/cta inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-teal)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)] transition-all hover:brightness-110 active:scale-95"
              >
                <Mail className="h-4 w-4" />
                {tx.hero.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abir-abbas"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-mono text-sm uppercase tracking-[0.18em] text-foreground/80 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 hover:text-foreground active:scale-95"
              >
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== Layer 3: bento grid (recruiter scan) ============== */}
      <motion.section
        className="cin-hero-bento-section relative w-full px-6 pb-24 md:px-10 md:pb-36"
        style={{ y: bentoY, opacity: bentoOpacity }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="cin-hero-bento mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/55">
            <span className="h-px w-10 bg-foreground/30" />
            <span>// at a glance</span>
            <Kbd>scan</Kbd>
          </div>

          <div className="cin-hero-bento-grid grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
            {/* Cell 1 â€” Identity (tall, left) */}
            <BentoCell
              className="col-span-2 md:col-span-5 md:row-span-2"
              tone="teal"
            >
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                    // identity
                  </div>
                  <h2 className="font-display text-3xl leading-tight md:text-4xl lg:text-5xl">
                    Creative Technologist
                    <br />
                    <span className="text-foreground/70">& AI Architect</span>
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {tx.hero.location}
                  </span>
                  <span className="text-foreground/30">Â·</span>
                  <span>{tx.hero.countries}</span>
                  <span className="text-foreground/30">Â·</span>
                  <span>{tx.hero.readers}</span>
                </div>
              </div>
            </BentoCell>

            {/* Cell 2 â€” Now (small, top right) */}
            <BentoCell className="col-span-1 md:col-span-4" tone="lime">
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  <span>// now</span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--accent-lime)]" />
                </div>
                <div className="font-display text-2xl leading-tight md:text-3xl">
                  {tx.portrait.role}
                </div>
                <div className="text-sm text-foreground/60">{tx.portrait.now}</div>
              </div>
            </BentoCell>

            {/* Cell 3 â€” Available (small, top far right) */}
            <BentoCell className="col-span-1 md:col-span-3" tone="amber">
              <div className="flex h-full flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  // status
                </div>
                <div className="font-display text-xl leading-tight md:text-2xl">
                  Available
                  <br />
                  <span className="text-foreground/70">Q3 2026</span>
                </div>
                <div className="mt-auto text-sm text-foreground/60">Open across GCC</div>
              </div>
            </BentoCell>

            {/* Cell 4 â€” Metric (medium) */}
            <BentoCell className="col-span-1 md:col-span-4" tone="teal">
              <div className="flex h-full flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  // impact
                </div>
                <div className="font-display text-5xl leading-none tracking-tight md:text-6xl">
                  <span className="text-[color:var(--accent-teal)]">+38%</span>
                </div>
                <div className="text-sm text-foreground/70">
                  Production output at AbaYa-Track â€” same headcount, smarter
                  visibility.
                </div>
              </div>
            </BentoCell>

            {/* Cell 5 â€” Recognition / neobrutalist (medium) */}
            <BentoCell className="col-span-1 md:col-span-5" tone="amber">
              <div className="flex h-full flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  // recognition
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="cin-bento-brutal rounded-2xl border-2 border-amber-300/60 bg-amber-300/10 p-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-200/80">
                      Hackathon
                    </div>
                    <div className="mt-1 font-display text-lg leading-tight text-amber-100">
                      RedAGPT
                    </div>
                    <div className="text-xs text-amber-200/80">
                      Redis Side Quest Â· Winner
                    </div>
                  </div>
                  <div className="cin-bento-brutal rounded-2xl border-2 border-teal-300/60 bg-teal-300/10 p-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-teal-200/80">
                      MIT 2026
                    </div>
                    <div className="mt-1 font-display text-lg leading-tight text-teal-100">
                      SmartSwap
                    </div>
                    <div className="text-xs text-teal-200/80">
                      Hacknation Â· Next Best
                    </div>
                  </div>
                </div>
              </div>
            </BentoCell>

            {/* Cell 6 â€” Stack (wide, bottom) */}
            <BentoCell className="col-span-2 md:col-span-7" tone="default">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                    // stack
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    production-grade
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.map((s) => (
                    <span
                      key={s}
                      className="cin-stack-chip rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-foreground/80 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCell>

            {/* Cell 7 â€” Languages (small) */}
            <BentoCell className="col-span-1 md:col-span-3">
              <div className="flex h-full flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  // spoken
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-foreground/80">EN</span>
                    <span className="text-foreground/55">IELTS 7.5</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-foreground/80">BN</span>
                    <span className="text-foreground/55">Native</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-mono text-foreground/80">DE</span>
                    <span className="text-foreground/55">Goethe A2</span>
                  </li>
                </ul>
              </div>
            </BentoCell>

            {/* Cell 8 â€” Numbers (small) */}
            <BentoCell className="col-span-1 md:col-span-2">
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  // readers
                </div>
                <div className="font-display text-3xl leading-none tracking-tight">
                  325K<span className="text-[color:var(--accent-teal)]">+</span>
                </div>
                <div className="text-xs text-foreground/55">global readers</div>
              </div>
            </BentoCell>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function StaticMesh() {
  return (
    <div
      className="cin-hero-static absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 45%, oklch(0.78 0.14 180 / 0.45) 0%, oklch(0.78 0.14 180 / 0.12) 18%, transparent 55%)",
        filter: "blur(2px)",
      }}
      aria-hidden
    />
  );
}
