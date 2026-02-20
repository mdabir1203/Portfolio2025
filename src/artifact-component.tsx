import { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { Github, Instagram, Linkedin, MonitorPlay, Leaf, ExternalLink, Twitter, MessageCircle } from 'lucide-react';

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
  const { scrollYProgress } = useScroll(); // Keep for global if needed, but we'll use horizontal for effects
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

  // Hero section opacity fade
  // Hero section effects mapped to horizontal progress
  const heroOpacity = useTransform(scrollXProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollXProgress, [0, 0.1], [1, 0.95]);

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

    const handleWheel = (e: WheelEvent) => {
      const el = horizontalContainerRef.current;
      if (!el) return;

      // If scrolling horizontally already, let native behavior take over
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Convert vertical scroll to horizontal
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const container = horizontalContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
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

  // Emotional Background Transitions (Mapped to horizontal progress)
  const bgColor = useTransform(
    scrollXProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ['#061312', '#081a19', '#032520', '#051b1a', '#061312', '#040b0a']
  );

  const orderedSections = useMemo(
    () => getSectionOrderForPersona(persona),
    [persona],
  );

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'home':
        return (
          <section key="home" id="home" className="snap-section flex flex-col items-center justify-center relative px-6 z-20">
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

                <div className="text-left space-y-6">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.85] text-white tracking-tighter font-serif mb-4 flex flex-col">
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

                  <p className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-mono uppercase tracking-[0.25em] text-primary/70">
                    {persona === 'recruiter' && 'Built for hiring managers & talent teams'}
                    {persona === 'client' && 'For founders & teams shipping secure AI products'}
                    {persona === 'collaborator' && 'For engineers who care about systems & craft'}
                    {persona === 'general' && 'Human-first AI, culture, and craft'}
                  </p>

                  <p className="text-sand/60 text-lg md:text-2xl max-w-2xl leading-relaxed font-light">
                    {persona === 'recruiter' && (
                      <>
                        AI developer, Rust engineer, and security specialist with a bias for ship-ready systems.
                        Proven in blocking real exploits, shipping multi-agent workflows, and driving retention and ROI.
                      </>
                    )}
                    {persona === 'client' && (
                      <>
                        I help you design and deploy AI products that are safe, explainable, and measurably useful.
                        From multi-agent copilots to secure data layers, every build is tied to business impact.
                      </>
                    )}
                    {persona === 'collaborator' && (
                      <>
                        I explore the edges of agents, Rust systems, and security—then open-source the playbooks.
                        Expect thoughtful trade-offs, observability by design, and a love for weird side quests.
                      </>
                    )}
                    {persona === 'general' && (
                      <>
                        Bridging the gap between cutting-edge AI and human stories.
                        This is where experiments, failures, and big bets on the future live side by side.
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    {persona === 'recruiter' && (
                      <>
                        <button
                          onClick={() => handleSectionChange('projects')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(23,207,190,0.4)] hover:shadow-[0_0_40px_rgba(23,207,190,0.6)] hover:scale-105 transition-all duration-300"
                        >
                          View Projects & Case Studies
                        </button>
                        <a
                          href="/resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-sm font-semibold tracking-[0.18em] uppercase hover:bg-primary/10 transition-colors duration-300"
                        >
                          Open Resume
                        </a>
                      </>
                    )}
                    {persona === 'client' && (
                      <>
                        <button
                          onClick={() => handleSectionChange('contact')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(23,207,190,0.4)] hover:shadow-[0_0_40px_rgba(23,207,190,0.6)] hover:scale-105 transition-all duration-300"
                        >
                          Book a Discovery Call
                        </button>
                        <button
                          onClick={() => handleSectionChange('impact')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-sm font-semibold tracking-[0.18em] uppercase hover:bg-primary/10 transition-colors duration-300"
                        >
                          See Impact Stories
                        </button>
                      </>
                    )}
                    {persona === 'collaborator' && (
                      <>
                        <button
                          onClick={() => handleSectionChange('impact')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(23,207,190,0.4)] hover:shadow-[0_0_40px_rgba(23,207,190,0.6)] hover:scale-105 transition-all duration-300"
                        >
                          Explore Technical Deep Dives
                        </button>
                        <a
                          href="https://github.com/mdabir1203"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-sm font-semibold tracking-[0.18em] uppercase hover:bg-primary/10 transition-colors duration-300"
                        >
                          View GitHub
                        </a>
                      </>
                    )}
                    {persona === 'general' && (
                      <>
                        <button
                          onClick={() => handleSectionChange('skills')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_0_25px_rgba(23,207,190,0.4)] hover:shadow-[0_0_40px_rgba(23,207,190,0.6)] hover:scale-105 transition-all duration-300"
                        >
                          Meet the Mindset
                        </button>
                        <button
                          onClick={() => handleSectionChange('recommendations')}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-sm font-semibold tracking-[0.18em] uppercase hover:bg-primary/10 transition-colors duration-300"
                        >
                          See What Others Say
                        </button>
                      </>
                    )}
                  </div>
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
        );
      case 'skills':
        return (
          <section key="skills" id="skills" className="snap-section flex items-center py-32 px-6 z-20 relative">
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
                  <span className="text-primary animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary via-white/80 to-primary bg-[length:200%_auto]">
                    {persona === 'client' ? 'Revenue & Risk.' : persona === 'recruiter' ? 'Teams & Outcomes.' : 'Measurable Impact.'}
                  </span>
                </h2>

                <div className="space-y-6 text-lg md:text-xl text-sand/70 leading-relaxed font-light">
                  {persona === 'recruiter' && (
                    <>
                      <p>
                        I operate as an <span className="text-primary font-mono border-b border-primary/30">Efficiency & Security Architect</span> inside AI teams.
                        I slot into product pods to de-risk launches, harden systems, and unblock engineering throughput.
                      </p>
                      <p>
                        From incident response to multi-LLM workflows, the focus is simple: reduce surprises, increase signal, and make your next hire the calmest one of the quarter.
                      </p>
                    </>
                  )}
                  {persona === 'client' && (
                    <>
                      <p>
                        Think of this as an embedded AI partner: we co-design flows, align them with your governance constraints, and then ship in small, observable increments.
                      </p>
                      <p>
                        You get clear phases, honest trade-offs, and a systems view that keeps compliance, security, and UX talking to each other instead of fighting.
                      </p>
                    </>
                  )}
                  {persona === 'collaborator' && (
                    <>
                      <p>
                        I care about primitives—queues, schedulers, memory layouts, agent protocols—and how they behave under failure.
                      </p>
                      <p>
                        If you like arguing about observability, safety rails, or how to keep latency predictable while talking to 5+ models, you’re in the right place.
                      </p>
                    </>
                  )}
                  {persona === 'general' && (
                    <>
                      <p>
                        I'm an <span className="text-primary font-mono border-b border-primary/30">Efficiency & Security Architect</span>.
                        I specialize in deploying AI workflows that protect assets while recapturing thousands of hours through intelligent automation.
                      </p>
                      <p>
                        I turn \"magic\" technology into predictable <span className="text-white italic">business advantages</span>.
                        This portfolio traces the mindset behind those decisions, not just the highlight reel.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 glass-panel rounded-3xl group transition-all duration-500 hover:border-primary/50">
                  <span className="text-primary/50 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">
                    // THE ADVANTAGE
                  </span>
                  <p className="text-2xl font-bold text-white font-serif">
                    {persona === 'client'
                      ? 'High-ROI AI deployments that don’t blow up compliance.'
                      : persona === 'recruiter'
                        ? 'Operators who can speak to both execs and infra.'
                        : 'High-ROI AI deployments for 2026 and beyond.'}
                  </p>
                </div>

                <div className="p-8 glass-panel rounded-3xl border-white/5 hover:border-primary/40 group transition-all duration-500">
                  <span className="text-primary/40 font-mono text-[10px] tracking-widest uppercase mb-4 block group-hover:text-primary transition-colors">
                    // THE OUTCOME
                  </span>
                  <p className="text-2xl font-bold text-white font-serif tracking-tight leading-snug">
                    {persona === 'collaborator'
                      ? 'Systems that are fun to debug, resilient in production, and honest about trade-offs.'
                      : 'Empowering human agency through strategic automation.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
        );
      case 'projects':
        return (
          <section key="projects" id="projects" className="snap-section flex items-center min-h-screen z-20 relative">
            <ProjectsSection projects={projects} />
          </section>
        );
      case 'recommendations':
        return (
          <section key="recommendations" id="recommendations" className="snap-section flex items-center py-32 z-20 relative">
            <RecommendationSection recommendations={linkedinRecommendations} />
          </section>
        );
      case 'awards':
        return (
          <section key="awards" id="awards" className="snap-section flex items-center py-32 bg-card/10 z-20 relative">
            <AwardsSection awards={awards} />
          </section>
        );
      case 'thoughts':
        return (
          <section key="thoughts" id="thoughts" className="snap-section py-32 px-6 z-20 relative">
            <BlogSection
              posts={posts}
              isFetching={isFetchingPosts}
              onRetry={fetchMediumPosts}
            />
          </section>
        );
      case 'videos':
        return (
          <section key="videos" id="videos" className="snap-section py-32 px-6 z-20 relative bg-card/5">
            <VideosSection />
          </section>
        );
      case 'impact':
        return (
          <section key="impact" id="impact" className="snap-section z-20 relative overflow-hidden">
            <DataStorySection />
          </section>
        );
      case 'contact':
        return (
          <section key="contact" id="contact" className="snap-section flex flex-col justify-center py-32 px-6 relative z-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 border-b border-white/10 pb-4 text-white">
                {persona === 'client'
                  ? 'Scope a build. Share a risk. Start small.'
                  : persona === 'recruiter'
                    ? 'Initialize Connection.'
                    : persona === 'collaborator'
                      ? 'Ship something weird together.'
                      : 'Initialize Connection.'}
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
                  metric={persona === 'client' ? 'B2B & Exec Threads' : 'B2B Strategic Vision'}
                  color="primary"
                />
                <SocialCard
                  icon={<Github className="w-6 h-6" />}
                  platform="GitHub"
                  handle="@mdabir1203"
                  link="https://github.com/mdabir1203"
                  metric={persona === 'collaborator' ? 'Rust, agents & experiments' : 'Modular Rust & RedAGPT'}
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
          </section>
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
        <BackgroundEffects mouseX={mouseX} mouseY={mouseY} scrollValue={scrollValue} canvasRef={canvasRef} />

        <Navigation activeTab={activeSection} onTabClick={handleSectionChange} />

        <div
          ref={horizontalContainerRef}
          className="horizontal-snap-container h-full w-screen"
        >
          {orderedSections.map(renderSection)}
        </div>

        {consentStatus === 'unknown' && (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4 sm:pb-6">
            <div className="pointer-events-auto max-w-3xl w-full rounded-2xl border border-white/10 bg-[#021513]/95 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-5 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-[0.22em] text-primary/70">
                    Optional Personalization
                  </p>
                  <p className="text-sm sm:text-base text-sand/80">
                    I use a tiny cookie/local preference to remember whether you&apos;re a recruiter, client, or collaborator
                    so the hero, CTAs, and layout feel tailored to you. No cross-site tracking, ads, or third-party scripts.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-[220px]">
                  <button
                    type="button"
                    onClick={denyConsent}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-sand/80 hover:bg-white/10 transition-colors"
                  >
                    Keep it neutral
                  </button>
                  <button
                    type="button"
                    onClick={grantConsent}
                    className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary px-4 py-2 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-primary-foreground shadow-[0_0_22px_rgba(23,207,190,0.55)] hover:shadow-[0_0_32px_rgba(23,207,190,0.8)] transition-all"
                  >
                    Allow personalization
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </InteractiveCursor >
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
