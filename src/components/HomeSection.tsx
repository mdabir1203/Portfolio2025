import { FC, memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { LinkedInRecommendation } from '../data/linkedin-recommendations';
import SocialPresenceShowcase from './SocialPresenceShowcase';

interface HomeSectionProps {
  onHireClick: () => void;
  isHired: boolean;
  linkedinRecommendations: LinkedInRecommendation[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  },
};

const ProfileCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-[2rem] bg-card/50 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden group"
    >
      <div
        style={{ transform: "translateZ(50px)" }}
        className="absolute inset-0 z-10 p-2"
      >
        <img
          src="/images/profile.webp"
          alt="Mohammad Abir Abbas"
          className="w-full h-full object-cover rounded-[1.5rem] shadow-inner"
        />
      </div>

      {/* Dynamic Glow / Reflection */}
      <div
        className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ transform: "translateZ(60px)" }}
      />
    </motion.div>
  );
};

const HomeSection: FC<HomeSectionProps> = ({ onHireClick, isHired, linkedinRecommendations }) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={containerVariants}
      className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        {/* Text Content */}
        <motion.div variants={containerVariants} className="space-y-8 text-center lg:text-left">
          <motion.div variants={itemVariants}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-primary/20">
              Creative Technologist & Storyteller
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
              Mohammad <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Abir Abbas</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transforming global cultural intelligence into AI-powered enterprise decisions.
              I embed diverse cultural insights into risk modeling and strategic planning, empowering C-suite executives to make data-driven decisions that respect regional nuances.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {["AI Whisperer", "Rust Artisan", "Vibe Coder"].map((tag) => (
              <span key={tag} className="px-5 py-2.5 rounded-full bg-secondary/30 border border-white/5 text-sm md:text-base font-medium text-foreground backdrop-blur-md">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              onClick={onHireClick}
              className="relative px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(23,207,190,0.4)] hover:shadow-[0_0_40px_rgba(23,207,190,0.6)] hover:scale-105 transition-all duration-300 active:scale-95"
            >
              {isHired ? 'Hired!' : 'Hire Me'}
            </button>
          </motion.div>


          <motion.div variants={itemVariants} className="block">
            <div className="inline-flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 px-5 py-4 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-md shadow-lg">
              <span className="text-2xl animate-pulse">🌏</span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground tracking-wide uppercase text-[0.7rem]">
                  Global Mobility
                </p>
                <p className="text-sm text-muted-foreground leading-snug max-w-md">
                  Open to relocation to <span className="text-primary font-medium">Thailand (Bangkok)</span> & <span className="text-primary font-medium">Dubai</span> for <span className="text-foreground">AI Augmented Compliance</span> & <span className="text-foreground">Business Analyst</span> roles.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-8">
            {[
              {
                name: 'Instagram',
                url: 'https://www.instagram.com/u_know_whoab1r/',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                )
              },
              {
                name: 'Facebook',
                url: 'https://www.facebook.com/xplocide.abir',
                label: 'মোহাম্মদ আবীর',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                )
              },
              {
                name: 'GitHub',
                url: 'https://github.com/mdabir1203',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                )

              }
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-card/30 border border-white/5 backdrop-blur-md text-muted-foreground hover:text-primary hover:bg-white/5 hover:border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(23,207,190,0.3)]"
                title={social.label || social.name}
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(23,207,190,0.4)]"
              title="Download Cloud CV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span className="sr-only">Download Cloud CV</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Profile Card */}
        <motion.div variants={itemVariants} className="relative perspective-1000">
          <ProfileCard />
        </motion.div>
      </div>

      <motion.div variants={containerVariants} className="mb-24">
        <SocialPresenceShowcase />
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={containerVariants}>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-16 font-serif">
          LinkedIn Recommendations
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkedinRecommendations.map((rec, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-card border border-white/5 shadow-xl flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <img src={rec.avatar} alt={rec.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                <div>
                  <h3 className="text-lg font-bold text-foreground font-serif">{rec.name}</h3>
                  <p className="text-sm text-primary">{rec.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                "{rec.content}"
              </p>
              <div className="mt-auto flex gap-1 text-accent">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center mt-12">
          <a
            href="https://www.linkedin.com/in/abir-abbas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium tracking-wide uppercase text-sm border-b border-primary/30 pb-1 hover:border-primary"
          >
            View More on LinkedIn →
          </a>
        </motion.div>
      </motion.div>
    </motion.section >
  );
};

export default memo(HomeSection);
