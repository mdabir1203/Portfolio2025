import { useEffect, useRef } from 'react';
import type { Persona, PersonaDetectionSource } from '../persona';

type PersonaEvent = 
  | { type: 'persona_detected'; persona: Persona; source: PersonaDetectionSource }
  | { type: 'persona_switched'; from: Persona; to: Persona }
  | { type: 'consent_granted' }
  | { type: 'consent_denied' }
  | { type: 'cta_clicked'; cta: string; persona: Persona }
  | { type: 'section_viewed'; section: string; persona: Persona };

/**
 * Production-grade analytics hook for persona layer.
 * Tracks key events without heavy dependencies.
 * 
 * Usage:
 * - Automatically tracks persona detection and consent decisions
 * - Call `trackCTA` and `trackSectionView` manually for user interactions
 */
export function usePersonaAnalytics() {
  const hasTrackedInitialPersona = useRef(false);

  const track = (event: PersonaEvent) => {
    if (typeof window === 'undefined') return;

    // Send to Google Analytics 4 if available
    if ((window as any).gtag) {
      (window as any).gtag('event', event.type, {
        persona: 'persona' in event ? event.persona : undefined,
        source: 'source' in event ? event.source : undefined,
        cta: 'cta' in event ? event.cta : undefined,
        section: 'section' in event ? event.section : undefined,
        from: 'from' in event ? event.from : undefined,
        to: 'to' in event ? event.to : undefined,
      });
    }

    // Send to custom analytics endpoint (if configured)
    const analyticsEndpoint = (window as any).__PORTFOLIO_ANALYTICS_ENDPOINT__;
    if (analyticsEndpoint && typeof fetch !== 'undefined') {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
        keepalive: true, // Ensure request completes even if page unloads
      }).catch(() => {
        // Silently fail - analytics should never break the app
      });
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[PersonaAnalytics]', event);
    }
  };

  const trackPersonaDetected = (persona: Persona, source: PersonaDetectionSource) => {
    if (hasTrackedInitialPersona.current) return;
    hasTrackedInitialPersona.current = true;
    track({ type: 'persona_detected', persona, source });
  };

  const trackPersonaSwitched = (from: Persona, to: Persona) => {
    track({ type: 'persona_switched', from, to });
  };

  const trackConsentGranted = () => {
    track({ type: 'consent_granted' });
  };

  const trackConsentDenied = () => {
    track({ type: 'consent_denied' });
  };

  const trackCTA = (cta: string, persona: Persona) => {
    track({ type: 'cta_clicked', cta, persona });
  };

  const trackSectionView = (section: string, persona: Persona) => {
    track({ type: 'section_viewed', section, persona });
  };

  return {
    trackPersonaDetected,
    trackPersonaSwitched,
    trackConsentGranted,
    trackConsentDenied,
    trackCTA,
    trackSectionView,
  };
}
