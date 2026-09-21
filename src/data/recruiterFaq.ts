/**
 * Recruiter FAQ items — split out of FAQSection.tsx so the data
 * ships in the main bundle (small, fast) while the FAQSection
 * component itself stays code-split behind React.lazy. Both files
 * import from here; neither needs to import the other.
 */
export interface FAQItem {
  q: string;
  a: string;
  /** Optional call-to-action — where the "receipt" lives. */
  receipt?: { label: string; href: string };
}

export const RECRUITER_FAQ: FAQItem[] = [
  {
    q: "Who is Mohammad Abir Abbas, in one paragraph?",
    a: "Mohammad Abir Abbas is a Creative Technologist, AI Strategist & Emerging Technology Architect based in Dubai, UAE. He works at the intersection of AI, product, systems architecture, business strategy and physical operations — helping founders, SMEs and enterprises across the GCC turn emerging technologies into business advantage, from identifying high-value opportunities to designing, building and measuring the systems that make them real. Operating principle: Sense → Understand → Predict → Decide → Act → Measure → Learn. The AbaYa-Track Delivery Module recovered AED 111,246 of trapped manufacturing backlog in 30 days at an 11.1:1 value-to-cost ratio. MIT Hacknation 2026 Next Best, Redis Side Quest Winner 2024.",
    receipt: { label: "Case study", href: "#case-study" },
  },
  {
    q: "Where is Abir based, and where will he actually show up?",
    a: "Dubai, UAE — already on the ground. UAE Company Visa held, no sponsorship needed. Available Q3 2026 for Creative Technologist, AI Strategist, Emerging Technology Architect, Solutions Engineer, Platform Engineer, and Developer Experience roles across Dubai, Abu Dhabi, Riyadh, NEOM, and worldwide remote. He'll be in your office on day one, not day thirty.",
    receipt: { label: "Visa status", href: "https://abir.getwaved.ai/abir.vcf" },
  },
  {
    q: "What did he ship most recently, and what did it produce?",
    a: "AbaYa-Track's Delivery Module, 2026. A value-weighted production dashboard for a Dubai abaya factory that surfaced AED 111,246 of trapped backlog in 30 days at an 11.1:1 value-to-cost ratio. Same factory, same headcount: production output +38%, on-time delivery 65% → 92%, zero additional hires. The full boardroom case study is published on this site.",
    receipt: { label: "Read the case", href: "#case-study" },
  },
  {
    q: "Does he actually write code, or does he just talk about it?",
    a: "He writes code. Production code. 4,000+ commits across AbaYa-Track, SmartSwap (MIT Hacknation 2026), RedAGPT (Redis Side Quest Winner 2024), Wavelink, and the Engaze.ai integration for 50+ sellers. Open-source work is public on github.com/mdabir1203. He'll send a code sample before the first interview if you ask.",
    receipt: { label: "GitHub", href: "https://github.com/mdabir1203" },
  },
  {
    q: "What's his salary band, honestly?",
    a: "AED 18,000 – 25,000 per month in the GCC for a mid-level Creative Technologist, AI Strategist, Solutions Engineer, or Platform Engineer role. Negotiable up for the right scope — Dubai-based, on-shore, no visa cost, no onboarding tax. For comparison, that's 30–40% under the Dubai mid-level market band for someone with shipped AI-to-production experience.",
    receipt: { label: "Open roles", href: "#contact" },
  },
  {
    q: "What does the rest of his team say about him?",
    a: "Three real LinkedIn recommendations, on this page. Junyub Kim (General Motors Strategic Planner, 42 Wolfsburg peer): \"pioneering and passionate … technical talent, paired with a reliable, results-oriented mindset.\" Sabbir Shubho (Embedded Software Developer): \"once he made up his mind on something, he put a great effort no matter how hard that task is.\" Martje Lott (Universität Hamburg, AIESEC supervisor).",
    receipt: { label: "Reviews", href: "#reviews" },
  },
  {
    q: "What languages does he ship in, and what languages does he talk in?",
    a: "Code: TypeScript, Python, Rust, C, C++. Spoken: English (IELTS 7.5), Bengali (native), Arabic (working proficiency — GCC-market ready), German (Goethe A2). Comfortable shipping inside multilingual product teams and running cross-cultural GTM delivery across 13 countries. If your team writes tickets in three languages, he reads all three.",
    receipt: { label: "Languages", href: "#path" },
  },
  {
    q: "Has he won anything an industry jury agreed on?",
    a: "Yes. MIT Hacknation 2026 — Next Best Project for SmartSwap (client-side intent engine, MIT Sloan AI Club, 1,000+ developers, 65+ countries). Redis Side Quest 2024 — Winner for RedAGPT (open-source AutoGPT + Langchain for AI-driven network vulnerability scanning). Langchain + Autonomous GPT Agents Hackathon — certified. Jira Fundamentals Badge.",
    receipt: { label: "Press kit", href: "/cards/abir-referral-card.pdf" },
  },
  {
    q: "How fast does he actually reply, and how do you reach him?",
    a: "Within 24 hours, usually faster. The fastest path is the 15-minute intro chat at abir.getwaved.ai/connect — pick a slot, he confirms in an hour. Email: abir.abbas@proton.me. WhatsApp: +971 54 361 8066. LinkedIn: linkedin.com/in/abir-abbas. He'll send a tailored one-pager after the intro — mapped to your brief, not a template.",
    receipt: { label: "Connect", href: "/connect?code=intro&ref=faq" },
  },
];
