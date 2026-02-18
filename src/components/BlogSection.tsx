import { FC, memo } from 'react';
import DOMPurify from 'dompurify';
import { MediumPost } from '../types';

interface BlogSectionProps {
  posts: MediumPost[];
  isFetching: boolean;
  onRetry: () => void;
}

const BlogSection: FC<BlogSectionProps> = ({ posts, isFetching, onRetry }) => (
  <section className="mb-24 sm:mb-32 animate-fadeIn relative px-4">
    {/* Premium Cyan Ornament */}
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 text-white tracking-tight font-serif">
      Reading My <span className="text-primary italic">Mind</span>
    </h2>
    <p className="text-lg sm:text-xl text-sand/60 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
      Strategic deep-dives into AI compliance, Rust architecture, and the intersection of cultural intelligence and enterprise security.
    </p>

    {isFetching ? (
      <div className="text-center py-20 bg-card/20 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div className="spinner border-2 border-primary/20 border-t-primary rounded-full w-16 h-16 animate-spin mx-auto mb-6"></div>
        <p className="text-sand/40 font-mono text-sm uppercase tracking-widest">Synchronizing Intelligence...</p>
      </div>
    ) : posts.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          const publishedAt = new Date(post.pubDate);
          const formattedDate = publishedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          let excerpt = post.description || post.content || '';
          excerpt = DOMPurify.sanitize(excerpt, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
          if (excerpt.length > 180) {
            excerpt = excerpt.substring(0, 180) + '...';
          }

          return (
            <a
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full bg-card/40 border border-white/5 rounded-[2.5rem] p-8 transition-all duration-700 hover:border-primary/30 hover:bg-white/[0.03] hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">↗</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Analysis
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-sand/50">
                  {formattedDate}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-500 leading-snug relative z-10">
                {post.title}
              </h3>

              <div className="relative z-10">
                <p className="text-sand/90 text-base leading-relaxed mb-10 group-hover:text-white transition-colors duration-500">
                  {excerpt}
                </p>

                {/* Out-of-the-box Glass Highlight for curiosity */}
                <div className="absolute inset-x-[-1rem] inset-y-[-0.5rem] bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-full" />
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center text-xs font-mono uppercase tracking-widest text-sand/40 group-hover:text-primary transition-colors relative z-10">
                Read Deep-Dive
              </div>
            </a>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-20 bg-card/20 rounded-3xl border border-white/5">
        <p className="text-sand/40 text-lg">Knowledge base momentarily offline.</p>
        <button
          onClick={onRetry}
          className="mt-6 text-primary hover:text-primary/80 font-mono text-sm uppercase tracking-widest underline underline-offset-8 transition-all"
        >
          Initialize Re-fetch
        </button>
      </div>
    )}

    <div className="text-center mt-20">
      <a
        href="https://medium.com/@md.abir1203"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-6 px-10 py-5 rounded-full bg-transparent border border-white/10 text-white font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 group"
      >
        <span className="text-sm uppercase tracking-[0.2em]">Explore All Mind-Maps</span>
        <span className="text-primary group-hover:translate-x-2 transition-transform">→</span>
      </a>
    </div>
  </section>
);

export default memo(BlogSection);
