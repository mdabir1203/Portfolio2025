export interface AssistantAct {
  id: string;
  title: string;
  visitorPrompt: string;
  botResponse: string;
  businessAngle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const assistantActs: AssistantAct[] = [
  {
    id: 'hook',
    title: 'Act 1 · The Hook',
    visitorPrompt: 'Who else has checked out this portfolio?',
    botResponse:
      "✨ You’re joining a growing community. Over 3,200 people have visited this portfolio so far, and 40% came back for a second look. The most binge-watched feature? BlackBox Chronicles — where we reverse-engineered vulnerabilities and rebuilt them in Rust.",
    businessAngle: 'High engagement = proof this work resonates with real security leaders and tech communities.'
  },
  {
    id: 'watch-party',
    title: 'Act 2 · The Watch Party',
    visitorPrompt: 'What’s your most popular video?',
    botResponse:
      '📺 Our YouTube demo of the Rust rebuild has 12,000+ views and an average watch time of 4:30 minutes — above industry average. Viewers especially loved seeing the exploit fail live. Want to watch a 30-second cut here?',
    businessAngle: 'Strong watch times = validation that our security-first storytelling grabs attention and sustains interest.',
    ctaLabel: 'Watch 30s Cut',
    ctaHref: 'https://youtu.be/dQw4w9WgXcQ'
  },
  {
    id: 'connections',
    title: 'Act 3 · The Connections',
    visitorPrompt: 'How do your ideas connect? I see BlackBox, Agentverse, and Vibeverse…',
    botResponse:
      '🌐 Great question. Think of it as a system:\n\nBlackBox Chronicles proves technical mastery → reverse engineering + Rust security.\n\nAgentverse shows scalability → multi-agent collaboration for real-world tasks.\n\nVibeverse ensures adoption → human-centric, culture-aware AI.\n\nTogether, they’re not isolated projects — they’re layers of one vision: secure, scalable, and human AI systems.',
    businessAngle:
      'We don’t just build code. We architect ecosystems that solve technical, business, and human problems together.'
  },
  {
    id: 'proof',
    title: 'Act 4 · The Proof',
    visitorPrompt: 'What business outcomes does this translate to?',
    botResponse:
      '📊 Here’s the impact in numbers:\n\nRisk Reduction → Legacy exploit blocked = potential $500k in breach cost avoided.\n\nPerformance Gains → Rust rebuild cut memory usage by 40%, saving infra costs.\n\nEngagement Proof → Thousands of views + portfolio interactions = strong demand signal.\n\nAdoption Edge → Our vibe-coded agents improved user retention by 25% in tests.*',
    businessAngle:
      'Outcomes that investors, CTOs, and clients care about: cost ↓, risk ↓, engagement ↑.'
  },
  {
    id: 'finale',
    title: 'Act 5 · The Finale',
    visitorPrompt: 'What’s next for you?',
    botResponse:
      '🚀 We’re evolving this portfolio into a customer-ready agent framework. Imagine your company having a BlackBox Assistant trained on your own docs, diagrams, and workflows — delivering the same clarity and impact you just experienced. Want to explore a custom demo?',
    businessAngle:
      'We’re not showing off a portfolio. We’re previewing the customer experience we can build for you.',
    ctaLabel: 'Book a Custom Demo',
    ctaHref: 'https://calendly.com/abirabbasmd'
  }
];
