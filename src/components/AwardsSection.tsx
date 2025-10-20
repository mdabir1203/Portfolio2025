import { FC, memo } from 'react';
import { Award } from '../data/awards';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: FC<AwardsSectionProps> = ({ awards }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">

      Awards &amp; Certifications
    </h2>

    <div className="max-w-5xl mx-auto grid gap-8">
      {awards.map((award, index) => (
        <article
          key={`${award.title}-${index}`}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-shadow duration-300"
        >
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-green-400">{award.title}</h3>
              <p className="text-gray-300">
                <span className="text-cyan-300">{award.issuer}</span>
                {award.date && <span className="text-gray-400"> · {award.date}</span>}
              </p>
            </div>
            {award.link && (
              <a
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1321]"
              >
                View credential
                <span aria-hidden>↗</span>
              </a>
            )}
          </header>
          {award.description && <p className="text-gray-300 leading-relaxed mb-4">{award.description}</p>}

          {award.highlights && award.highlights.length > 0 && (
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {award.highlights.map((highlight, highlightIndex) => (
                <li key={highlightIndex}>{highlight}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  </section>
);

export default memo(AwardsSection);
