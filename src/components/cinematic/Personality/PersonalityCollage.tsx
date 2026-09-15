// Variant C — About Collage
// Replace the existing About / identity card with a 2-column layout:
// bio paragraph left, photo collage right. Magazine-contributor feel.

import { motion, useReducedMotion } from 'framer-motion';
import { PERSONALITY_PHOTOS } from './photos';
import { WavyUnderline } from './LottieBits';

export function PersonalityCollage() {
  const reduce = useReducedMotion();
  const me = PERSONALITY_PHOTOS[0];
  const skyline = PERSONALITY_PHOTOS[2];
  const oldTown = PERSONALITY_PHOTOS[4];
  const coffee = PERSONALITY_PHOTOS[5];
  const profile = PERSONALITY_PHOTOS[1];

  return (
    <section
      id="personality-collage"
      className="relative w-full overflow-hidden bg-[#f6f1e8] py-24 sm:py-32"
      aria-labelledby="personality-collage-title"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16">
        {/* Left — bio */}
        <div className="md:col-span-5">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#4a4a4a]">
            // 06 — the person
          </div>
          <h2
            id="personality-collage-title"
            className="mt-3 font-serif text-5xl font-normal leading-[0.98] text-[#1a1a1a] sm:text-6xl"
          >
            <span style={{ color: '#0f7569' }}>One</span> person.
            <br />Seven million <em>neighbors</em>.
          </h2>
          <div className="mt-3 max-w-[220px]">
            <WavyUnderline className="h-3 w-full" />
          </div>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#3a3a3a] sm:text-lg">
            <p>
              I'm <strong className="font-semibold text-[#1a1a1a]">Mohammad Abir Abbas</strong>. I deploy
              AI workflows that ship to GCC production. But the city I live in is the
              reason I write the code the way I do.
            </p>
            <p>
              <span className="text-[#1a1a1a]">Dubai</span> is a place that ships. The buildings
              keep climbing, the visa queues keep moving, the dhows still cross the creek
              at 9pm. I try to bring that <em>just-build-it</em> energy to every project
              I touch.
            </p>
            <p>
              I run on coffee #2, an unreasonable opinion about IDEs, and the occasional
              long walk in the Marina when the day won't settle.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {['AI Architect', 'Dubai · UAE', 'Q3 2026 available', 'UAE Company Visa'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#1a1a1a]/15 bg-white/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1a1a1a]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — photo collage */}
        <div className="relative md:col-span-7">
          <div className="relative mx-auto h-[640px] max-w-[640px]">
            <CollageTile photo={me} className="absolute left-0 top-0 w-[58%]" tilt={-2.4} delay={0.1} z={30} />
            <CollageTile photo={skyline} className="absolute right-0 top-0 w-[55%]" tilt={2.1} delay={0.25} z={20} />
            <CollageTile photo={oldTown} className="absolute left-[8%] top-[36%] w-[44%]" tilt={-1.6} delay={0.4} z={40} />
            <CollageTile photo={coffee} className="absolute right-[5%] top-[42%] w-[40%]" tilt={1.4} delay={0.55} z={35} />
            <CollageTile photo={profile} className="absolute left-[20%] bottom-0 w-[50%]" tilt={-0.8} delay={0.7} z={25} />

            {/* Lottie-style hand-drawn frame around the collage */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-6"
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <div
                className="absolute inset-0 rounded-md border-2 border-dashed"
                style={{ borderColor: '#0f7569', opacity: 0.25 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollageTile({
  photo,
  className = '',
  tilt = 0,
  delay = 0,
  z = 1,
}: {
  photo: typeof PERSONALITY_PHOTOS[number];
  className?: string;
  tilt?: number;
  delay?: number;
  z?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      className={`overflow-hidden rounded-[2px] border border-black/5 bg-white shadow-[0_22px_48px_-22px_rgba(0,0,0,0.4)] ${className}`}
      style={{ zIndex: z, transformOrigin: '50% 50%' }}
      initial={{ opacity: 0, y: 26, rotate: tilt * 1.5, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={reduce ? undefined : { y: -4, rotate: tilt * 0.5, transition: { duration: 0.3 } }}
    >
      <div className="aspect-[3/4] w-full">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="border-t border-black/5 bg-white px-3 py-2">
        <div className="font-serif text-[13px] italic text-[#1a1a1a]">{photo.caption}</div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-[#4a4a4a]">
          {photo.place}
        </div>
      </figcaption>
    </motion.figure>
  );
}
