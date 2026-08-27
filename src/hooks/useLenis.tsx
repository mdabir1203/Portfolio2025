import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

gsap.registerPlugin(ScrollTrigger);

type LenisContextValue = {
  lenis: Lenis | null;
  ready: boolean;
};

const LenisContext = createContext<LenisContextValue>({ lenis: null, ready: false });

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const coarse = useIsCoarsePointer();
  // Skip Lenis on touch devices and when the user prefers reduced motion —
  // native scroll already feels good there, and pinning on small screens
  // is a UX trap.
  const skipLenis = reduce || coarse;

  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (skipLenis) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    // Bridge Lenis's RAF loop into ScrollTrigger.
    const onRaf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after layout settles (font swap, images, etc.)
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // iOS URL-bar collapse can shift layout after first paint.
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onLoad);

    setReady(true);

    return () => {
      window.removeEventListener("load", onLoad);
      vv?.removeEventListener("resize", onLoad);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [skipLenis]);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, ready }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}
