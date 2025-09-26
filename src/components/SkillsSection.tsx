import { FC, memo } from 'react';
import { Skill } from '../data/skills';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      My Digital Arsenal
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="skill-card bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-8 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="skill-name text-xl font-semibold text-[#a7ffeb] tracking-wide">{skill.name}</h3>
            <span className={`badge ${skill.badge} text-xs font-bold px-3 py-1 rounded-full ${
              skill.badge === 'advanced'
                ? 'bg-gradient-to-r from-[#022b27] via-[#00695C] to-[#00a99d] text-[#f4fffb] shadow-[0_12px_24px_rgba(0,105,92,0.25)]'
                : skill.badge === 'intermediate'
                ? 'bg-gradient-to-r from-[#02423b] via-[#009688] to-[#4DB6AC] text-[#f4fffb] shadow-[0_12px_24px_rgba(0,150,136,0.25)]'
                : skill.badge === 'rookie'
                ? 'bg-gradient-to-r from-[#4DB6AC] to-[#c8fff4] text-[#043530] shadow-[0_12px_24px_rgba(77,182,172,0.2)]'
                : 'bg-gradient-to-r from-[#FF7043] via-[#ff8a65] to-[#009688] text-[#041f1b] shadow-[0_12px_24px_rgba(255,112,67,0.25)]'
            }`}> 
              {skill.badge.charAt(0).toUpperCase() + skill.badge.slice(1)}
            </span>
          </div>

          <p className="text-[#d7f5ef] mb-6 text-sm leading-relaxed">{skill.description}</p>

          <div className="skill-bar bg-[#033832]/60 rounded-full h-3 mb-6">
            <div
              className="skill-progress bg-gradient-to-r from-[#00695C] via-[#00a99d] to-[#4DB6AC] rounded-full h-full transition-all duration-1000 ease-out shadow-[0_10px_25px_rgba(0,150,136,0.25)]"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>

          <div className="specializations flex flex-wrap gap-2">
            {skill.specializations.map((spec, specIndex) => (
              <span
                key={specIndex}
                className="bg-gradient-to-r from-[#033832]/60 to-[#02423b]/60 text-[#a7ffeb] px-3 py-1 rounded-full text-xs font-medium border border-[#2f6f68]/40 transition-all duration-300 hover:border-[#00bfa5] hover:text-[#c8fff4]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default memo(SkillsSection);
