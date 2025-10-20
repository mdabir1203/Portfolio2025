import { FC, memo } from 'react';
import { Experience } from '../data/experience';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      Work Experience
    </h2>
    <div className="max-w-4xl mx-auto">
      {experiences.map((exp, index) => (
        <div key={index} className="flex mb-12">
          <div className="w-1/4 text-right pr-6">
            <div className="text-[#c8fff4] font-semibold tracking-wide">{exp.period}</div>
            <div className="text-[#7fcfc2]">{exp.location}</div>
          </div>
          <div className="w-3/4 pl-6 border-l border-[#2f6f68]/50">
            <h3 className="text-2xl font-semibold text-[#a7ffeb] tracking-wide">{exp.role}</h3>
            <h4 className="text-lg text-[#d7f5ef] mb-3">{exp.company}</h4>
            <ul className="list-disc list-inside text-[#d7f5ef] space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i}>
                  {detail.link ? (
                    <a
                      href={detail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00bfa5] hover:text-[#c8fff4] underline-offset-4 hover:underline"
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
