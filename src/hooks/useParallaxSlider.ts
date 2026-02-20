import { useState, useEffect, useRef, useCallback } from 'react';

interface ParallaxState {
    activeIndex: number;
    rotX: number;
    rotY: number;
}

export function useParallaxSlider(totalCount: number) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [targetRot, setTargetRot] = useState({ x: 0, y: 0 });
    const [currentRot, setCurrentRot] = useState({ x: 0, y: 0 });

    const rafRef = useRef<number>(0);
    const containerRef = useRef<HTMLElement | null>(null);

    // Lerp constant (0.06 as suggested by user)
    const lerpAmount = 0.06;

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            setCurrentRot(prev => ({
                x: prev.x + (targetRot.x - prev.x) * lerpAmount,
                y: prev.y + (targetRot.y - prev.y) * lerpAmount
            }));
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [targetRot]);

    const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate offset from center (-1 to 1)
        const offX = (e.clientX - centerX) / (rect.width / 2);
        const offY = (e.clientY - centerY) / (rect.height / 2);

        // Set target rotation (max 15 degrees for better feel)
        setTargetRot({
            x: Number((-offY * 15).toFixed(2)),
            y: Number((offX * 15).toFixed(2))
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTargetRot({ x: 0, y: 0 });
    }, []);

    const next = useCallback(() => {
        setActiveIndex(prev => (prev + 1) % totalCount);
    }, [totalCount]);

    const prev = useCallback(() => {
        setActiveIndex(prev => (prev - 1 + totalCount) % totalCount);
    }, [totalCount]);

    const goTo = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                next();
            } else if (e.key === 'ArrowLeft') {
                prev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev]);

    // Touch gestures (simplified swipe)
    const touchStart = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart.current - touchEnd;

        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
    };

    // Scroll wheel navigation (throttled)
    const lastScrollTime = useRef(0);
    const handleWheel = useCallback((e: WheelEvent) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 500) return; // 500ms throttle

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 0) next();
            else prev();
            lastScrollTime.current = now;
        } else if (Math.abs(e.deltaY) > 20) {
            // Allow vertical scroll to also trigger horizontal navigation if intent is clear
            // But usually better to keep it to deltaX or specific zones
        }
    }, [next, prev]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) container.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    return {
        activeIndex,
        rotX: currentRot.x,
        rotY: currentRot.y,
        containerRef,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
            onTouchStart: handleTouchStart,
            onTouchEnd: handleTouchEnd
        },
        next,
        prev,
        goTo
    };
}
