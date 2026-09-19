import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslations as translations } from "@/i18n/translations";
import { X, Send, Mail } from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Role = "user" | "assistant";
type Message = { role: Role; content: string };
type Phase = "idle" | "loading" | "cached" | "ready" | "streaming" | "error";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const QWEN_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const MAX_RESPONSE_TOKENS = 300;
const RESPONSE_TEMPERATURE = 0.7;
const MAGNETIC_RANGE_PX = 80;
const MAGNETIC_PULL = 0.15;
const CACHE_HIT_MS = 4000;
const BURST_RADIUS_PX = 52;
const IDLE_TOOLTIP_DELAY_MS = 4000;
const QUESTION_CYCLE_MS = 3200;

// â”€â”€â”€ Funny questions that cycle while the model loads â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CRACK_QUESTIONS_EN = [
  "Will Abir fix my terrible code at 3 AM? ðŸŒ™",
  "Can AI explain why my CSS is broken? ðŸ˜­",
  "Is Abir secretly a robot? ðŸ¤–",
  "What if I just ask for his Netflix password? ðŸ“º",
  "Can this AI tell my boss I'm 'in a meeting'? ðŸ¤«",
  "Will Abir do my taxes? ðŸ’¸",
  "What's the meaning of life AND React hooks? âš›ï¸",
  "Can I hire Abir to make my startup profitable in 24h? ðŸ˜…",
  "Does Abir drink coffee or is he just caffeinated by passion? â˜•",
  "What if the real friends were the AI agents we deployed along the way? ðŸ¤",
];

const CRACK_QUESTIONS_AR = [
  "Ù‡Ù„ ÙŠØµÙ„Ø­ Ø£Ø¨ÙŠØ± ÙƒÙˆØ¯ÙŠ Ø§Ù„ÙØ§Ø´Ù„ Ø§Ù„Ø³Ø§Ø¹Ø© 3 ØµØ¨Ø§Ø­Ø§Ù‹ØŸ ðŸŒ™",
  "Ù‡Ù„ ÙŠÙ…ÙƒÙ† Ù„Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ ÙŠØ´Ø±Ø­ Ù„ÙŠØ´ CSS Ù…Ø§ ÙŠØ´ØªØºÙ„ØŸ ðŸ˜­",
  "Ù‡Ù„ Ø£Ø¨ÙŠØ± Ø±ÙˆØ¨ÙˆØª Ø³Ø±ÙŠØŸ ðŸ¤–",
  "ÙˆØ´ Ù„Ùˆ Ø³Ø£Ù„ØªÙ‡ Ø¹Ù† ÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± NetflixØŸ ðŸ“º",
  "Ù‡Ù„ ÙŠÙ‚Ø¯Ø± ÙŠÙ‚ÙˆÙ„ Ù„Ù…Ø¯ÙŠØ±ÙŠ Ø¥Ù†Ù†ÙŠ 'ÙÙŠ Ø§Ø¬ØªÙ…Ø§Ø¹'ØŸ ðŸ¤«",
  "Ù‡Ù„ Ø£Ø¨ÙŠØ± ÙŠØ´Ø±Ø¨ Ù‚Ù‡ÙˆØ© Ø£Ùˆ Ø¥Ù†Ù‡ ÙŠØ¹Ù…Ù„ Ø¨Ø§Ù„Ø´ØºÙ ÙÙ‚Ø·ØŸ â˜•",
  "Ù‡Ù„ ÙŠÙ‚Ø¯Ø± ÙŠØ®Ù„ÙŠ Ø§Ù„Ø³ØªØ§Ø±Øª-Ø£Ø¨ Ø±Ø¨Ø­ ÙÙŠ 24 Ø³Ø§Ø¹Ø©ØŸ ðŸ˜…",
  "Ù…Ø§ Ù‡Ùˆ Ù…Ø¹Ù†Ù‰ Ø§Ù„Ø­ÙŠØ§Ø© ÙˆÙ‡ÙˆÙƒØ³ ReactØŸ âš›ï¸",
];

// â”€â”€â”€ Portfolio knowledge base (replaces AirLLM's input_text) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SYSTEM_PROMPT = `You are the AI voice for Mohammad Abir Abbas's portfolio at abir.getwaved.ai.
You have a personality: sharp, warm, occasionally funny â€” like a brilliant friend who happens to have the resume of a senior exec.
Always anchor answers in specific numbers and measurable impact. Never vague. Never corporate-speak.
Answer in 2-4 sentences. First-person where natural ("Abir built..." or "I helped...").
Drop a dry quip or human aside when it fits â€” but never at the expense of the facts.
If someone asks something outside scope, warmly redirect: "Abir's the human for that one â†’ abir.abbas@proton.me"

PERSONALITY NOTES
- Confident but not arrogant. Numbers do the bragging so the tone doesn't have to.
- Self-aware: knows this is a portfolio, happy to say so ("yes, I'm literally an AI on Abir's website â€” ask me anything").
- Warm toward recruiters: they're busy, give them the signal fast.
- Playful toward curious visitors: lean into the weirdness of talking to a browser-based AI.
- Never robotic filler ("Certainly!", "Great question!", "As an AI language model..."). Just talk.

IDENTITY
Name: Mohammad Abir Abbas — Creative Technologist, AI Strategist & Emerging Technology Architect.
Location: Dubai, United Arab Emirates. Available: Q3 2026. UAE Company Visa — no sponsorship required.
Open to roles across UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, NEOM), and global remote.
Audience: 325,000+ readers across Medium publications.
GTM reach: 13 countries across GCC, Europe, and South Asia.
Education: MSc Computational Methods of Engineering (Leibniz University Hannover, 2019), BSc Mechanical Engineering (CUET, 2018), 42 Wolfsburg (C/C++ systems programming, 2022â€“2024), HNM IT Frankfurt network engineering.

CURRENT ROLES
- Creative Technology Advisor @ Wavelink â€” designing GTM strategy and sales pipeline for smart NFC business cards; drove 100% GDPR compliance from day one, zero paper, one-tap contact sharing.
- Co-founder @ Deep Blue Digital â€” built and exited; served 50+ e-commerce sellers.

TECHNICAL SKILLS (with depth)
- AI/ML: AutoGPT, LangChain, WebLLM (WebGPU), RAG pipelines, prompt engineering, multi-agent orchestration.
- Frontend: React 19, React Native, TanStack Start (SSR), Framer Motion, Tailwind CSS v4.
- Systems: Rust, C, C++ â€” low-level network tooling and embedded systems.
- Automation: Zapier, n8n, Midjourney API, Resend, Cloudflare Workers.
- Infra: Cloudflare Pages, Wrangler, network monitoring, 99.9% uptime SLA management.
- GTM: cross-cultural go-to-market across 13 countries, P&L ownership, pipeline design.

CASE STUDY 1 â€” AbayaTrack (GCC Manufacturing)
Client: Famous Ladies Gowns Tailoring LLC â€” a GCC abaya factory.
Problem: No production visibility; bottlenecks invisible, output unpredictable.
Solution: End-to-end mobile time-tracking per garment unit + real-time bottleneck detection dashboard. Zero additional headcount.
Results (measured, post-deployment):
  â€¢ +38% production output
  â€¢ âˆ’30% cycle time per unit
  â€¢ 92% on-time delivery rate (up from ~65%)
  â€¢ 0 extra hires needed to achieve the gains
  â€¢ ROI visible within first production cycle

CASE STUDY 2 â€” Wavelink (Smart NFC Networking)
Product: Smart NFC digital business cards â€” one tap shares full contact profile.
Role: GTM Strategy, Pipeline Design, Process Optimization.
Results:
  â€¢ 100% GDPR compliance from launch
  â€¢ Zero paper cards; instant digital handoff
  â€¢ Sales pipeline built from scratch; multi-market rollout across GCC

CASE STUDY 3 â€” SmartSwap (MIT Hacknation 2026)
Award: Next Best â€” MIT Hacknation 2026 (out of 200+ competing teams).
What it does: Client-side intent engine that reads UTM signals + behavioral cues, scores visitors across 7 personas, and dynamically swaps hero copy / CTA / content â€” all in <50ms, zero backend, zero latency hit.
Technical specs:
  â€¢ 7 behavioral persona models running client-side
  â€¢ <50ms persona detection and content swap
  â€¢ Zero server round-trips â€” fully edge-native
  â€¢ Increases conversion relevance without A/B testing infrastructure

CASE STUDY 4 â€” RedAGPT (Redis Side Quest Winner 2024)
Award: Winner â€” Redis Side Quest 2024 (competitive open-source hackathon).
What it does: Open-source vulnerability scanner for home/office networks, powered by AutoGPT + LangChain + Redis vector search.
Technical specs:
  â€¢ Automated network scan â†’ severity-ranked remediation reports
  â€¢ Uses Redis as vector store for CVE knowledge base
  â€¢ LangChain agent chain: scan â†’ classify â†’ report â†’ remediate suggestions
  â€¢ Designed for non-technical users: plain-English severity summaries

CASE STUDY 5 â€” Deep Blue Digital (E-commerce Operations)
Role: Co-Founder. Served 50+ independent e-commerce sellers in GCC.
Results:
  â€¢ 40% faster payment processing via Engaze.ai integration
  â€¢ âˆ’30% Customer Acquisition Cost (CAC) through AI-driven marketing automation (Midjourney Ã— Zapier)
  â€¢ Scaled to 50+ active sellers before exit

CASE STUDY 6 â€” HNM IT Frankfurt (Network Engineering)
Role: IT Network Engineer. Client: HNM IT, Frankfurt, Germany.
Results:
  â€¢ 99.9% network uptime maintained across engagement
  â€¢ âˆ’35% Mean Time to Resolution (MTTR) via network automation scripts
  â€¢ Delivered in German-language enterprise environment (multilingual execution)

RECOGNITION
- Redis Side Quest Winner 2024 â€” competitive open-source hackathon, global participants
- MIT Hacknation 2026 Next Best â€” 200+ teams, judged on technical execution and business impact

LANGUAGES
- English: IELTS 7.5 (professional working proficiency)
- Bengali: Native
- German: Goethe A2 (operational in Frankfurt environment)

CONTACT
Email: abir.abbas@proton.me
LinkedIn: linkedin.com/in/abir-abbas
Portfolio: abir.getwaved.ai`;

// â”€â”€â”€ Cycling crack questions during load â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    }, QUESTION_CYCLE_MS);
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

// â”€â”€â”€ Cached celebration burst â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SPARKS = ["âœ¦", "â¬¡", "â—ˆ", "âœ¶", "â‹", "â—†", "âœº", "â¬Ÿ"];
function CachedBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {SPARKS.map((s, i) => {
        const angle = (i / SPARKS.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * BURST_RADIUS_PX;
        const ty = Math.sin(rad) * BURST_RADIUS_PX;
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

// â”€â”€â”€ Typing indicator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Shimmer progress bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        {value}% â€” {label}
      </p>
    </div>
  );
}

// â”€â”€â”€ Main widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Magnetic proximity effect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      if (dist < MAGNETIC_RANGE_PX) {
        orbX.set(dx * MAGNETIC_PULL);
        orbY.set(dy * MAGNETIC_PULL);
      } else {
        orbX.set(0);
        orbY.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [open, orbX, orbY]);

  // â”€â”€ Idle tooltip cycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          scheduleTooltip();
        }, 3000);
      }, IDLE_TOOLTIP_DELAY_MS);
    };
    scheduleTooltip();
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (tooltipCycleRef.current) clearTimeout(tooltipCycleRef.current);
    };
  }, [open]);

  // â”€â”€ Auto-scroll messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // â”€â”€ Focus input when ready â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (phase === "ready" && open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [phase, open]);

  // â”€â”€ Load engine (lazy â€” only on first open) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        QWEN_MODEL_ID,
        {
          initProgressCallback: (r: { progress: number }) =>
            setLoadProgress(Math.round(r.progress * 100)),
        }
      );
      engineRef.current = engine;
      const elapsed = Date.now() - loadStart;
      if (elapsed < CACHE_HIT_MS) {
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

  // â”€â”€ Send message â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        max_tokens: MAX_RESPONSE_TOKENS,
        temperature: RESPONSE_TEMPERATURE,
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
      {/* â”€â”€ Floating orb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              {lang === "ar" ? "Ø§Ø³Ø£Ù„ Ø¹Ù† Ø£Ø¨ÙŠØ± â†" : "Ask me about Abir â†’"}
              {/* Arrow pointer */}
              <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rotate-45 border-r border-t border-white/10 bg-[color:var(--bento)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orb wrapper â€” spring position for magnetic effect */}
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
                  {orbHovered ? "âœ¦" : "AI"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* â”€â”€ Chat panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

              {/* Loading state â€” orb spinner + crack questions + progress bar */}
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

                  {/* "Meanwhile, people are wonderingâ€¦" */}
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                    {lang === "ar" ? "Ø¨ÙŠÙ†Ù…Ø§ ÙŠØªØ³Ø§Ø¡Ù„ Ø§Ù„Ù†Ø§Ø³â€¦" : "Meanwhile, people are wonderingâ€¦"}
                  </p>

                  {/* Cycling funny questions */}
                  <CrackQuestions lang={lang} />

                  {/* Progress bar */}
                  <div className="w-full">
                    <ProgressBar value={loadProgress} label={tx.chat.loading} />
                  </div>
                </div>
              )}

              {/* Cached state â€” instant load celebration */}
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
                    âš¡
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-center space-y-1"
                  >
                    <p className="font-mono text-[13px] font-semibold text-[color:var(--accent-teal)]">
                      {lang === "ar" ? "âš¡ Ù…Ø­Ù…Ù‘Ù„ Ù…Ù† Ø§Ù„ÙƒØ§Ø´!" : "âš¡ Loaded from cache!"}
                    </p>
                    <p className="font-mono text-[10px] text-foreground/40">
                      {lang === "ar" ? "Ù„Ø£Ù† Ø£Ø¨ÙŠØ± Ù„Ø§ ÙŠÙ†ØªØ¸Ø± Ø£Ø­Ø¯Ø§Ù‹ ðŸ˜Ž" : "Because Abir doesn't keep you waiting ðŸ˜Ž"}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Error state */}
              {phase === "error" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                  <span className="text-2xl">âš </span>
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
                                â–‹
                              </motion.span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator â€” shown briefly between send and first token */}
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

