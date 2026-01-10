import { FC, useEffect, useId, useMemo, useRef, useState } from 'react';

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

const radius = 85;
const circumference = 2 * Math.PI * radius;

const SocialPresenceShowcase: FC = () => {
  const [animate, setAnimate] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chartTitleId = useId();
  const chartDescId = useId();
  const chartRef = useRef<HTMLDivElement>(null);

  const totalValue = useMemo(
    () => followerSegments.reduce((total, segment) => total + segment.value, 0),
    [],
  );
  const totalLabel = useMemo(() => `${(totalValue / 1000).toFixed(1)}k+`, [totalValue]);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setAnimate(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = chartRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Number counting animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = totalValue / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalValue) {
        setDisplayValue(totalValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, totalValue]);

  let accumulatedValue = 0;

  return (
    <section className="mt-6 sm:mt-8 md:mt-12">
      <div className="rounded-xl sm:rounded-2xl border border-[#3ca99c]/35 bg-[#032520]/90 p-4 sm:p-6 md:p-8 shadow-[0_28px_65px_rgba(0,150,136,0.22)] backdrop-blur-xl relative overflow-hidden">
        {/* Premium background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ef9d7]/5 via-transparent to-[#FF8A65]/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:flex-row lg:items-center">
            <div className="lg:w-1/2 space-y-3 sm:space-y-4">
              <p className="inline-flex items-center gap-2 text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] text-[#c6fff3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0EF9D7]"></span>
                Social Proof / Top 100 Designer Playbook
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#f4fff9] leading-snug">
                A meticulously nurtured audience that mirrors top-tier design momentum.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#eafff9] max-w-xl leading-relaxed">
                Every connection is the outcome of a curated conversation—carefully aligned with product intuition, growth rituals,
                and the brand language of a top 100 designer.
              </p>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                {followerSegments.map((segment, index) => (
                  <div
                    key={segment.label}
                    className="group rounded-xl border border-[#1c5d54]/70 bg-[#083d36]/85 p-4 text-left shadow-[0_16px_32px_rgba(0,150,136,0.18)] backdrop-blur-sm transition-all duration-300 hover:border-[#0ef9d7]/50 hover:shadow-[0_20px_40px_rgba(14,249,215,0.25)] hover:-translate-y-1"
                    style={{
                      animation: isVisible ? 'fade-in-up 0.6s ease-out' : 'none',
                      animationDelay: `${0.8 + index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: segment.accent,
                          boxShadow: `0 0 12px ${segment.accent}, 0 0 24px ${segment.accent}40`,
                          animation: 'pulse-slow 2s ease-in-out infinite',
                        }}
                      />
                      <p className="text-xs uppercase tracking-[0.22em] text-[#c1fff4] font-semibold">{segment.label}</p>
                    </div>
                    <p
                      className="text-2xl font-bold text-[#f2fff9] mb-1 transition-all duration-300 group-hover:scale-105"
                      style={{
                        textShadow: `0 0 20px ${segment.accent}40`,
                      }}
                    >
                      {segment.displayValue}
                    </p>
                    <p className="text-xs text-[#e0fff7] leading-relaxed opacity-90">{segment.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 sm:gap-6 lg:flex-row lg:justify-end">
              <div ref={chartRef} className="relative">
                {/* Premium glow effects */}
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-[#0ef9d7]/20 via-[#00bfa5]/15 to-[#FF8A65]/10 blur-3xl animate-pulse-slow"></div>
                <div className="absolute -inset-4 rounded-full border border-[#0ef9d7]/20 animate-pulse-ring"></div>

                {/* Chart container with premium styling */}
                <div className="relative">
                  <svg
                    viewBox="0 0 220 220"
                    className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-80 lg:w-80 xl:h-96 xl:w-96 drop-shadow-[0_0_50px_rgba(14,249,215,0.4)]"
                    role="img"
                    aria-labelledby={chartTitleId}
                    aria-describedby={chartDescId}
                  >
                    <defs>
                      {/* Premium gradients for each segment */}
                      <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EF9D7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00bfa5" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="facebookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF8A65" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF7043" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C4DFF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#9C27B0" stopOpacity="0.8" />
                      </linearGradient>
                      {/* Glow filter */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <title id={chartTitleId}>Audience distribution across social platforms</title>
                    <desc id={chartDescId}>
                      LinkedIn {followerSegments[0].displayValue}, Facebook {followerSegments[1].displayValue}, Instagram
                      {` ${followerSegments[2].value}`} followers in total {totalLabel} advocates.
                    </desc>

                    {/* Background ring with premium styling */}
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke="rgba(15, 61, 55, 0.5)"
                      strokeWidth="24"
                      className="transition-opacity duration-1000"
                    />

                    {/* Segments with enhanced animations */}
                    {followerSegments.map((segment, index) => {
                      const startValue = accumulatedValue;
                      accumulatedValue += segment.value;
                      const segmentRatio = segment.value / totalValue;
                      const startRatio = startValue / totalValue;
                      const dashArray = `${segmentRatio * circumference} ${circumference}`;
                      const dashOffset = circumference - startRatio * circumference;

                      const gradientId = segment.label === 'LinkedIn' ? 'linkedinGradient'
                        : segment.label === 'Facebook' ? 'facebookGradient'
                          : 'instagramGradient';

                      return (
                        <g key={segment.label}>
                          {/* Glow effect behind segment */}
                          <circle
                            cx="110"
                            cy="110"
                            r={radius}
                            fill="transparent"
                            stroke={segment.accent}
                            strokeWidth="28"
                            strokeDasharray={dashArray}
                            strokeDashoffset={animate ? dashOffset : circumference}
                            strokeLinecap="round"
                            transform="rotate(-90 110 110)"
                            opacity="0.4"
                            filter="url(#glow)"
                            style={{
                              transition: `stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.3}s`,
                              animation: `segment-pulse 3s ease-in-out infinite ${index * 0.5}s`
                            }}
                          />
                          {/* Main segment */}
                          <circle
                            cx="110"
                            cy="110"
                            r={radius}
                            fill="transparent"
                            stroke={`url(#${gradientId})`}
                            strokeWidth="22"
                            strokeDasharray={dashArray}
                            strokeDashoffset={animate ? dashOffset : circumference}
                            strokeLinecap="round"
                            transform="rotate(-90 110 110)"
                            style={{
                              transition: `stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.3}s`,
                            }}
                            className="drop-shadow-[0_0_12px_currentColor]"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Center content with meaningful chart animation */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span
                      className="text-xs uppercase tracking-[0.4em] text-[#c1fff4] font-semibold mb-2 opacity-90"
                      style={{
                        animation: isVisible ? 'fade-in-up 0.6s ease-out' : 'none',
                        animationDelay: '0.2s',
                        animationFillMode: 'both'
                      }}
                    >
                      Network
                    </span>
                    <span
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-[#f5fff9] bg-gradient-to-br from-[#eafffa] via-[#c8fff4] to-[#0EF9D7] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(14,249,215,0.6)]"
                      style={{
                        animation: isVisible ? 'fade-in-scale 0.8s ease-out' : 'none',
                        animationDelay: '0.4s',
                        animationFillMode: 'both',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        textShadow: '0 0 40px rgba(14, 249, 215, 0.5), 0 0 80px rgba(14, 249, 215, 0.3)',
                        lineHeight: '1.1',
                      }}
                    >
                      {isVisible ? `${(displayValue / 1000).toFixed(1)}k+` : '0k+'}
                    </span>

                    {/* Meaningful animated data flow visualization */}
                    {isVisible && (
                      <>
                        {/* Pulsing center glow */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(14, 249, 215, 0.2) 0%, transparent 70%)',
                            animation: 'pulse-center 3s ease-in-out infinite',
                          }}
                        />

                        {/* Animated connection lines from segments to center */}
                        {(() => {
                          let tempAccumulated = 0;
                          return followerSegments.map((segment, index) => {
                            const segmentRatio = segment.value / totalValue;
                            const startRatio = tempAccumulated / totalValue;
                            const midRatio = startRatio + segmentRatio / 2;
                            tempAccumulated += segment.value;

                            const midAngle = midRatio * 360 - 90;
                            const x1 = 110 + Math.cos(midAngle * Math.PI / 180) * radius;
                            const y1 = 110 + Math.sin(midAngle * Math.PI / 180) * radius;

                            return (
                              <svg
                                key={`connection-${segment.label}`}
                                className="absolute inset-0 pointer-events-none"
                                viewBox="0 0 220 220"
                                style={{
                                  animation: `fade-in 1s ease-out ${0.8 + index * 0.2}s both`,
                                }}
                              >
                                <defs>
                                  <linearGradient id={`lineGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={segment.accent} stopOpacity="0.8" />
                                    <stop offset="100%" stopColor={segment.accent} stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                <line
                                  x1={x1}
                                  y1={y1}
                                  x2="110"
                                  y2="110"
                                  stroke={`url(#lineGradient-${index})`}
                                  strokeWidth="2"
                                  strokeDasharray="6 4"
                                  style={{
                                    animation: `draw-line 1.5s ease-out ${1 + index * 0.3}s both`,
                                    filter: 'drop-shadow(0 0 6px currentColor)',
                                  }}
                                />
                              </svg>
                            );
                          });
                        })()}

                        {/* Orbiting data points */}
                        {[...Array(8)].map((_, i) => {
                          const orbitRadius = 85 + (i % 3) * 5;
                          const speed = 8 + (i % 2) * 2;
                          return (
                            <div
                              key={`orbit-${i}`}
                              className="absolute rounded-full bg-[#0EF9D7]"
                              style={{
                                width: '6px',
                                height: '6px',
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${orbitRadius}px)`,
                                animation: `particle-orbit ${speed}s linear infinite ${i * 0.2}s`,
                                boxShadow: '0 0 12px rgba(14, 249, 215, 0.9), 0 0 24px rgba(14, 249, 215, 0.5)',
                                opacity: 0.8,
                              }}
                            />
                          );
                        })}

                        {/* Rotating ring indicator */}
                        <div
                          className="absolute rounded-full border-2 border-[#0EF9D7]/30"
                          style={{
                            width: '140px',
                            height: '140px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'rotate-ring 20s linear infinite',
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="max-w-xs text-center lg:text-left px-2">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-[#c8fff4] mb-2 sm:mb-3">Platform reach</p>
                <p className="text-[0.65rem] sm:text-xs text-[#e0fff8] leading-relaxed">
                  LinkedIn {followerSegments[0].displayValue}, Facebook {followerSegments[1].displayValue}, Instagram {followerSegments[2].value}{' '}
                  followers with 908 following.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPresenceShowcase;
