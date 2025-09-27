import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const tabs = [
  'home',
  'skills',
  'projects',
  'blog',
  'tutorials',
  'services',
  'awards',
  'experience',
  'journey',
  'assistant',
  'contact'
];

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

  const showHelper = useCallback(() => {
    setIsHelperOpen(true);
  }, []);

  const hideHelper = useCallback(() => {
    setIsHelperOpen(false);
  }, []);

  const toggleHelper = useCallback(() => {
    setIsHelperOpen((prev) => !prev);
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
    <div className="relative flex flex-col items-center gap-4 mb-12">
      <nav className="mt-16 flex flex-wrap justify-center gap-4" aria-label="Primary">
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
            className={`tab px-6 py-3 rounded-lg font-semibold tracking-wide uppercase transition-all duration-200 ease-out motion-reduce:transition-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] focus-visible:ring-offset-2 ${
              activeTab === tab
                ? 'text-[#a7ffeb] border-[#00bfa5] bg-[#022b27]/80 shadow-[0_18px_38px_rgba(0,150,136,0.28)]'
                : 'text-[#7fcfc2] border-transparent bg-[#042623]/60 hover:border-[#1f655d] hover:text-[#c8fff4] hover:shadow-[0_10px_24px_rgba(0,150,136,0.18)]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
        onMouseEnter={showHelper}
        onMouseLeave={hideHelper}
        onFocus={showHelper}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            hideHelper();
          }
        }}
      >
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

        {isHelperOpen && (
          <div
            id={helperPanelId}
            ref={helperPanelRef}
            role="dialog"
            aria-modal="false"
            className="mb-2 w-72 rounded-xl border border-[#1f655d] bg-[#021c1a]/95 p-4 text-sm shadow-2xl shadow-[0_24px_60px_rgba(0,150,136,0.25)] focus:outline-none"
            tabIndex={-1}
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
      </div>
    </div>
  );
};

export default memo(Navigation);
