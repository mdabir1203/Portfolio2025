// useAudience — detect the visitor's intent (recruiter, founder, peer, default).
//
// Resolution order (first match wins, persisted in sessionStorage so a
// deep-link override beats in-session referrer signals):
//
//   1. URL `?audience=...`           — explicit deep-link (e.g. /recruiter?audience=recruiter)
//   2. URL `?role=...` / `?for=...`  — common alias from inMail and ATS
//   3. document.referrer             — LinkedIn, Indeed, Greenhouse, Lever, Workable,
//                                       AshbyHQ, Recruiterflow, Gem, Huntr, Wellfound,
//                                       GitHub Jobs, YC Work at a Startup
//   4. UTM `utm_source=...`          — `linkedin`, `inmail`, `recruiter`, `greenhouse`,
//                                       `lever`, `workable`, `ashby`, `hr-tech`
//   5. Persisted session choice
//   6. Default: "default"
//
// The hook is SSR-safe (returns "default" until the client runs useEffect).
import { useEffect, useState } from "react";

export type Audience = "recruiter" | "founder" | "peer" | "default";

const STORAGE_KEY = "abir.audience.v1";

const RECRUITER_HOSTNAMES: Array<string | RegExp> = [
  "linkedin.com",
  "lnkd.in",
  "indeed.com",
  "glassdoor.com",
  "greenhouse.io",
  "lever.co",
  "workable.com",
  "workable-mail.com",
  "ashbyhq.com",
  "recruiterflow.com",
  "gem.com",
  "huntr.co",
  "wellfound.com",
  "angel.co",
  "ycombinator.com",
  "workatastartup.com",
  "github.com", // github.com/jobs/* etc.
  "stackoverflow.com",
  "remoteok.com",
  "weworkremotely.com",
];

const RECRUITER_UTM = new Set([
  "linkedin",
  "inmail",
  "recruiter",
  "hr",
  "talent",
  "greenhouse",
  "lever",
  "workable",
  "ashby",
  "hr-tech",
  "bamboohr",
  "jobadder",
  "recruiterflow",
  "gem",
  "huntr",
  "wellfound",
  "jobvite",
  "icims",
  "smartrecruiters",
  "jobstreet",
  "bayt",
  "gulf-talent",
  "naukri",
  "naukrigulf",
  "mihnati",
  "bayt.com",
]);

const FOUNDER_HOSTNAMES: Array<string | RegExp> = [
  "ycombinator.com",
  "yc.com",
  "producthunt.com",
  "hackernews.com",
  "news.ycombinator.com",
  "angellist.com",
  "wellfound.com",
  "f6s.com",
  "crunchbase.com",
];

const PEER_HOSTNAMES: Array<string | RegExp> = [
  "github.com",
  "gitlab.com",
  "stackoverflow.com",
  "dev.to",
  "hashnode.com",
  "medium.com",
  "twitter.com",
  "x.com",
  "linkedin.com", // also surfaces in recruiter list — recruiter wins for hire copy
  "reddit.com",
  "lobste.rs",
];

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function matchesHost(host: string, patterns: Array<string | RegExp>): boolean {
  for (const p of patterns) {
    if (typeof p === "string") {
      if (host === p || host.endsWith("." + p)) return true;
    } else {
      if (p.test(host)) return true;
    }
  }
  return false;
}

function fromUrl(): Audience | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const explicit =
    url.searchParams.get("audience") ||
    url.searchParams.get("role") ||
    url.searchParams.get("for") ||
    url.searchParams.get("as");
  if (explicit) {
    const v = explicit.toLowerCase();
    if (v === "recruiter" || v === "recruiters" || v === "hr" || v === "talent" || v === "hiring") {
      return "recruiter";
    }
    if (v === "founder" || v === "ceo" || v === "founder-mode" || v === "startup") {
      return "founder";
    }
    if (v === "peer" || v === "engineer" || v === "dev" || v === "developer" || v === "tech") {
      return "peer";
    }
  }
  return null;
}

function fromReferrer(): Audience | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  const host = hostnameOf(document.referrer);
  if (!host) return null;
  if (matchesHost(host, RECRUITER_HOSTNAMES)) return "recruiter";
  if (matchesHost(host, FOUNDER_HOSTNAMES)) return "founder";
  if (matchesHost(host, PEER_HOSTNAMES)) return "peer";
  return null;
}

function fromUtm(): Audience | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const src = (url.searchParams.get("utm_source") || "").toLowerCase();
  const medium = (url.searchParams.get("utm_medium") || "").toLowerCase();
  const campaign = (url.searchParams.get("utm_campaign") || "").toLowerCase();
  if (RECRUITER_UTM.has(src)) return "recruiter";
  if (medium === "recruiter" || medium === "inmail" || medium === "talent") return "recruiter";
  if (medium === "email" && (campaign.includes("recruit") || campaign.includes("hire") || campaign.includes("talent"))) {
    return "recruiter";
  }
  return null;
}

function fromStorage(): Audience | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(STORAGE_KEY);
    if (v === "recruiter" || v === "founder" || v === "peer" || v === "default") {
      return v;
    }
  } catch {}
  return null;
}

export function detectAudience(): Audience {
  return fromUrl() || fromReferrer() || fromUtm() || fromStorage() || "default";
}

export function useAudience(): Audience {
  const [audience, setAudience] = useState<Audience>("default");

  useEffect(() => {
    const detected = detectAudience();
    setAudience(detected);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, detected);
    } catch {}
    // Notify anything that's watching the audience (analytics, chat persona).
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("abir:audience", { detail: detected }));
    }
  }, []);

  return audience;
}
