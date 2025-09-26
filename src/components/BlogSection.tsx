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
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">My Medium Blog Posts</h2>
    <p className="text-xl text-[#E0F2F1] text-center mb-12 max-w-3xl mx-auto">
      Sharing my thoughts on AI, Rust, security, and vibe coding.
    </p>

    {isFetching ? (
      <div className="text-center py-12">
        <div className="spinner border-4 border-[#4DB6AC]/30 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
        <p className="text-[#FAFAFA] text-lg">Loading my latest thoughts...</p>
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
              className="blog-card bg-[#FAFAFA]/10 border border-[#4DB6AC]/30 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-[0_20px_40px_rgba(77,182,172,0.3)] group"
            >
              <h3 className="blog-title text-2xl font-bold text-[#009688] mb-3 group-hover:text-[#4DB6AC] transition-colors duration-300">
                {post.title}
              </h3>
              <div className="blog-date text-[#B2DFDB] text-sm mb-4">{date}</div>
              <p className="blog-excerpt text-[#E0F2F1] mb-6 leading-relaxed">{excerpt}</p>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-link text-[#4DB6AC] hover:bg-[#4DB6AC]/20 transition-all duration-300 font-bold py-2 px-4 rounded-lg border-2 border-[#4DB6AC] hover:border-[#009688] hover:text-[#009688] inline-block"
              >
                Read Full Article →
              </a>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-[#B2DFDB] text-lg">No blog posts available at the moment.</p>
        <button
          onClick={onRetry}
          className="mt-4 bg-gradient-to-r from-[#009688] to-[#4DB6AC] hover:from-[#00695C] hover:to-[#009688] text-[#FAFAFA] font-bold py-2 px-4 rounded-lg transition-all duration-300"
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
        className="inline-block bg-gradient-to-r from-[#009688] to-[#4DB6AC] hover:from-[#00695C] hover:to-[#009688] text-[#FAFAFA] font-bold py-3 px-6 rounded-lg border-2 border-transparent transition-all duration-300 text-shadow-glow transform hover:scale-105 hover:shadow-lg hover:shadow-[0_0_45px_rgba(0,150,136,0.4)]"
        onClick={onRetry}
      >
        View All Posts on Medium →
      </a>
    </div>
  </section>
);

export default memo(BlogSection);
