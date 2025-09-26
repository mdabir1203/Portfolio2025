import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const tabs = ['home', 'skills', 'projects', 'blog', 'tutorials', 'services', 'awards', 'experience', 'journey', 'contact'];

const helperPanelId = 'navigation-helper-panel';

const Navigation: FC<NavigationProps> = ({ activeTab, onTabClick }) => {
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const helperButtonRef = useRef<HTMLButtonElement | null>(null);
  const helperPanelRef = useRef<HTMLDivElement | null>(null);

  const focusTab = useCallback((index: number) => {
    const wrappedIndex = (index + tabs.length) % tabs.length;
    const tab = tabRefs.current[wrappedIndex];
    tab?.focus();
  }, []);

  const selectTabAt = useCallback(
    (index: number) => {
      const wrappedIndex = (index + tabs.length) % tabs.length;
      onTabClick(tabs[wrappedIndex]);
      focusTab(wrappedIndex);
    },
    [focusTab, onTabClick]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.altKey || event.metaKey || event.ctrlKey) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          selectTabAt(index + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          selectTabAt(index - 1);
          break;
        case 'Home':
          event.preventDefault();
          selectTabAt(0);
          break;
        case 'End':
          event.preventDefault();
          selectTabAt(tabs.length - 1);
          break;
        default:
          break;
      }
    },
    [selectTabAt]
  );

  const handleToggleHelper = useCallback(() => {
    setIsHelperOpen((prev) => !prev);
  }, []);

  const handleCloseHelper = useCallback(() => {
    setIsHelperOpen(false);
    helperButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isHelperOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsHelperOpen(false);
        helperButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isHelperOpen]);

  useEffect(() => {
    if (isHelperOpen) {
      helperPanelRef.current?.focus();
    }
  }, [isHelperOpen]);

  return (
    <div className="flex flex-col items-center gap-4 mb-12">
      <nav className="flex flex-wrap justify-center gap-4" aria-label="Primary">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            onClick={() => selectTabAt(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={`tab px-6 py-3 rounded-lg font-bold transition-all duration-200 ease-out motion-reduce:transition-none border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2 ${
              activeTab === tab
                ? 'text-[#FAFAFA] border-[#009688] bg-[#009688]/25 shadow-lg shadow-[0_12px_30px_rgba(0,150,136,0.35)]'
                : 'text-[#E0F2F1] border-[#4DB6AC]/40 hover:border-[#009688] hover:text-[#009688]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div className="relative">
        <button
          type="button"
          ref={helperButtonRef}
          onClick={handleToggleHelper}
          aria-expanded={isHelperOpen}
          aria-controls={helperPanelId}
          className="text-sm font-semibold tracking-wide px-4 py-2 rounded-full bg-[#FAFAFA]/10 border border-[#4DB6AC]/40 text-[#4DB6AC] hover:bg-[#4DB6AC]/20 hover:text-[#FAFAFA] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2"
        >
          {isHelperOpen ? 'Hide navigation tips' : 'Show navigation tips'}
        </button>

        {isHelperOpen && (
          <div
            id={helperPanelId}
            ref={helperPanelRef}
            role="dialog"
            aria-modal="false"
            className="absolute left-1/2 top-[calc(100%+0.75rem)] w-72 -translate-x-1/2 rounded-xl border border-[#4DB6AC]/30 bg-[#00695C]/95 p-4 text-sm shadow-2xl shadow-[0_20px_45px_rgba(77,182,172,0.25)] focus:outline-none"
            tabIndex={-1}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#4DB6AC]">Keyboard navigation</h3>
              <button
                type="button"
                onClick={handleCloseHelper}
                className="rounded-full border border-[#4DB6AC]/40 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-[#4DB6AC] hover:bg-[#4DB6AC]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
            <p className="mb-2 text-[#E0F2F1]">Use your keyboard to glide through the sections like an arcade run:</p>
            <ul className="space-y-1 text-[#FAFAFA]">
              <li><span className="font-semibold text-[#4DB6AC]">← / →</span> Cycle through the tabs</li>
              <li><span className="font-semibold text-[#4DB6AC]">↑ / ↓</span> Works too if that&apos;s your style</li>
              <li><span className="font-semibold text-[#4DB6AC]">Home</span> Jump to the first tab instantly</li>
              <li><span className="font-semibold text-[#4DB6AC]">End</span> Warp to the final tab</li>
              <li><span className="font-semibold text-[#4DB6AC]">Enter</span> or <span className="font-semibold text-[#4DB6AC]">Space</span> Activate the focused tab</li>
              <li><span className="font-semibold text-[#4DB6AC]">Esc</span> Close this helper</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Navigation);
