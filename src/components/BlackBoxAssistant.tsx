import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assistantActs } from '../data/assistant-journey';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  variant?: 'default' | 'script' | 'business' | 'cta' | 'live';
  meta?: {
    actId?: string;
    businessAngle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    mode?: string;
  };
}

const introMessage: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  content: 'Hi, I’m the BlackBox Assistant. Want to see what makes this portfolio different?',
  variant: 'script',
};

const assistantEndpoint = import.meta.env.VITE_ASSISTANT_ENDPOINT ?? '/api/assistant';

const MAX_HISTORY_ENTRIES = 12;

const BlackBoxAssistant: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [lastMode, setLastMode] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [visitedActs, setVisitedActs] = useState<string[]>([]);

  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);
  const scrollAnimationRef = useRef<number | null>(null);

  const suggestionActs = useMemo(() => assistantActs, []);

  useEffect(() => {
    const container = chatBodyRef.current;
    if (!container || !autoScrollRef.current) {
      return undefined;
    }

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    scrollAnimationRef.current = requestAnimationFrame(() => {
      const delta = container.scrollHeight - (container.scrollTop + container.clientHeight);
      const shouldSmooth = delta > container.clientHeight * 0.75;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: shouldSmooth ? 'smooth' : 'auto',
      });
      scrollAnimationRef.current = null;
    });

    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };
  }, [messages]);

  useEffect(
    () => () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    },
    [],
  );

  const historyFromMessages = useCallback(
    (conversation: ChatMessage[]) =>
      conversation
        .slice(-MAX_HISTORY_ENTRIES)
        .map((message) => ({ role: message.role, content: message.content })),
    [],
  );

  const dispatchAssistantReply = useCallback(
    async (messageText: string, conversation: ChatMessage[]) => {
      setIsGenerating(true);
      setErrorMessage(null);
      const history = historyFromMessages(conversation);
      const requestStartedAt = new Date().toISOString();
      setDebugMessage(
        `Dispatching to ${assistantEndpoint} @ ${requestStartedAt} with ${history.length} turns.`
      );

      try {
        const response = await fetch(assistantEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageText,
            history,
          }),
        });

        const rawBody = await response.text();
        let data: unknown = null;

        try {
          data = rawBody ? JSON.parse(rawBody) : null;
        } catch (parseError) {
          setErrorMessage('Assistant returned malformed JSON payload.');
          setDebugMessage(
            `Failed to parse assistant payload @ ${new Date().toISOString()}: ${String(parseError)} | body=${rawBody}`
          );
          return;
        }

        if (!response.ok || typeof data !== 'object' || data === null) {
          const statusDetail = response.ok ? 'Unexpected payload shape' : `Status ${response.status}`;
          setErrorMessage('Assistant request failed. See debug details below.');
          setDebugMessage(
            `${statusDetail} @ ${new Date().toISOString()} | body=${rawBody}`
          );
          return;
        }

        const { reply, mode } = data as { reply?: unknown; mode?: string };

        if (typeof reply !== 'string') {
          setErrorMessage('Assistant response missing expected string content.');
          setDebugMessage(
            `Reply typeof ${typeof reply} encountered @ ${new Date().toISOString()} | body=${rawBody}`
          );
          return;
        }

        setLastMode(mode ?? null);
        autoScrollRef.current = true;
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-live-${Date.now()}`,
            role: 'assistant',
            content: reply,
            variant: 'live',
            meta: { mode: mode ?? undefined },
          },
        ]);
        setDebugMessage(
          `Assistant succeeded with mode=${mode ?? 'unknown'} @ ${new Date().toISOString()}`
        );
      } catch (error) {
        setErrorMessage('Unable to reach the LangChain + Qwen runtime. Try again shortly.');
        setDebugMessage(`Network or runtime error @ ${new Date().toISOString()}: ${String(error)}`);
        console.error('Assistant generation failed', error);
      } finally {
        setIsGenerating(false);
      }
    },
    [assistantEndpoint, historyFromMessages]
  );

  const appendMessages = useCallback(
    (entries: ChatMessage[], messageText: string) => {
      autoScrollRef.current = true;
      setMessages((prev) => {
        const updated = [...prev, ...entries];
        void dispatchAssistantReply(messageText, updated);
        return updated;
      });
    },
    [dispatchAssistantReply]
  );

  const handleManualSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };

      appendMessages([userMessage], trimmed);
      setInputValue('');
    },
    [appendMessages, inputValue]
  );

  const handleActSelection = useCallback(
    (actId: string) => {
      const act = suggestionActs.find((item) => item.id === actId);
      if (!act) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${act.id}-${Date.now()}`,
        role: 'user',
        content: act.visitorPrompt,
      };

      const scriptMessages: ChatMessage[] = [
        {
          id: `assistant-script-${act.id}-${Date.now()}`,
          role: 'assistant',
          content: act.botResponse,
          variant: 'script',
          meta: { actId: act.id },
        },
        {
          id: `assistant-business-${act.id}-${Date.now()}`,
          role: 'assistant',
          content: `Business Angle → ${act.businessAngle}`,
          variant: 'business',
          meta: { actId: act.id, businessAngle: act.businessAngle },
        },
      ];

      if (act.ctaHref && act.ctaLabel) {
        scriptMessages.push({
          id: `assistant-cta-${act.id}-${Date.now()}`,
          role: 'assistant',
          content: act.ctaLabel,
          variant: 'cta',
          meta: { actId: act.id, ctaHref: act.ctaHref, ctaLabel: act.ctaLabel },
        });
      }

      appendMessages([userMessage, ...scriptMessages], act.visitorPrompt);
      setVisitedActs((prev) => (prev.includes(act.id) ? prev : [...prev, act.id]));
    },
    [appendMessages, suggestionActs]
  );

  const handleToggle = () => {
    autoScrollRef.current = true;
    setIsOpen((prev) => !prev);
  };

  const handleReset = () => {
    autoScrollRef.current = true;
    setMessages([introMessage]);
    setVisitedActs([]);
    setErrorMessage(null);
    setDebugMessage(null);
    setLastMode(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {isOpen && (
        <div
          id="blackbox-assistant-panel"
          className="w-80 sm:w-96 rounded-2xl border border-[#1f655d] bg-[#021c1a]/95 p-5 shadow-[0_28px_68px_rgba(0,150,136,0.28)] backdrop-blur-xl text-left"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#4DB6AC]">BlackBox Assistant</p>
              <h3 className="text-lg font-semibold text-[#c8fff4]">
                {lastMode ? `Live · ${lastMode === 'qwen' ? 'Qwen3 Coder Stack' : 'Context Summary'}` : 'Story Navigator'}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[#1f655d] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7fcfc2] transition-colors duration-200 hover:border-[#00bfa5] hover:text-[#c8fff4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
            >
              Reset
            </button>
          </div>
          <div
            ref={chatBodyRef}
            onScroll={() => {
              const container = chatBodyRef.current;
              if (!container) {
                return;
              }
              const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
              autoScrollRef.current = distanceFromBottom < 48;
            }}
            className="max-h-80 space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed text-[#e3fbf6] will-change-transform"
          >
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const bubbleStyles = isUser
                ? 'bg-[#0b2b27] text-[#e3fbf6] border border-[#1f655d] ml-auto'
                : message.variant === 'business'
                ? 'bg-[#052c28] text-[#ffd9cd] border border-dashed border-[#FF8A65]/70'
                : message.variant === 'cta'
                ? 'bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] text-[#031b18] font-semibold'
                : message.variant === 'live'
                ? 'bg-[#033832]/90 border border-[#23a395] text-[#c8fff4]'
                : 'bg-[#02423b]/80 border border-[#1f655d]/60 text-[#e3fbf6]';

              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 shadow-[0_12px_32px_rgba(0,150,136,0.25)] ${bubbleStyles}`}>
                    {!isUser && message.variant === 'cta' && message.meta?.ctaHref ? (
                      <a
                        href={message.meta.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        {message.content}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="whitespace-pre-line">{message.content}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-[#033832]/60 px-4 py-3 text-[#9adcd1]">
                  Syncing with LangChain · Qwen…
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="mt-3 rounded-lg border border-[#FF8A65] bg-[#2b100c] p-3 text-xs text-[#FFB199]">
              {errorMessage}
            </div>
          )}

          {debugMessage && (
            <div className="mt-2 rounded-lg border border-dashed border-[#1f655d]/60 bg-[#031f1d] p-2 text-[10px] text-[#7fcfc2]">
              Debug · {debugMessage}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything…"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              className="flex-1 rounded-lg border border-[#1f655d] bg-[#011311] px-3 py-2 text-sm text-[#e3fbf6] shadow-inner focus:border-[#00bfa5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5]"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-lg border border-[#23a395] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9adcd1] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#00bfa5] hover:text-[#c8fff4]"
            >
              Send
            </button>
          </form>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#4DB6AC]">Acts & quick prompts</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestionActs.map((act) => {
                const isVisited = visitedActs.includes(act.id);
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleActSelection(act.id)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfa5] ${
                      isVisited
                        ? 'border-[#00bfa5] text-[#c8fff4] bg-[#033832]/90'
                        : 'border-[#1f655d] text-[#9adcd1] hover:border-[#00bfa5] hover:text-[#c8fff4]'
                    }`}
                  >
                    {act.title}
                  </button>
                );
              })}
            </div>
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
          {isOpen ? 'Let’s keep exploring' : introMessage.content}
        </span>
      </button>
    </div>
  );
};

export default BlackBoxAssistant;
