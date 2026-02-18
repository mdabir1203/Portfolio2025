import { FC, memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink } from 'lucide-react';
import { Award } from '../data/awards';

interface AwardsSectionProps {
  awards: Award[];
}

const AwardsSection: FC<AwardsSectionProps> = ({ awards }) => (
  <section className="py-24 px-6 max-w-7xl mx-auto z-20 relative">
    <div className="text-center mb-20 space-y-4">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-serif">
        The <span className="text-primary italic">Recognition</span> Wall
      </h2>
      <p className="text-sand/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
        A celebration of small wins and major milestones—from winning hackathons to being part of communities that change worlds.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {awards.map((award, index) => (
        <motion.div
          key={`${award.title}-${index}`}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-2xl bg-gradient-to-r from-card/10 to-transparent border-l-2 border-white/5 hover:border-primary transition-all duration-300 gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono text-primary/50 py-1 px-2 border border-primary/20 rounded uppercase tracking-widest">
                {award.issuer}
              </span>
              {award.date && <span className="text-[10px] font-mono text-white/30 uppercase">{award.date}</span>}
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              {award.title}
            </h3>
            <p className="mt-2 text-sm text-sand/60 leading-relaxed font-light">
              {award.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Trophy className="text-primary/20 group-hover:text-primary transition-colors" size={24} />
            {award.link && (
              <a
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-white transition-all"
                aria-label="View Award"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default memo(AwardsSection);
