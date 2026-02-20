import { FC, memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ExternalLink, ChevronLeft, ChevronRight, X, BarChart3, ShieldCheck } from 'lucide-react';
import { Project } from '../data/projects';
import { useParallaxSlider } from '../hooks/useParallaxSlider';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: FC<ProjectsSectionProps> = ({ projects }) => {
  const {
    activeIndex,
    rotX,
    rotY,
    containerRef,
    handlers,
    next,
    prev,
    goTo
  } = useParallaxSlider(projects.length);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background/50 relative">
      <div className="text-center mb-8 space-y-4 px-6 z-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-serif">
          The <span className="text-primary italic">Creation</span> Phase
        </h2>
        <p className="text-sand/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
          Scaleable builds with measurable Impact & ROI.
        </p>
      </div>

      <div
        ref={containerRef as any}
        className="parallax-slider-container z-10"
        {...handlers}
      >
        {projects.map((project, index) => {
          const isCurrent = index === activeIndex;
          const isPrevious = index === (activeIndex - 1 + projects.length) % projects.length;
          const isNext = index === (activeIndex + 1) % projects.length;

          return (
            <div
              key={`${project.title}-${index}`}
              className="parallax-card"
              data-current={isCurrent}
              data-previous={isPrevious}
              data-next={isNext}
              style={{
                '--rotX': isCurrent ? rotX : 0,
                '--rotY': isCurrent ? rotY : 0,
              } as any}
            >
              <ProjectCard project={project} isCurrent={isCurrent} onShowImage={setSelectedImage} />
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-8 z-30 p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-primary hover:border-primary/50 transition-all hidden md:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-8 z-30 p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-primary hover:border-primary/50 transition-all hidden md:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-3 mt-8 z-20">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/20 hover:bg-primary/40'
              }`}
          />
        ))}
      </div>

      {/* Full-screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Project Detail"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-all"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectCard = ({ project, isCurrent, onShowImage }: { project: Project, isCurrent: boolean, onShowImage: (url: string) => void }) => {
  return (
    <div className="parallax-card-content p-8 rounded-3xl bg-gradient-to-br from-card/80 to-black/80 border border-white/10 flex flex-col relative group overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="parallax-card-inner flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-primary py-1 px-2 bg-primary/10 rounded uppercase tracking-widest block w-fit">
              {project.category.replace('-', ' ')}
            </span>
            <span className="text-[10px] font-mono text-white/30 uppercase block font-bold">{project.stars}</span>
          </div>
          <Rocket className={`text-primary/20 ${isCurrent ? 'text-primary/60' : ''} group-hover:text-primary transition-colors`} size={24} />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Feynman Summary - Single line, high prominence */}
        <p className="text-primary/90 text-sm font-medium mb-4 italic leading-tight border-l-2 border-primary/30 pl-3">
          "{project.feynmanSummary}"
        </p>

        <p className="text-xs text-sand/50 leading-relaxed font-light line-clamp-3 mb-6">
          {project.description}
        </p>

        {/* Impact Metrics Grid */}
        {project.metrics && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {project.metrics.slice(0, 2).map((metric, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary/60 uppercase tracking-tighter">
                  {idx === 0 ? <BarChart3 size={12} /> : <ShieldCheck size={12} />}
                  {metric.label}
                </div>
                <div className="text-sm font-bold text-white tabular-nums">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        {project.image && (
          <div
            className="relative h-28 w-full rounded-xl overflow-hidden mb-4 cursor-pointer group/img shrink-0"
            onClick={() => onShowImage(project.image!)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500 scale-100 group-hover/img:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/img:bg-black/10 transition-all" />
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          {project.link !== '#' ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Source <ExternalLink size={12} />
            </motion.a>
          ) : (
            <span className="text-[10px] font-mono text-white/20 uppercase">Internal Build</span>
          )}

          <button
            onClick={() => onShowImage(project.image!)}
            className="text-[10px] uppercase tracking-widest text-white/40 hover:text-primary transition-colors font-bold"
          >
            Details
          </button>
        </div>
      </div>

      {/* Ambient Glow */}
      {isCurrent && (
        <div className="absolute -inset-20 bg-primary/5 blur-[100px] opacity-50 pointer-events-none -z-10" />
      )}
    </div>
  );
};

export default memo(ProjectsSection);
