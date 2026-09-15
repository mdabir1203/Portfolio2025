// Stable visitor code for the /connect referral stamp.
//
// Resolution order:
//   1. URL `?code=...` param if present (server-known codes win).
//   2. A 6-char alphanumeric code stored in sessionStorage so re-renders
//      and modal toggles don't churn the visible value.
//   3. Generate a fresh one, persist, return.
//
// 6 chars from a 32-char alphabet (uppercase + digits) gives ~1B options —
// more than enough for personal-brand distribution volume.
import { useEffect, useState } from "react";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
const LENGTH = 6;
const STORAGE_KEY = "abir.visitorCode.v1";

function generate(): string {
  // crypto.getRandomValues is available in all modern browsers and Workers.
  const bytes = new Uint8Array(LENGTH);
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < LENGTH; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < LENGTH; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function useVisitorCode(urlCode: string | undefined): string {
  const [code, setCode] = useState<string>(() => {
    if (urlCode && urlCode !== "intro") return urlCode.toUpperCase();
    if (typeof window === "undefined") return "INTRO";
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored && /^[A-Z0-9]{4,12}$/.test(stored)) return stored;
    } catch {
      // sessionStorage can throw in private mode or restricted contexts.
    }
    const fresh = generate();
    try {
      window.sessionStorage.setItem(STORAGE_KEY, fresh);
    } catch {
      // Ignore.
    }
    return fresh;
  });

  // If the URL changes (e.g. user navigates between /c/foo and /c/bar), pick
  // up the new code. Persisted session code only applies when URL is "intro"
  // (the default).
  useEffect(() => {
    if (urlCode && urlCode !== "intro") {
      setCode(urlCode.toUpperCase());
    }
  }, [urlCode]);

  return code;
}
