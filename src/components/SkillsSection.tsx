import { FC, memo, useEffect, useRef, useState } from 'react';
import { Skill } from '../data/skills';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="mb-12 sm:mb-16 animate-fadeIn">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
        My Digital Arsenal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {skills.map((skill, index) => {
          const isVisible = visibleCards.has(index);
          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="skill-card-dynamic bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-5 sm:p-6 md:p-8 transition-all duration-500 group relative overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bfa5]/0 via-[#00bfa5]/0 to-[#0ef9d7]/0 group-hover:from-[#00bfa5]/10 group-hover:via-[#00bfa5]/5 group-hover:to-[#0ef9d7]/10 transition-all duration-700 rounded-xl pointer-events-none"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{
                  transform: 'translateX(-100%)',
                  animation: 'skill-shimmer 2s ease-in-out infinite',
                }}></div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-[#00bfa5] rounded-full blur-sm"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                      animation: `skill-particle-float 3s ease-in-out infinite ${i * 0.5}s`,
                    }}
                  ></div>
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="skill-name text-xl font-semibold text-[#a7ffeb] tracking-wide group-hover:text-[#c8fff4] transition-colors duration-300 group-hover:scale-105 transform-gpu inline-block">
                    {skill.name}
                  </h3>
                  <span className={`badge-dynamic ${skill.badge} text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    skill.badge === 'advanced'
                      ? 'bg-gradient-to-r from-[#022b27] via-[#00695C] to-[#00a99d] text-[#f4fffb] shadow-[0_12px_24px_rgba(0,105,92,0.25)] group-hover:shadow-[0_16px_32px_rgba(0,105,92,0.4)]'
                      : skill.badge === 'intermediate'
                      ? 'bg-gradient-to-r from-[#02423b] via-[#009688] to-[#4DB6AC] text-[#f4fffb] shadow-[0_12px_24px_rgba(0,150,136,0.25)] group-hover:shadow-[0_16px_32px_rgba(0,150,136,0.4)]'
                      : skill.badge === 'rookie'
                      ? 'bg-gradient-to-r from-[#4DB6AC] to-[#c8fff4] text-[#043530] shadow-[0_12px_24px_rgba(77,182,172,0.2)] group-hover:shadow-[0_16px_32px_rgba(77,182,172,0.3)]'
                      : 'bg-gradient-to-r from-[#FF7043] via-[#ff8a65] to-[#009688] text-[#041f1b] shadow-[0_12px_24px_rgba(255,112,67,0.25)] group-hover:shadow-[0_16px_32px_rgba(255,112,67,0.4)]'
                  }`}> 
                    {skill.badge.charAt(0).toUpperCase() + skill.badge.slice(1)}
                  </span>
                </div>
                <p className="text-[#d7f5ef] mb-6 text-sm leading-relaxed group-hover:text-[#eafffa] transition-colors duration-300">{skill.description}</p>

                <div className="skill-bar-dynamic bg-[#033832]/60 rounded-full h-3 mb-6 relative overflow-hidden group-hover:h-3.5 transition-all duration-300">
                  <div
                    className="skill-progress-dynamic bg-gradient-to-r from-[#00695C] via-[#00a99d] to-[#4DB6AC] rounded-full h-full transition-all duration-1000 ease-out shadow-[0_10px_25px_rgba(0,150,136,0.25)] relative overflow-hidden"
                    style={{ 
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 150 + 300}ms`,
                    }}
                  >
                    {/* Animated shine on progress bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-skill-progress-shine"></div>
                  </div>
                </div>

                <div className="specializations flex flex-wrap gap-2">
                  {skill.specializations.map((spec, specIndex) => (
                    <span
                      key={specIndex}
                      className="specialization-tag bg-gradient-to-r from-[#033832]/60 to-[#02423b]/60 text-[#a7ffeb] px-3 py-1 rounded-full text-xs font-medium border border-[#2f6f68]/40 transition-all duration-300 hover:border-[#00bfa5] hover:text-[#c8fff4] hover:scale-110 hover:bg-gradient-to-r hover:from-[#00bfa5]/20 hover:to-[#0ef9d7]/20 hover:shadow-[0_4px_12px_rgba(0,191,165,0.3)] transform-gpu"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: `${index * 100 + specIndex * 50 + 500}ms`,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#00bfa5]/0 group-hover:border-[#00bfa5]/40 transition-all duration-500 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(SkillsSection);
