// TerminalCard — a card that, on hover/tap, reveals a typing-in JSON
// snippet like a data terminal output.
//
// Designed for the "Five variables" set in the case study. The front
// reads like a normal card. On pointer-enter (desktop) or tap (touch),
// the card flips up and types out something like:
//
//   { weight: 0.35, source: "tier" }
//
// with a tiny terminal cursor that blinks.
//
// Why this matters: the case study talks about a value engine that
// collapses five inputs into one AED number. The terminal reveal is the
// side of that you're not supposed to see in the demo — it makes the
// engineered depth feel earned, not claimed.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

export type TerminalCardProps = {
  /** Big number or icon on top of the card. */
  corner: ReactNode;
  /** Card title (e.g. "Order price"). */
  title: ReactNode;
  /** One-sentence description. */
  description: ReactNode;
  /** Terminal snippet to type out on reveal. */
  terminal: ReactNode;
  /** Background tint. Default paper-2. */
  className?: string;
};

const TYPE_SPEED_MS = 12; // per character

export function TerminalCard({
  corner,
  title,
  description,
  terminal,
  className,
}: TerminalCardProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const terminalStr =
    typeof terminal === "string" ? terminal : String(terminal ?? "");
  const intervalRef = useRef<number | null>(null);

  const startTyping = useCallback(() => {
    setTyped("");
    setDone(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = window.setInterval(() => {
      i += 1;
      setTyped(terminalStr.slice(0, i));
      if (i >= terminalStr.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDone(true);
      }
    }, TYPE_SPEED_MS);
  }, [terminalStr]);

  useEffect(() => {
    if (open && !reduce) startTyping();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [open, reduce, startTyping]);

  // Touch / click toggles. Pointer enter starts typing.
  const onActivate = useCallback(() => {
    setOpen((o) => {
      const next = !o;
      if (next) startTyping();
      return next;
    });
  }, [startTyping]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onPointerEnter={() => !open && setOpen(true)}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className={
        "group relative cursor-pointer select-none rounded-2xl border border-rule bg-paper-2 p-5 outline-none transition-colors hover:bg-paper-hi focus-visible:ring-2 focus-visible:ring-[#0f7569] " +
        (className ?? "")
      }
    >
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
          {corner}
        </div>
        <motion.div
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-[#0f7569]"
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : open
                ? { opacity: [1, 0.4, 1], scale: [1, 1.4, 1] }
                : { opacity: 1, scale: 1 }
          }
          transition={{
            duration: 1.6,
            repeat: reduce ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="mt-3 font-display text-xl leading-tight md:text-2xl">
        {title}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted md:text-sm">
        {description}
      </p>

      {/* Terminal reveal */}
      <motion.div
        initial={false}
        animate={
          open
            ? { opacity: 1, height: "auto", marginTop: 16 }
            : { opacity: 0, height: 0, marginTop: 0 }
        }
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="rounded-md border border-[#0f7569]/25 bg-[#0a1411] px-3 py-2 font-mono text-[11px] leading-[1.5] text-[#b9efe5]">
          <span className="mr-1 text-[#5d6cc4]">$</span>
          <span>{typed}</span>
          {!done && (
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-3 w-1.5 -translate-y-0.5 bg-[#b9efe5]"
              animate={reduce ? {} : { opacity: [1, 0, 1] }}
              transition={{ duration: 0.85, repeat: Infinity }}
            />
          )}
        </div>
        <div className="mt-2 flex items-center justify-end text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          <span aria-hidden>↩ tap to close</span>
        </div>
      </motion.div>

      {/* Static hint chip when closed — gives the user a clue. */}
      {!open && (
        <div className="mt-3 flex items-center justify-end font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint opacity-70">
          <span aria-hidden>hover · tap · →</span>
        </div>
      )}
    </div>
  );
}
