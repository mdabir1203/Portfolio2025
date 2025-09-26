import { FC, useCallback, useMemo, useState } from 'react';
import { assistantActs } from '../data/assistant-journey';

const initialMessage = "Hi, I’m the BlackBox Assistant. Want to see what makes this portfolio different?";

const BlackBoxAssistant: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveReply, setLiveReply] = useState<
    { text: string; mode?: 'deepresearch' | 'fallback' } | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const currentAct = useMemo(() => assistantActs[currentIndex], [currentIndex]);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < assistantActs.length - 1;

  const conversationalHistory = useMemo(
    () =>
      assistantActs.slice(0, currentIndex).flatMap((act) => [
        { role: 'user' as const, content: act.visitorPrompt },
        { role: 'assistant' as const, content: act.botResponse },
      ]),
    [currentIndex]
  );

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex((prev) => Math.min(prev + 1, assistantActs.length - 1));
      setLiveReply(null);
      setGenerationError(null);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      setLiveReply(null);
      setGenerationError(null);
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLiveReply(null);
    setGenerationError(null);
  };

  const requestLiveReply = useCallback(async () => {
    try {
      setIsGenerating(true);
      setGenerationError(null);
      const response = await fetch('/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentAct.visitorPrompt,
          history: conversationalHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Assistant request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data.reply === 'string') {
        setLiveReply({
          text: data.reply,
          mode:
            data.mode === 'deepresearch' || data.mode === 'fallback' ? data.mode : undefined,
        });
      } else {
        setLiveReply(null);
      }
    } catch (error) {
      console.error('Assistant generation failed', error);
      setGenerationError('Unable to reach the LangChain + DeepResearch runtime. Try again shortly.');
    } finally {
      setIsGenerating(false);
    }
  }, [conversationalHistory, currentAct.visitorPrompt]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl border border-[#1f655d] bg-[#021c1a]/95 p-5 shadow-[0_28px_68px_rgba(0,150,136,0.28)] backdrop-blur-xl text-left">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#4DB6AC]">BlackBox Assistant</p>
              <h3 className="text-lg font-semibold text-[#c8fff4]">{currentAct.title}</h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[#1f655d] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7fcfc2] transition-colors duration-200 hover:border-[#00bfa5] hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-[#e3fbf6]">
            <div className="rounded-xl bg-[#033832]/80 p-4 border border-[#1f655d]/60">
              <p className="text-xs uppercase tracking-[0.25em] text-[#80f0df] mb-2">Visitor Prompt</p>
              <p>{currentAct.visitorPrompt}</p>
            </div>
            <div className="rounded-xl bg-[#02423b]/80 p-4 border border-[#1f655d]/60">
              <p className="text-xs uppercase tracking-[0.25em] text-[#FF8A65] mb-2">Assistant</p>
              <p className="whitespace-pre-line">{currentAct.botResponse}</p>
              {liveReply && (
                <div className="mt-4 rounded-lg border border-[#1f655d]/70 bg-[#033832]/80 p-3 text-xs text-[#c8fff4]">
                  <p className="uppercase tracking-[0.25em] text-[#80f0df] mb-1">
                    {liveReply.mode === 'fallback'
                      ? 'Context Summary'
                      : 'Live (DeepResearch Stack)'}
                  </p>
                  <p className="whitespace-pre-line text-sm text-[#e3fbf6]">{liveReply.text}</p>
                  {liveReply.mode === 'fallback' && (
                    <p className="mt-2 text-[11px] text-[#9adcd1]">
                      Tip: Add an OpenRouter DeepResearch key to unlock generative riffs on this narrative.
                    </p>
                  )}
                </div>
              )}
              {generationError && (
                <p className="mt-3 text-xs text-[#FFB199]">{generationError}</p>
              )}
            </div>
            <div className="rounded-xl border border-dashed border-[#FF8A65]/60 bg-[#052c28]/70 p-4 text-xs text-[#FFB199]">
              <span className="font-semibold uppercase tracking-[0.25em] text-[#FF8A65]">Business Angle:</span>
              <span className="block mt-1 text-sm text-[#ffd9cd]">{currentAct.businessAngle}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!hasPrevious}
                className="rounded-lg border border-[#1f655d] px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[#9adcd1] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#00bfa5] hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasNext}
                className="rounded-lg border border-[#1f655d] px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[#9adcd1] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#00bfa5] hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
              >
                Next
              </button>
            </div>

            <button
              type="button"
              onClick={requestLiveReply}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg border border-[#23a395] px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[#9adcd1] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#00bfa5] hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
            >
              {isGenerating ? 'Syncing…' : 'Run DeepResearch Stack'}
            </button>

            {currentAct.ctaHref && currentAct.ctaLabel && (
              <a
                href={currentAct.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] px-4 py-2 font-semibold uppercase tracking-[0.3em] text-[#031b18] shadow-[0_16px_32px_rgba(0,150,136,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {currentAct.ctaLabel}
              </a>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="group relative flex items-center gap-3 rounded-full border border-[#23a395] bg-[#033832]/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c8fff4] shadow-[0_24px_60px_rgba(0,150,136,0.32)] transition-all duration-200 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
        aria-expanded={isOpen}
        aria-controls="blackbox-assistant-panel"
      >
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#009688] via-[#4DB6AC] to-[#FF8A65] text-lg shadow-[0_16px_32px_rgba(0,150,136,0.4)]">
          <span className="absolute inset-0 rounded-full border border-[#80f0df]/40 blur-sm"></span>
          <span className="relative text-[#021513]">🛰️</span>
        </span>
        <span className="max-w-[12rem] text-left leading-snug">
          {isOpen ? 'Let’s keep exploring' : initialMessage}
        </span>
      </button>
    </div>
  );
};

export default BlackBoxAssistant;
