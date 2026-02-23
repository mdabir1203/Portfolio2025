import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Github, Instagram, Linkedin, MonitorPlay, Twitter, MessageCircle } from 'lucide-react';

import BackgroundEffects from './components/BackgroundEffects';
import InteractiveCursor from './components/InteractiveCursor';
import Navigation from './components/Navigation';
import RecommendationSection from './components/RecommendationSection';
import AwardsSection from './components/AwardsSection';
import BlogSection from './components/BlogSection';
import VideosSection from './components/VideosSection';
import DataStorySection from './components/DataStorySection';
import ProjectsSection from './components/ProjectsSection';

import { linkedinRecommendations } from './data/linkedin-recommendations';
import { awards } from './data/awards';
import { projects } from './data/projects';
import { MediumPost } from './types';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePersona } from './PersonaContext';
import type { Persona } from './persona';
import { useConsent } from './ConsentContext';

gsap.registerPlugin(ScrollTrigger);

type SectionId =
  | 'home'
  | 'skills'
  | 'projects'
  | 'recommendations'
  | 'awards'
  | 'thoughts'
  | 'videos'
  | 'impact'
  | 'contact';

const useMagnetic = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Magnetic pull strength
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x: springX, y: springY, handleMouseMove, handleMouseLeave };
};

const getSectionOrderForPersona = (persona: Persona): SectionId[] => {
  // For general visitors, lean into personality earlier.
  if (persona === 'general') {
    return ['home', 'skills', 'recommendations', 'awards', 'projects', 'thoughts', 'videos', 'impact', 'contact'];
  }

  // Recruiters: projects and validation up-front.
  if (persona === 'recruiter') {
    return ['home', 'projects', 'awards', 'recommendations', 'skills', 'impact', 'thoughts', 'videos', 'contact'];
  }

  // Clients/founders: value, impact, and ways to work together.
  if (persona === 'client') {
    return ['home', 'projects', 'impact', 'skills', 'recommendations', 'awards', 'thoughts', 'videos', 'contact'];
  }

  // Collaborators/engineers: mindset, deep-dives, then social/contact.
  if (persona === 'collaborator') {
    return ['home', 'skills', 'impact', 'projects', 'thoughts', 'videos', 'recommendations', 'awards', 'contact'];
  }

  return ['home', 'skills', 'projects', 'recommendations', 'awards', 'thoughts', 'videos', 'impact', 'contact'];
};

/**
 * HeroHeading — CSS lineIn fade-in + sequential setInterval typewriter.
 * No Framer Motion infinite loops. All three lines run via one async useEffect chain.
 */
const HeroHeading = memo(() => {
  const [l1, setL1] = useState('');
  const [l2, setL2] = useState('');
  const [l3, setL3] = useState('');
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const typeLine = (
      setter: React.Dispatch<React.SetStateAction<string>>,
      text: string,
      lineIdx: number,
      startDelay: number,
      charDelay: number
    ): Promise<void> => new Promise((resolve) => {
      setTimeout(() => {
        let i = 0;
        setActiveLine(lineIdx);
        const iv = setInterval(() => {
          if (cancelled) { clearInterval(iv); return; }
          i++;
          setter(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(iv);
            setActiveLine(0);
            resolve();
          }
        }, charDelay);
      }, startDelay);
    });

    (async () => {
      await typeLine(setL1, 'SCALING', 1, 500, 55);
      await typeLine(setL2, 'INNOVATION', 2, 0, 10);
      await typeLine(setL3, 'SAFELY.', 3, 0, 50);
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative z-30 pointer-events-none">
      <h1 className="text-[9vw] md:text-[7vw] lg:text-[6vw] font-black leading-[0.8] tracking-tighter flex flex-col">
        <motion.span
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-line font-sans text-white/90"
        >
          <span className={activeLine === 1 ? 'type-cursor' : ''}>{l1 || '\u00A0'}</span>
        </motion.span>

        <motion.span
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="hero-line font-serif italic text-primary mt-12"
        >
          <span className={activeLine === 2 ? 'type-cursor' : ''}>{l2 || '\u00A0'}</span>
        </motion.span>

        <motion.span
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="hero-line font-sans text-white mt-6 mix-blend-difference"
        >
          <span className={activeLine === 3 ? 'type-cursor' : ''}>{l3 || '\u00A0'}</span>
        </motion.span>
      </h1>
    </div>
  );
});

const ArtifactComponent = () => {
  const { persona } = usePersona();
  const { status: consentStatus, grant: grantConsent, deny: denyConsent } = useConsent();
  const [activeSection, setActiveSection] = useState('home');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollValue = useMotionValue(0);
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: horizontalContainerRef,
    axis: "x"
  });

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
    const container = horizontalContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        // Increased sensitivity: multiplier (1.5) to make it faster
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Map vertical movement keys to horizontal scroll
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        container.scrollLeft += 250; // Increased from 100
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        container.scrollLeft -= 250; // Increased from 100
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        container.scrollLeft += window.innerWidth;
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        container.scrollLeft -= window.innerWidth;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: horizontalContainerRef.current,
      threshold: 0.5,
      rootMargin: "0px"
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'skills', 'projects', 'recommendations', 'awards', 'thoughts', 'videos', 'impact', 'contact'];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element && horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTo({
        left: element.offsetLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  // Hero section effects mapped to scroll progress
  const heroOpacity = useTransform(scrollXProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollXProgress, [0, 0.1], [1, 0.95]);

  const orderedSections = useMemo(
    () => getSectionOrderForPersona(persona),
    [persona],
  );

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
      const el = horizontalContainerRef.current;
      if (!el) return;
      const scrollX = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      scrollValue.set(scrollX / (maxScroll || 1));
    };

    const container = horizontalContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
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

      // Speed up particles based on scroll
      const scrollFactor = scrollValue.get() * 5 + 1;

      if (Math.random() > 0.85 && particles.length < 100) {
        particles.push(new P(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.speedX *= (1 + scrollValue.get() * 0.01);
        p.update();
        p.draw();
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Emotional Background Transitions (Mapped to scroll progress)
  const bgColor = useTransform(
    scrollXProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ['#061312', '#081a19', '#032520', '#0a1f2e', '#161312', '#040b0a']
  );

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'home':
        return (
          <div key="home" className="flex flex-col items-center justify-center relative z-20 h-full w-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[10%] left-[-5%] text-[20vw] font-black text-white/5 whitespace-nowrap select-none">ARCHITECTURE</div>
              <div className="absolute bottom-[10%] right-[-5%] text-[20vw] font-black text-primary/5 whitespace-nowrap select-none">EFFICIENCY</div>
            </div>

            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              className="max-w-7xl mx-auto px-8 md:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative"
            >
              <div className="z-30">
                <HeroHeading />

                <div className="mt-12 space-y-8 max-w-xl relative">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="inline-block px-4 py-1 rounded-sm bg-primary/10 border-l-4 border-primary text-[10px] font-mono uppercase tracking-[0.25em] text-primary"
                  >
                    {persona === 'recruiter' && 'Protocol: Talent Acquisition'}
                    {persona === 'client' && 'Protocol: Strategic Build'}
                    {persona === 'collaborator' && 'Protocol: Open Source Craft'}
                    {persona === 'general' && 'Human-Centric AI Systems'}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="text-sand/70 text-lg md:text-xl leading-relaxed font-light backdrop-blur-sm bg-black/5 p-4 rounded-lg border border-white/5"
                  >
                    {persona === 'recruiter' && (
                      <>
                        <span className="text-white font-medium">Efficiency Architect.</span> Rust engineer & security specialist.
                        Proven in blocking real exploits and shipping multi-agent workflows.
                      </>
                    )}
                    {persona === 'client' && (
                      <>
                        <span className="text-white font-medium">Strategic Deployment.</span> I help you design and deploy AI products that are
                        safe, explainable, and measurably useful.
                      </>
                    )}
                    {persona === 'collaborator' && (
                      <>
                        <span className="text-white font-medium">Craft & Systems.</span> I explore the edges of agents, Rust, and security—then open-source the playbooks.
                      </>
                    )}
                    {persona === 'general' && (
                      <>
                        Bridging the gap between cutting-edge AI and human stories.
                        Experiments, failures, and big bets on the future live side by side.
                      </>
                    )}
                  </motion.p>

                  <div className="flex flex-wrap items-center gap-6 mt-10">
                    <MagneticButton
                      onClick={() => handleSectionChange('projects')}
                      className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    >
                      Explore Work
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => handleSectionChange('contact')}
                      className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors"
                    >
                      <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                      Connect
                    </MagneticButton>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end"
              >
                <div className="relative w-72 h-96 md:w-80 md:h-[32rem] group">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.8 }}
                    className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-50 origin-bottom"
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 1 }}
                    className="absolute -inset-2 border border-primary/20 mask-brutalist pointer-events-none origin-left"
                  />
                  <div className="w-full h-full overflow-hidden mask-brutalist bg-card relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                    <motion.img
                      initial={{ scale: 1.5, filter: 'grayscale(100%) contrast(150%)' }}
                      animate={{ scale: 1.1, filter: 'grayscale(100%) contrast(100%)' }}
                      transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                      src="/images/profile.webp"
                      alt="Mohammad Abir Abbas"
                      className="w-full h-full object-cover duotone-teal"
                    />
                  </div>

                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute -bottom-20 left-0 w-full flex justify-between items-center px-4"
              >
                <div className="hidden lg:flex gap-12 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
                  <span>Craft</span>
                  <span>Code</span>
                  <span>Impact</span>
                </div>
                <div
                  className="animate-bounce flex flex-col items-center cursor-pointer group"
                  onClick={() => handleSectionChange('skills')}
                >
                  <span className="text-[8px] tracking-[0.5em] uppercase font-mono text-primary/40 mb-2 group-hover:text-primary transition-colors">INITIATE</span>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        );
      case 'skills':
        return (
          <div key="skills" className="flex items-center z-20 relative h-full w-full">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              className="max-w-7xl mx-auto px-8 md:px-16 w-full grid md:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none font-serif">
                  Built for <br />
                  <span className="text-primary animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary via-white/80 to-primary bg-[length:200%_auto]">
                    {persona === 'client' ? 'Revenue & Risk.' : persona === 'recruiter' ? 'Teams & Outcomes.' : 'Measurable Impact.'}
                  </span>
                </h2>

                <div className="space-y-6 text-lg md:text-xl text-sand/70 leading-relaxed font-light">
                  <p>
                    I operate as an <span className="text-primary font-mono border-b border-primary/30">Efficiency & Security Architect</span>.
                    I specialize in deploying AI workflows that protect assets while recapturing thousands of hours through intelligent automation.
                  </p>
                  <p>
                    I turn "magic" technology into predictable <span className="text-white italic">business advantages</span>.
                    This portfolio traces the mindset behind those decisions, not just the highlight reel.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 glass-panel rounded-3xl group transition-all duration-500 hover:border-primary/50">
                  <span className="text-primary/50 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">
                    // THE ADVANTAGE
                  </span>
                  <p className="text-2xl font-bold text-white font-serif">
                    High-ROI AI deployments that don’t blow up compliance.
                  </p>
                </div>

                <div className="p-8 glass-panel rounded-3xl border-white/5 hover:border-primary/40 group transition-all duration-500">
                  <span className="text-primary/40 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">
                    // THE OUTCOME
                  </span>
                  <p className="text-2xl font-bold text-white font-serif tracking-tight leading-snug">
                    Empowering human agency through strategic automation.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'projects':
        return (
          <div key="projects" className="flex items-center h-full w-full z-20 relative">
            <ProjectsSection projects={projects} />
          </div>
        );
      case 'recommendations':
        return (
          <div key="recommendations" className="flex items-center py-32 z-20 relative h-full w-full">
            <RecommendationSection recommendations={linkedinRecommendations} />
          </div>
        );
      case 'awards':
        return (
          <div key="awards" className="flex items-center py-32 bg-card/10 z-20 relative h-full w-full">
            <AwardsSection awards={awards} />
          </div>
        );
      case 'thoughts':
        return (
          <div key="thoughts" className="flex items-center z-20 relative h-full w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-32">
              <BlogSection
                posts={posts}
                isFetching={isFetchingPosts}
                onRetry={fetchMediumPosts}
              />
            </div>
          </div>
        );
      case 'videos':
        return (
          <div key="videos" className="flex items-center z-20 relative bg-card/5 h-full w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-32">
              <VideosSection />
            </div>
          </div>
        );
      case 'impact':
        return (
          <div key="impact" className="z-20 relative overflow-hidden h-full w-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
              <DataStorySection />
            </div>
          </div>
        );
      case 'contact':
        return (
          <div key="contact" className="flex flex-col justify-center relative z-20 h-full w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full py-32">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 border-b border-white/10 pb-4 text-white">
                  Initialize Connection.
                </h2>
                <p className="text-sm md:text-base text-muted-foreground/70 mb-10 max-w-2xl">
                  {persona === 'client' &&
                    'Send context, constraints, and timelines—and we can quickly see if there’s a fit for an AI or systems engagement.'}
                  {persona === 'recruiter' &&
                    'Best paths for hiring conversations, referrals, or longlist validation across AI, Rust, and security roles.'}
                  {persona === 'collaborator' &&
                    'If you have an idea, repo, or odd constraint you want to explore, this is your shortcut into my brain.'}
                  {persona === 'general' &&
                    'No pressure, no pitch. Just a set of links if you ever want to continue the conversation elsewhere.'}
                </p>

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
                  <SocialCard
                    icon={<Twitter className="w-6 h-6" />}
                    platform="TikTok / X"
                    handle="@Mohamma71616280"
                    link="https://x.com/Mohamma71616280"
                    metric="AI Intelligence & Riffs"
                    color="white"
                  />
                  <SocialCard
                    icon={<MessageCircle className="w-6 h-6" />}
                    platform="WhatsApp"
                    handle="+880 1841-603542"
                    link="https://wa.me/8801841603542"
                    metric="Direct Protocol"
                    color="primary"
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
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <InteractiveCursor>
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="text-ink h-screen w-screen font-sans selection:bg-primary/30 selection:text-ink relative overflow-hidden transition-colors duration-1000"
      >
        <div className="grain-overlay" />
        <BackgroundEffects mouseX={mouseX} mouseY={mouseY} scrollValue={scrollValue} canvasRef={canvasRef} />

        <Navigation activeTab={activeSection} onTabClick={handleSectionChange} />

        <div
          ref={horizontalContainerRef}
          className="horizontal-snap-container"
        >
          {/* AI & LLM Scraper Optimization Block */}
          <aside className="sr-only" aria-hidden="true">
            <h2>Mohammad Abir Abbas - AI Business Consultant</h2>
            <p>Specialization: Strategic AI Implementation, Growth Strategy, and Enterprise Security.</p>
          </aside>

          {orderedSections.map((id) => (
            <div key={id} id={id} className="snap-section">
              {renderSection(id)}
            </div>
          ))}
        </div>

        {consentStatus === 'unknown' && (
          <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4">
            <div className="max-w-3xl w-full rounded-2xl border border-white/10 bg-[#021513]/95 backdrop-blur-xl px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-sand/80">Tailor the experience?</p>
                <div className="flex gap-3">
                  <button onClick={denyConsent} className="text-xs text-sand/60">Neutral</button>
                  <button onClick={grantConsent} className="bg-primary px-4 py-2 rounded-full text-xs font-bold uppercase">Personalize</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </InteractiveCursor>
  );
};

const MagneticButton = ({ children, onClick, className }: any) => {
  const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic();
  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
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
