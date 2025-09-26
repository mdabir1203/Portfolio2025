import { FC, memo } from 'react';
import DOMPurify from 'dompurify';
import { MediumPost } from '../types';

interface BlogSectionProps {
  posts: MediumPost[];
  isFetching: boolean;
  onRetry: () => void;
}

const BlogSection: FC<BlogSectionProps> = ({ posts, isFetching, onRetry }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      My Medium Blog Posts
    </h2>
    <p className="text-xl text-[#d7f5ef] text-center mb-12 max-w-3xl mx-auto">
      Sharing my thoughts on AI, Rust, security, and vibe coding.
    </p>

    {isFetching ? (
      <div className="text-center py-12">
        <div className="spinner border-4 border-[#00bfa5]/20 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
        <p className="text-[#f4fffb] text-lg">Loading my latest thoughts...</p>
      </div>
    ) : posts.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          const date = new Date(post.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          let excerpt = post.description || post.content || '';
          excerpt = DOMPurify.sanitize(excerpt, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
          if (excerpt.length > 150) {
            excerpt = excerpt.substring(0, 150) + '...';
          }

          return (
            <div
              key={index}
              className="blog-card bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)] group"
            >
              <h3 className="blog-title text-2xl font-semibold text-[#a7ffeb] mb-3 group-hover:text-[#c8fff4] transition-colors duration-300 tracking-wide">
                {post.title}
              </h3>
              <div className="blog-date text-[#9adcd1] text-sm mb-4">{date}</div>
              <p className="blog-excerpt text-[#d7f5ef] mb-6 leading-relaxed">{excerpt}</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-link text-[#052321] font-semibold tracking-wide inline-block py-2 px-4 rounded-lg border border-[#00bfa5]/50 bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,150,136,0.32)]"
              >
                Read Full Article →
              </a>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-[#9adcd1] text-lg">No blog posts available at the moment.</p>
        <button
          onClick={onRetry}
          className="mt-4 bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-2 px-4 rounded-lg transition-all duration-300 shadow-[0_16px_32px_rgba(0,150,136,0.3)]"
        >
          Try Again
        </button>
      </div>
    )}

    <div className="text-center mt-8">
      <a
        href="https://medium.com/@md.abir1203"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3 px-6 rounded-lg border border-[#00bfa5]/40 transition-all duration-300 shadow-[0_20px_45px_rgba(0,150,136,0.35)] hover:-translate-y-0.5"
        onClick={onRetry}
      >
        View All Posts on Medium →
      </a>
    </div>
  </section>
);

export default memo(BlogSection);
