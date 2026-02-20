import type { Persona } from '../persona';

/**
 * Graceful degradation utilities for persona layer.
 * Ensures the site works even if localStorage/APIs fail.
 */

/**
 * In-memory fallback storage when localStorage is unavailable.
 * Cleared on page reload (by design - privacy-first).
 */
const memoryFallback: {
  persona?: Persona;
  consent?: 'granted' | 'denied';
} = {};

export function getPersonaFallback(): Persona | null {
  return memoryFallback.persona || null;
}

export function setPersonaFallback(persona: Persona): void {
  memoryFallback.persona = persona;
}

export function getConsentFallback(): 'granted' | 'denied' | null {
  return memoryFallback.consent || null;
}

export function setConsentFallback(consent: 'granted' | 'denied'): void {
  memoryFallback.consent = consent;
}

/**
 * Checks if localStorage is available and working.
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__persona_storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe localStorage wrapper with fallback to memory.
 */
export function safeStorageGet(key: string): string | null {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Fall through to memory fallback
    }
  }
  
  // Memory fallback
  if (key === 'portfolioPersona') {
    return memoryFallback.persona || null;
  }
  if (key === 'portfolioConsent') {
    return memoryFallback.consent || null;
  }
  
  return null;
}

export function safeStorageSet(key: string, value: string): void {
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch {
      // Fall through to memory fallback
    }
  }
  
  // Memory fallback
  if (key === 'portfolioPersona') {
    memoryFallback.persona = value as Persona;
  } else if (key === 'portfolioConsent') {
    memoryFallback.consent = value as 'granted' | 'denied';
  }
}
