import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const tabs = [
  'home', 'skills', 'projects', 'blog', 'tutorials',
  'services', 'awards', 'experience', 'journey', 'trust', 'contact'
];

const Navigation: FC<NavigationProps> = ({ activeTab, onTabClick }) => {
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const helperButtonRef = useRef<HTMLButtonElement | null>(null);
  const helperPanelRef = useRef<HTMLDivElement | null>(null);
  const helperPanelId = 'keyboard-helper-panel';

  // Toggle the helper visibility
  const toggleHelper = useCallback(() => {
    setIsHelperOpen((prev) => !prev);
  }, []);

  const hideHelper = useCallback(() => {
    setIsHelperOpen(false);
  }, []);

  // Handle Escape key to close the helper panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsHelperOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus management when helper opens
  useEffect(() => {
    if (isHelperOpen && helperPanelRef.current) {
      helperPanelRef.current.focus();
    }
  }, [isHelperOpen]);

  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-12 relative" aria-label="Primary">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabClick(tab)}
          aria-current={activeTab === tab ? 'page' : undefined}
          className={`tab px-6 py-3 rounded-lg font-bold transition-all duration-200 ease-out motion-reduce:transition-none border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${
            activeTab === tab
              ? 'text-green-400 border-green-400 bg-green-400/20 shadow-lg shadow-green-400/30'
              : 'text-gray-400 border-gray-600 hover:border-cyan-400 hover:text-cyan-400'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}

      {/* Helper Button (outside tab buttons) */}
      <button
        type="button"
        ref={helperButtonRef}
        onClick={toggleHelper}
        aria-expanded={isHelperOpen}
        aria-controls={helperPanelId}
        className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#1f655d] bg-[#033832]/90 text-[#9adcd1] shadow-[0_18px_38px_rgba(0,150,136,0.18)] transition-colors duration-200 hover:border-[#23a395] hover:bg-[#035049]/90 hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2"
      >
        <span className="sr-only">{isHelperOpen ? 'Hide navigation tips' : 'Show navigation tips'}</span>
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
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
          className="absolute top-14 right-0 w-72 rounded-xl border border-[#1f655d] bg-[#021c1a]/95 p-4 text-sm shadow-2xl shadow-[0_24px_60px_rgba(0,150,136,0.25)]"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[#a7ffeb]">Keyboard navigation</h3>
            <button
              type="button"
              onClick={hideHelper}
              className="rounded-full border border-[#1f655d] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7fcfc2] hover:bg-[#02423b]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>

          <p className="mb-2 text-[#9adcd1]">Use your keyboard to glide through the sections like an arcade run:</p>
          <ul className="space-y-1 text-[#e3fbf6]">
            <li><span className="font-semibold text-[#a7ffeb]">← / →</span> Cycle through the tabs</li>
            <li><span className="font-semibold text-[#a7ffeb]">↑ / ↓</span> Works too if that&apos;s your style</li>
            <li><span className="font-semibold text-[#a7ffeb]">Home</span> Jump to the first tab instantly</li>
            <li><span className="font-semibold text-[#a7ffeb]">End</span> Warp to the final tab</li>
            <li><span className="font-semibold text-[#a7ffeb]">Enter</span> or <span className="font-semibold text-[#a7ffeb]">Space</span> Activate the focused tab</li>
            <li><span className="font-semibold text-[#FF8A65]">Esc</span> Close this helper</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default memo(Navigation);
