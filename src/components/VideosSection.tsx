import { FC, memo } from 'react';
import { videos } from '../data/videos';

const VideosSection: FC = () => (
  <section className="mb-24 sm:mb-32 animate-fadeIn relative">
    {/* Prestige Accent Ornament */}
    <div className="absolute -top-12 left-0 w-24 h-px bg-gradient-to-r from-prestige/50 to-transparent"></div>

    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight font-serif">
      Visual <span className="text-prestige">Intelligence</span>
    </h2>
    <p className="text-lg sm:text-xl text-sand/60 mb-16 max-w-2xl leading-relaxed">
      Watch live demonstrations of agentic workflows, quantum prototyping, and the architectural principles of high-stability AI systems.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col bg-card/40 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-prestige/30 hover:-translate-y-2 shadow-2xl"
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-16 h-16 rounded-full bg-prestige/90 flex items-center justify-center shadow-[0_0_30px_rgba(184,134,11,0.5)]">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>

            {/* View Badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-prestige tracking-widest uppercase">
                {video.views}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-prestige"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-sand/40">
                {video.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-prestige transition-colors duration-500 leading-tight">
              {video.title}
            </h3>

            <p className="text-sm text-sand/50 leading-relaxed mb-6 flex-grow">
              {video.description}
            </p>

            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-prestige/60 group-hover:text-prestige transition-colors">
              Watch Presentation
            </div>
          </div>
        </a>
      ))}
    </div>

    {/* Secondary Link for Channel */}
    <div className="text-center mt-20">
      <a
        href="https://youtube.com/@AIAugmented"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-6 px-10 py-5 rounded-full bg-transparent border border-white/10 text-white font-medium hover:border-prestige/50 hover:bg-prestige/5 transition-all duration-500 group"
      >
        <span className="text-sm uppercase tracking-[0.2em]">Access Complete Archive</span>
        <span className="text-prestige group-hover:translate-x-2 transition-transform">→</span>
      </a>
    </div>
  </section>
);

export default memo(VideosSection);
