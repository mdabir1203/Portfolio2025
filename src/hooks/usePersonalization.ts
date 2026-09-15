// usePersonalization — combines audience + browser language + URL override
// into a single "persona" object the rest of the app can read.
//
// Detection priority for `lang`:
//   1. URL `?lang=...`              — deep-link override (?lang=bn, ?lang=de, ?lang=ar)
//   2. localStorage `lang`          — user previously chose (kept in LanguageContext too)
//   3. document.documentElement.lang (if non-en)
//   4. navigator.languages         — pick first match in [bn, ar, de, en]
//   5. Default: "en"
//
// `audience` is resolved by useAudience (recruiter / founder / peer / default).
import { useEffect, useState } from "react";
import { useAudience, type Audience } from "./useAudience";

export type SupportedLang = "en" | "ar" | "bn" | "de";

export interface Personalization {
  audience: Audience;
  lang: SupportedLang;
  isRTL: boolean;
  greeting: string;
  // Did the user explicitly choose a non-default lang? If so, we leave them alone.
  explicitLang: boolean;
}

const RTL_LANGS: ReadonlySet<SupportedLang> = new Set<SupportedLang>(["ar"]);

const SUPPORTED: ReadonlyArray<SupportedLang> = ["en", "ar", "bn", "de"];

const STORAGE_KEY = "abir.lang.v1";

const GREETINGS: Record<SupportedLang, string> = {
  en: "Hi — I'm Abir.",
  ar: "مرحباً — أنا عبير.",
  bn: "আসসালামু আলাইকুম — আমি আবির।",
  de: "Hallo — ich bin Abir.",
};

function fromUrl(): SupportedLang | null {
  if (typeof window === "undefined") return null;
  const v = new URL(window.location.href).searchParams.get("lang");
  if (v && (SUPPORTED as ReadonlyArray<string>).includes(v.toLowerCase())) {
    return v.toLowerCase() as SupportedLang;
  }
  return null;
}

function fromStorage(): SupportedLang | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && (SUPPORTED as ReadonlyArray<string>).includes(v)) {
      return v as SupportedLang;
    }
  } catch {}
  return null;
}

function fromBrowser(): SupportedLang | null {
  if (typeof navigator === "undefined") return null;
  const langs = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : navigator.language
    ? [navigator.language]
    : [];
  for (const raw of langs) {
    const tag = raw.toLowerCase().split("-")[0];
    if ((SUPPORTED as ReadonlyArray<string>).includes(tag)) {
      return tag as SupportedLang;
    }
  }
  return null;
}

function detectLang(): { lang: SupportedLang; explicit: boolean } {
  const url = fromUrl();
  if (url) return { lang: url, explicit: true };
  const stored = fromStorage();
  if (stored) return { lang: stored, explicit: true };
  const browser = fromBrowser();
  if (browser) return { lang: browser, explicit: false };
  return { lang: "en", explicit: false };
}

export function usePersonalization(): Personalization {
  const audience = useAudience();
  const [lang, setLang] = useState<SupportedLang>("en");
  const [explicitLang, setExplicitLang] = useState(false);

  useEffect(() => {
    const detected = detectLang();
    setLang(detected.lang);
    setExplicitLang(detected.explicit);
    try {
      // Persist auto-detected choices too, so the experience stays stable on reload.
      window.localStorage.setItem(STORAGE_KEY, detected.lang);
    } catch {}
    // Reflect on <html lang> for screen readers + browser translation UI.
    if (typeof document !== "undefined") {
      document.documentElement.lang = detected.lang;
      document.documentElement.dir = RTL_LANGS.has(detected.lang) ? "rtl" : "ltr";
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("abir:lang", { detail: detected.lang }),
      );
    }
  }, []);

  // If the URL changes (?lang=bn), pick it up.
  useEffect(() => {
    const onPop = () => {
      const v = fromUrl();
      if (v && v !== lang) setLang(v);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [lang]);

  return {
    audience,
    lang,
    isRTL: RTL_LANGS.has(lang),
    greeting: GREETINGS[lang],
    explicitLang,
  };
}
