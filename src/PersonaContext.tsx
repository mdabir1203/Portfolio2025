import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { detectInitialPersona, Persona, storePersona, type PersonaDetectionSource } from './persona';
import { useConsent } from './ConsentContext';
import { usePersonaAnalytics } from './hooks/usePersonaAnalytics';
import { usePersonaPerformance } from './hooks/usePersonaPerformance';

type PersonaContextValue = {
  persona: Persona;
};

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

type PersonaProviderProps = {
  children: ReactNode;
};

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const [persona, setPersona] = useState<Persona>('general');
  const [detectionSource, setDetectionSource] = useState<PersonaDetectionSource>('default');
  const { status: consentStatus } = useConsent();
  const { trackPersonaDetected } = usePersonaAnalytics();
  const { markDetectionStart, markDetectionEnd, markRenderStart, markRenderEnd } = usePersonaPerformance();

  useEffect(() => {
    if (consentStatus === 'unknown') {
      // Wait until the user has made a choice before using storage-backed signals
      return;
    }

    markDetectionStart();
    const allowStorage = consentStatus === 'granted';

    try {
      const { persona: detected, source } = detectInitialPersona({ allowStorage });
      setPersona(detected);
      setDetectionSource(source);

      markDetectionEnd(detected, source);
      trackPersonaDetected(detected, source);

      // Persist persona for future visits only if:
      // - storage is allowed by consent
      // - we're not in explicit debug mode
      if (allowStorage && source !== 'debug') {
        storePersona(detected);
      }
    } catch (error) {
      // In case anything goes wrong, stay on the safe default
      console.error('[PersonaProvider] Detection failed:', error);
      setPersona('general');
      setDetectionSource('default');
      markDetectionEnd('general', 'default');
    }
  }, [consentStatus, trackPersonaDetected, markDetectionStart, markDetectionEnd]);

  useEffect(() => {
    markRenderStart();
    // Mark render end after a microtask to capture initial render
    Promise.resolve().then(() => {
      markRenderEnd();
    });
  }, [persona, markRenderStart, markRenderEnd]);

  return (
    <PersonaContext.Provider value={{ persona }}>
      {children}
    </PersonaContext.Provider>
  );
};

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return ctx;
}

