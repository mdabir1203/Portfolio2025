import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/i18n/translations';
import { translations } from '@/i18n/translations';

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  cycle: () => void;
  t: (key: keyof typeof translations.en) => string;
}>({
  lang: 'en',
  setLang: () => {},
  cycle: () => {},
  t: (key) => (translations.en[key] as { toString(): string }).toString(),
});

const ORDER: ReadonlyArray<Lang> = ['en', 'ar', 'bn', 'de'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const v = url.searchParams.get('lang');
      const stored = localStorage.getItem('lang') as Lang | null;
      const navLang = (navigator.languages?.[0] || navigator.language || 'en')
        .toLowerCase()
        .split('-')[0] as Lang;
      const candidates: Array<Lang | null | string> = [v as Lang, stored, navLang, 'en'];
      for (const c of candidates) {
        if (c && (ORDER as ReadonlyArray<string>).includes(c as string)) {
          setLangState(c as Lang);
          return;
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const cycle = () => setLangState((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length]);

  // Lookup helper. Falls back to English, then to the raw key.
  const t = (key: keyof typeof translations.en): string => {
    const all = translations as unknown as Record<Lang, Record<string, unknown>>;
    const dict = all[lang] || all.en;
    const fallback = all.en;
    const v = (dict[key] ?? fallback[key]) as unknown;
    if (typeof v === 'string') return v;
    // Object — pull the first useful string field.
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      for (const k of ['h', 'p1', 'pitch', 'location', 'tag', 'cta', 'value', 'text', 'name']) {
        if (typeof o[k] === 'string') return o[k] as string;
      }
    }
    return String(key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, cycle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;
