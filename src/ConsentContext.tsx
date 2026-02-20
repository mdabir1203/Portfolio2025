import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { usePersonaAnalytics } from './hooks/usePersonaAnalytics';
import { safeStorageGet, safeStorageSet } from './utils/personaFallback';

type ConsentStatus = 'unknown' | 'granted' | 'denied';

type ConsentContextValue = {
  status: ConsentStatus;
  grant: () => void;
  deny: () => void;
};

const STORAGE_KEY = 'portfolioConsent';

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

type ConsentProviderProps = {
  children: ReactNode;
};

export const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<ConsentStatus>('unknown');
  const { trackConsentGranted, trackConsentDenied } = usePersonaAnalytics();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = safeStorageGet(STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      setStatus(stored);
    }
  }, []);

  const persist = (next: ConsentStatus) => {
    if (typeof window === 'undefined') return;
    safeStorageSet(STORAGE_KEY, next);
  };

  const grant = useCallback(() => {
    setStatus('granted');
    persist('granted');
    trackConsentGranted();
  }, [trackConsentGranted]);

  const deny = useCallback(() => {
    setStatus('denied');
    persist('denied');
    trackConsentDenied();
  }, [trackConsentDenied]);

  return (
    <ConsentContext.Provider value={{ status, grant, deny }}>
      {children}
    </ConsentContext.Provider>
  );
};

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}

