import { FC, useEffect, useMemo, useState } from 'react';

interface Segment {
  label: string;
  value: number;
  accent: string;
  caption: string;
  displayValue: string;
}

const followerSegments: Segment[] = [
  {
    label: 'LinkedIn',
    value: 2000,
    accent: '#0EF9D7',
    caption: '2k+ strategic followers leaning into B2B product vision.',
    displayValue: '2k+',
  },
  {
    label: 'Facebook',
    value: 3000,
    accent: '#FF8A65',
    caption: '3k+ community builders engaged in launch stories.',
    displayValue: '3k+',
  },
  {
    label: 'Instagram',
    value: 554,
    accent: '#7C4DFF',
    caption: '554 design-obsessed followers for daily visual riffs.',
    displayValue: '554',
  },
];

const instagramDeepDive = [
  { label: 'Followers', value: '554' },
  { label: 'Following', value: '908' },
  { label: 'Posts', value: '48' },
];

const radius = 76;
const circumference = 2 * Math.PI * radius;

const SocialPresenceShowcase: FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const totalValue = useMemo(
    () => followerSegments.reduce((total, segment) => total + segment.value, 0),
    [],
  );
  const totalLabel = useMemo(() => `${(totalValue / 1000).toFixed(1)}k+`, [totalValue]);

  let accumulatedValue = 0;

  return (
    <section className="mt-8 md:mt-12">
      <div className="rounded-2xl border border-[#2f6f68]/40 bg-[#042621]/80 p-6 md:p-8 shadow-[0_28px_65px_rgba(0,150,136,0.22)] backdrop-blur-xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="lg:w-1/2 space-y-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#80f0df]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0EF9D7]"></span>
              Social Proof / Top 100 Designer Playbook
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#e7fff9] leading-snug">
              A meticulously nurtured audience that mirrors top-tier design momentum.
            </h2>
            <p className="text-sm md:text-base text-[#b6efe4] max-w-xl">
              Every connection is the outcome of a curated conversation—carefully aligned with product intuition, growth rituals,
              and the brand language of a top 100 designer.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {followerSegments.map((segment) => (
                <div
                  key={segment.label}
                  className="rounded-xl border border-[#154d45]/60 bg-[#06302a]/70 p-4 text-left shadow-[0_16px_32px_rgba(0,150,136,0.18)]"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[#7ce7d8] mb-1">{segment.label}</p>
                  <p className="text-xl font-semibold text-[#f2fff9]">{segment.displayValue}</p>
                  <p className="text-xs text-[#a8e5da] leading-relaxed">{segment.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-6 lg:flex-row lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[#0ef9d7]/10 blur-2xl"></div>
              <svg
                viewBox="0 0 220 220"
                className="h-48 w-48 md:h-56 md:w-56"
                aria-hidden="true"
              >
                <circle cx="110" cy="110" r={radius} fill="none" stroke="#0F3D37" strokeWidth="18" />
                {followerSegments.map((segment, index) => {
                  const startValue = accumulatedValue;
                  accumulatedValue += segment.value;
                  const segmentRatio = segment.value / totalValue;
                  const startRatio = startValue / totalValue;
                  const dashArray = `${segmentRatio * circumference} ${circumference}`;
                  const dashOffset = circumference - startRatio * circumference;

                  return (
                    <circle
                      key={segment.label}
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="transparent"
                      stroke={segment.accent}
                      strokeWidth="18"
                      strokeDasharray={dashArray}
                      strokeDashoffset={animate ? dashOffset : circumference}
                      strokeLinecap="round"
                      transform="rotate(-90 110 110)"
                      style={{ transition: `stroke-dashoffset 1.4s ease-out ${index * 0.25}s` }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-[0.3em] text-[#80f0df]">Network</span>
                <span className="text-3xl font-semibold text-[#f5fff9]">{totalLabel}</span>
                <span className="text-xs text-[#a8e5da]">human-first advocates</span>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-[#154d45]/60 bg-[#041f1c]/80 p-5 shadow-[0_18px_38px_rgba(0,150,136,0.2)]">
              <h3 className="text-sm uppercase tracking-[0.25em] text-[#7ce7d8] mb-3">Instagram Rituals</h3>
              <div className="space-y-3">
                {instagramDeepDive.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between gap-6">
                    <span className="text-xs text-[#9adcd1] uppercase tracking-[0.18em]">{metric.label}</span>
                    <span className="text-lg font-semibold text-[#e6fff7]">{metric.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 max-w-[16rem] text-xs text-[#8ad7c8]">
                554 followers, 908 following, 48 posts—every touchpoint built through personal conversations alone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPresenceShowcase;
