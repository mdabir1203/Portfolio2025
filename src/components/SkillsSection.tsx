import { FC, memo } from 'react';
import { Skill } from '../data/skills';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: FC<SkillsSectionProps> = ({ skills }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">My Digital Arsenal</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {skills.map((skill, index) => (
        <div
          key={index}
          className="skill-card bg-[#FAFAFA]/10 border border-[#4DB6AC]/30 rounded-xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-[0_20px_40px_rgba(77,182,172,0.3)] group"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="skill-name text-xl font-bold text-[#4DB6AC] text-shadow-glow">{skill.name}</h3>
            <span className={`badge ${skill.badge} text-xs font-bold px-3 py-1 rounded-full ${
              skill.badge === 'advanced'
                ? 'bg-gradient-to-r from-[#00695C] to-[#009688]'
                : skill.badge === 'intermediate'
                ? 'bg-gradient-to-r from-[#009688] to-[#4DB6AC]'
                : skill.badge === 'rookie'
                ? 'bg-gradient-to-r from-[#4DB6AC] to-[#FAFAFA] text-[#00695C]'
                : 'bg-gradient-to-r from-[#FF7043] to-[#009688]'
            }`}>
              {skill.badge.charAt(0).toUpperCase() + skill.badge.slice(1)}
            </span>
          </div>

          <p className="text-[#E0F2F1] mb-6 text-sm leading-relaxed">{skill.description}</p>

          <div className="skill-bar bg-[#FAFAFA]/10 rounded-full h-3 mb-6">
            <div
              className="skill-progress bg-gradient-to-r from-[#00695C] to-[#4DB6AC] rounded-full h-full transition-all duration-1000 ease-out"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>

          <div className="specializations flex flex-wrap gap-2">
            {skill.specializations.map((spec, specIndex) => (
              <span
                key={specIndex}
                className="bg-gradient-to-r from-[#009688]/20 to-[#4DB6AC]/20 text-[#4DB6AC] px-3 py-1 rounded-full text-xs font-medium border border-[#4DB6AC]/30 hover:bg-gradient-to-r hover:from-[#009688]/30 hover:to-[#4DB6AC]/30 transition-all duration-300"
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
