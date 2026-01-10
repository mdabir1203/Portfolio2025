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
      <section className="mb-8 sm:mb-12 md:mb-16 animate-fadeIn">
        <div className="relative mb-6 sm:mb-8 md:mb-12 overflow-hidden rounded-2xl sm:rounded-[32px] border border-[#00bfa5]/20 bg-[#041512]/15 px-4 py-10 sm:px-6 sm:py-16 shadow-luxury backdrop-blur-sm md:px-10 md:py-20 lg:px-16 lg:py-24 max-w-7xl mx-auto">

          <div className="relative z-10 flex flex-col gap-6 sm:gap-8 md:gap-10">
            {/* Name and Profile Picture Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-8">
              <div className="flex-1 w-full">
                <span className="inline-flex items-center gap-2 sm:gap-3 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.65em] text-[#8fe3d5] font-medium mb-3 sm:mb-4">
                  <span className="h-px w-10 sm:w-14 bg-gradient-to-r from-[#00a99d]/80 to-transparent" aria-hidden="true"></span>
                  Strategic technologist & storyteller
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.15] sm:leading-[1.1] text-[#eafffa] tracking-tight break-words" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Mohammad Abir Abbas
                </h1>
              </div>
              
              {/* Profile Picture */}
              <div className="relative flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start group profile-picture-container">
                <div className="absolute -inset-8 sm:-inset-12 rounded-[3rem] bg-gradient-to-br from-[#00a99d]/10 via-transparent to-transparent blur-3xl group-hover:from-[#00a99d]/30 group-hover:blur-[80px] group-hover:scale-125 transition-all duration-700 ease-out" aria-hidden="true"></div>
                <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-[#ff7043]/10 blur-3xl group-hover:bg-[#ff7043]/30 group-hover:blur-[80px] group-hover:scale-200 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700 ease-out" aria-hidden="true"></div>
                <div className="relative w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-72 overflow-hidden rounded-2xl sm:rounded-[2.75rem] border border-[#1f4a44]/70 bg-[#052b27]/50 shadow-[0_40px_90px_rgba(0,110,100,0.45)] group-hover:border-[#00bfa5]/60 group-hover:shadow-[0_80px_160px_rgba(0,191,165,0.7),0_0_100px_rgba(14,249,215,0.5),inset_0_0_60px_rgba(0,191,165,0.2)] transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-3 transform-gpu">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00bfa5]/0 via-[#00bfa5]/0 to-[#00bfa5]/0 group-hover:from-[#00bfa5]/30 group-hover:via-[#0ef9d7]/15 group-hover:to-transparent transition-all duration-700 z-10 pointer-events-none group-hover:animate-pulse" style={{ animation: 'profile-glow-pulse 2s ease-in-out infinite' }}></div>
                  
                  {/* Dynamic 3D tilt effect */}
                  <img 
                    src="/images/profile.webp" 
                    alt="Mohammad Abir Abbas" 
                    className="h-full w-full object-cover saturate-110 group-hover:saturate-150 group-hover:scale-115 group-hover:brightness-110 transition-all duration-700 ease-out transform-gpu" 
                    style={{ transformStyle: 'preserve-3d' }}
                  />
                  
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100" style={{ 
                    background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                    animation: 'profile-shimmer 2s ease-in-out infinite',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%'
                  }}></div>
                  
                  {/* Date badge with enhanced hover */}
                  <div className="absolute top-6 right-6 text-[0.6rem] uppercase tracking-[0.65em] text-white/70 group-hover:text-[#00bfa5] group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(0,191,165,0.8)] transition-all duration-300 z-20" aria-hidden="true">2K24</div>
                  
                  {/* Floating glow particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#00bfa5] rounded-full blur-md" style={{ animation: 'profile-particle-float 3s ease-in-out infinite' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#0ef9d7] rounded-full blur-sm" style={{ animation: 'profile-particle-float 3s ease-in-out infinite 0.5s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#00bfa5] rounded-full blur-sm" style={{ animation: 'profile-particle-float 3s ease-in-out infinite 1s' }}></div>
                    <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-[#0ef9d7] rounded-full blur-sm" style={{ animation: 'profile-particle-float 3s ease-in-out infinite 1.5s' }}></div>
                    <div className="absolute bottom-1/2 left-1/2 w-2.5 h-2.5 bg-[#00bfa5] rounded-full blur-md" style={{ animation: 'profile-particle-float 3s ease-in-out infinite 2s' }}></div>
                  </div>
                  
                  {/* Radial glow rings */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-[2.75rem] border border-[#00bfa5]/40 group-hover:border-[#00bfa5]/60" style={{ animation: 'profile-glow-pulse 2s ease-in-out infinite' }}></div>
                    <div className="absolute inset-2 rounded-2xl sm:rounded-[2.75rem] border border-[#0ef9d7]/30" style={{ animation: 'profile-glow-pulse 2s ease-in-out infinite 0.5s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 text-left">
              <div className="space-y-4 sm:space-y-7">
                <p className="max-w-2xl text-sm sm:text-base leading-[1.7] sm:leading-[1.75] text-[#c8f5ec] font-light tracking-wide">
                  Transforming global cultural intelligence into AI-powered enterprise decisions. With experience across 13 countries, I embed diverse cultural insights into risk modeling and strategic planning, empowering C-suite executives and sovereign investors to make data-driven decisions that respect regional nuances—from holiday calendars to local business customs—across financial services, ecommerce, retail, and compliance.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                  <span className="rounded-full border border-[#145046]/60 bg-gradient-to-br from-white/12 to-white/5 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[#9ee2d7] shadow-luxury-sm transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5 hover:scale-[1.02] min-h-[44px] flex items-center justify-center">
                    AI Whisperer
                  </span>
                  <span className="rounded-full border border-[#145046]/60 bg-gradient-to-br from-white/12 to-white/5 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[#9ee2d7] shadow-luxury-sm transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5 hover:scale-[1.02] min-h-[44px] flex items-center justify-center">
                    Rust Artisan
                  </span>
                  <span className="rounded-full border border-[#412017]/60 bg-gradient-to-br from-white/12 to-white/5 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-[#ffb199] shadow-luxury-sm transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center">
                    Vibe Coder
                  </span>
                </div>
                <button
                  className="self-start sm:self-auto w-full sm:w-auto rounded-full border-2 border-[#8fe3d5]/70 bg-gradient-to-br from-[#c8fff4] to-[#a7ffeb] px-6 sm:px-9 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-[0.5em] text-[#03211d] shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury-lg hover:scale-[1.015] active:scale-[0.98] min-h-[44px] flex items-center justify-center"
                  onClick={onHireClick}
                >
                  {isHired ? 'Hired!' : 'Hire Me'}
                </button>
              </div>

              <div className="grid gap-4 sm:gap-5 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.55em] text-[#8fe3d5] grid-cols-1 sm:grid-cols-3">
                <div className="glass-premium rounded-2xl px-5 py-6 shadow-luxury transition-all duration-300 hover:shadow-luxury-lg hover:-translate-y-0.5">
                  <p className="text-[#c8fff4] font-medium">Focus</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-[#eafffa]">Multi-LLM Systems</p>
                </div>
                <div className="glass-premium rounded-2xl px-5 py-6 shadow-luxury transition-all duration-300 hover:shadow-luxury-lg hover:-translate-y-0.5">
                  <p className="text-[#c8fff4] font-medium">Edge</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-[#eafffa]">Secure Rust Pipelines</p>
                </div>
                <div className="glass-premium rounded-2xl px-5 py-6 shadow-luxury transition-all duration-300 hover:shadow-luxury-lg hover:-translate-y-0.5">
                  <p className="text-[#c8fff4] font-medium">Promise</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-[#eafffa]">Human-Centered Results</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SocialPresenceShowcase />

        <section className="mb-16" aria-labelledby="linkedin-recommendations-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="linkedin-recommendations-heading" className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-[#a7ffeb] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              LinkedIn Recommendations
            </h2>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
              {linkedinRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="glass-premium rounded-2xl p-7 flex flex-col h-full shadow-luxury transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-luxury-lg"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={recommendation.avatar}
                      alt={recommendation.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#4DB6AC]/50 shadow-luxury-sm"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-[#80f0df] tracking-wide text-lg">{recommendation.name}</h3>
                      <p className="text-[#9adcd1] text-sm font-light">{recommendation.role}</p>
                    </div>
                  </div>
                  <p className="text-[#e3fbf6] italic flex-1 leading-relaxed">"{recommendation.content}"</p>
                  <div className="flex mt-auto pt-5 text-[#FF7043] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <a
                href="https://www.linkedin.com/in/abir-abbas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#009688] via-[#00bfa5] to-[#4DB6AC] hover:from-[#00a99d] hover:via-[#009688] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3.5 px-8 rounded-xl border-2 border-[#4DB6AC]/50 shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury-lg"
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
