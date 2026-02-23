# Portfolio 2025 — *SCALING INNOVATION SAFELY.*

> A personal portfolio that doesn't just list work — it tells the story of how I think, build, and grow.

[![Live Site](https://img.shields.io/badge/Live-Portfolio-0ef-?style=flat-square&logo=vercel)](https://ahossainpharmacy.com)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20TypeScript%20%2B%20Vite-blue?style=flat-square)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## The Story Behind This Portfolio

Most portfolios are CVs dressed in React. This one is different.

Every section here maps to a **real chapter in my life** — a moment I shipped something, broke something, learned something, or simply had the audacity to start. The code is the medium; the experiences are the message.

It started at **42 Wolfsburg** — a peer-to-peer engineering school where there are no teachers, no lectures, and no comfort zone. You learn by doing, or you don't learn at all. That environment rewired how I think about systems: always from first principles, always for real-world impact.

What followed was a sequence of experiments that kept compounding.

---

## How the Site is Structured

The portfolio is a **horizontal swipe story** — like flipping through slides of a life, not scrolling through pages of bullet points. Each section is a full-screen chapter.

```
Home → Skills → Projects → Recognition → Awards → Thoughts → Videos → Impact → Contact
```

The **order shifts based on who you are** — recruiter, client, collaborator, or curious human. The same story, different entry points.

---

## The Chapters

### 🏠 Home — *Who I Am Right Now*
A full-screen hero with a typewriter that spells out `SCALING INNOVATION SAFELY.` — not a tagline, but a working philosophy. Every project I've shipped has been about making systems faster or bigger without sacrificing correctness or trust.

The photo is real. The words are earned.

---

### ⚙️ Skills — *The Tools I Trust*
Not an exhaustive list of every framework I've touched. A focused set of domains where I've shipped things under real pressure: **Rust systems programming**, **multi-agent AI**, **security engineering**, and **full-stack product delivery**.

---

### 🧱 Projects — *The Creation Phase*

Nine projects. Each one is a door I kicked open — some in hackathons, some as self-initiated explorations, some as actual businesses. They're presented as **3D parallax cards** because they *are* multi-dimensional — technical depth on the front, business impact on the back.

| Project | Story | Category |
|---|---|---|
| **The Hollow Batch Exploit** | Discovered how attackers flatten JSON payloads to steal API services. Documented the prevention. | Self Project |
| **ShadowMap** | Built a Rust framework for continuous attack surface monitoring — 40% faster audits, SOC 2 ready. | Self Project |
| **RedAGPT** | Won the Redis Side Quest Hackathon with an AI agent that cuts 48-hour security reviews to 15 minutes. | 🏆 Hackathon |
| **Wavelink** | NFC contactless networking cards — 90% less friction, zero paper, real-time tap analytics. | Startup Venture |
| **EmbeddedGPT** | Self-initiated: automated R&D workflows for embedded systems using Generative AI. | Self Project |
| **A. Hossain Pharmacy** | Took a 25-year-old local pharmacy fully digital — inventory precision, patient retention, online presence. | Startup Venture |
| **The Deep Blue Digital** | A creator marketplace to productize services and generate revenue without billing-hour constraints. | Startup Venture |
| **Modular Rust Learning** | A library of reusable Rust primitives — zero-cost abstractions, 70% code reuse across new projects. | Self Project |
| **Cultural Compass** | AI-powered localization tool helping startups expand into non-Western markets without cultural friction. | Self Project |

---

### 🗣️ Recognition — *What Others Saw*

LinkedIn recommendations — not cherry-picked flattery, but specific technical and collaborative observations from people I've worked alongside. The kind of feedback that shows up in Slack messages and retrospectives, not performance reviews.

---

### 🏅 Awards — *The Receipts*

Not a trophy shelf. A timeline of moments that mattered:

- **Hack-Nation 2026** — current chapter, still building
- **Redis Side Quest Winner** — RedAGPT, June 2023
- **42 Wolfsburg "Wolfsburg Homie"** — 2021–2023: a playful award for persistent presence in the community during late-night build marathons
- **AIESEC VP, Incoming Global Talent** — managing interns and corporate HubSpot integration for Local Committee Hannover
- **AIESEC iGTA Achievement** — highest completed actions in the program
- **DigComp EU Certification** — validated across all five EU digital competence pillars
- **Goethe-Institut A2** — German, because I moved to Germany and actually learned the language

---

### ✍️ Thoughts — *The Medium Writing*

Posts from [Medium](https://medium.com/@md.abir1203) pulled via live RSS. Writing is how I process what I build. If I can explain it simply, I understand it. If I can't, I go back and rebuild it.

---

### 🎥 Videos — *Show, Don't Tell*

Embedded YouTube content. Because some ideas are easier to show than explain.

---

### 📊 Impact — *The Data Story*

Not vanity metrics. A section that anchors the work in real-world outcomes: engineering hours recovered, revenue protected, retention improved. Every number here has a source claim.

---

### 📬 Contact — *Let's Build Something*

Simple. Direct. No noise. If you've read this far, you already know if we should talk.

---

## Tech Architecture

### Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety + component composability |
| Build | Vite | Sub-second HMR, fast cold starts |
| Animation | Framer Motion + CSS keyframes | Complex choreography + zero-overhead idle |
| 3D Effects | Custom CSS `perspective` + `transform-style` | No heavy library, full control |
| Typewriter | Vanilla `setInterval` chain | 0 JS overhead once text is typed |
| Styling | Tailwind CSS + custom CSS variables | Design tokens + utility-first |
| Data | Typed `.ts` flat files | No backend, no CMS — just truth in code |
| Icons | Lucide React | Lightweight, consistent |
| Canvas | Requestanimationframe particle system | Scoped to home section, stopped off-screen |

### Performance Choices

- **Canvas particle loop pauses** when the Home section is off-screen via IntersectionObserver
- **Heading animation** uses CSS `lineIn` + `setInterval` — no `repeat: Infinity` Framer Motion loops
- **Project images** use `loading="lazy"` + `decoding="async"`
- **Horizontal scroll** converts vertical `wheel` events natively, with passive scroll listeners
- **Persona-aware section ordering** via `useMemo` — zero re-computation unless persona changes
- **`useParallaxSlider`** tilt state written to refs, not React state — no per-frame re-renders

### Project Structure

```
src/
├── artifact-component.tsx   # Main application shell + horizontal scroll orchestrator
├── components/
│   ├── ProjectsSection.tsx  # 3D parallax card slider
│   ├── AwardsSection.tsx    # Recognition timeline
│   ├── BlogSection.tsx      # Medium RSS integration
│   ├── DataStorySection.tsx # Impact metrics
│   ├── Navigation.tsx       # Section-aware horizontal nav
│   └── ...                  # 25 components total
├── data/
│   ├── projects.ts          # All 9 projects with metrics
│   ├── awards.ts            # Recognition timeline
│   └── linkedin-recommendations.ts
├── hooks/
│   ├── useParallaxSlider.ts # 3D tilt + slide logic
│   └── useTypewriter.ts     # Sequential setInterval typewriter
├── PersonaContext.tsx        # Recruiter / Client / Collaborator / General routing
└── index.css                # Design tokens + all animation keyframes
```

---

## Running Locally

```bash
# Install dependencies
yarn install

# Start development server (hot reload)
yarn dev

# Type-check without building
yarn tsc --noEmit

# Production build
yarn build
```

The dev server starts at `http://localhost:5173` (or the next available port).

---

## Design Philosophy

> **"The best design is invisible. The best code is honest."**

Every visual decision — the teal `#17cfbe` primary, the dark `#061312` background, the `Playfair Display` serif for headings, the `Outfit` sans-serif for body — maps to an intentional feeling: **precision without coldness, depth without noise**.

The horizontal scroll isn't a gimmick. It forces the visitor to *choose* to go deeper, one section at a time. Like a conversation, not a broadcast.

---

## Author

**Mohammad Abir Abbas** — Efficiency Architect · 2026

- 🌍 [ahossainpharmacy.com](https://ahossainpharmacy.com)
- 💼 [LinkedIn](https://linkedin.com/in/mdabir1203)
- 🐙 [GitHub — mdabir1203](https://github.com/mdabir1203)
- ✍️ [Medium](https://medium.com/@md.abir1203)

---

*Built in late-night sessions. Shipped with intention.*
