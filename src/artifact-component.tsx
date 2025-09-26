import { useState, useEffect, useRef, useCallback, memo } from 'react';

import BackgroundEffects from './components/BackgroundEffects';
import Navigation from './components/Navigation';
import HomeSection from './components/HomeSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import BlogSection from './components/BlogSection';
import TutorialsSection from './components/TutorialsSection';
import ServicesSection from './components/ServicesSection';
import JourneySection from './components/JourneySection';
import AssistantJourneySection from './components/AssistantJourneySection';
import ContactSection from './components/ContactSection';
import ExperienceSection from './components/ExperienceSection';
import AwardsSection from './components/AwardsSection';
import BlackBoxAssistant from './components/BlackBoxAssistant';

import { skills } from './data/skills';
import { projects } from './data/projects';
import { services } from './data/services';
import { linkedinRecommendations } from './data/linkedin-recommendations';
import { journey } from './data/journey';
import { experiences } from './data/experience';
import { awards } from './data/awards';
import { MediumPost } from './types';

const ArtifactComponent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isHired, setIsHired] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mediumPosts, setMediumPosts] = useState<MediumPost[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setMousePosition({ x, y }));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;
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
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`;
        this.life = 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleHireClick = () => {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;
      for (let i = 0; i < 100; i++) {
        particles.push(new P(x, y));
      }
      setIsHired(true);
      setTimeout(() => setIsHired(false), 3000);
    };

    const hireButton = document.querySelector('.hire-me-button');
    hireButton?.addEventListener('click', handleHireClick);
    return () => hireButton?.removeEventListener('click', handleHireClick);
  }, []);

  const fetchMediumPosts = useCallback(async () => {
    setIsFetchingPosts(true);
    try {
      const mediumUsername = 'md.abir1203';
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        `https://medium.com/feed/@${mediumUsername}`
      )}`;
      const response = await fetch(rssUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        setMediumPosts(data.items);
      }
    } catch (error) {
      console.error('Error fetching Medium posts:', error);
    } finally {
      setIsFetchingPosts(false);
    }
  }, []);

  // Medium posts are fetched lazily when the blog tab becomes active

  const handleTabClick = useCallback(
    (tab: string) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveTab(tab);
      if (tab === 'blog' && mediumPosts.length === 0) {
        fetchMediumPosts();
      }
    },
    [mediumPosts, fetchMediumPosts]
  );

  const handleHireNavigate = useCallback(() => handleTabClick('contact'), [handleTabClick]);

  const bookMeeting = useCallback(() => {
    window.open('https://calendly.com/abirabbasmd', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#021513] via-[#042623] to-[#062f2b] text-[#f4fffb] font-mono relative overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#033832]/95 text-[#FF7043] px-4 py-2 rounded-md border border-[#FF7043]/40 shadow-lg shadow-[#FF7043]/15 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
      >
        Skip to main content
      </a>
      <BackgroundEffects mousePosition={mousePosition} canvasRef={canvasRef} />
      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto px-6 py-12 relative z-20"
      >
        <Navigation activeTab={activeTab} onTabClick={handleTabClick} />
        {activeTab === 'home' && (
          <HomeSection
            onHireClick={handleHireNavigate}
            isHired={isHired}
            linkedinRecommendations={linkedinRecommendations}
          />
        )}
        {activeTab === 'skills' && <SkillsSection skills={skills} />}
        {activeTab === 'projects' && <ProjectsSection projects={projects} />}
        {activeTab === 'blog' && (
          <BlogSection posts={mediumPosts} isFetching={isFetchingPosts} onRetry={fetchMediumPosts} />
        )}
        {activeTab === 'tutorials' && <TutorialsSection />}
        {activeTab === 'services' && (
          <ServicesSection services={services} bookMeeting={bookMeeting} />
        )}
        {activeTab === 'awards' && <AwardsSection awards={awards} />}
        {activeTab === 'experience' && <ExperienceSection experiences={experiences} />}
        {activeTab === 'journey' && <JourneySection journey={journey} />}
        {activeTab === 'assistant' && <AssistantJourneySection />}
        {activeTab === 'contact' && <ContactSection bookMeeting={bookMeeting} />}
        <footer className="mt-24 pt-8 border-t border-[#2f6f68]/50 text-center">
          <p className="text-[#c7f2ea] mb-4">
            © 2025 Mohammad Abir Abbas.  Crafted with ♥ and a touch of chaos.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-[#9adcd1] hover:text-[#FF7043] transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-[#9adcd1] hover:text-[#FF7043] transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-[#9adcd1] hover:text-[#FF7043] transition-colors duration-300">Cookie Settings</a>
          </div>
        </footer>
      </main>

      <div
        id="cookieConsent"
        className="fixed bottom-0 left-0 right-0 bg-[#033832]/95 text-[#f1fffc] p-4 text-center z-50 hidden"
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>This website uses cookies to ensure you get the best experience.</p>
          <div className="flex gap-4">
            <button
              id="acceptCookies"
              className="bg-[#00a99d] hover:bg-[#009688] text-[#031b18] font-semibold py-2 px-4 rounded transition-colors duration-300 shadow-[0_10px_25px_rgba(0,150,136,0.25)]"
            >
              Accept All Cookies
            </button>
            <button
              id="rejectCookies"
              className="bg-[#FF7043] hover:bg-[#e8653c] text-[#0a211d] font-semibold py-2 px-4 rounded transition-colors duration-300 shadow-[0_10px_25px_rgba(255,112,67,0.28)]"
            >
              Reject All Cookies
            </button>
            <button
              id="cookieSettings"
              className="bg-[#4DB6AC] hover:bg-[#00bfa5] text-[#043530] font-semibold py-2 px-4 rounded transition-colors duration-300 shadow-[0_10px_25px_rgba(77,182,172,0.28)]"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>

      <BlackBoxAssistant />

      <style>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }

        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.25);
          border-top: 4px solid #00bfa5;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .retro-cube {
          width: 80px;
          height: 80px;
          position: absolute;
          transform-style: preserve-3d;
        }

        .retro-cube div {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, rgba(0, 150, 136, 0.65), rgba(77, 182, 172, 0.55));
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #FAFAFA;
          text-shadow: 0 0 10px rgba(250, 250, 250, 0.65);
          box-shadow: 0 0 24px rgba(0, 191, 165, 0.28), 0 0 40px rgba(255, 112, 67, 0.22);
        }

        .retro-cube .front  { transform: translateZ(40px); }
        .retro-cube .back   { transform: rotateY(180deg) translateZ(40px); }
        .retro-cube .right  { transform: rotateY(90deg) translateZ(40px); }
        .retro-cube .left   { transform: rotateY(-90deg) translateZ(40px); }
        .retro-cube .top    { transform: rotateX(90deg) translateZ(40px); }
        .retro-cube .bottom { transform: rotateX(-90deg) translateZ(40px); }

        .voxel-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .mesh-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .mesh-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, rgba(0, 191, 165, 0.32), rgba(0, 150, 136, 0));
          animation: mesh-animate 10s linear infinite;
        }

        @keyframes mesh-animate {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(10px, 10px, 0) rotate(5deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0); }
        }
      `}</style>
    </div>
  );
};

export default memo(ArtifactComponent);
