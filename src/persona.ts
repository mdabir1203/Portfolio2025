import { safeStorageGet, safeStorageSet } from './utils/personaFallback';

export type Persona = 'general' | 'recruiter' | 'client' | 'collaborator';

const STORAGE_KEY = 'portfolioPersona';

export type PersonaDetectionSource = 'query' | 'storage' | 'referrer' | 'default' | 'debug';

const VALID_PERSONAS: Persona[] = ['general', 'recruiter', 'client', 'collaborator'];

function normalizePersona(value: string | null): Persona | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  switch (lower) {
    case 'recruiter':
    case 'hiring':
    case 'talent':
      return 'recruiter';
    case 'client':
    case 'founder':
    case 'buyer':
      return 'client';
    case 'collaborator':
    case 'engineer':
    case 'dev':
    case 'developer':
      return 'collaborator';
    case 'general':
      return 'general';
    default:
      return null;
  }
}

export function getStoredPersona(): Persona | null {
  if (typeof window === 'undefined') return null;
  
  const raw = safeStorageGet(STORAGE_KEY);
  if (!raw) return null;
  
  if (VALID_PERSONAS.includes(raw as Persona)) {
    return raw as Persona;
  }
  
  return normalizePersona(raw);
}

export function storePersona(persona: Persona): void {
  if (typeof window === 'undefined') return;
  safeStorageSet(STORAGE_KEY, persona);
}

function detectPersonaFromQueryInternal(search: string): { persona: Persona | null; source: PersonaDetectionSource } {
  if (!search) return { persona: null, source: 'default' };

  const params = new URLSearchParams(search);
  const direct = params.get('persona');
  if (direct === 'debug') {
    // Explicit debug mode: render as general, but don't persist or apply other heuristics
    return { persona: 'general', source: 'debug' };
  }

  const fromPersona = normalizePersona(direct);
  if (fromPersona) {
    return { persona: fromPersona, source: 'query' };
  }

  const utmCampaign = params.get('utm_campaign') || params.get('utm_content');
  const fromUtm = normalizePersona(utmCampaign);
  if (fromUtm) {
    return { persona: fromUtm, source: 'query' };
  }

  return { persona: null, source: 'default' };
}

function detectPersonaFromReferrerInternal(referrer: string): Persona | null {
  if (!referrer) return null;
  const lower = referrer.toLowerCase();

  if (lower.includes('linkedin') || lower.includes('wellfound') || lower.includes('angel.co')) {
    return 'recruiter';
  }

  if (
    lower.includes('github') ||
    lower.includes('gitlab') ||
    lower.includes('stackexchange') ||
    lower.includes('stackoverflow') ||
    lower.includes('medium.com') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be')
  ) {
    return 'collaborator';
  }

  if (
    lower.includes('producthunt') ||
    lower.includes('indiehackers') ||
    lower.includes('vercel.app')
  ) {
    return 'client';
  }

  return null;
}

export function detectInitialPersona(options?: { allowStorage?: boolean }): { persona: Persona; source: PersonaDetectionSource } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { persona: 'general', source: 'default' };
  }

  const allowStorage = options?.allowStorage ?? true;

  // 1) Explicit query param / UTM
  const fromQuery = detectPersonaFromQueryInternal(window.location.search);
  if (fromQuery.persona) {
    return { persona: fromQuery.persona, source: fromQuery.source };
  }

  // 2) Stored preference (only if storage is allowed)
  if (allowStorage) {
    const stored = getStoredPersona();
    if (stored) {
      return { persona: stored, source: 'storage' };
    }
  }

  // 3) Referrer heuristic
  const fromReferrer = detectPersonaFromReferrerInternal(document.referrer);
  if (fromReferrer) {
    return { persona: fromReferrer, source: 'referrer' };
  }

  // 4) Fallback
  return { persona: 'general', source: 'default' };
}

