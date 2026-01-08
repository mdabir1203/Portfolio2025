import { FC, useEffect, useState } from 'react';

interface InteractiveCursorProps {
  children: React.ReactNode;
}

// Category-specific hover messages
const getHoverMessage = (element: HTMLElement): string => {
  const text = element.textContent?.trim().toLowerCase() || '';
  const buttonText = element.closest('button')?.textContent?.trim().toLowerCase() || '';
  const linkText = element.closest('a')?.textContent?.trim().toLowerCase() || '';
  const combinedText = text || buttonText || linkText;

  // Navigation tabs
  if (combinedText.includes('home')) return "Welcome home! 🏠";
  if (combinedText.includes('skills')) return "See what I can do! ⚡";
  if (combinedText.includes('projects')) return "Check out my work! 🚀";
  if (combinedText.includes('thoughts')) return "Read my mind! 💭";
  if (combinedText.includes('video writeups') || combinedText.includes('video-writeups')) return "Watch & learn! 🎬";
  if (combinedText.includes('services')) return "Let's work together! 🤝";
  if (combinedText.includes('awards')) return "See my achievements! 🏆";
  if (combinedText.includes('experience')) return "My journey so far! 📈";
  if (combinedText.includes('journey')) return "Follow my path! 🗺️";
  if (combinedText.includes('contact')) return "Let's connect! 📧";

  // Action buttons
  if (combinedText.includes('hire me') || combinedText.includes('hired')) return "Ready to hire? 💼";
  if (combinedText.includes('view more') || combinedText.includes('view on') || combinedText.includes('view')) return "Take a look! 👀";
  if (combinedText.includes('send message') || combinedText.includes('send')) return "Drop me a line! ✉️";
  if (combinedText.includes('schedule') || combinedText.includes('meeting') || combinedText.includes('book')) return "Book a chat! 📅";
  if (combinedText.includes('learn more') || combinedText.includes('read more')) return "Dive deeper! 🔍";
  if (combinedText.includes('close')) return "Close this! ✖️";
  if (combinedText.includes('retry') || combinedText.includes('try again')) return "Give it another shot! 🔄";
  if (combinedText.includes('download') || combinedText.includes('get')) return "Grab it! ⬇️";
  if (combinedText.includes('submit') || combinedText.includes('apply')) return "Let's do this! ✅";

  // Social links
  if (combinedText.includes('linkedin') || element.closest('a[href*="linkedin"]')) return "Connect on LinkedIn! 💼";
  if (combinedText.includes('github') || element.closest('a[href*="github"]')) return "Check my code! 💻";
  if (combinedText.includes('medium') || element.closest('a[href*="medium"]')) return "Read my articles! ✍️";
  if (combinedText.includes('twitter') || element.closest('a[href*="twitter"]')) return "Follow me! 🐦";
  if (combinedText.includes('instagram') || element.closest('a[href*="instagram"]')) return "See my stories! 📸";
  if (combinedText.includes('facebook') || element.closest('a[href*="facebook"]')) return "Join the community! 👥";

  // Default for any button/link
  return "Hey Check me out! 👆";
};

const InteractiveCursor: FC<InteractiveCursorProps> = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [hoveredButtonText, setHoveredButtonText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(hasTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip cursor setup on mobile devices
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a[href], [role="button"]');
      if (button) {
        setIsHoveringButton(true);
        const message = getHoverMessage(button as HTMLElement);
        setHoveredButtonText(message);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a[href], [role="button"]');
      if (button) {
        // Check if we're still over a button
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.closest('button, a[href], [role="button"]')) {
          setIsHoveringButton(false);
          setHoveredButtonText('');
        }
      } else {
        setIsHoveringButton(false);
        setHoveredButtonText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, [isMobile]);

  // Update cursor style on mount (only on desktop)
  useEffect(() => {
    if (!isMobile) {
      document.body.style.cursor = 'none';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [isMobile]);

  return (
    <>
      {children}
      {/* Custom Cursor - Only show on desktop */}
      {!isMobile && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
          }}
        >
        {/* Main cursor dot */}
        <div
          className={`absolute rounded-full transition-all duration-300 ${
            isHoveringButton ? 'w-12 h-12 bg-[#00bfa5]' : 'w-5 h-5 bg-[#eafffa]'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: isHoveringButton
              ? '0 0 20px rgba(0, 191, 165, 0.8), 0 0 40px rgba(0, 191, 165, 0.5), 0 0 60px rgba(0, 191, 165, 0.3)'
              : '0 0 8px rgba(234, 255, 250, 0.6), 0 0 16px rgba(234, 255, 250, 0.3)',
          }}
        >
          {isHoveringButton && (
            <div className="absolute inset-0 rounded-full animate-ping bg-[#00bfa5] opacity-60" />
          )}
        </div>

        {/* Outer ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-300 ${
            isHoveringButton
              ? 'w-16 h-16 border-[#00bfa5] opacity-80'
              : 'w-10 h-10 border-[#eafffa] opacity-40'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            animation: isHoveringButton ? 'pulse-ring 2s ease-in-out infinite' : 'none',
          }}
        />

        {/* Inner glow ring when hovering */}
        {isHoveringButton && (
          <div
            className="absolute rounded-full border border-[#00bfa5] opacity-50"
            style={{
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
              animation: 'pulse-inner 1.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Hover message */}
        {isHoveringButton && hoveredButtonText && (
          <div
            className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap glass-premium px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#eafffa] shadow-luxury-lg"
            style={{
              animation: 'fade-in-up 0.3s ease-out',
              background: 'rgba(0, 191, 165, 0.15)',
              backdropFilter: 'blur(12px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.3)',
              border: '1px solid rgba(0, 191, 165, 0.3)',
            }}
          >
            {hoveredButtonText}
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '8px solid rgba(0, 191, 165, 0.15)',
              }}
            />
          </div>
        )}
        </div>
      )}

      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.4;
          }
        }
        @keyframes pulse-inner {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.2;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, -8px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default InteractiveCursor;
