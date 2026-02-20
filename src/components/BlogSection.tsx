import { FC, memo } from 'react';
import DOMPurify from 'dompurify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediumPost } from '../types';
import { useParallaxSlider } from '../hooks/useParallaxSlider';

interface BlogSectionProps {
  posts: MediumPost[];
  isFetching: boolean;
  onRetry: () => void;
}

const BlogSection: FC<BlogSectionProps> = ({ posts, isFetching, onRetry }) => {
  const {
    activeIndex,
    rotX,
    rotY,
    containerRef,
    handlers,
    next,
    prev,
    goTo
  } = useParallaxSlider(posts.length);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background/50 relative">
      <div className="text-center mb-8 space-y-4 px-6 z-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-serif">
          Reading My <span className="text-primary italic">Mind</span>
        </h2>
        <p className="text-sand/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
          Strategic deep-dives and technical mind-maps.
        </p>
      </div>

      {isFetching ? (
        <div className="h-[450px] flex flex-col items-center justify-center z-20">
          <div className="spinner border-2 border-primary/20 border-t-primary rounded-full w-12 h-12 animate-spin mb-4"></div>
          <p className="text-sand/40 font-mono text-[10px] uppercase tracking-widest">Synchronizing Intelligence...</p>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div
            ref={containerRef as any}
            className="parallax-slider-container z-10"
            {...handlers}
          >
            {posts.map((post, index) => {
              const isCurrent = index === activeIndex;
              const isPrevious = index === (activeIndex - 1 + posts.length) % posts.length;
              const isNext = index === (activeIndex + 1) % posts.length;

              return (
                <div
                  key={index}
                  className="parallax-card"
                  data-current={isCurrent}
                  data-previous={isPrevious}
                  data-next={isNext}
                  style={{
                    '--rotX': isCurrent ? rotX : 0,
                    '--rotY': isCurrent ? rotY : 0,
                    '--slide-width': '450px'
                  } as any}
                >
                  <BlogCard post={post} isCurrent={isCurrent} />
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
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/20 hover:bg-primary/40'
                  }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="h-[450px] flex flex-col items-center justify-center z-20">
          <p className="text-sand/40 text-sm font-mono uppercase tracking-widest mb-6">Knowledge base momentarily offline.</p>
          <button
            onClick={onRetry}
            className="text-primary hover:text-white font-mono text-xs uppercase tracking-[0.2em] underline underline-offset-8 transition-all"
          >
            Initialize Re-fetch
          </button>
        </div>
      )}

      <div className="mt-8 z-20">
        <a
          href="https://medium.com/@md.abir1203"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 hover:text-primary transition-colors"
        >
          Explore All Mind-Maps
        </a>
      </div>
    </div>
  );
};

const BlogCard = ({ post, isCurrent }: { post: MediumPost, isCurrent: boolean }) => {
  const publishedAt = new Date(post.pubDate);
  const formattedDate = publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  let excerpt = post.description || post.content || '';
  excerpt = DOMPurify.sanitize(excerpt, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  if (excerpt.length > 150) {
    excerpt = excerpt.substring(0, 150) + '...';
  }

  return (
    <div className="parallax-card-content p-8 rounded-3xl bg-gradient-to-br from-card/80 to-black/80 border border-white/10 flex flex-col relative group overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="parallax-card-inner flex flex-col h-full z-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full">
            Analysis
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
            {formattedDate}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-500 leading-snug">
          {post.title}
        </h3>

        <p className="text-sm text-sand/60 leading-relaxed font-light line-clamp-4 flex-grow">
          {excerpt}
        </p>

        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between group/link"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary group-hover/link:text-white transition-colors">Read Deep-Dive</span>
          <span className="text-primary group-hover/link:translate-x-1 transition-transform">↗</span>
        </a>
      </div>

      {/* Ambient Glow */}
      {isCurrent && (
        <div className="absolute -inset-20 bg-primary/5 blur-[100px] opacity-50 pointer-events-none -z-10" />
      )}

      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
};

export default memo(BlogSection);
