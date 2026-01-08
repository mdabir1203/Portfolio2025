import { FC, memo } from 'react';
import { Experience } from '../data/experience';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => (
  <section className="mb-12 sm:mb-16 animate-fadeIn">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      Work Experience
    </h2>
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {experiences.map((exp, index) => (
        <div key={index} className="flex flex-col sm:flex-row mb-8 sm:mb-12">
          <div className="w-full sm:w-1/4 text-left sm:text-right pr-0 sm:pr-6 mb-3 sm:mb-0">
            <div className="text-sm sm:text-base text-[#c8fff4] font-semibold tracking-wide">{exp.period}</div>
            <div className="text-xs sm:text-sm text-[#7fcfc2]">{exp.location}</div>
          </div>
          <div className="w-full sm:w-3/4 pl-0 sm:pl-6 border-l-0 sm:border-l border-[#2f6f68]/50">
            <h3 className="text-xl sm:text-2xl font-semibold text-[#a7ffeb] tracking-wide">{exp.role}</h3>
            <h4 className="text-base sm:text-lg text-[#d7f5ef] mb-2 sm:mb-3">{exp.company}</h4>
            <ul className="list-disc list-inside text-sm sm:text-base text-[#d7f5ef] space-y-1 sm:space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i}>
                  {detail.link ? (
                    <a
                      href={detail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00bfa5] hover:text-[#c8fff4] underline-offset-4 hover:underline min-h-[44px] flex items-center"
                    >
                      {detail.text}
                    </a>
                  ) : (
                    detail.text
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default memo(ExperienceSection);
