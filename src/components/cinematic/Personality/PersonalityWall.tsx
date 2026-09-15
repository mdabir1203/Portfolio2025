// Variant A — Photo Wall
// A dedicated "off the clock" chapter between the case study and
// reviews sections. Bento grid, Lottie-style motion, captions
// written in your voice. Reads like a coffee-table book spread.

import { motion, useReducedMotion } from 'framer-motion';
import { PERSONALITY_PHOTOS } from './photos';
import { PassportStamp, WavyUnderline } from './LottieBits';

export function PersonalityWall() {
  const reduce = useReducedMotion();
  const photos = PERSONALITY_PHOTOS;

  // Pull specific items into specific slots to keep the bento shape intentional.
  const me = photos[0];
  const skyline = photos[2];
  const marina = photos[3];
  const oldTown = photos[4];
  const coffee = photos[5];
  const aerial = photos[6];
  const creek = photos[7];
  const profile = photos[1];

  return (
    <section
      id="personality-wall"
      className="relative w-full overflow-hidden bg-[#f6f1e8] py-24 sm:py-32"
      aria-labelledby="personality-wall-title"
    >
      {/* Chapter header — matches the editorial scrapbook language. */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#4a4a4a]">
            // 06 — off the clock
          </span>
          <div className="h-px flex-1 bg-[#1a1a1a]/15" />
        </div>
        <h2
          id="personality-wall-title"
          className="mt-6 font-serif text-5xl font-normal leading-[0.95] text-[#1a1a1a] sm:text-6xl md:text-7xl"
        >
          The chapters <em className="not-italic" style={{ color: '#0f7569' }}>I don't</em> bill for.
        </h2>
        <div className="mt-3 max-w-prose text-[#3a3a3a]">
          <p className="text-base leading-relaxed sm:text-lg">
            Eight photos from the side of the work that no case study captures. The
            <span style={{ color: '#0f7569' }}> 7-million-city</span> I walk through, the
            coffee I treat like infrastructure, and the one face I can reliably put
            in the top-left corner.
          </p>
        </div>
        <div className="mt-2 max-w-[220px]">
          <WavyUnderline className="h-3 w-full" />
        </div>
      </div>

      {/* Bento grid. Desktop = 12-col, mobile = stacked. */}
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 px-6 sm:gap-5 md:grid-cols-12 md:gap-6">
        {/* Slot 1: me (tall, 2 rows) */}
        <BentoTile photo={me} className="col-span-2 md:col-span-4 md:row-span-2" tilt={-1.4} stamp>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/80">
            this is me
          </div>
          <div className="font-serif text-2xl italic text-white sm:text-3xl">
            {me.caption}
          </div>
          <div className="mt-1 text-sm text-white/80">{me.note}</div>
        </BentoTile>

        {/* Slot 2: skyline (tall) */}
        <BentoTile photo={skyline} className="col-span-1 md:col-span-3 md:row-span-2" tilt={0.8} />

        {/* Slot 3: marina (wide) */}
        <BentoTile photo={marina} className="col-span-1 md:col-span-5" tilt={-0.6} />

        {/* Slot 4: old town (square) */}
        <BentoTile photo={oldTown} className="col-span-1 md:col-span-3" tilt={1.1} />

        {/* Slot 5: coffee (small) */}
        <BentoTile photo={coffee} className="col-span-1 md:col-span-3" tilt={-0.9}>
          <div className="font-serif text-lg italic text-white">{coffee.caption}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
            {coffee.place}
          </div>
        </BentoTile>

        {/* Slot 6: creek (wide) */}
        <BentoTile photo={creek} className="col-span-2 md:col-span-6" tilt={0.4} />

        {/* Slot 7: profile (square) */}
        <BentoTile photo={profile} className="col-span-1 md:col-span-3" tilt={-1.2}>
          <div className="font-serif text-base italic text-white">{profile.caption}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/80">
            {profile.place}
          </div>
        </BentoTile>

        {/* Slot 8: aerial (tall) */}
        <BentoTile photo={aerial} className="col-span-1 md:col-span-3 md:row-span-1" tilt={0.7} />
      </div>

      {/* Footer ribbon — short, hand-written closing line. */}
      <motion.div
        className="mx-auto mt-16 max-w-3xl px-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6 }}
      >
        <div className="font-serif text-xl italic text-[#3a3a3a] sm:text-2xl">
          "The city teaches you that <span style={{ color: '#0f7569' }}>seven million</span> people
          are doing something you haven't thought of yet."
        </div>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a6a]">
          — a thought, walking back from the marina
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bento tile primitive — image with optional caption overlay.         */
/* ------------------------------------------------------------------ */
type BentoProps = {
  photo: typeof PERSONALITY_PHOTOS[number];
  className?: string;
  tilt?: number;
  stamp?: boolean;
  children?: React.ReactNode;
};

function BentoTile({ photo, className = '', tilt = 0, stamp, children }: BentoProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-md border border-black/5 bg-white shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)] ${className}`}
      style={{ transformOrigin: '50% 50%' }}
      initial={{ opacity: 0.001, y: 18, rotate: tilt * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.05, margin: '0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.25 } }}
    >
      <div className="absolute inset-0">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      </div>
      {/* Always-on top-right place pill */}
      <div className="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-black/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        {photo.place}
      </div>
      {/* Optional passport stamp on the "me" tile. */}
      {stamp && (
        <div className="absolute -right-4 -top-4 z-10 h-24 w-24 sm:h-28 sm:w-28">
          <PassportStamp className="h-full w-full" />
        </div>
      )}
      {/* Bottom caption slot — shows child or photo's own note. */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white sm:p-5">
        {children ?? (
          <>
            <div className="font-serif text-xl italic sm:text-2xl">{photo.caption}</div>
            {photo.note && <div className="mt-0.5 text-xs text-white/80 sm:text-sm">{photo.note}</div>}
          </>
        )}
      </div>
    </motion.div>
  );
}
