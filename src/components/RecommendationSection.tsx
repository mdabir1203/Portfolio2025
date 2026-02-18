import { FC, memo } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { LinkedInRecommendation } from '../data/linkedin-recommendations';

interface RecommendationSectionProps {
    recommendations: LinkedInRecommendation[];
}

const RecommendationSection: FC<RecommendationSectionProps> = ({ recommendations }) => {
    return (
        <section id="recommendations" className="py-24 px-6 max-w-7xl mx-auto z-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
            >
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-serif mb-4">
                    Kind <span className="text-primary italic">Words</span>
                </h2>
                <p className="text-sand/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-8">
                    Voices from the people I've built with, taught, and learned from across the digital landscape.
                </p>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={rec.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-card/10 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-card/20 transition-all duration-500 overflow-hidden"
                    >
                        <div className="absolute top-4 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                            <Quote size={80} strokeWidth={1} />
                        </div>

                        <div className="relative z-10">
                            <p className="text-ink/80 italic leading-relaxed mb-8 line-clamp-6 group-hover:line-clamp-none transition-all duration-500">
                                "{rec.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                                    <img
                                        src={rec.avatar}
                                        alt={rec.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rec.name)}&background=17cfbe&color=fff`;
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-ink">{rec.name}</h4>
                                    <p className="text-xs text-ink/50 uppercase tracking-widest">{rec.role}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default memo(RecommendationSection);
