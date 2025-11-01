import { FC, memo, useCallback, useMemo, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import clsx from 'clsx';
import { JourneyStep } from '../data/journey';

type JourneySectionProps = {
  journey: JourneyStep[];
};

type ParticleConfig = {
  left: number;
  top: number;
  size: number;
  blur: number;
  floatDistance: number;
  duration: number;
  delay: number;
  parallaxIntensity: number;
  opacity: number;
};

type TimelineParticleProps = {
  config: ParticleConfig;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

const TimelineParticle = memo(({ config, pointerX, pointerY }: TimelineParticleProps) => {
  const parallaxX = useTransform(pointerX, (value) => (value - 0.5) * config.parallaxIntensity);
  const parallaxY = useTransform(pointerY, (value) => (value - 0.5) * config.parallaxIntensity * 1.2);

  return (
    <motion.span
      className="absolute pointer-events-none rounded-full bg-gradient-to-br from-[#5eead4]/35 via-[#14b8a6]/45 to-transparent mix-blend-screen"
      style={{
        left: `${config.left}%`,
        top: `${config.top}%`,
        width: config.size,
        height: config.size,
        filter: `blur(${config.blur}px)`,
        opacity: config.opacity,
        x: parallaxX,
        y: parallaxY
      }}
      animate={{ y: [0, -config.floatDistance, 0] }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay: config.delay
      }}
    />
  );
});

TimelineParticle.displayName = 'TimelineParticle';

const JourneySection: FC<JourneySectionProps> = ({ journey }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothPointerX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.4 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.4 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end start']
  });

  const lineGlow = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const haloScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.05]);
  const haloOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.35]);

  const particles = useMemo<ParticleConfig[]>(
    () => [
      { left: 14, top: 8, size: 220, blur: 55, floatDistance: 36, duration: 16, delay: 0, parallaxIntensity: 32, opacity: 0.6 },
      { left: 78, top: 14, size: 160, blur: 40, floatDistance: 28, duration: 18, delay: 1.8, parallaxIntensity: 26, opacity: 0.5 },
      { left: 28, top: 42, size: 180, blur: 48, floatDistance: 34, duration: 20, delay: 0.6, parallaxIntensity: 30, opacity: 0.55 },
      { left: 66, top: 54, size: 210, blur: 60, floatDistance: 46, duration: 22, delay: 1.2, parallaxIntensity: 28, opacity: 0.45 },
      { left: 18, top: 72, size: 190, blur: 52, floatDistance: 38, duration: 19, delay: 2.4, parallaxIntensity: 34, opacity: 0.5 },
      { left: 74, top: 82, size: 200, blur: 58, floatDistance: 40, duration: 24, delay: 1.4, parallaxIntensity: 24, opacity: 0.6 }
    ],
    []
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) {
        return;
      }

      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;

      pointerX.set(Math.min(Math.max(relativeX, 0), 1));
      pointerY.set(Math.min(Math.max(relativeY, 0), 1));
    },
    [pointerX, pointerY]
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }, [pointerX, pointerY]);

  return (
    <motion.section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden py-24 md:py-32"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(20,184,166,0.16),_transparent_50%)]" />

      <motion.div
        className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[60%] w-[40%] rounded-full bg-gradient-to-r from-[#14b8a6]/15 via-[#5eead4]/10 to-transparent blur-3xl"
        style={{ scale: haloScale, opacity: haloOpacity }}
      />

      <div className="pointer-events-none absolute inset-0">
        {particles.map((config, index) => (
          <TimelineParticle key={index} config={config} pointerX={smoothPointerX} pointerY={smoothPointerY} />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
        <div className="relative text-center">
          <motion.h2
            className="bg-gradient-to-r from-[#ccfbf1] via-[#5eead4] to-[#14b8a6] bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            viewport={{ once: true, amount: 0.6 }}
          >
            My Digital Journey
          </motion.h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[#b0f5e9]/80 md:text-lg">
            A curated timeline of pivotal chapters—each milestone harmonised across craft, community, and cutting-edge creation.
          </p>
        </div>

        <div className="relative mt-20 space-y-24 md:space-y-28">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 rounded-full bg-gradient-to-b from-[#5eead4]/80 via-[#2dd4bf]/30 to-[#0f766e]/0 md:block"
            style={{ opacity: lineGlow }}
          >
            <motion.div
              className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#5eead4]/35 via-transparent to-transparent blur-3xl"
              style={{ opacity: lineGlow }}
              animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {journey.map((step, index) => {
            const isLeftAligned = index % 2 === 0;

            return (
              <motion.article
                key={`${step.year}-${step.title}`}
                className={clsx(
                  'relative mx-auto w-full md:w-[48%]',
                  isLeftAligned ? 'md:pr-12 md:text-right md:mr-auto' : 'md:pl-12 md:text-left md:ml-auto'
                )}
                initial={{ opacity: 0, x: isLeftAligned ? -60 : 60, y: 40 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 * index }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.span
                  className={clsx(
                    'pointer-events-none absolute top-1/2 hidden h-0.5 w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[#5eead4] to-transparent md:block',
                    isLeftAligned ? 'right-[-72px]' : 'left-[-72px]'
                  )}
                  animate={{ opacity: [0.25, 0.75, 0.25] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                />

                <motion.span
                  className={clsx(
                    'pointer-events-none absolute top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full border border-[#5eead4]/70 bg-[#0f766e]/60 shadow-[0_0_30px_rgba(45,212,191,0.6)] md:block',
                    isLeftAligned ? 'right-[-98px]' : 'left-[-98px]'
                  )}
                  animate={{ scale: [1, 1.2, 1], boxShadow: [
                    '0 0 22px rgba(94,234,212,0.55)',
                    '0 0 36px rgba(45,212,191,0.85)',
                    '0 0 22px rgba(94,234,212,0.55)'
                  ] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                />

                <div className="group relative overflow-hidden rounded-3xl border border-[#134e4a]/60 bg-[#021f1c]/80 p-8 shadow-[0_30px_80px_rgba(13,148,136,0.25)] backdrop-blur-xl">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0f766e]/35 via-transparent to-transparent opacity-70" />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#5eead4]/70 to-transparent" />
                  <div className="relative">
                    <div className="text-sm uppercase tracking-[0.3em] text-[#5eead4]/80">{step.year}</div>
                    <h3 className="mt-3 text-2xl font-semibold text-[#e6fffb]">{step.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-[#b6f5ea]/80">{step.description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-24 rounded-3xl border border-[#134e4a]/50 bg-gradient-to-r from-[#022c29]/85 via-[#043532]/80 to-[#022321]/85 p-10 text-center shadow-[0_30px_90px_rgba(13,148,136,0.25)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-[#d1faf4]">Builder Philosophy</h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-[#b6f5ea]/80">
            "We build boldly, break fearlessly, and aim for horizons yet unseen."
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default memo(JourneySection);
