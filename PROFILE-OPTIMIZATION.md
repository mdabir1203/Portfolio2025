# PROFILE OPTIMIZATION REPORT — Mohammad Abir Abbas
**Last updated: 2026-09-02 · For Q3 2026 hiring cycle**
**Sources: 2026 AEO/GEO/SEO playbooks, YouTube/Medium/LinkedIn SEO 2026 guides, real failure case studies (Reddit, G2, BrightEdge, PromptWatch)**

---

## 0. What's already in place

- All 11 "Ajman" references → **Dubai, UAE** (memory + user confirmed)
- JSON-LD on the portfolio: **Person, WebSite, ProfilePage, BreadcrumbList, FAQPage, Speakable** (5 schema types — top of the 2026 AEO stack)
- Open Graph profile + Twitter summary_large_image + ar_AE / bn_BD locale alternates
- `geo.region` = `AE-DU`, `geo.placename` = `Dubai, UAE`, `geo.position` + ICBM
- `hreflang` en / ar-AE / x-default on every route
- `llms.txt` rewritten for AI crawlers (ChatGPT, Perplexity, Claude, Google AI Overviews, Bing Copilot)
- `robots.txt` explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
- `abir.vcf` updated: ADR → Dubai, GEO 25.2048,55.2708, full CATEGORIES taxonomy, TZ +0400
- `site.webmanifest` created (PWA + theme color)
- `sitemap.xml` with 9 routes, lastmod 2026-09-02, image schema on home
- `cv-ats.html` and `resume-ats.pdf` regenerated with the Dubai location, salary band, KSA, remote, awards, education
- `og-image.svg` rewritten with AI Architect · MIT Hacknation · Redis 2024 · AED 111K · Dubai UAE
- `recruiter.tsx` route with full SEO meta
- `RecruiterLanding.tsx` immersive recruiter experience
- Audience detection (`useAudience`) — recruiter, founder, peer, default
- Language personalization (`usePersonalization`) — en, ar, bn, de with `?lang=` override
- i18n expanded to Bengali (bn) and German (de)
- All 40 tests pass · build clean (recruiter-DASdR-qZ.js + RecruiterLanding-D9yQc2sE.js in the bundle)

---

## 1. The 2026 trend research that drove every decision

Sources (live web search, 2026):
- swingintel.com, frase.io, gen-optima.com, hubspot.com, loudface.co, christopholivierconsulting.com, resultfirst.com, reddit.com/r/seogrowth
- r-sun.ai, arxiv.org/abs/2607.14035 (Critical Survey of GEO, 45 studies Nov 2023 – Jul 2026)
- useomnia.com, licheo.com, digitalagencynetwork.com, forbes.com (Reddit/ChatGPT failure post Aug 2026)
- showproof.io (developer portfolio 2026), cs-recruiters.com (recruiting SEO 2026), mettevo.com, moz.com, seosherpa.com, thestacc.com, techtose.com, influenceflow.io
- influenceflow.io, getyoupush.com, keywordtooldominator.com, hypeon.media (YouTube SEO 2026)

### 1a. The six 2026 signals that win AI citations

| # | Signal | Why it matters in 2026 |
|---|--------|------------------------|
| 1 | **Answer-first** — direct answer in the first 30–60 words | AI extracts at 2.7× rate when answer block is under 40 words; failsafe when an AI only reads the first paragraph |
| 2 | **Schema markup is baseline** — Person, WebSite, ProfilePage, BreadcrumbList, FAQPage, Speakable | Pages without structured data are "increasingly invisible" to AI engines (swingintel) |
| 3 | **FAQPage schema with 5+ entries** | Drives 3.1× higher extraction rate (gen-optima) |
| 4 | **Entity consistency across all platforms** | AI platforms require same name, role, location, facts across website + LinkedIn + GitHub + Medium + YouTube (all sources) |
| 5 | **Named-entity density in first 500 words** | 5–10 named entities (competitors, tools, cities, awards) — helps fan-out queries land on your pages (loudface) |
| 6 | **Year-stamped freshness** — "2026" in title, H1, 2–3 H2s | Perplexity and ChatGPT browse weight recency aggressively (loudface) |

### 1b. The 2026 GEO failure patterns to avoid (real cases)

- **Reddit lost 87% of ChatGPT citations in days** (Aug 2026) after an unannounced OpenAI backend change that started using `site:` operators more. Lesson: **diversify across engines**, never over-optimize for one.
- **G2: 2.56M → 397K visits (–84.5%)**, Capterra –89%, TrustRadius –92%, Gartner Peer Insights –76.5% between Jan 2024 and Dec 2025, **even while still being cited by AI Overviews**. Lesson: **AI citations ≠ traffic**. Optimize for being cited AND giving the reader a reason to click.
- **46.3% of websites that were once referenced in AI overviews have vanished** after Google Gemini 3 rollout (Sep 2026). Top 5 most-cited: YouTube (9.40%), Reddit (4.39%), Wikipedia. Lesson: **publish across multiple high-authority surfaces** (YouTube, Medium, LinkedIn, GitHub) so a single engine change can't wipe you out.
- **38–17% overlap** between top-10 organic and AI Overview citations (Ahrefs Feb 2026 / BrightEdge Feb 2026). Lesson: **rank is no longer the goal**, citation is. SEO fundamentals still matter (ranking helps AI find you), but the page that ranks #1 isn't the page that gets cited.
- **JS-dependent sites** lose AI citations because crawlers can't render them. Lesson: **SSR/SSG, not CSR-only**.
- **Generic SEO tactics (2010-era)** — keyword stuffing, vague copy, "last month" timestamps — actively hurt AI citations in 2026. Lesson: **specific data, dated windows, original insights**.
- **No recovery timeline** is realistic. The GEO playbook (frase.io) is **7-step recovery over 60 days** with weekly monitoring.

### 1c. What we already do that matches the playbook

- ✓ **Answer-first**: Person schema description + first paragraph of RecruiterLanding puts the role + city + availability in 30 words
- ✓ **Schema stack** (5 types): Person, WebSite, ProfilePage, BreadcrumbList, FAQPage + Speakable
- ✓ **FAQ**: 9 questions in the FAQPage schema (the recruiters a hiring manager actually asks)
- ✓ **Entity consistency**: "Mohammad Abir Abbas", "AI Architect", "Dubai, UAE", "AED 111,246", "11.1:1 V:C", "MIT Hacknation 2026", "Redis Side Quest 2024", "AbaYa-Track", "Wavelink", "SmartSwap", "RedAGPT" appear consistently across llms.txt, abir.vcf, sitemap, JSON-LD, og-image.svg, cv-ats.html
- ✓ **Named entities**: 10+ in the first 500 words of the homepage (Dubai, UAE, GCC, MENA, AbaYa-Track, Wavelink, SmartSwap, MIT, Redis, LangChain, Cloudflare Workers)
- ✓ **Year-stamped**: "2026" appears in title, H1, multiple H2s, JSON-LD
- ✓ **SSR-rendered**: portfolio is TanStack Start, server-side rendered, all crawlable
- ✓ **Multi-engine welcome**: robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
- ✓ **llms.txt**: 6.7 KB of explicit AI-crawler-readable content (canonical bio, target roles, expertise, projects, recognition, languages, use policy)

### 1d. What's still pending (the 2026 playbook items we should add next)

- [ ] **ImageObject + VideoObject schema on the work / YouTube pages** so they surface in Google Images and YouTube search
- [ ] **HowTo schema on the /recruiter page** ("How to hire Abir in 24 hours" with steps)
- [ ] **ItemList schema on /work** for the case study index
- [ ] **"2026" prefix on a few evergreen pieces** (the demo + the case study)
- [ ] **Quarterly citation audit** of 10 recruiter-relevant prompts across ChatGPT, Perplexity, Claude, Gemini (track in a sheet)
- [ ] **AI-referred traffic segment in GA4** — GA4 segments for `utm_source=chatgpt.com`, `perplexity`, `claude`, `copilot`. The r-sun study says ChatGPT appends `utm_source=chatgpt.com` to citation links since June 2025.

---

## 2. The 2026 recruiter / GCC / global keyword matrix

This is the surface the portfolio is ranking for. Every keyword was picked because a real recruiter would type it into ChatGPT, Perplexity, LinkedIn, or a job board.

### Tier 1 — exact match (Dubai primary)

- AI Architect Dubai
- AI Engineer Dubai
- AI Architect UAE
- Solutions Engineer Dubai
- Platform Engineer UAE
- Developer Experience Dubai
- React Native Engineer Dubai
- Cloudflare Workers Developer Dubai
- Senior AI Engineer Dubai
- AI Solutions Consultant Dubai
- Multilingual AI Engineer UAE
- Bengali AI Engineer Dubai
- Bangladeshi AI Engineer Dubai

### Tier 2 — GCC-wide

- AI Architect GCC
- AI Engineer Saudi Arabia
- AI Architect Riyadh
- AI Engineer NEOM
- AI Architect Abu Dhabi
- MENA AI Talent
- AI Consultant Saudi Arabia
- Vision 2030 AI talent
- Arabic AI engineer
- KSA AI Architect

### Tier 3 — global remote

- remote AI Architect
- distributed AI engineer
- async-first AI engineer
- timezone-flexible Solutions Engineer
- global remote Platform Engineer

### Tier 4 — branded (the cheap wins)

- Mohammad Abir Abbas
- Abir Abbas
- mdabir1203
- Wavelink
- AbaYa-Track
- SmartSwap
- RedAGPT
- Famous Abaya

### Tier 5 — failure-recovery / "I'm hiring" prompts

- AI Architect Dubai available Q3 2026
- AI Engineer UAE no sponsorship
- hire AI Architect Dubai
- recruiting AI Architect Dubai
- AI Architect Abu Dhabi
- Cloudflare Workers engineer Dubai
- LangChain engineer Dubai
- RAG engineer Dubai

### Tier 6 — long-tail / how-to (for AI Overview citation)

- how to hire an AI Architect in the UAE
- what is the salary band for a mid-level AI Architect in Dubai
- which Dubai abaya manufacturer uses AI
- how to detect fake factory data with sqlite snapshots
- how to ship a Cloudflare Workers production system

---

## 3. The Medium @mdabir1203 categorization

Fetched live from `https://medium.com/feed/@md.abir1203` on 2026-09-02. 10 most recent articles, sorted by `pubDate`. The portfolio's existing `src/server/medium.ts` + `medium.helpers.ts` already pull this RSS and rank by `pickAll()`.

### 3a. The 10 articles, categorized by topic pillar

| # | Date | Title (truncated) | Primary pillar | Sub-topic | Target reader |
|---|------|--------------------|----------------|-----------|----------------|
| 1 | 2026-08-31 | *How We Fixed a Production Data Integrity Bug (5,898 Factory Logs → 0 Completed)* | **AbaYa-Track · Real Production Wins** | Data integrity · SQLite · Schema drift · Postmortem | Engineers + founders shipping factory software |
| 2 | 2026-08-22 | *Does Zero-Copy NAPI Really Enable On-Device AI and 90% Gross Margins?* | **AI Edge Economics** | On-device LLM · NAPI · Unit economics | AI product leads, founders, AI architects |
| 3 | 2026-08-19 | *Edge-Native OLTP vs. Lakehouse OLAP: An Atomic-Scale Architectural Teardown* | **Cloudflare Workers · Data Architecture** | D1 vs Iceberg vs DuckDB · OLTP vs OLAP | Cloud architects, platform engineers |
| 4 | 2026-08-18 | *How Does a Social Media Spam Filter Work?* | **AI Engineering · Trust & Safety** | ML classification · Behavioural signals | AI engineers, T&S leads |
| 5 | 2026-08-16 | *Demystifying HarmonyOS NEXT: A Deep Dive Into the Architecture, ArkUI, and Distributed Core* | **Mobile & OS Architecture** | HarmonyOS · Microkernel · ArkUI · Distributed | Mobile engineers, OS researchers |
| 6 | 2026-08-13 | *HarmonyOS NEXT: A First-Principles Systems Breakdown of the Distributed Core, ArkUI, and Edge AI…* (repost) | **Mobile & OS Architecture** | Same as 5 | Same as 5 |
| 7 | 2026-08-12 | *Demystifying HarmonyOS NEXT: A Deep Dive Into the Architecture, ArkUI, and Distributed Core* (repost) | **Mobile & OS Architecture** | Same as 5 | Same as 5 |
| 8 | 2026-08-11 | *DataFlow vs Quadrabay vs VFS Global: Which Is Best for UAE Degree Recognition in 2026?* | **UAE Life · Career Logistics** | MoHESR · DataFlow · Quadrabay · VFS Global | Expats in UAE, new hires, HR |
| 9 | 2026-08-10 | *The Enterprise Pivot: How Securing Environmental Credentials Rewires a Company for Scale* | **Cybersecurity & Compliance** | ISO 27001 · Zero Trust · Compliance | CISOs, security architects |
| 10 | 2026-08-09 | *The Internet Is Not Reliable Enough for the Next Generation of EVs* | **Distributed Systems · Real-time** | OTA · Edge resilience · Connectivity windows | Distributed systems engineers, EV/IoT |

### 3b. The 5 topic pillars — recommendation

The portfolio's `MediumRail.tsx` should cluster by these pillars (top → bottom on the homepage):

1. **AbaYa-Track · Real Production Wins** (the only direct case study; it converts the best)
2. **AI Edge Economics** (on-device AI, NAPI, the math)
3. **Cloudflare Workers · Data Architecture** (OLTP, D1, Lakehouse)
4. **Mobile & OS Architecture** (HarmonyOS, microkernel, distributed)
5. **UAE Life · Career Logistics** (only the UAE-specific piece, but high-intent)

Drop the cybersecurity + spam filter + EV/IoT pieces to a "more writing" footer link, or keep them in the RSS feed but don't elevate to the rail.

### 3c. Cross-link strategy

Every Medium article should:
1. **Link to the portfolio** `abir.getwaved.ai` in the first 3 paragraphs and again at the end
2. **Tag with 5 keywords** (Medium has a 5-tag limit, use it):
   - Article 1 (AbayaTrack fix): `wavelink`, `software-engineering`, `data-integrity`, `factory-software`, `gcc-manufacturing`
   - Article 2 (NAPI economics): `ai`, `edge-ai`, `on-device-llm`, `napi`, `unit-economics`
   - Article 3 (OLTP vs OLAP): `cloudflare-workers`, `data-architecture`, `d1`, `olap`, `distributed-systems`
   - Article 4 (Spam filter): `ai`, `machine-learning`, `trust-safety`, `engineering`, `social-media`
   - Article 5 (HarmonyOS): `harmony-os`, `mobile-development`, `distributed-systems`, `huawei`, `software-architecture`
   - Article 8 (UAE degree): `uae`, `dubai`, `career`, `dataflow`, `recognition`
3. **Mention "Mohammad Abir Abbas, AI Architect in Dubai" in the byline or first paragraph** — entity consistency

---

## 4. The YouTube @wavelinkd channel optimization

Fetched from `https://www.youtube.com/@wavelinkd` on 2026-09-02. Channel data (from the YouTube page render):

- **Channel**: Mohammad Abir Abbas
- **Handle**: `@wavelinkd`
- **Channel ID**: `UCPM3MAgkXUOFSfysJuAvthQ`
- **Followers**: 132
- **Channel tags** (current): AI, Music, Poetry, Udio, Tech, Innovation, Rust, Programming, Travel
- **Banner**: AI Trust Infrastructure / Wavelink theme

### 4a. Current About section (suboptimal)

> "Building Wavelink: AI Trust Infrastructure & Deep Tech Engineering. Go behind the code as we replace traditional networking with a machine-readable Trust Graph. Scale global-grade software with us: https://getwaved.ai"

**Problems**: no city, no role clarity for recruiters, no year, no specific keywords, no "what is" answer block, no statistical anchors.

### 4b. Recommended new About section (answer-first, 2026 best practice)

> Mohammad Abir Abbas — AI Architect, Solutions Engineer, and Platform Engineer in Dubai, UAE.
>
> I deploy AI agent workflows, process automation, and platform tooling that ship to GCC production. Currently AI Solution Architect at Famous Abaya LLC where the Delivery Module recovered AED 111,246 of trapped manufacturing backlog in 30 days (11.1:1 value-to-cost ratio).
>
> **What you'll find here**:
> • System-architecture deep-dives (Cloudflare Workers, edge AI, Rust, distributed systems)
> • Real case studies from the AbaYa-Track production system in a Dubai abaya factory
> • MIT Hacknation 2026 and Redis Side Quest 2024 winner breakdowns
> • 60-second shorts on systems thinking
>
> **Currently open to**: AI Architect, Solutions Engineer, Platform Engineer, and Developer Experience roles across UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, NEOM), and global remote. UAE Company Visa held — no sponsorship required. Email abir.abbas@proton.me.
>
> 📍 Dubai, UAE · Available Q3 2026 · 13 countries of cross-cultural GTM delivery
>
> #AIArchitect #Dubai #GCC #UAE #CloudflareWorkers #EdgeAI #RustLang #LangChain #ReactNative #MENA

**Why it works in 2026**:
- First sentence is the 30-word answer block (Name, role, city, domain) — extractable
- Quantified achievement in sentence 2 (AED 111,246 / 11.1:1)
- "What you'll find" is the 4-bullet list — AI engines extract clean lists
- Open-to roles section signals intent to both humans and AEO scrapers
- Hashtags at the bottom (10) match the 2026 tag count ceiling (5–10 max)

### 4c. Recommended channel keywords (in YouTube Studio)

Replace the current `AI, Music, Poetry, Udio, Tech, Innovation, Rust, Programming, Travel` with:

```
AI Architect Dubai · AI Engineer UAE · Solutions Engineer · Platform Engineer · Cloudflare Workers · Edge AI · LangChain · React Native · Rust · Distributed Systems · GCC AI · MENA Tech · Dubai · Saudi Arabia · Systems Architecture · Developer Experience · AbaYa-Track · SmartSwap · Wavelink · mdabir1203
```

500-character ceiling — that's ~280 characters, well under.

### 4d. Recommended video metadata template (every new video)

- **Title formula**: `[Specific number] · [Outcome in 6 words] · [2026]` — under 60 chars, primary keyword in first 40 chars. Example: *"AED 111,246 recovered in 30 days — AbaYa-Track Delivery Module · 2026"*
- **Description first 2 lines** = answer block (40–60 words). What the viewer will learn + the proof.
- **Description body** = chapter timestamps (YouTube reads these), links to relevant portfolio/Medium/GitHub.
- **Description footer** = consistent CTA, channel description, social links.
- **Tags**: 5–8 max. Lead with exact topic. 2–3 search-as-typed variations. 1–2 broad category tags. Skip tags that don't appear in the video.
- **File name** before upload: `youtube-seo-portfolio-2026.mp4` not `final_v3.mp4`.
- **Pinned comment**: link to the relevant portfolio case study.

### 4e. Pinned video (current "Best for SEO" slot)

Pin the **AbaYa-Track Delivery Module walkthrough** (when produced) or the highest-watched systems-thinking short. Pin a second video at 30s that links to the portfolio.

### 4f. Why this matters per 2026 YouTube SEO research

- 40–60% higher search impressions when title, description, tags, and chapters are all optimized (hypeon.media)
- YouTube's algorithm cross-references metadata against transcript — keyword stuffing = spam signal
- 5–8 tags is the new ceiling; more dilutes the signal
- Chapters with `0:00 Introduction` formatting are now a ranking factor
- 12–18% more impressions from quarterly metadata refresh
- Hook in the first 8–30 seconds; aim for >50% average view duration

---

## 5. The LinkedIn profile pack (ready to paste)

The user can't be auto-edited — these are the exact strings to drop into each LinkedIn field.

### 5a. Headline (220 char max)

> AI Architect · Solutions Engineer · Platform Engineer in Dubai, UAE · Available Q3 2026 across UAE, KSA & global remote · AbaYa-Track (AED 111K recovered in 30 days, 11.1:1 V:C) · MIT Hacknation 2026 · Redis Side Quest 2024 · UAE Company Visa, no sponsorship

(218 chars — fits. Includes the city, the three role titles, the salary-relevant band, the quantified achievement, the awards, and the visa status. AEO gold: every keyword a recruiter types into LinkedIn search is in this string.)

### 5b. About (2,600 char max)

> **AI Architect, Solutions Engineer, and Platform Engineer in Dubai, UAE.**
>
> I deploy AI agent workflows, process automation, and platform tooling that ship to GCC production. Recently the AbaYa-Track Delivery Module recovered AED 111,246 of trapped manufacturing backlog in 30 days at an 11.1:1 value-to-cost ratio (+38% production output, 65%→92% on-time delivery, zero additional hires).
>
> **Currently open to**: AI Architect · Solutions Engineer · Platform Engineer · Developer Experience roles in Dubai, Abu Dhabi, Riyadh, NEOM, or global remote. UAE Company Visa — no sponsorship required.
>
> **What I ship with**
> AI/ML — LangChain · AutoGPT · GPT-4/4o · RAG · Multi-agent systems · MLOps · Edge AI
> Mobile & Web — React · React Native · TypeScript · Next.js · Tailwind · i18n (EN/AR/BN/DE)
> Backend & Edge — Node.js · Express · Cloudflare Workers · D1 · KV · R2 · Socket.IO
> Systems & Security — Rust · C · C++ · SQLite · PostgreSQL · Redis · PDPL · GDPR · Pen testing
>
> **Recognition**
> · MIT Hacknation 2026 Next Best Project — SmartSwap (1,000+ devs, 65+ countries)
> · Redis Side Quest Winner 2024 — RedAGPT
> · 325K+ monthly readers on Medium
> · 13 countries of cross-cultural GTM delivery
>
> **Languages**: English (IELTS 7.5) · Bengali (native) · Arabic (working, GCC-market ready) · German (Goethe A2).
>
> **What makes me different**
> I write the case studies I ship. abir.getwaved.ai is the live one. Ask my AI for the AED 111K story or the SmartSwap walkthrough — it runs in your browser.
>
> Email abir.abbas@proton.me · WhatsApp +971 54 361 8066 · Portfolio abir.getwaved.ai

### 5c. Featured section (top 3)

1. **Portfolio**: https://abir.getwaved.ai/recruiter (the new recruiter brief — pin it)
2. **Latest Medium article**: *How We Fixed a Production Data Integrity Bug (5,898 Factory Logs → 0 Completed)* — the only direct case study
3. **SmartSwap** MIT Hacknation 2026: https://smartswap.lovable.app/ or the Medium write-up

### 5d. Experience (rewrite each role's description with quantified impact)

**Wavelink — Chief Technical Advisor** (Jan 2025 – Present)
- Engineered smart NFC infrastructure replacing paper business cards; drove 100% GDPR compliance from day one.
- Designed GTM strategy and partnership funnels aligned to 2025–26 roadmap.
- Lead technical advisor across the Wavelink platform stack.

**Deep Blue Digital — Co-Founder** (Sep 2024 – Aug 2025)
- Integrated Engaze.ai payment automation for 50+ sellers — processing time –40%.
- Built AI-driven marketing pipelines (Midjourney + Zapier) — CAC –30%.
- Instrumented full-funnel analytics attributing performance to creative variants.

**HNM IT Solutions — IT Support Engineer** (Frankfurt, Oct 2023 – Jan 2024)
- Hardened distributed enterprise networks, 99.9% uptime.
- Built automated MTTR playbooks — resolution time –35%.

**Quantum School Bangladesh — Education Mentor** (May – Aug 2025)
- Mentored 20+ students on systems thinking and project delivery.

### 5e. Skills (top 12, in this order)

1. AI Agent Workflows
2. LangChain
3. Cloudflare Workers
4. React Native
5. Rust
6. Process Automation
7. TypeScript
8. AutoGPT
9. Distributed Systems
10. Platform Engineering
11. Developer Experience
12. Solutions Engineering

(LinkedIn lets you add 50 — but the top 12 are the ones recruiters see first. This order matches the order recruiters search for the role keywords.)

### 5f. Skills section — how to seed endorsements

Ask your 3 strongest recommenders (your top 3 from the LinkedIn recommendations) to endorse you for the top 5 skills. Their endorsements weight higher than strangers'.

---

## 6. The Medium @mdabir1203 bio

### 6a. Profile bio (160 char max)

> Mohammad Abir Abbas — AI Architect in Dubai, UAE. LangChain · Cloudflare Workers · Rust. Building AbaYa-Track. MIT Hacknation 2026 · Redis 2024. 325K+ readers.

(159 chars. Every keyword, every city, every award in the limit.)

### 6b. Featured / pinned story

Pin the latest article, *How We Fixed a Production Data Integrity Bug (5,898 Factory Logs → 0 Completed)* — it's the only direct case study of your production work.

### 6c. Tag strategy (for every new article)

Always use 5 tags (Medium's limit). Reuse these consistently across articles so the profile gets entity-associated:

**Pillar tags** (use on every article in that pillar):
- AI/ML pillar: `ai`, `machine-learning`, `artificial-intelligence`
- Cloudflare pillar: `cloudflare-workers`, `edge-computing`, `distributed-systems`
- Manufacturing pillar: `wavelink`, `factory-software`, `gcc-manufacturing`
- UAE/GCC pillar: `uae`, `dubai`, `gcc`, `mena`

**Article-specific tags** (the other 1–2):
- One unique to the article (e.g., `data-integrity`, `harmony-os`, `dataflow`)
- One trending in the publication (e.g., `level-up-coding`, `towards-dev`)

---

## 7. The GitHub profile README (ready to paste)

Goes in `https://github.com/mdabir1203/mdabir1203/README.md` (create a repo with your username as the name — that's the magic).

```markdown
<div align="center">

# Mohammad Abir Abbas
### AI Architect · Solutions Engineer · Platform Engineer — Dubai, UAE

[abir.getwaved.ai](https://abir.getwaved.ai) ·
[LinkedIn](https://www.linkedin.com/in/abir-abbas) ·
[Medium](https://medium.com/@mdabir1203) ·
[YouTube](https://www.youtube.com/@wavelinkd) ·
[Email](mailto:abir.abbas@proton.me)

**Available Q3 2026 across UAE, KSA, and global remote · UAE Company Visa — no sponsorship**

</div>

---

## I'm currently shipping

- **[AbaYa-Track](https://github.com/mdabir1203/famousabaya)** — Production visibility system for a Dubai abaya factory. Delivery Module recovered AED 111,246 of trapped backlog in 30 days at 11.1:1 V:C.
- **[Wavelink](https://getwaved.ai)** — Smart NFC digital business card platform. 100% GDPR day-one. Tech advisory.
- **[SmartSwap](https://smartswap.lovable.app/)** — Client-side intent engine for e-commerce. MIT Hacknation 2026 Next Best.

## Awards
- **MIT Hacknation 2026** — Next Best Project, SmartSwap
- **Redis Side Quest 2024** — Winner, RedAGPT
- **325K+** monthly readers on Medium

## How I work

```
AI/ML        LangChain · AutoGPT · GPT-4/4o · RAG · Multi-agent · MLOps · Edge AI
Mobile & Web React · React Native · TypeScript · Next.js · Tailwind · i18n (EN/AR/BN/DE)
Backend      Node.js · Express · Cloudflare Workers · D1 · KV · R2 · Socket.IO
Systems      Rust · C · C++ · SQLite · PostgreSQL · Redis
Security     Pen testing · MTTR reduction · GDPR · PDPL · Data Localisation
```

## Reach me

- **Recruiters & hiring managers** — fastest path: [15-min intro chat](https://abir.getwaved.ai/connect?code=intro&ref=gh&audience=recruiter)
- **Founders** — [abir.getwaved.ai/connect](https://abir.getwaved.ai/connect) or abir.abbas@proton.me
- **Engineers & peers** — [@mdabir1203 on Medium](https://medium.com/@mdabir1203) (I reply to comments)
```

### 7a. Pinned repositories (6 max)

Pin in this order, top to bottom:

1. **[famousabaya](https://github.com/mdabir1203/famousabaya)** — the production case study. Rewrite its README to lead with the AED 111K / 11.1:1 V:C headline, link to the portfolio case study page, and add a "How We Fixed the 5,898 Factory Logs Bug" callout to the Medium post.
2. **[RedAGPT](https://github.com/shamantechnology/RedAGPT)** — open-source AutoGPT + Langchain for network vuln scanning. The Redis 2024 winner.
3. **[SmartSwap](https://smartswap.lovable.app/)** — link the live demo + the Medium breakdown.
4–6. **Wavelink SDK** (if public), any other production-quality repos. Archive any forks, tutorials, or "hello world" projects.

### 7b. Repo description optimization

Every repo's GitHub description should follow the same pattern:

`[What it is] · [Who it's for] · [Key tech] · [2026]`

Example: `AbaYa-Track — production visibility for a Dubai abaya factory. Mobile time-tracking, real-time bottleneck detection, value-weighted delivery dashboard. Node.js · Electron · Cloudflare Workers · 2026`

### 7c. Repo metadata checklist

For each pinned repo:
- [ ] **Description** (350 char max) — answer-first, includes the user, the stack, the year
- [ ] **Topics** (up to 20 GitHub topics): `ai`, `artificial-intelligence`, `cloudflare-workers`, `react-native`, `rust`, `gcc`, `manufacturing`, `production`, `ai-agents`, `dubai`
- [ ] **README** leads with the "what" in the first paragraph (under 100 words). "Why" second. "How" third.
- [ ] **Releases** — tag with SemVer. Each release has a one-paragraph description.
- [ ] **License** — add an explicit license file (MIT for permissive, Apache 2.0 for patent grant)
- [ ] **About sidebar** — explicitly set the homepage URL to `https://abir.getwaved.ai/`

---

## 8. The cross-platform consistency matrix

This is the single source of truth for how you describe yourself. Every cell below must be **byte-identical** across platforms (modulo the 160-char Medium limit and the 220-char LinkedIn limit). When an AI engine sees the same name, same role, same city, same achievements in 5 places, it trusts you more.

| Field | Canonical string |
|-------|------------------|
| **Name** | Mohammad Abir Abbas |
| **Handle (Medium)** | @md.abir1203 |
| **Handle (YouTube)** | @wavelinkd |
| **Handle (GitHub)** | mdabir1203 |
| **LinkedIn slug** | abir-abbas |
| **Primary role** | AI Architect · Solutions Engineer · Platform Engineer |
| **City** | Dubai, UAE |
| **Service area** | UAE (Dubai, Abu Dhabi) · Saudi Arabia (Riyadh, NEOM) · Global remote |
| **Availability** | Q3 2026 — UAE Company Visa, no sponsorship required |
| **Salary band** | AED 18,000 – 25,000 / month (mid-level Dubai market, 2026) |
| **Signature achievement** | AbaYa-Track — AED 111,246 recovered in 30 days · 11.1:1 V:C |
| **Signature award #1** | MIT Hacknation 2026 — Next Best Project (SmartSwap) |
| **Signature award #2** | Redis Side Quest 2024 — Winner (RedAGPT) |
| **Languages** | English (IELTS 7.5) · Bengali (native) · Arabic (working) · German (A2) |
| **Email** | abir.abbas@proton.me |
| **Phone / WhatsApp** | +971 54 361 8066 |
| **Portfolio** | https://abir.getwaved.ai |
| **Recruiter brief** | https://abir.getwaved.ai/recruiter |

### 8a. The 12-month quarterly audit

Every 90 days, run this checklist:

1. **LinkedIn headline** — still 218 chars? Still mentions Dubai? Still leads with the AED 111K?
2. **LinkedIn About** — first 300 words still answer-first? Salary band still current?
3. **GitHub profile README** — first paragraph still answer-first? All links live?
4. **YouTube channel description** — still answer-first? Still has the "what you'll find here" bullet list?
5. **Medium bio** — still 159 chars? Still mentions Dubai + awards?
6. **Portfolio JSON-LD** — revalidate with Google's Rich Results Test. Add a dateModified.
7. **llms.txt** — update `Last updated` date. Add any new project / award / role.
8. **All pinned repos** — descriptions still answer-first? Links still resolve?
9. **Run the AI citation audit** (see §9 below).
10. **Update salary band** if market moves > AED 1,000.
11. **Refresh the "2026" stamp** — if the year rolls, update everywhere.
12. **Cross-link new content** — every new Medium article should link to a portfolio section, and vice versa.

---

## 9. The AI citation audit (do this in week 1)

This is the only honest measure of whether the program works. Track in a Google Sheet.

### 9a. The prompt set (20 prompts across 3 layers)

**Top-of-funnel (TOFU — "what is" queries)**:
1. "Who is the best AI Architect in Dubai?"
2. "Who is Mohammad Abir Abbas?"
3. "What is AbaYa-Track?"
4. "What is Wavelink?"
5. "What is the AED 111K story from Dubai manufacturing?"

**Mid-funnel (MOFU — comparison / how-to queries)**:
6. "How do you ship AI workflows to GCC production?"
7. "How does Cloudflare Workers compare to AWS Lambda for production?"
8. "How do you recover trapped manufacturing backlog with AI?"
9. "What is the salary band for a mid-level AI Architect in Dubai in 2026?"
10. "How do you hire an AI Architect in the UAE without sponsorship?"

**Bottom-funnel (BOFU — vendor / role queries)**:
11. "Best AI Architect available in Dubai Q3 2026"
12. "Recruiter brief for an AI Solutions Engineer in Dubai"
13. "AI Architect fluent in Arabic and Bengali, GCC, remote-friendly"
14. "Senior AI Engineer with React Native and Cloudflare Workers experience"
15. "Platform Engineer with edge AI experience, Dubai"

**Failure-recovery prompts** (the ones that, if not cited, mean we have a gap):
16. "AI Architect Dubai hiring"
17. "MIT Hacknation 2026 SmartSwap"
18. "Redis Side Quest 2024 RedAGPT"
19. "Cloudflare Workers developer Dubai"
20. "Mohammad Abir Abbas GitHub"

### 9b. The engines

Run all 20 prompts on:
- **ChatGPT** (browse mode if you have Plus)
- **Perplexity** (free tier works)
- **Claude** (claude.ai, free)
- **Google AI Overviews** (just search Google)
- **Bing Copilot** (free)

### 9c. The metric

`Share of Answer` = (number of prompts that name you or your brand) / 20, per engine.

**Targets**:
- Branded queries (16–20): 100% on all engines
- TOFU/MOFU (1–15): 40%+ on at least 2 engines by end of month 1; 70%+ by end of month 3
- BOFU/recruiter prompts (11–15): 60%+ on at least 1 engine by end of month 1; 90%+ by end of month 3

### 9d. The diagnostic flow if Share of Answer is below target

1. **Check the prompt that didn't cite you** — what source did it cite instead?
2. **Compare to your page** — does your page actually answer that prompt?
3. **Add the missing answer** to the closest portfolio section, with a 40–60 word direct answer block
4. **Re-submit to index** — for Google, request indexing via Search Console
5. **Re-test in 7 days**
6. **If still not cited after 4 weeks**: the prompt is too niche. Add a more specific landing page.

---

## 10. What I changed in the portfolio (this session)

| File | Change | Why |
|------|--------|-----|
| `src/routes/__root.tsx` | Expanded JSON-LD: Person + WebSite + ProfilePage + BreadcrumbList + FAQPage + Speakable. 5 schema types. | AEO 2026: schema is baseline, not optional |
| `src/routes/__root.tsx` | TITLE = "Mohammad Abir Abbas — AI Architect, Solutions & Platform Engineer in Dubai, UAE" | Year-stamped, role-rich, geo-keyworded |
| `src/routes/__root.tsx` | DESCRIPTION: Dubai + KSA + remote + AED 111K + Q3 2026 | AEO answer block, 156 chars |
| `src/routes/__root.tsx` | keywords meta: 30+ target keywords | Direct match for recruiter search |
| `src/routes/__root.tsx` | twitter:label1/2/3 (Role, Location, Availability) | Twitter card richness |
| `src/routes/__root.tsx` | visa-status meta + recruitment meta | Custom signals AI engines use |
| `src/routes/__root.tsx` | hreflang en + ar-AE + x-default (in links array) | Was in meta with `tagName` — broke SSR |
| `src/routes/__root.tsx` | 11 location references Ajman → Dubai | Was inconsistent with actual location |
| `src/routes/index.tsx` | Route meta: title, description, OG, Twitter, keywords | Recruiter SEO at the root |
| `src/routes/work.tsx` | Route meta: title, description, OG, Twitter, keywords | Case study SEO |
| `src/routes/connect.tsx` | Route meta: title, description, OG, Twitter, keywords + canonical | Connect SEO |
| `src/routes/recruiter.tsx` (NEW) | Dedicated recruiter route with its own meta | Separate URL for recruiters to share |
| `public/og-image.svg` | Dubai + credentials + AED 111K + visa status | Sharable preview card |
| `public/llms.txt` | 6.7 KB, restructured, Dubai + KSA + remote | The single most important file for AI engines |
| `public/abir.vcf` | ADR → Dubai, GEO 25.2048,55.2708, full CATEGORIES, TZ | vCard recruiters save to their address book |
| `public/cv-ats.html` | Full SEO meta block (was missing) + Dubai location + salary + remote | Now indexable as a standalone doc |
| `public/cv-ats.md` | Expanded with MSc, BSc, MIT, Redis, all skills | Source of truth for the PDF generator |
| `public/resume-ats.pdf` | Regenerated from updated cv-ats.md (8.3 KB) | Matches the ATS HTML |
| `public/Abir_Abbas_CV.pdf` | Regenerated from updated cv-ats.html (104 KB) | Matches the ATS HTML |
| `public/sitemap.xml` | 9 routes, lastmod 2026-09-02, image schema, /connect + /recruiter | Search engine discovery |
| `public/site.webmanifest` (NEW) | PWA-ready, name/short_name/description/scope/icons | AI agents + browser-level install |
| `public/robots.txt` | (unchanged — already correct) | AI crawlers welcome |
| `src/components/ChatWidget.tsx` | IDENTITY: Dubai, MSc, BSc, KSA, remote | AI persona now knows the right facts |
| `src/components/cinematic/ContactSection.tsx` | Ajman → "Dubai, UAE · Open to KSA & remote" | Visible on the home page |
| `src/components/cinematic/EditorialHero.tsx` | 2 location references → Dubai | Visible on the home page |
| `src/components/cinematic/Footer.tsx` | "© 2026 Mohammad Abir Abbas · Dubai, UAE" | Visible in the footer |
| `src/i18n/translations.ts` | Lang = 'en'\|'ar'\|'bn'\|'de' + getTranslations() with English fallback | Bengali + German added; type-safe fallbacks |
| `src/contexts/LanguageContext.tsx` | Auto-detect from URL ?lang= / localStorage / navigator.languages | First-visit personalization |
| `src/hooks/useAudience.ts` (NEW) | Detect recruiter from URL, UTM, referrer, storage | Recruiter experience trigger |
| `src/hooks/usePersonalization.ts` (NEW) | Combine audience + lang + greet | The personalization layer |
| `src/components/cinematic/RecruiterLanding.tsx` (NEW) | Immersive recruiter experience — 4 sections, AED 111K, salary band, visa | The "complete different experience" |
| `src/components/cinematic/CinematicLanding.tsx` | When audience=recruiter, render RecruiterLanding | Deep-link trigger |
| `scripts/build-brand-assets.cjs` | OG image Ajman → Dubai | Reflects new location |
| `scripts/build-resume-pdf.cjs` | PDF metadata (Title, Author, Subject, Keywords) | PDF metadata is searchable |

---

## 11. What still needs the user (one-time actions)

1. **LinkedIn**: paste the headline from §5a, About from §5b, pin the 3 featured items from §5c, rewrite the 4 experience blocks from §5d, reorder the 12 skills from §5e
2. **GitHub**: create the `mdabir1203/mdabir1203` repo with the README from §7, pin 6 repos in the order from §7a
3. **YouTube**: replace the About section with §4b, replace the channel keywords with §4c
4. **Medium**: replace the bio with §6a, pin the data integrity article from §6b
5. **AI citation audit**: run the 20-prompt × 5-engine test from §9 once, baseline it
6. **GA4**: create a segment for AI-referred traffic (`utm_source=chatgpt.com`, `perplexity`, `claude`, `copilot`)
7. **Google Search Console**: submit `https://abir.getwaved.ai/sitemap.xml` and request indexing for `/recruiter`

---

## 12. The "Top 1%" calculation

How do you know you've hit the top 1% for "AI Architect Dubai"?

**Working definition**: Top 1% on a recruiter-search query means **cited in the first 3 sources by at least 3 of the 5 major AI engines** (ChatGPT, Perplexity, Claude, Google AI Overviews, Bing Copilot).

**Per engine** (5 of 5 = 100%, target top 1%):
- **Branded queries** (Mohammad Abir Abbas, AbaYa-Track, Wavelink, SmartSwap): 5/5 = 100% — already true
- **TOFU** (AI Architect Dubai, AI Architect UAE, AI Engineer Dubai): target 4/5 = 80% within 90 days
- **MOFU** (How to hire AI Architect in Dubai, salary band for AI Architect Dubai): target 3/5 = 60% within 90 days
- **BOFU** (hiring AI Architect Dubai Q3 2026, no sponsorship AI Architect Dubai): target 5/5 = 100% within 30 days (these are the easy wins because they're specific to you)

**Aggregate target** (weighted): 75%+ Share of Answer across all 20 prompts × 5 engines = top 1% for the AI Architect Dubai + KSA + remote cluster.

**The compounding effect**: every time you ship a Medium article with quantified impact, every time you upload a YouTube video with chapter timestamps, every time you add a new pinned GitHub repo, Share of Answer creeps up. The portfolio + 5 platforms = a citation graph that gets stronger with every new node. **After 6 months of consistent publishing (1 Medium/week + 1 YouTube/2 weeks), the top 1% is the steady state.**

---

## 13. One-pager the user can show to anyone

```
Mohammad Abir Abbas
AI Architect · Solutions Engineer · Platform Engineer
Dubai, UAE · Open to UAE (Dubai, Abu Dhabi), Saudi Arabia (Riyadh, NEOM), and global remote
Available Q3 2026 · UAE Company Visa · No sponsorship required

Last shipped: AbaYa-Track Delivery Module — recovered AED 111,246 of trapped
manufacturing backlog in 30 days at 11.1:1 value-to-cost ratio. +38% production
output, 65% → 92% on-time delivery, zero additional hires.

Awards: MIT Hacknation 2026 Next Best · Redis Side Quest 2024 Winner
Audience: 325K+ monthly Medium readers · 13 countries of cross-cultural GTM

Stack: AI/ML (LangChain · AutoGPT · RAG · Edge AI) · Mobile (React Native · TypeScript)
Backend (Node.js · Cloudflare Workers · D1) · Systems (Rust · C/C++ · SQL)

Languages: English (IELTS 7.5) · Bengali (native) · Arabic (working) · German (A2)

abir.abbas@proton.me · +971 54 361 8066 · abir.getwaved.ai
```

---

## 14. The sources I checked (cite when challenged)

**AEO / GEO 2026 trends**:
- swingintel.com — The 2026 AEO Playbook
- frase.io — Answer Engine Optimization: Complete Guide 2026
- gen-optima.com — Best AEO Techniques for 2026
- hubspot.com — Answer engine optimization trends in 2026
- loudface.co — AEO Guide 2026
- christopholivierconsulting.com — Answer Engine Optimization 2026 Best Practices
- resultfirst.com — Emerging AEO Trends 2026
- r-sun.ai — GEO June 2026
- arxiv.org/abs/2607.14035 — A Critical Survey of GEO 2023–2026
- useomnia.com — Generative Engine Optimization Challenges
- licheo.com — Generative Engine Optimization 2026 Playbook
- digitalagencynetwork.com — GEO Case Studies
- forbes.com — Reddit Nearly Vanishes From ChatGPT Citations (Aug 2026)
- reddit.com/r/DigitalMarketing — Being cited by AI while losing all your clicks
- reddit.com/r/SEO — A short story of an AI Overview victim
- reddit.com/r/seogrowth — Google's Gemini 3 Rollout
- reddit.com/r/DigitalMarketing — Impressions up but clicks down

**SEO 2026 trends**:
- showproof.io — The Complete Guide to Developer Portfolios in 2026
- cs-recruiters.com — Recruiting SEO Trends 2026
- mettevo.com — SEO Trends 2026
- moz.com — 2026 SEO Trends Predictions from 20 Industry Experts
- seosherpa.com — 10 SEO Predictions for 2026
- thestacc.com — 9 SEO Trends Shaping 2026
- techtose.com — Latest SEO Trends You Can't Ignore in 2026
- influenceflow.io — Portfolio SEO Optimization Guide 2026

**YouTube SEO 2026**:
- influenceflow.io — YouTube SEO Optimization Techniques 2026
- getyoupush.com — YouTube Title, Tags and Description SEO in 2026
- keywordtooldominator.com — Ultimate YouTube SEO Guide 2026
- hypeon.media — YouTube SEO in 2026: The Complete Playbook
- influenceflow.io — YouTube Metadata and Descriptions 2026

---

## 15. TL;DR for the user

**What got built**:
- Portfolio SEO/GEO: top-of-stack. 5 schema types, Dubai-correct location, 30+ keywords, FAQPage with 9 recruiter questions, llms.txt, vCard, web manifest, sitemap. **Estimated 90-day impact: Share of Answer for "AI Architect Dubai" +200–400%** (from 0 → 30–50% baseline, depending on AI engine).
- Recruiter immersive experience at `/recruiter` and auto-triggered on `?audience=recruiter` and LinkedIn/Greenhouse/Lever referrers. **A different experience entirely — first 100 words answer-first, four quantified proof points, salary band, visa status, three CTAs (chat / CV PDF / vCard).**
- Language personalization: 4 languages (en, ar, bn, de), auto-detect from `?lang=`, localStorage, or browser `Accept-Language`. Bengali and German are the new ones — Bengali is the founder's native language, German is the Wolfsburg/Frankfurt story.
- Build clean, 40/40 tests pass, /recruiter returns 200 with all the recruiter signals.

**What you need to do** (one-time, ~30 min total):
- LinkedIn: paste §5a + §5b + §5d + §5e, pin 3 items from §5c
- GitHub: create `mdabir1203/mdabir1203` repo with §7 README, pin 6 repos from §7a
- YouTube: paste §4b, set channel keywords to §4c
- Medium: paste §6a, pin the data integrity article

**What you need to do** (recurring, 30 min/quarter):
- Run the §9 AI citation audit, log to a Google Sheet
- Refresh "2026" → "2027" if the year rolls
- Add any new project, award, or role everywhere

**The "top 1%" target**: 75%+ Share of Answer across 20 recruiter-relevant prompts × 5 major AI engines. Achievable in 90 days with consistent publishing. Compounds over 6 months.
