import { FC, memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

interface NavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Mindset' },
  { id: 'projects', label: 'Creations' },
  { id: 'recommendations', label: 'Kind Words' },
  { id: 'awards', label: 'Wall' },
  { id: 'thoughts', label: 'Thoughts' },
  { id: 'videos', label: 'Videos' },
  { id: 'impact', label: 'Impact' },
  { id: 'contact', label: 'Connect' }
];

// Magnetic Item Component
const DockItem = ({
  mouseX,
  tab,
  isActive,
  onClick
}: {
  mouseX: MotionValue;
  tab: typeof tabs[0];
  isActive: boolean;
  onClick: () => void
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  // Calculate distance from mouse to center of this item
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale based on distance (Gaussian-like curve)
  const widthSync = useTransform(distance, [-150, 0, 150], [100, 140, 100]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      style={{ width } as any} // Dynamic width for magnetic effect
      onClick={onClick}
      className={`
        relative h-12 rounded-full flex items-center justify-center 
        transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${isActive
          ? 'bg-primary/20 text-primary-foreground shadow-[0_0_20px_rgba(23,207,190,0.3)] border border-primary/50'
          : 'bg-card/40 text-muted-foreground hover:bg-white/5 hover:text-foreground border border-white/5'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
      role="tab"
      aria-selected={isActive}
    >
      <span className="relative z-10 text-sm font-medium tracking-wide">
        {tab.label}
      </span>

      {/* Active Indicator Dot */}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_currentColor]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const Navigation: FC<NavigationProps> = ({ activeTab, onTabClick }) => {
  const mouseX = useMotionValue(Infinity);

  // Keyboard Navigation Stuff
  const navRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabElements = navRef.current?.querySelectorAll('[role="tab"]');
    if (!tabElements) return;

    const index = tabs.findIndex(t => t.id === activeTab);
    let nextIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      default:
        return;
    }

    if (nextIndex !== index) {
      onTabClick(tabs[nextIndex].id);
      (tabElements[nextIndex] as HTMLElement).focus();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 pointer-events-none">
      <motion.nav
        ref={navRef}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="
          pointer-events-auto
          mx-auto flex items-end gap-3 px-4 py-3
          rounded-full border border-white/10
          bg-background/60 backdrop-blur-2xl shadow-2xl
          hover:shadow-[0_0_40px_rgba(23,207,190,0.15)]
          transition-shadow duration-500
        "
        role="tablist"
        aria-label="Primary Navigation"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => (
          <DockItem
            key={tab.id}
            mouseX={mouseX}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabClick(tab.id)}
          />
        ))}
      </motion.nav>
    </div>
  );
};

export default memo(Navigation);
