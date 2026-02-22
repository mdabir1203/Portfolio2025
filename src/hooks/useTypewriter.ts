import { useState, useEffect, useRef } from 'react';

interface TypewriterOptions {
    startDelayMs?: number;
    charDelayMs?: number;
}

/**
 * Lightweight typewriter hook — uses setInterval (not RAF or Framer Motion).
 * Writes characters one by one into the returned `displayed` string.
 * The cursor is handled purely in CSS via the `.type-cursor` class on the span.
 */
export function useTypewriter(
    text: string,
    { startDelayMs = 0, charDelayMs = 22 }: TypewriterOptions = {}
) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayed('');
        setDone(false);

        const startTimer = setTimeout(() => {
            const interval = setInterval(() => {
                const next = indexRef.current + 1;
                setDisplayed(text.slice(0, next));
                indexRef.current = next;

                if (next >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, charDelayMs);

            return () => clearInterval(interval);
        }, startDelayMs);

        return () => clearTimeout(startTimer);
    }, [text, startDelayMs, charDelayMs]);

    return { displayed, done };
}
