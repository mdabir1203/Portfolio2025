import { FC, memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ExternalLink, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Award } from '../data/awards';
import { useParallaxSlider } from '../hooks/useParallaxSlider';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: FC<AwardsSectionProps> = ({ awards }) => {
  const {
    activeIndex,
    rotX,
    rotY,
    containerRef,
    handlers,
    next,
    prev,
    goTo
  } = useParallaxSlider(awards.length);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col items-start overflow-hidden bg-background/50 relative">
      <div className="w-full mb-8 space-y-4 z-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-serif">
          The <span className="text-primary italic">Recognition</span> Wall
        </h2>
        <p className="text-sand/60 text-sm md:text-base max-w-xl leading-relaxed font-light">
          Experience the journey through interactive 3D milestones.
        </p>
      </div>

      <div
        ref={containerRef as any}
        className="parallax-slider-container z-10"
        {...handlers}
      >
        {awards.map((award, index) => {
          const isCurrent = index === activeIndex;
          const isPrevious = index === (activeIndex - 1 + awards.length) % awards.length;
          const isNext = index === (activeIndex + 1) % awards.length;

          return (
            <div
              key={`${award.title}-${index}`}
              className="parallax-card"
              data-current={isCurrent}
              data-previous={isPrevious}
              data-next={isNext}
              style={{
                '--rotX': isCurrent ? rotX : 0,
                '--rotY': isCurrent ? rotY : 0,
              } as any}
            >
              <AwardCard award={award} isCurrent={isCurrent} onShowImage={setSelectedImage} />
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
        {awards.map((_, i) => (
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
                alt="Certificate Detail"
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

const AwardCard = ({ award, isCurrent, onShowImage }: { award: Award, isCurrent: boolean, onShowImage: (url: string) => void }) => {
  return (
    <div className="parallax-card-content p-8 rounded-3xl bg-gradient-to-br from-card/80 to-black/80 border border-white/10 flex flex-col relative group overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="parallax-card-inner flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-primary py-1 px-2 bg-primary/10 rounded uppercase tracking-widest block w-fit">
              {award.issuer}
            </span>
            {award.date && <span className="text-[10px] font-mono text-white/30 uppercase block">{award.date}</span>}
          </div>
          <Trophy className={`text-primary/20 ${isCurrent ? 'text-primary/60' : ''} group-hover:text-primary transition-colors`} size={24} />
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 line-clamp-2">
          {award.title}
        </h3>

        <p className="text-sm text-sand/60 leading-relaxed font-light line-clamp-3 mb-4">
          {award.description}
        </p>

        {award.image && (
          <div
            className="relative h-32 w-full rounded-xl overflow-hidden mb-4 cursor-pointer group/img"
            onClick={() => onShowImage(award.image!)}
          >
            <img
              src={award.image}
              alt={award.title}
              className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500 scale-100 group-hover/img:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/img:bg-black/10 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all">
              <span className="bg-primary/90 text-black p-2 rounded-full transform scale-50 group-hover/img:scale-100 transition-all">
                <Maximize2 size={16} />
              </span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center gap-4">
          {award.link && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={award.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Proof of Work <ExternalLink size={14} />
            </motion.a>
          )}
          {award.image && (
            <button
              onClick={() => onShowImage(award.image!)}
              className="text-[10px] uppercase tracking-widest text-white/40 hover:text-primary transition-colors font-bold"
            >
              View Gist
            </button>
          )}
        </div>
      </div>

      {/* Ambient Glow */}
      {isCurrent && (
        <div className="absolute -inset-20 bg-primary/5 blur-[100px] opacity-50 pointer-events-none -z-10" />
      )}
    </div>
  );
};

export default memo(AwardsSection);
