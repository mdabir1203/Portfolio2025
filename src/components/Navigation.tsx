import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'thoughts', label: 'Thoughts' },
  { id: 'video-writeups', label: 'Video Writeups' },
  { id: 'services', label: 'Services' },
  { id: 'awards', label: 'Awards' },
  { id: 'experience', label: 'Experience' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' }
];

const Navigation: FC<NavigationProps> = ({ activeTab, onTabClick }) => {
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const helperButtonRef = useRef<HTMLButtonElement | null>(null);
  const helperPanelRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const helperPanelId = 'keyboard-helper-panel';

  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  // Toggle the helper visibility
  const toggleHelper = useCallback(() => {
    setIsHelperOpen((prev) => !prev);
  }, []);

  const hideHelper = useCallback(() => {
    setIsHelperOpen(false);
  }, []);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close helper panel with Escape
      if (event.key === 'Escape') {
        setIsHelperOpen(false);
        return;
      }

      // Don't handle navigation keys if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      let newIndex = focusedTabIndex;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          newIndex = (focusedTabIndex + 1) % tabs.length;
          setFocusedTabIndex(newIndex);
          tabButtonRefs.current[newIndex]?.focus();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          newIndex = (focusedTabIndex - 1 + tabs.length) % tabs.length;
          setFocusedTabIndex(newIndex);
          tabButtonRefs.current[newIndex]?.focus();
          break;

        case 'Home':
          event.preventDefault();
          newIndex = 0;
          setFocusedTabIndex(newIndex);
          tabButtonRefs.current[newIndex]?.focus();
          break;

        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          setFocusedTabIndex(newIndex);
          tabButtonRefs.current[newIndex]?.focus();
          break;

        case 'Enter':
          event.preventDefault();
          if (tabButtonRefs.current[focusedTabIndex]) {
            onTabClick(tabs[focusedTabIndex].id);
            tabButtonRefs.current[focusedTabIndex]?.focus();
          }
          break;

        case ' ':
          // Only prevent default if we're on a tab button, not in a form field
          const isOnTabButton = target.closest('button[role="tab"]');
          if (isOnTabButton) {
            event.preventDefault();
            if (tabButtonRefs.current[focusedTabIndex]) {
              onTabClick(tabs[focusedTabIndex].id);
              tabButtonRefs.current[focusedTabIndex]?.focus();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedTabIndex, onTabClick]);

  // Update focused tab index when activeTab changes
  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTab);
    if (index !== -1) {
      setFocusedTabIndex(index);
    }
  }, [activeTab]);

  // Focus management when helper opens
  useEffect(() => {
    if (isHelperOpen && helperPanelRef.current) {
      helperPanelRef.current.focus();
    }
  }, [isHelperOpen]);

  return (
    <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 relative" aria-label="Primary" role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabButtonRefs.current[index] = el; }}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={focusedTabIndex === index ? 0 : -1}
          onClick={() => {
            onTabClick(tab.id);
            setFocusedTabIndex(index);
          }}
          onFocus={() => setFocusedTabIndex(index)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          className={`tab liquid-metal-button px-3 py-2 sm:px-7 sm:py-3.5 min-h-[44px] min-w-[44px] rounded-xl text-xs sm:text-base font-semibold tracking-wide transition-all duration-200 ease-out motion-reduce:transition-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 backdrop-blur-sm ${
            activeTab === tab.id
              ? 'border-green-400/60 bg-gradient-to-br from-green-400/25 via-green-400/15 to-transparent shadow-luxury hover:shadow-luxury-lg hover:-translate-y-0.25 hover:shadow-[0_0_20px_rgba(0,191,165,0.15)]'
              : 'border-gray-600/40 bg-[#041512]/30 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:-translate-y-0.25 hover:shadow-luxury-sm'
          }`}
        >
          <span className="liquid-metal-text-wrapper" data-text={tab.label}>
            <span className={activeTab === tab.id ? 'text-green-300' : 'text-gray-300'}>
              {tab.label}
            </span>
          </span>
        </button>
      ))}

      {/* Helper Button (outside tab buttons) */}
      <button
        type="button"
        ref={helperButtonRef}
        onClick={toggleHelper}
        aria-expanded={isHelperOpen}
        aria-controls={helperPanelId}
        className="group flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#1f655d]/60 glass-premium text-[#9adcd1] shadow-luxury transition-all duration-300 hover:border-[#23a395] hover:bg-[#035049]/95 hover:text-[#c8fff4] hover:shadow-luxury-lg hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2"
      >
        <span className="sr-only">{isHelperOpen ? 'Hide navigation tips' : 'Show navigation tips'}</span>
        <svg
          aria-hidden="true"
          className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17h.01M12 11a1.5 1.5 0 011.2.6c.46.61.31 1.47-.27 1.95l-.93.78a1.5 1.5 0 00-.5 1.12V16m0-9a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
      </button>

      {/* Helper Panel */}
      {isHelperOpen && (
        <div
          id={helperPanelId}
          ref={helperPanelRef}
          role="dialog"
          aria-modal="false"
          tabIndex={-1}
          className="absolute top-16 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl border border-[#1f655d]/50 glass-premium p-4 sm:p-5 text-xs sm:text-sm shadow-luxury-lg backdrop-blur-xl z-50"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[#a7ffeb] tracking-wide" style={{fontFamily: "'Cormorant Garamond', Georgia, serif"}}>Keyboard navigation</h3>
            <button
              type="button"
              onClick={hideHelper}
              className="rounded-lg border border-[#1f655d]/50 bg-[#02423b]/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7fcfc2] transition-all duration-200 hover:bg-[#02423b]/90 hover:border-[#23a395]/60 hover:text-[#a7ffeb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>

          <p className="mb-3 text-[#9adcd1] leading-relaxed">Use your keyboard to glide through the sections like an arcade run:</p>
          <ul className="space-y-2 text-[#e3fbf6]">
            <li className="flex items-center gap-2"><span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">← / →</span> Cycle through the tabs</li>
            <li className="flex items-center gap-2"><span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">↑ / ↓</span> Works too if that&apos;s your style</li>
            <li className="flex items-center gap-2"><span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">Home</span> Jump to the first tab instantly</li>
            <li className="flex items-center gap-2"><span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">End</span> Warp to the final tab</li>
            <li className="flex items-center gap-2"><span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">Enter</span> or <span className="font-semibold text-[#a7ffeb] bg-[#00bfa5]/10 px-2 py-0.5 rounded">Space</span> Activate the focused tab</li>
            <li className="flex items-center gap-2"><span className="font-semibold text-[#FF8A65] bg-[#FF7043]/10 px-2 py-0.5 rounded">Esc</span> Close this helper</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default memo(Navigation);
