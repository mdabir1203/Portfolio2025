import { FC, memo } from 'react';
import { Experience } from '../data/experience';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: FC<ExperienceSectionProps> = ({ experiences }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Work Experience</h2>
    <div className="max-w-4xl mx-auto">
      {experiences.map((exp, index) => (
        <div key={index} className="flex mb-12">
          <div className="w-1/4 text-right pr-6">
            <div className="text-cyan-400 font-bold">{exp.period}</div>
            <div className="text-gray-400">{exp.location}</div>
          </div>
          <div className="w-3/4 pl-6 border-l border-white/10">
            <h3 className="text-2xl font-bold text-green-400">{exp.role}</h3>
            <h4 className="text-lg text-gray-300 mb-3">{exp.company}</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {exp.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default memo(ExperienceSection);
