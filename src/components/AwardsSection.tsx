import { FC, memo } from 'react';
import { Award } from '../data/awards';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: FC<AwardsSectionProps> = ({ awards }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">
      Awards &amp; Certifications
    </h2>

    <div className="max-w-5xl mx-auto grid gap-8">
      {awards.map((award, index) => (
        <article
          key={`${award.title}-${index}`}
          className="bg-[#FAFAFA]/10 border border-[#4DB6AC]/30 rounded-2xl p-6 shadow-lg shadow-[0_15px_35px_rgba(0,150,136,0.18)] hover:shadow-[0_20px_40px_rgba(77,182,172,0.3)] transition-shadow duration-300"
        >
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-[#009688]">{award.title}</h3>
              <p className="text-[#E0F2F1]">
                <span className="text-[#4DB6AC]">{award.issuer}</span>
                {award.date && <span className="text-[#B2DFDB]"> · {award.date}</span>}
              </p>
            </div>
            {award.link && (
              <a
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 text-sm font-semibold text-[#4DB6AC] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00695C]"
              >
                View credential
                <span aria-hidden>↗</span>
              </a>
            )}
          </header>

          {award.description && <p className="text-[#E0F2F1] leading-relaxed mb-4">{award.description}</p>}

          {award.highlights && award.highlights.length > 0 && (
            <ul className="list-disc list-inside text-[#E0F2F1] space-y-2">
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
