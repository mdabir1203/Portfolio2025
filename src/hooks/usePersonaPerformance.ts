import { useRef } from 'react';

/**
 * Performance monitoring for persona detection and layout adaptation.
 * Tracks:
 * - Time to detect persona
 * - Time to render adaptive layout
 * 
 * Uses performance.now() for accurate timing without relying on Performance API marks/measures
 * which can have browser compatibility issues.
 */
export function usePersonaPerformance() {
  const detectionStartTime = useRef<number | null>(null);
  const renderStartTime = useRef<number | null>(null);

  const markDetectionStart = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      detectionStartTime.current = performance.now();
    }
  };

  const markDetectionEnd = (persona: string, source: string) => {
    if (detectionStartTime.current && typeof window !== 'undefined' && 'performance' in window) {
      const endTime = performance.now();
      const duration = endTime - detectionStartTime.current;
      
      // Log duration to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PersonaPerformance] Detection took ${Math.round(duration)}ms for ${persona} (${source})`);
      }

      // Send to analytics if duration is concerning (>100ms)
      if (duration > 100 && typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'persona_detection_slow', {
            duration_ms: Math.round(duration),
            persona,
            source,
          });
        } catch (error) {
          // Silently fail - analytics should never break the app
          if (process.env.NODE_ENV === 'development') {
            console.warn('[usePersonaPerformance] Analytics failed:', error);
          }
        }
      }

      detectionStartTime.current = null;
    }
  };

  const markRenderStart = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      renderStartTime.current = performance.now();
    }
  };

  const markRenderEnd = () => {
    if (renderStartTime.current && typeof window !== 'undefined' && 'performance' in window) {
      const duration = performance.now() - renderStartTime.current;
      
      // Log duration to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PersonaPerformance] Render took ${Math.round(duration)}ms`);
      }

      // Send to analytics if duration is concerning (>200ms)
      if (duration > 200 && typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'persona_render_slow', {
            duration_ms: Math.round(duration),
          });
        } catch (error) {
          // Silently fail - analytics should never break the app
          if (process.env.NODE_ENV === 'development') {
            console.warn('[usePersonaPerformance] Analytics failed:', error);
          }
        }
      }

      renderStartTime.current = null;
    }
  };

  return {
    markDetectionStart,
    markDetectionEnd,
    markRenderStart,
    markRenderEnd,
  };
}
