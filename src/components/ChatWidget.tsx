import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";
import { X, Send } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";
type Message = { role: Role; content: string };
type Phase = "idle" | "loading" | "cached" | "ready" | "streaming" | "error";

// ─── Funny questions that cycle while the model loads ─────────────────────────
const CRACK_QUESTIONS_EN = [
  "Will Abir fix my terrible code at 3 AM? 🌙",
  "Can AI explain why my CSS is broken? 😭",
  "Is Abir secretly a robot? 🤖",
  "What if I just ask for his Netflix password? 📺",
  "Can this AI tell my boss I'm 'in a meeting'? 🤫",
  "Will Abir do my taxes? 💸",
  "What's the meaning of life AND React hooks? ⚛️",
  "Can I hire Abir to make my startup profitable in 24h? 😅",
  "Does Abir drink coffee or is he just caffeinated by passion? ☕",
  "What if the real friends were the AI agents we deployed along the way? 🤝",
];

const CRACK_QUESTIONS_AR = [
  "هل يصلح أبير كودي الفاشل الساعة 3 صباحاً؟ 🌙",
  "هل يمكن للذكاء الاصطناعي يشرح ليش CSS ما يشتغل؟ 😭",
  "هل أبير روبوت سري؟ 🤖",
  "وش لو سألته عن كلمة مرور Netflix؟ 📺",
  "هل يقدر يقول لمديري إنني 'في اجتماع'؟ 🤫",
  "هل أبير يشرب قهوة أو إنه يعمل بالشغف فقط؟ ☕",
  "هل يقدر يخلي الستارت-أب ربح في 24 ساعة؟ 😅",
  "ما هو معنى الحياة وهوكس React؟ ⚛️",
];

// ─── Portfolio knowledge base (replaces AirLLM's input_text) ─────────────────
const SYSTEM_PROMPT = `You are the AI voice for Mohammad Abir Abbas's portfolio at abir.getwaved.ai.
Answer in 2-4 sentences max. Be direct, confident, and first-person where natural.
Only use information below. If asked outside scope, invite: abir.abbas@proton.me.

IDENTITY: Mohammad Abir Abbas — Creative Technologist & AI Architect.
Based in Ajman, UAE. Available Q3 2026. 325K+ Medium readers. 13 countries GTM.

CURRENT ROLE: Creative Technology Advisor at Wavelink (smart NFC business cards).
Co-founder of Deep Blue Digital.

SKILLS: AI Agent Workflows, Process Automation, React/React Native, Rust/C/C++, Cross-cultural GTM.

CASE STUDIES:
1. AbayaTrack — GCC abaya factory. +38% output, −30% cycle time, 92% on-time, 0 extra hires. Mobile time-tracking per garment unit, real-time bottleneck detection.
2. Wavelink — Smart NFC digital business cards. One tap, zero paper, GDPR-compliant. GTM Strategy, Pipeline Design, 100% compliance.
3. SmartSwap — MIT Hacknation 2026 Next Best. Client-side intent engine: reads UTM signals, scores 7 behavioral personas in <50ms, swaps hero/CTA/content dynamically. Zero backend.
4. RedAGPT — Redis Side Quest Winner 2024. Open-source AutoGPT+Langchain vulnerability scanner for home/office networks. Severity-ranked remediation reports.
5. Deep Blue Digital — 40% faster payment processing for 50+ sellers, −30% CAC via AI marketing automation.
6. HNM IT Frankfurt — 99.9% uptime, −35% MTTR via network automation.

RECOGNITION: Redis Side Quest Winner 2024, MIT Hacknation 2026 Next Best.
LANGUAGES: English IELTS 7.5, Bengali (native), German A2.
CONTACT: abir.abbas@proton.me | linkedin.com/in/abir-abbas`;

// ─── Cycling crack questions during load ─────────────────────────────────────
function CrackQuestions({ lang }: { lang: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const questions = lang === "ar" ? CRACK_QUESTIONS_AR : CRACK_QUESTIONS_EN;

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % questions.length);
        setVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(cycle);
  }, [questions.length]);

  return (
    <div className="relative h-16 w-full overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 px-2 text-center font-mono text-[11px] leading-relaxed text-foreground/60"
          >
            {questions[idx]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Cached celebration burst ─────────────────────────────────────────────────
const SPARKS = ["✦", "⬡", "◈", "✶", "❋", "◆", "✺", "⬟"];
function CachedBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {SPARKS.map((s, i) => {
        const angle = (i / SPARKS.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * 52;
        const ty = Math.sin(rad) * 52;
        return (
          <motion.span
            key={i}
            className="absolute text-[color:var(--accent-teal)] text-sm select-none"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0.3 }}
            transition={{ duration: 0.65, delay: i * 0.04, ease: "easeOut" }}
          >
            {s}
          </motion.span>
        );
      })}
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-teal)]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Shimmer progress bar ─────────────────────────────────────────────────────
function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent-teal)] to-[color:var(--accent-lime)]"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "500%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="font-mono text-[10px] text-foreground/50">
        {value}% — {label}
      </p>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const { lang } = useLanguage();
  const tx = translations[lang];

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [orbHovered, setOrbHovered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const engineRef = useRef<unknown>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipCycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Magnetic spring values
  const orbX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const orbY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  // ── Magnetic proximity effect ──────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = orbRef.current;
      if (!el || open) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        orbX.set(dx * 0.15);
        orbY.set(dy * 0.15);
      } else {
        orbX.set(0);
        orbY.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [open, orbX, orbY]);

  // ── Idle tooltip cycle ────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setShowTooltip(false);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (tooltipCycleRef.current) clearTimeout(tooltipCycleRef.current);
      return;
    }
    const scheduleTooltip = () => {
      tooltipTimerRef.current = setTimeout(() => {
        setShowTooltip(true);
        tooltipCycleRef.current = setTimeout(() => {
          setShowTooltip(false);
          scheduleTooltip(); // re-schedule after 12s
        }, 3000);
      }, 4000);
    };
    scheduleTooltip();
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (tooltipCycleRef.current) clearTimeout(tooltipCycleRef.current);
    };
  }, [open]);

  // ── Auto-scroll messages ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when ready ────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "ready" && open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, open]);

  // ── Load engine (lazy — only on first open) ───────────────────────────────
  const initEngine = useCallback(async () => {
    if (engineRef.current) return;

    if (!("gpu" in navigator)) {
      setErrorMsg(tx.chat.error);
      setPhase("error");
      return;
    }

    setPhase("loading");
    const loadStart = Date.now();
    try {
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      const engine = await CreateMLCEngine(
        "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (r: { progress: number }) =>
            setLoadProgress(Math.round(r.progress * 100)),
        }
      );
      engineRef.current = engine;
      const elapsed = Date.now() - loadStart;
      // If loaded in < 4s it was from cache — show celebration
      if (elapsed < 4000) {
        setPhase("cached");
        setTimeout(() => {
          setPhase("ready");
          setMessages([{ role: "assistant", content: tx.chat.greeting }]);
        }, 1400);
      } else {
        setPhase("ready");
        setMessages([{ role: "assistant", content: tx.chat.greeting }]);
      }
    } catch (e) {
      console.error("WebLLM init error:", e);
      setErrorMsg(tx.chat.error);
      setPhase("error");
    }
  }, [tx.chat.error, tx.chat.greeting]);

  const handleOpen = () => {
    setOpen(true);
    setShowTooltip(false);
    initEngine();
  };

  const handleClose = () => {
    setOpen(false);
    orbX.set(0);
    orbY.set(0);
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 400);
      return;
    }
    if (phase !== "ready" || !engineRef.current) return;

    const userMsg: Message = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setPhase("streaming");

    // Placeholder for streaming assistant message
    setMessages([...nextHistory, { role: "assistant", content: "" }]);

    try {
      const engine = engineRef.current as {
        chat: {
          completions: {
            create: (opts: unknown) => Promise<AsyncIterable<{ choices: { delta: { content?: string } }[] }>>;
          };
        };
      };
      const stream = await engine.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...nextHistory.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
        max_tokens: 300,
        temperature: 0.7,
      });

      let accumulated = "";
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        accumulated += token;
        setMessages([...nextHistory, { role: "assistant", content: accumulated }]);
      }
      setPhase("ready");
    } catch (e) {
      console.error("Chat error:", e);
      setMessages([
        ...nextHistory,
        { role: "assistant", content: "Sorry, something went wrong. Try again." },
      ]);
      setPhase("ready");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isStreaming = phase === "streaming";

  return (
    <>
      {/* ── Floating orb ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[70]" style={{ isolation: "isolate" }}>
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="absolute right-[68px] bottom-2 whitespace-nowrap rounded-full border border-white/10 bg-[color:var(--bento)] px-3 py-1.5 font-mono text-[11px] text-foreground/80 shadow-lg backdrop-blur-md"
            >
              {lang === "ar" ? "اسأل عن أبير ←" : "Ask me about Abir →"}
              {/* Arrow pointer */}
              <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rotate-45 border-r border-t border-white/10 bg-[color:var(--bento)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orb wrapper — spring position for magnetic effect */}
        <motion.div style={{ x: orbX, y: orbY }}>
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "oklch(0.78 0.14 180 / 0.35)" }}
            animate={{ scale: [1, 1.75, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "oklch(0.78 0.14 180 / 0.25)" }}
            animate={{ scale: [1, 1.75, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
          />

          {/* The orb button */}
          <motion.button
            ref={orbRef}
            onClick={open ? handleClose : handleOpen}
            onHoverStart={() => setOrbHovered(true)}
            onHoverEnd={() => setOrbHovered(false)}
            aria-label={open ? "Close chat" : "Open AI chat"}
            initial={{ scale: 0, opacity: 0, y: 40, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 18, delay: 1.8 },
              opacity: { duration: 0.4, delay: 1.8 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.2 },
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.2 },
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            style={{
              position: "relative",
              width: 56,
              height: 56,
              borderRadius: "50%",
              cursor: "pointer",
              border: "none",
              background: `radial-gradient(circle at 32% 28%,
                oklch(0.92 0.16 185),
                oklch(0.65 0.18 178) 30%,
                oklch(0.38 0.12 175) 65%,
                oklch(0.22 0.08 170)
              )`,
              boxShadow: `
                inset -5px -5px 12px oklch(0.20 0.08 170 / 0.9),
                inset 3px 3px 8px oklch(0.95 0.18 185 / 0.25),
                0 0 0 1px oklch(0.78 0.14 180 / 0.3),
                0 0 20px oklch(0.78 0.14 180 / 0.45),
                0 0 60px oklch(0.78 0.14 180 / 0.15)
              `,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-4 w-4 text-white" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="icon"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-[11px] font-bold text-white select-none"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {orbHovered ? "✦" : "AI"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* ── Chat panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{
              enter: { type: "spring", stiffness: 380, damping: 28 },
              exit: { duration: 0.2, ease: "easeIn" },
            }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[84px] right-4 z-[70] w-[340px] max-sm:right-2 max-sm:left-2 max-sm:w-auto rounded-2xl border border-white/10 bg-[color:var(--bento)] shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-teal)]">
                {tx.chat.tag}
              </span>
              <motion.button
                onClick={handleClose}
                whileTap={{ scale: 0.85 }}
                className="rounded-full p-1 text-foreground/40 transition-colors hover:text-foreground/80"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex flex-col" style={{ height: 400 }}>

              {/* Loading state — orb spinner + crack questions + progress bar */}
              {phase === "loading" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-5">
                  {/* Spinning orb */}
                  <div className="relative">
                    <motion.div
                      className="h-14 w-14 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 32% 28%, oklch(0.92 0.16 185), oklch(0.38 0.12 175))`,
                        boxShadow: "0 0 24px oklch(0.78 0.14 180 / 0.5)",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* orbit dot */}
                    <motion.div
                      className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rounded-full bg-[color:var(--accent-lime)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "50% 36px" }}
                    />
                  </div>

                  {/* "Meanwhile, people are wondering…" */}
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                    {lang === "ar" ? "بينما يتساءل الناس…" : "Meanwhile, people are wondering…"}
                  </p>

                  {/* Cycling funny questions */}
                  <CrackQuestions lang={lang} />

                  {/* Progress bar */}
                  <div className="w-full">
                    <ProgressBar value={loadProgress} label={tx.chat.loading} />
                  </div>
                </div>
              )}

              {/* Cached state — instant load celebration */}
              {phase === "cached" && (
                <div className="relative flex flex-1 flex-col items-center justify-center gap-3 p-5 overflow-hidden">
                  <CachedBurst />
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [0.4, 1.2, 1], opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="h-14 w-14 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, oklch(0.92 0.16 185), oklch(0.38 0.12 175))`,
                      boxShadow: "0 0 32px oklch(0.78 0.14 180 / 0.7)",
                    }}
                  >
                    ⚡
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-center space-y-1"
                  >
                    <p className="font-mono text-[13px] font-semibold text-[color:var(--accent-teal)]">
                      {lang === "ar" ? "⚡ محمّل من الكاش!" : "⚡ Loaded from cache!"}
                    </p>
                    <p className="font-mono text-[10px] text-foreground/40">
                      {lang === "ar" ? "لأن أبير لا ينتظر أحداً 😎" : "Because Abir doesn't keep you waiting 😎"}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Error state */}
              {phase === "error" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                  <span className="text-2xl">⚠</span>
                  <p className="font-mono text-[11px] text-foreground/60">{errorMsg}</p>
                  <a
                    href="mailto:abir.abbas@proton.me"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent-teal)] px-4 py-2 font-mono text-[11px] font-semibold text-[color:var(--ink)] uppercase tracking-[0.15em] transition-all hover:brightness-110"
                  >
                    <Mail className="h-3 w-3" /> Email instead
                  </a>
                </div>
              )}

              {/* Messages */}
              {(phase === "ready" || phase === "streaming") && (
                <>
                  <div
                    className="chat-messages flex-1 space-y-3 overflow-y-auto p-4"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(0.78 0.14 180 / 0.3) transparent" }}
                  >
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8, scale: 0.97, x: msg.role === "user" ? 12 : -12 }}
                          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                              msg.role === "user"
                                ? "bg-[color:var(--accent-teal)] text-[color:var(--ink)] font-medium"
                                : "bg-[color:var(--bento-hi)] text-foreground/90"
                            }`}
                          >
                            {msg.content}
                            {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                              <motion.span
                                className="inline-block ml-0.5 text-[color:var(--accent-teal)]"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              >
                                ▋
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator — shown briefly between send and first token */}
                    {isStreaming && messages[messages.length - 1]?.content === "" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="rounded-xl bg-[color:var(--bento-hi)] px-3 py-2">
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input row */}
                  <div className="border-t border-white/8 p-3">
                    <div className="flex items-center gap-2">
                      <motion.input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tx.chat.placeholder}
                        disabled={isStreaming}
                        animate={shakeInput ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-foreground placeholder:text-foreground/30 outline-none transition-all focus:border-[color:var(--accent-teal)]/60 focus:ring-1 focus:ring-[color:var(--accent-teal)]/40 disabled:opacity-50"
                      />
                      <motion.button
                        onClick={handleSend}
                        disabled={isStreaming}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-teal)] text-[color:var(--ink)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// needed for inline Mail icon in error state
function Mail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
