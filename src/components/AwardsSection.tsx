import { FC, memo } from 'react';
import { Award } from '../data/awards';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: FC<AwardsSectionProps> = ({ awards }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      Awards &amp; Certifications
    </h2>

    <div className="max-w-5xl mx-auto grid gap-8">
      {awards.map((award, index) => (
        <article
          key={`${award.title}-${index}`}
          className="bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-2xl p-6 shadow-lg shadow-[0_15px_35px_rgba(0,150,136,0.18)] hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)] transition-shadow duration-300"
        >
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-semibold text-[#a7ffeb] tracking-wide">{award.title}</h3>
              <p className="text-[#d7f5ef]">
                <span className="text-[#00bfa5]">{award.issuer}</span>
                {award.date && <span className="text-[#7fcfc2]"> · {award.date}</span>}
              </p>
            </div>
            {award.link && (
              <a
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#00bfa5] hover:text-[#c8fff4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#021513]"
              >
                View credential
                <span aria-hidden>↗</span>
              </a>
            )}
          </header>

          {award.description && <p className="text-[#d7f5ef] leading-relaxed mb-4">{award.description}</p>}

          {award.highlights && award.highlights.length > 0 && (
            <ul className="list-disc list-inside text-[#d7f5ef] space-y-2">
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
