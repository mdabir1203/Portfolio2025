import { FC, memo } from 'react';
import { Experience } from '../data/experience';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">Work Experience</h2>
    <div className="max-w-4xl mx-auto">
      {experiences.map((exp, index) => (
        <div key={index} className="flex mb-12">
          <div className="w-1/4 text-right pr-6">
            <div className="text-[#4DB6AC] font-bold">{exp.period}</div>
            <div className="text-[#B2DFDB]">{exp.location}</div>
          </div>
          <div className="w-3/4 pl-6 border-l border-[#4DB6AC]/30">
            <h3 className="text-2xl font-bold text-[#009688]">{exp.role}</h3>
            <h4 className="text-lg text-[#E0F2F1] mb-3">{exp.company}</h4>
            <ul className="list-disc list-inside text-[#E0F2F1] space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i}>
                  {detail.link ? (
                    <a
                      href={detail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4DB6AC] hover:underline"
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
