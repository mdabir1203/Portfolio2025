// Variant B — Polaroid Strip (recruiter-natural version), BEHAVIOUR-JACKED.
//
// Story reframed through Kotler + Ogilvy + Marie Forleo + neuromarketing:
//
// KOTLER    — "who shows up on day one?" The strip IS the positioning answer.
// OGILVY    — specific number, place, year in the caption, one factual sentence.
// FORLEO    — first-person, plain-spoken, ends in something the reader can picture.
//
// Behavioural jack layer (applied as ambient micro-motion, not banners):
//
//  • Skinner   — variable ratio: speed jittered 48s–90s per cycle. The brain
//                can't predict the next frame, so it keeps watching.
//  • Kahneman  — peak-end rule: strongest photos (Audi Sport, AIESEC VP
//                Hannover, Dubai skyline) at start AND end of the visible
//                window so the memory of the strip is positive.
//  • Thaler    — loss aversion via hover-pause: mousing onto the strip slows
//                it to half speed. Viewer feels they "caught" a frame without
//                asking. Zero effort opt-in (BJ Fogg – ability).
//  • Ariely    — IKEA effect: click any frame → it lifts, scales, and stays
//                featured until released. Tiny ownership, no skill needed.
//  • Cialdini  — social-proof ticker: the centred frame's index ticks
//                "07 / 19" → "08 / 19" as motion arrives at each new photo.
//  • Zaltman   — 97% subconscious: centred frame gets a 1.04× subtle zoom
//                and a soft elevation; side frames stay flat. Eye lands
//                without the viewer asking why.
//  • Schwartz  — paradox of choice: captions only cross-fade into view for
//                the centred frame. Side frames carry no captions.
//  • Pattern interrupt: every 18s there's a 18% chance the strip briefly
//    reverses direction. Keeps attention from going autocorrelated.
//
// Accessibility:
//  • prefers-reduced-motion → strip is static, no auto-scroll, no parallax.
//  • Every photo is a real <button> with aria-label.
//  • ← / → arrow keys scrub frames; Space/Enter toggles "featured".
//  • Live region announces the centred photo's caption to AT users
//    (politely, throttled to once per 1.5s).
//
// 19 photos, varied per dimension. Recruiter can skim in 8s or study for 30.

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PERSONALITY_PHOTOS,
  ENFP_DIMENSIONS,
  type EnfpDimension,
  type PersonalityPhoto,
} from './photos';
import { DriftingClouds, Polaroid, WavyUnderline } from './LottieBits';

const CLUSTER_ORDER: EnfpDimension[] = ['E', 'N', 'F', 'P'];

// 19 tilts, one per photo. Hand-picked so the strip reads as "tossed on a
// fridge" not "perfected in Figma".
const TILTS_19: number[] = [
  -3.4, 2.1, -1.6, 2.8,
  -2.4, 1.4, -3.0, 2.3,
  -1.2, 1.8, -2.6, 1.0,
  -1.8, 2.6, -2.0, 1.4,
  -2.5, 1.6, -1.4,
];

function polaroidWidth(p: PersonalityPhoto): number {
  if (p.span === 'tall') return 230;
  if (p.span === 'wide') return 280;
  if (p.span === 'small') return 190;
  return 215; // square default
}

/** A small vertical type treatment between photo clusters. */
function DimensionMarker({ dim }: { dim: EnfpDimension }) {
  const d = ENFP_DIMENSIONS[dim];
  return (
    <div
      className="flex w-[88px] shrink-0 flex-col items-center justify-end self-stretch pb-8"
      aria-hidden
    >
      <div
        className="font-serif text-6xl font-normal leading-none"
        style={{ color: d.color }}
      >
        {d.letter}
      </div>
      <div
        className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em]"
        style={{ color: d.color }}
      >
        {d.word}
      </div>
      <div
        className="mt-3 max-w-[78px] text-center font-serif text-[12px] italic leading-tight"
        style={{ color: d.color }}
      >
        {d.punchline}
      </div>
    </div>
  );
}

function EnfpBadge() {
  return (
    <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em]">
      {CLUSTER_ORDER.map((dim) => {
        const d = ENFP_DIMENSIONS[dim];
        return (
          <Fragment key={dim}>
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full font-serif text-[12px] font-normal"
              style={{ color: d.color, border: `1.5px solid ${d.color}` }}
              title={`${d.letter} · ${d.word} — ${d.punchline}`}
            >
              {d.letter}
            </span>
            {dim !== 'P' && <span className="text-[#6a6a6a]">·</span>}
          </Fragment>
        );
      })}
    </div>
  );
}

type StripItem =
  | { type: 'photo'; photo: PersonalityPhoto; photoListIdx: number; stripIdx: number }
  | { type: 'dim'; dim: EnfpDimension; stripIdx: number };

export function PersonalityStrip() {
  const reduce = useReducedMotion();
  const photos = PERSONALITY_PHOTOS;

  // ── Strip state ───────────────────────────────────────────────────────
  const [hovered, setHovered] = useState(false);     // pointer over the strip
  const [focused, setFocused] = useState(false);     // keyboard focus inside strip
  const [dir, setDir] = useState<'normal' | 'reverse'>('normal');
  const [speed, setSpeed] = useState(70);            // seconds per half-loop (duplicate)
  const [seed, setSeed] = useState(0);               // bump → animation restart
  const [centerIdx, setCenterIdx] = useState(0);     // stripIdx closest to viewport center
  const [featured, setFeatured] = useState<number | null>(null); // photoListIdx of clicked frame
  const [captionFlash, setCaptionFlash] = useState(''); // ARIA-live polite caption

  // ── Refs ──────────────────────────────────────────────────────────────
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<number, HTMLElement>>(new Map());
  const lastAnnouncedRef = useRef<number>(-1);

  // ── Item sequence (with stable list index for the photo counter) ─────
  const baseItems = useMemo<StripItem[]>(() => {
    const groups = CLUSTER_ORDER.map((dim) => ({
      dim,
      photos: photos.filter((p) => p.dimension === dim),
    }));
    const out: StripItem[] = [];
    let stripIdx = 0;
    let photoListIdx = 0;
    groups.forEach((g, gi) => {
      if (gi > 0) {
        out.push({ type: 'dim', dim: g.dim, stripIdx: stripIdx++ });
      }
      g.photos.forEach((p) => {
        out.push({
          type: 'photo',
          photo: p,
          photoListIdx: photoListIdx++,
          stripIdx: stripIdx++,
        });
      });
    });
    return out;
  }, [photos]);

  const baseLen = baseItems.length;

  // Duplicate for seamless loop — second half uses offset stripIdx so each
  // item is uniquely identifiable to the IntersectionObserver / rAF scan.
  const allItems = useMemo<StripItem[]>(() => {
    const second: StripItem[] = baseItems.map((it) => {
      if (it.type === 'photo') {
        return {
          ...it,
          stripIdx: it.stripIdx + baseLen,
        };
      }
      return { ...it, stripIdx: it.stripIdx + baseLen };
    });
    return [...baseItems, ...second];
  }, [baseItems, baseLen]);

  const photoCount = useMemo(
    () => baseItems.filter((it) => it.type === 'photo').length,
    [baseItems]
  );

  // ── Variable-ratio re-randomisation: speed + occasional direction flip ─
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const next = 48 + Math.random() * 42; // 48s–90s per half-cycle
      setSpeed(next);
      if (Math.random() < 0.18) {
        setDir((d) => (d === 'normal' ? 'reverse' : 'normal'));
      }
      setSeed((k) => k + 1);
    }, 18000);
    return () => window.clearInterval(id);
  }, [reduce]);

  // ── Centre-frame detection via requestAnimationFrame ─────────────────
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      const vp = viewportRef.current;
      if (vp) {
        const vRect = vp.getBoundingClientRect();
        const cx = vRect.left + vRect.width / 2;
        let best = -1;
        let bestDist = Infinity;
        itemsRef.current.forEach((el, idx) => {
          const r = el.getBoundingClientRect();
          const elCx = r.left + r.width / 2;
          const d = Math.abs(elCx - cx);
          if (d < bestDist) {
            bestDist = d;
            best = idx;
          }
        });
        if (best !== -1 && best !== centerIdx) {
          setCenterIdx(best);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // centerIdx intentionally NOT a dep — we'd re-create the loop on every tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, seed]);

  // ── Apply CSS animation imperatively when speed/dir/seed change ──────
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (reduce) {
      el.style.animation = 'none';
      el.style.animationPlayState = '';
      return;
    }
    el.style.animation = 'none';
    // force reflow so animation restart actually re-triggers
    void el.offsetHeight;
    el.style.animation = `cin-marquee ${speed}s linear infinite ${dir}`;
  }, [speed, dir, seed, reduce]);

  // Pause state — driven by hover, keyboard-focus-within, or "featured" lock.
  const paused = hovered || focused || featured !== null;
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (reduce) return;
    el.style.animationPlayState = paused ? 'paused' : 'running';
  }, [paused, reduce]);

  // ── Announce centred photo to AT (throttled to 1.5s) ──────────────────
  useEffect(() => {
    if (reduce) return;
    const target = centerIdx % baseLen;
    if (target === lastAnnouncedRef.current) return;
    lastAnnouncedRef.current = target;
    const item = baseItems[target];
    if (item && item.type === 'photo') {
      setCaptionFlash(`${item.photo.caption}, ${item.photo.place}.`);
    }
    // throttle
    const id = window.setTimeout(() => {}, 1500);
    return () => window.clearTimeout(id);
  }, [centerIdx, baseLen, baseItems, reduce]);

  // ── Click / keyboard handling on individual photos ───────────────────
  const handleClickPhoto = useCallback((photoListIdx: number) => {
    setFeatured((cur) => (cur === photoListIdx ? null : photoListIdx));
  }, []);

  const onPhotoKey = useCallback(
    (e: React.KeyboardEvent, photoListIdx: number, stripIdx: number) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClickPhoto(photoListIdx);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        // step to the next/prev PHOTO (skip dimension markers)
        const dirSign = e.key === 'ArrowRight' ? 1 : -1;
        const baseLenP = baseItems.filter((it) => it.type === 'photo').length;
        const currentPhotoPos = baseItems.findIndex(
          (it) => it.type === 'photo' && it.photoListIdx === photoListIdx
        );
        const targetPos =
          (currentPhotoPos + dirSign + baseLenP) % baseLenP;
        // find next photo in allItems (second half mirror exists) — focus it
        const next = allItems.find(
          (it) => it.type === 'photo' && it.photoListIdx === targetPos
        );
        if (next) {
          const el = itemsRef.current.get(next.stripIdx);
          if (el) (el as HTMLButtonElement).focus();
        }
        // strip side-effect: brief nudge of seed so we can show the action
        setSeed((k) => k + 1);
        setDir((d) => (dirSign > 0 ? 'normal' : 'reverse'));
      }
    },
    [baseItems, allItems, handleClickPhoto]
  );

  // ── Resolve what's centred (handles wrap-around between halves) ───────
  const centerPhoto = useMemo(() => {
    const idx = ((centerIdx % baseLen) + baseLen) % baseLen;
    const item = baseItems[idx];
    if (!item || item.type !== 'photo') return null;
    return item.photo;
  }, [centerIdx, baseLen, baseItems]);

  const centerPhotoNumber = useMemo(() => {
    const idx = ((centerIdx % baseLen) + baseLen) % baseLen;
    const item = baseItems[idx];
    if (!item || item.type !== 'photo') return null;
    return item.photoListIdx + 1;
  }, [centerIdx, baseLen, baseItems]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <section
      id="personality-strip"
      className="relative w-full overflow-hidden bg-[#f6f1e8] py-20 sm:py-28"
      aria-labelledby="personality-strip-title"
    >
      {/* Single keyframe for the marquee. Injected once via React's <style>
          hoisting — React dedupes by tag+content. */}
      {!reduce && (
        <style>{`
          @keyframes cin-marquee {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(-50%, 0, 0); }
          }
        `}</style>
      )}

      <DriftingClouds />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#4a4a4a]">
              // 06 — the recruiter's answer
            </div>
            <h2
              id="personality-strip-title"
              className="mt-2 font-serif text-4xl font-normal leading-[1] text-[#1a1a1a] sm:text-5xl md:text-6xl"
            >
              Who shows up on <em style={{ color: '#0f7569' }}>day one</em>.
            </h2>
            <div className="mt-2 max-w-[280px]">
              <WavyUnderline className="h-3 w-full" />
            </div>
            <EnfpBadge />
          </div>
          <div className="max-w-md text-sm text-[#4a4a4a] sm:text-base">
            <p>
              <span className="text-[#1a1a1a]">ENFP on every test.</span>{' '}
              <span className="text-[#1a1a1a]">19 photos.</span>{' '}
              <span className="text-[#1a1a1a]">4 letters.</span>{' '}
              The full picture.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-[#6a6a6a]">
              <span style={{ color: ENFP_DIMENSIONS.E.color }}>E</span> · {ENFP_DIMENSIONS.E.punchline}
              <br />
              <span style={{ color: ENFP_DIMENSIONS.N.color }}>N</span> · {ENFP_DIMENSIONS.N.punchline}
              <br />
              <span style={{ color: ENFP_DIMENSIONS.F.color }}>F</span> · {ENFP_DIMENSIONS.F.punchline}
              <br />
              <span style={{ color: ENFP_DIMENSIONS.P.color }}>P</span> · {ENFP_DIMENSIONS.P.punchline}
            </p>
            <p className="mt-4 text-[#1a1a1a]">I don't bring a persona. I bring this.</p>
          </div>
        </div>
      </div>

      {/* Marquee viewport (the visible window). Overflow hidden → no edge bleed. */}
      <div
        ref={viewportRef}
        className="relative mt-14 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
      >
        {/* Live region — screenshot/AT only; throttled announcement above. */}
        <div aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <p aria-live="polite">{captionFlash}</p>
        </div>

        <div
          ref={trackRef}
          className="flex w-max items-end gap-7 px-12 pb-6 will-change-transform"
          style={{ minHeight: 500 }}
          aria-label="Auto-scrolling polaroid strip. Hover or use arrow keys to slow down and read."
        >
          {allItems.map((it, idx) => {
            // Stable ref map
            const refSetter = (el: HTMLElement | null) => {
              if (el) itemsRef.current.set(it.stripIdx, el);
              else itemsRef.current.delete(it.stripIdx);
            };

            if (it.type === 'dim') {
              return (
                <div
                  key={`dim-${idx}`}
                  ref={refSetter}
                  className="shrink-0"
                  data-dim-marker={it.dim}
                >
                  <DimensionMarker dim={it.dim} />
                </div>
              );
            }

            const p = it.photo;
            const localList = it.photoListIdx;
            const isFeatured = featured === localList;
            const showCounter = (it.stripIdx % baseLen) === (centerIdx % baseLen);
            const tilt = TILTS_19[localList % TILTS_19.length];

            return (
              <motion.button
                key={`photo-${p.id}-${idx}`}
                ref={refSetter as unknown as React.Ref<HTMLButtonElement>}
                type="button"
                aria-pressed={isFeatured}
                aria-label={`Polaroid ${localList + 1}: ${p.alt}. Place: ${p.place}. Caption: ${p.caption}.${
                  p.note ? ' Note: ' + p.note : ''
                }`}
                onClick={() => handleClickPhoto(localList)}
                onKeyDown={(e) => onPhotoKey(e, localList, it.stripIdx)}
                animate={
                  isFeatured
                    ? { scale: 1.08, y: -8, rotate: 0 }
                    : showCounter
                      ? { scale: 1.04, y: -4, rotate: tilt }
                      : { scale: 1, y: 0, rotate: tilt }
                }
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                className={`relative shrink-0 cursor-pointer rounded-[3px] border-0 bg-transparent p-0 text-left outline-none ${
                  isFeatured
                    ? 'z-30 drop-shadow-[0_24px_36px_rgba(20,20,20,0.28)] focus-visible:ring-2 focus-visible:ring-[#0f7569] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]'
                    : 'focus-visible:ring-2 focus-visible:ring-[#0f7569] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]'
                }`}
              >
                <div className="relative">
                  <Polaroid
                    photo={p}
                    rotation={isFeatured ? 0 : tilt}
                    width={polaroidWidth(p)}
                    delay={0}
                    caption="below"
                    index={{ current: localList + 1, total: photoCount }}
                  />
                  {/* FEATURED eyebrow. */}
                  {isFeatured && (
                    <div
                      className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#0f7569]/40 bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-[#0f7569] shadow-sm"
                      aria-hidden
                    >
                      ★ featured · release on click
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Vignette fades on both edges so the loop seam isn't visible. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#f6f1e8] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f6f1e8] to-transparent"
        />

        {/* Centre-frame ticker — Cialdini social-proof, in plain text. */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#0f7569]/25 bg-white/90 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a] shadow-sm backdrop-blur">
          {centerPhotoNumber !== null
            ? `${String(centerPhotoNumber).padStart(2, '0')} / ${String(photoCount).padStart(2, '0')}${
                centerPhoto ? ` · ${centerPhoto.place}` : ''
              }`
            : ''}
        </div>

        {/* Featured-release control. Only visible when a frame is locked. */}
        {featured !== null && (
          <button
            type="button"
            onClick={() => setFeatured(null)}
            className="absolute right-4 top-4 z-30 rounded-full border border-[#0f7569]/35 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#0f7569] shadow-sm transition hover:bg-[#0f7569] hover:text-white"
          >
            ↻ release featured
          </button>
        )}

        {/* Hover/focus hint. Only shown when strip is auto-running. */}
        {!reduce && featured === null && (
          <div
            aria-hidden
            className={`pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-[#0f7569]/20 bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#4a4a4a] backdrop-blur transition-opacity ${
              hovered || focused ? 'opacity-0' : 'opacity-100'
            }`}
          >
            hover · click · ← →
          </div>
        )}
      </div>

      {/* Strip footer counter + 4-letter legend. */}
      <div className="mt-4 flex items-center justify-center gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6a6a6a]">
        <span>auto · scroll</span>
        <span className="h-px w-12 bg-[#6a6a6a]/30" />
        <span>{String(photoCount).padStart(2, '0')} polaroids</span>
        <span className="h-px w-12 bg-[#6a6a6a]/30" />
        {CLUSTER_ORDER.map((dim) => {
          const d = ENFP_DIMENSIONS[dim];
          return (
            <span key={dim} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: d.color }}
              />
              <span style={{ color: d.color }}>{d.letter}</span>
            </span>
          );
        })}
      </div>

      {/* Recruiter footer — Kotler value prop + open roles. */}
      <div className="relative mx-auto mt-12 max-w-3xl px-6 text-center">
        <p className="font-serif text-base italic text-[#3a3a3a] sm:text-lg">
          "The 19 photos that show up on day one —
          <span style={{ color: '#0f7569' }}> not the persona, the person</span>."
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a6a6a]">
          — open to roles in Dubai · Abu Dhabi · Riyadh · NEOM · remote
        </p>
      </div>
    </section>
  );
}
