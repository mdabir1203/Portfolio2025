import { FC, memo } from 'react';
import { LinkedInRecommendation } from '../data/linkedin-recommendations';
import CursorTrail from './CursorTrail';
import SocialPresenceShowcase from './SocialPresenceShowcase';

interface HomeSectionProps {
  onHireClick: () => void;
  isHired: boolean;
  linkedinRecommendations: LinkedInRecommendation[];
}

const trailImages = ['/images/trail-gem.svg', '/images/trail-spark.svg', '/images/trail-aurora.svg'];

const HomeSection: FC<HomeSectionProps> = ({ onHireClick, isHired, linkedinRecommendations }) => {
  return (
    <CursorTrail className="w-full" images={trailImages} spawnInterval={60} maxItems={32}>
      <section className="mb-12 md:mb-16 animate-fadeIn">
        <div className="relative mb-8 md:mb-12 overflow-hidden rounded-[36px] border border-[#1f4a44]/60 bg-[#041512]/95 px-6 py-16 shadow-[0_35px_90px_rgba(0,80,72,0.45)] backdrop-blur-xl sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#010504] via-[#031513] to-[#062622] opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(0,171,152,0.32),transparent_60%),radial-gradient(circle_at_82%_28%,rgba(255,112,67,0.18),transparent_60%),radial-gradient(circle_at_48%_82%,rgba(0,150,136,0.24),transparent_65%)] opacity-90"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
          <div className="pointer-events-none select-none">
            <div className="absolute top-10 left-10 text-[clamp(2.25rem,7vw,7rem)] font-black uppercase tracking-[0.25em] text-white/6">
              MOHAMMAD
            </div>
            <div className="absolute bottom-10 right-10 text-[clamp(2.25rem,7vw,7rem)] font-black uppercase tracking-[0.3em] text-white/5">
              ABBAS
            </div>
            <div className="absolute top-10 right-12 flex gap-6 text-[0.65rem] sm:text-xs tracking-[0.55em] uppercase text-[#9ee2d7]/70">
              <span>Work</span>
              <span>About</span>
              <span>Thoughts</span>
              <span>Contact</span>
            </div>
            <div className="absolute left-12 bottom-32 origin-bottom-left -rotate-90 text-[0.65rem] uppercase tracking-[0.8em] text-[#c8fff4]/70">
              Portfolio 2K24
            </div>
            <div className="absolute right-16 top-1/2 h-px w-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#00bfa5]/60 to-transparent"></div>
          </div>

          <div className="relative z-10 grid items-end gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="order-2 flex flex-col gap-10 text-left lg:order-1">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-[#8fe3d5]">
                  <span className="h-px w-12 bg-[#00a99d]/80"></span>
                  Strategic technologist & storyteller
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#eafffa] drop-shadow-[0_22px_60px_rgba(0,160,140,0.4)]">
                  Mohammad Abir Abbas
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-[#c8f5ec]/90 md:text-base">
                  We craft AI-powered, secure, and scalable solutions that drive impact. From multi-LLM workflows to Rust systems, every decision is data-driven, every product human-focused, and every line of code aimed at breaking barriers and shaping the impossible.
                </p>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-[#145046]/70 bg-white/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[#9ee2d7] shadow-[0_14px_32px_rgba(0,150,136,0.22)]">
                    AI Whisperer
                  </span>
                  <span className="rounded-full border border-[#145046]/70 bg-white/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[#9ee2d7] shadow-[0_14px_32px_rgba(0,150,136,0.22)]">
                    Rust Artisan
                  </span>
                  <span className="rounded-full border border-[#412017]/70 bg-white/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[#ffb199] shadow-[0_14px_32px_rgba(255,112,67,0.2)]">
                    Vibe Coder
                  </span>
                </div>
                <button
                  className="self-start rounded-full border border-[#8fe3d5]/60 bg-[#c8fff4] px-8 py-3 text-xs font-bold uppercase tracking-[0.48em] text-[#03211d] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_26px_52px_rgba(0,150,136,0.4)]"
                  onClick={onHireClick}
                >
                  {isHired ? 'Hired!' : 'Hire Me'}
                </button>
              </div>

              <div className="grid gap-4 text-[0.65rem] uppercase tracking-[0.5em] text-[#8fe3d5]/80 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#145046]/70 bg-white/5 px-4 py-5 shadow-[0_12px_30px_rgba(0,90,80,0.28)] backdrop-blur-sm">
                  <p className="text-[#c8fff4]/70">Focus</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#eafffa]">Multi-LLM Systems</p>
                </div>
                <div className="rounded-2xl border border-[#145046]/70 bg-white/5 px-4 py-5 shadow-[0_12px_30px_rgba(0,90,80,0.28)] backdrop-blur-sm">
                  <p className="text-[#c8fff4]/70">Edge</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#eafffa]">Secure Rust Pipelines</p>
                </div>
                <div className="rounded-2xl border border-[#145046]/70 bg-white/5 px-4 py-5 shadow-[0_12px_30px_rgba(0,90,80,0.28)] backdrop-blur-sm">
                  <p className="text-[#c8fff4]/70">Promise</p>
                  <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-[#eafffa]">Human-Centered Results</p>
                </div>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-12 rounded-[3rem] bg-gradient-to-br from-[#00a99d]/25 via-transparent to-transparent blur-3xl"></div>
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#ff7043]/25 blur-3xl"></div>
                <div className="relative w-56 overflow-hidden rounded-[2.75rem] border border-[#1f4a44]/70 bg-[#052b27]/80 shadow-[0_40px_90px_rgba(0,110,100,0.45)] sm:w-64 lg:w-72 xl:w-80">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <img src="/images/profile.webp" alt="Mohammad Abir Abbas" className="h-full w-full object-cover saturate-110" />
                  <div className="absolute top-6 right-6 text-[0.6rem] uppercase tracking-[0.65em] text-white/70">2K24</div>
                  <div className="absolute bottom-6 left-6 text-xs font-semibold uppercase tracking-[0.4em] text-[#c8fff4]">
                    Future Ready
                  </div>
                </div>
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
    </CursorTrail>
  );
};

export default memo(HomeSection);
