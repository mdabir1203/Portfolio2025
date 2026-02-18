import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Github, Instagram, Linkedin, MonitorPlay, Leaf, ExternalLink } from 'lucide-react';

import BackgroundEffects from './components/BackgroundEffects';
import InteractiveCursor from './components/InteractiveCursor';
import Navigation from './components/Navigation';
import RecommendationSection from './components/RecommendationSection';
import AwardsSection from './components/AwardsSection';
import BlogSection from './components/BlogSection';
import VideosSection from './components/VideosSection';
import DataStorySection from './components/DataStorySection';

import { linkedinRecommendations } from './data/linkedin-recommendations';
import { awards } from './data/awards';
import { MediumPost } from './types';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ArtifactComponent = () => {
  const [activeSection, setActiveSection] = useState('home');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollValue = useMotionValue(0);
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollYProgress } = useScroll();

  const fetchMediumPosts = useCallback(async () => {
    setIsFetchingPosts(true);
    try {
      // Using rss2json to convert Medium RSS to JSON
      const rssUrl = 'https://medium.com/feed/@md.abir1203';
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
      const data = await response.json();
      if (data.status === 'ok') {
        setPosts(data.items);
      }
    } catch (error) {
      console.error('Error fetching Medium posts:', error);
    } finally {
      setIsFetchingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchMediumPosts();
  }, [fetchMediumPosts]);

  useEffect(() => {
    // GSAP Immersive Animations
    const sections = ['#home', '#skills', '#projects', '#recommendations', '#awards', '#thoughts', '#videos', '#contact'];

    sections.forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Hero section opacity fade
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollValue.set(scrollY / maxScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      update: () => void;
      draw: () => void;
    };

    let particles: Particle[] = [];

    class P implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(0, 191, 165, ${Math.random() * 0.5})`;
        this.life = 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.9 && particles.length < 50) {
        particles.push(new P(Math.random() * canvas.width, Math.random() * canvas.height));
      }
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Emotional Background Transitions
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ['#061312', '#081a19', '#032520', '#061312', '#040b0a']
  );

  return (
    <InteractiveCursor>
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="text-ink min-h-screen font-sans selection:bg-primary/30 selection:text-ink relative overflow-x-hidden transition-colors duration-1000"
      >
        <BackgroundEffects mouseX={mouseX} mouseY={mouseY} scrollValue={scrollValue} canvasRef={canvasRef} />

        <Navigation activeTab={activeSection} onTabClick={handleSectionChange} />

        {/* SCROLL 01: THE HOOK (The Terminal) */}
        <section id="home" className="h-screen flex flex-col items-center justify-center relative px-6 z-20">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="max-w-6xl w-full"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative shrink-0 group"
              >
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20 backdrop-blur-sm relative z-10 p-2 bg-card/20 group-hover:border-primary/50 transition-all duration-700">
                  <img
                    src="/images/profile.webp"
                    alt="Mohammad Abir Abbas"
                    className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl shadow-primary/20">
                  Efficiency Architect • 2026
                </div>
              </motion.div>

              <div className="text-left">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.85] text-white tracking-tighter font-serif mb-12 flex flex-col">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      textShadow: ["0 0 0px rgba(14,249,215,0)", "0 0 20px rgba(14,249,215,0.3)", "0 0 0px rgba(14,249,215,0)"]
                    }}
                    transition={{
                      opacity: { duration: 0.8, delay: 0.5 },
                      x: { duration: 0.8, delay: 0.5 },
                      textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="block"
                  >
                    SCALING
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      opacity: { duration: 0.8, delay: 0.7 },
                      x: { duration: 0.8, delay: 0.7 },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="text-primary italic block"
                  >
                    INNOVATION
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                    }}
                    transition={{
                      opacity: { duration: 0.8, delay: 0.9 },
                      y: { duration: 0.8, delay: 0.9 },
                      filter: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="block"
                  >
                    SAFELY.
                  </motion.span>
                </h1>
                <p className="text-sand/60 text-lg md:text-2xl max-w-2xl leading-relaxed font-light">
                  Bridging the gap between cutting-edge AI and measurable business ROI.
                  Simple, secure, and built to scale.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center"
            >
              <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-primary/40 mb-2">Continue Journey</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* SCROLL 02: THE ALCHEMIST'S MINDSET (Technical & Visual Riffs) */}
        <section id="skills" className="min-h-screen flex items-center py-32 px-6 max-w-6xl mx-auto z-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none font-serif">
                Built for <br />
                <span className="text-primary animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary via-white/80 to-primary bg-[length:200%_auto]">Measurable Impact.</span>
              </h2>

              <div className="space-y-6 text-lg md:text-xl text-sand/70 leading-relaxed font-light">
                <p>
                  I'm an <span className="text-primary font-mono border-b border-primary/30">Efficiency & Security Architect</span>. I specialize in deploying AI workflows that protect enterprise assets while recapturing thousands of engineering hours through intelligent automation.
                </p>
                <p>
                  I turn "magic" technology into predictable <span className="text-white italic">business advantages</span>. My <a href="https://medium.com/@md.abir1203" target="_blank" className="text-primary underline decoration-primary/20 underline-offset-8 transition-all hover:decoration-primary/60">Reading My Mind</a> blog deep-dives into the strategic "why" behind high-performance code, while my social presence tracks the momentum of the 2026 digital layer.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 glass-panel rounded-3xl group transition-all duration-500 hover:border-primary/50">
                <span className="text-primary/50 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors text-xs tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">// THE ADVANTAGE</span>
                <p className="text-2xl font-bold text-white font-serif">High-ROI AI Deployments (2026)</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[10px] text-primary tracking-tighter">Operational Scaling</span>
                  <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[10px] text-primary tracking-tighter">Risk Mitigation</span>
                </div>
              </div>

              <div className="p-8 glass-panel rounded-3xl border-white/5 hover:border-primary/40 group transition-all duration-500">
                <span className="text-primary/40 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">// THE OUTCOME</span>
                <p className="text-2xl font-bold text-white font-serif tracking-tight leading-snug">Empowering Human Agency Through Strategic Automation</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SCROLL 03: THE HUMANE FRAMEWORK (Wavelink) */}
        <section id="projects" className="min-h-screen flex items-center py-32 px-6 bg-card/20 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <Leaf className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Connectivity that doesn’t <br />cost the earth.</h2>

            <p className="text-xl md:text-2xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Technology must be humane. Through <strong className="text-primary font-semibold italic">Wavelink</strong>, we are building the no-waste paper movement via smart NFC networking. One tap. Endless connections. Zero environmental waste.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-primary text-sm uppercase tracking-widest">
              <div className="p-6 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">Universal NFC</div>
              <div className="p-6 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">GDPR Compliant</div>
              <div className="p-6 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">Zero Paper</div>
            </div>

            <div className="mt-16">
              <a
                href="https://wave-link-cards.vercel.app"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Explore Wavelink <ExternalLink size={18} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* SCROLL 04: THE SOCIAL CONTRACT (Recommendations) */}
        <section id="recommendations" className="min-h-screen flex items-center py-32 z-20 relative">
          <RecommendationSection recommendations={linkedinRecommendations} />
        </section>

        {/* SCROLL 05: THE VALIDATION (Awards) */}
        <section id="awards" className="min-h-screen flex items-center py-32 bg-card/10 z-20 relative">
          <AwardsSection awards={awards} />
        </section>

        {/* NEW SCROLL 05.1: THE INTELLECT (Thoughts) */}
        <section id="thoughts" className="min-h-screen py-32 px-6 max-w-7xl mx-auto z-20 relative">
          <BlogSection
            posts={posts}
            isFetching={isFetchingPosts}
            onRetry={fetchMediumPosts}
          />
        </section>

        {/* NEW SCROLL 05.2: THE VISUAL (Videos) */}
        <section id="videos" className="min-h-screen py-32 px-6 max-w-7xl mx-auto z-20 relative bg-card/5">
          <VideosSection />
        </section>

        {/* PHASE 6: THE IMPACT (Data Story & Chaos Animation) */}
        <section id="impact" className="min-h-screen z-20 relative overflow-hidden">
          <DataStorySection />
        </section>

        {/* SCROLL 06: THE INVISIBLE ARCHITECTURE (Socials & GitHub) */}
        <section id="contact" className="min-h-screen flex flex-col justify-center py-32 px-6 max-w-6xl mx-auto relative z-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-16 border-b border-white/10 pb-8 text-white">Initialize Connection.</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SocialCard
                icon={<Linkedin className="w-6 h-6" />}
                platform="LinkedIn"
                handle="/in/abir-abbas"
                link="https://linkedin.com/in/abir-abbas"
                metric="B2B Strategic Vision"
                color="primary"
              />
              <SocialCard
                icon={<Github className="w-6 h-6" />}
                platform="GitHub"
                handle="@mdabir1203"
                link="https://github.com/mdabir1203"
                metric="Modular Rust & RedAGPT"
                color="white"
              />
              <SocialCard
                icon={<Instagram className="w-6 h-6" />}
                platform="Instagram"
                handle="@uknowwho_ab1r"
                link="https://instagram.com/uknowwho_ab1r"
                metric="Daily Visual Riffs"
                color="accent"
              />
              <SocialCard
                icon={<MonitorPlay className="w-6 h-6" />}
                platform="YouTube"
                handle="@AIAugmented"
                link="https://youtube.com/@AIAugmented"
                metric="TrendRadar & AI Deep Dives"
                color="destructive"
              />
            </div>
          </motion.div>

          <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-muted-foreground/40 text-sm">
            <p>© 2026 Mohammad Abir Abbas. All Systems Operational.</p>
            <div className="flex gap-8 mt-4 md:mt-0 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-primary/40 cursor-default">Status: Online</span>
              <span className="text-primary/40 cursor-default">Latency: 24ms</span>
              <span className="text-primary/40 cursor-default">Region: Global</span>
            </div>
          </footer>
        </section>

      </motion.div>
    </InteractiveCursor>
  );
};

// Reusable SocialCard with premium styles
function SocialCard({ icon, platform, handle, link, metric, color }: any) {
  const colorStyles: Record<string, string> = {
    primary: "group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5",
    accent: "group-hover:text-accent group-hover:border-accent/30 group-hover:bg-accent/5",
    destructive: "group-hover:text-destructive group-hover:border-destructive/30 group-hover:bg-destructive/5",
    white: "group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5",
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${colorStyles[color] || colorStyles.primary}`}
    >
      <div className="text-muted-foreground/60 transition-colors mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{platform}</h3>
      <p className="font-mono text-xs text-muted-foreground mb-6">{handle}</p>
      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold">{metric}</p>
      </div>
    </a>
  );
}

export default memo(ArtifactComponent);
