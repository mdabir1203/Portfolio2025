// Reveal — staggered content reveal for blocks (eyebrow → title → body → accent).
//
// Single component, clean API. The container reads its own inView state;
// direct children are wrapped in motion components that pick up the parent's
// "show" variant and stagger from there. Honors prefers-reduced-motion.
//
// Usage:
//
//   <Reveal className="..." stagger={0.12}>
//     <p className="text-ink-faint">// The New View</p>
//     <h2>AED 111,246</h2>
//     <p>True backlog value…</p>
//     <div>★ recommended</div>
//   </Reveal>
//
// Children keep their original semantics (h2 stays h2, p stays p).
// Screen readers see the final state on first render.

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

const itemVariants = (reduce: boolean) => ({
  hidden: reduce
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 0, y: 14, filter: "blur(3px)" },
  show: reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, filter: "blur(0px)" },
});

export type RevealProps = {
  children: ReactNode;
  /** Tag for the container. Default "div". */
  as?: ElementType;
  className?: string;
  /** Delay between sibling reveals in seconds. Default 0.12. */
  stagger?: number;
  /** Margin offset to fire earlier/later. Default "-8% 0px". */
  margin?: string;
};

export function Reveal({
  children,
  as = "div",
  className,
  stagger = 0.12,
  margin = "-8% 0px",
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: margin as `${string} ${string}`,
  });
  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : stagger,
              delayChildren: reduce ? 0 : 0.04,
            },
          },
        }}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          return (
            <motion.div
              variants={itemVariants(reduce)}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {cloneElement(child)}
            </motion.div>
          );
        })}
      </motion.div>
    </Tag>
  );
}
