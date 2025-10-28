import { FC, memo } from 'react';
import { LinkedInRecommendation } from '../data/linkedin-recommendations';
import SocialPresenceShowcase from './SocialPresenceShowcase';

interface HomeSectionProps {
  onHireClick: () => void;
  isHired: boolean;
  linkedinRecommendations: LinkedInRecommendation[];
}

const HomeSection: FC<HomeSectionProps> = ({ onHireClick, isHired, linkedinRecommendations }) => {
  return (
    <section className="mb-12 md:mb-16 animate-fadeIn">
      <div className="profile-section mb-8 md:mb-12 backdrop-blur-xl bg-[#052825]/70 border border-[#2f6f68]/40 rounded-2xl p-6 md:p-8 shadow-lg shadow-[0_35px_70px_rgba(0,150,136,0.18)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#00a99d]/20 blur-3xl"></div>
          <div className="absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-[#FF7043]/25 blur-2xl"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#009688]/40 via-transparent to-transparent blur-2xl scale-110"></div>
            <div className="relative w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64">
              <img
                src="/images/profile.webp"
                alt="Mohammad Abir Abbas"
                className="w-full h-full rounded-full object-cover border-[3px] border-[#4DB6AC]/50 shadow-2xl shadow-[0_25px_60px_rgba(0,150,136,0.35)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="profile-info text-center lg:text-left flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#C8FFF4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_12px_35px_rgba(77,182,172,0.35)] mb-3 md:mb-4">
              Mohammad Abir Abbas
            </h1>
            <div className="mb-6 md:mb-8">
              <p className="text-[#d7f5ef] leading-relaxed text-sm md:text-base max-w-2xl mx-auto lg:mx-0">
                We craft AI-powered, secure, and scalable solutions that drive impact. From multi-LLM workflows to Rust systems, every decision is data-driven, every product human-focused, and every line of code aimed at breaking barriers and shaping the impossible.
              </p>
            </div>

            <div className="role-hire flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gradient-to-r from-[#01302c] via-[#00695C] to-[#00a99d] text-[#FAFAFA] px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-[0_12px_24px_rgba(0,105,92,0.3)]">
                  AI Whisperer
                </span>
                <span className="bg-gradient-to-r from-[#02423b] via-[#009688] to-[#4DB6AC] text-[#f2fffb] px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-[0_12px_24px_rgba(0,150,136,0.28)]">
                  Rust Artisan
                </span>
                <span className="bg-gradient-to-r from-[#FF7043] via-[#ff8d66] to-[#009688] text-[#0b2824] px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-[0_12px_24px_rgba(255,112,67,0.28)]">
                  Vibe Coder
                </span>
              </div>
              <button
                className="hire-me-button bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#031b18] font-bold py-2 px-4 md:py-3 md:px-8 rounded-lg border border-[#4DB6AC]/50 transition-all duration-300 tracking-wide uppercase shadow-[0_16px_32px_rgba(0,150,136,0.35)] hover:shadow-[0_20px_45px_rgba(0,150,136,0.45)] hover:-translate-y-0.5"
                onClick={onHireClick}
              >
                {isHired ? 'Hired!' : 'Hire Me'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SocialPresenceShowcase />

      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#a7ffeb] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent">
            LinkedIn Recommendations
          </h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
            {linkedinRecommendations.map((recommendation, index) => (
              <div
                key={index}
                className="bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-6 flex flex-col h-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,150,136,0.25)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={recommendation.avatar}
                    alt={recommendation.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#4DB6AC]/40 shadow-[0_8px_18px_rgba(0,150,136,0.25)]"
                  />
                  <div className="text-left">
                    <h3 className="font-semibold text-[#80f0df] tracking-wide">{recommendation.name}</h3>
                    <p className="text-[#9adcd1] text-sm">{recommendation.role}</p>
                  </div>
                </div>
                <p className="text-[#e3fbf6] italic flex-1">"{recommendation.content}"</p>
                <div className="flex mt-auto pt-4 text-[#FF7043]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.linkedin.com/in/abir-abbas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#009688] via-[#00bfa5] to-[#4DB6AC] hover:from-[#00a99d] hover:via-[#009688] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3 px-6 rounded-lg border border-[#4DB6AC]/40 transition-all duration-300 shadow-[0_18px_38px_rgba(0,150,136,0.32)] hover:-translate-y-0.5"
            >
              View More on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default memo(HomeSection);
