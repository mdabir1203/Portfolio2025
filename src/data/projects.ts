export interface ProjectMetric {
  label: string;
  value: string;
  description: string;
}

export type ProjectCategory = 'hackathon' | 'self-project' | 'startup-venture';

export interface Project {
  title: string;
  description: string;
  stars: string;
  link: string;
  image: string;
  category: ProjectCategory;
  metrics?: ProjectMetric[];
}

export const projects: Project[] = [
  {
    title: 'ShadowMap',
    description: 'A Rust-powered open-source framework for subdomain enumeration, vulnerability detection, and attack surface mapping built with vibe coding.',
    stars: '⭐ Open Source',
    link: 'https://github.com/mdabir1203/ShadowMap',
    image: '/images/ShadowMaplogo.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Stripe-ready Pricing',
        value: '3 Plans',
        description: 'Starter, Growth, and Enterprise tiers render straight from the Rust landing page for immediate monetization.'
      },
      {
        label: 'Compliance Guardrails',
        value: 'SOC 2 + GDPR',
        description: 'Operational safeguards mirror SOC 2 Trust Services Criteria and GDPR requirements from the outset.'
      }
    ]
  },
  {
    title: 'Bangla Fact Checker',
    description: 'A Bengali-first fact-checking assistant that cross-checks text or images with the Perplexity API to deliver sourced, culturally aware answers in seconds.',
    stars: '🔎 AI Fact-Checking',
    link: 'https://github.com/mdabir1203/Bangla-Fact-Checker',
    image: '/images/factcheckerlogo.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Text & Image Checks',
        value: 'Dual Input',
        description: 'Validates both Bengali text and visuals so newsroom teams can consolidate workflows.'
      },
      {
        label: 'Cited Responses',
        value: 'Perplexity API',
        description: 'Every answer is backed by Perplexity sourcing to accelerate editorial review cycles.'
      }
    ]
  },
  {
    title: 'Prompt Panda Bangla',
    description: 'Showcasing prompt engineering in Bangla - making AI accessible to Bengali speakers with a lovable, friendly interface.',
    stars: '🐼 Vibe Coding',
    link: 'https://prompt-panda-bangla.lovable.app/',
    image: '/images/1.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Localized Onboarding',
        value: 'Bangla UX',
        description: 'Conversational flows and copy tuned for Bengali speakers reduce drop-off for first-time AI users.'
      },
      {
        label: 'Prompt Kits',
        value: 'Launch-ready',
        description: 'Curated prompt libraries make it easy for creators to ship campaigns without prompt engineering overhead.'
      }
    ]
  },
  {
    title: 'Deep Blue Digital 2.0',
    description: 'A Digital Marketplace for easy access to Creator tools',
    stars: '🚀 Learning Journey',
    link: 'https://www.thedeepbluedigital.com',
    image: '/images/deepbluelogo.webp',
    category: 'startup-venture',
    metrics: [
      {
        label: 'Creator Tools Hub',
        value: 'Marketplace',
        description: 'Aggregates editing, strategy, and automation assets so freelancers can productize faster.'
      },
      {
        label: 'Self-Serve Pathways',
        value: 'Learning Journey',
        description: 'Guided tracks convert curious creators into paying subscribers without manual onboarding.'
      }
    ]
  },
  {
    title: 'RedAGPT',
    description: 'A Redis side quest hackathon winner - a cutting-edge security testing toolkit using AutoGPT and Langchain for network vulnerability assessment in homes and offices.',
    stars: '🏆 Hackathon Winner',
    link: 'https://github.com/mdabir1203/RedAGPT',
    image: '/images/asd.webp',
    category: 'hackathon',
    metrics: [
      {
        label: 'Security Validation',
        value: 'Hackathon Win',
        description: 'Battle-tested at the Redis x AutoGPT hackathon, proving the concept with judges and users.'
      },
      {
        label: 'Network Coverage',
        value: 'Home & Office',
        description: 'Automates reconnaissance across consumer and SMB networks for proactive vulnerability sweeps.'
      }
    ]
  },
  {
    title: 'Wavelink',
    description: 'An NFC-enabled business card platform that transforms networking through instant tap-to-connect technology, eliminating manual contact entry and enabling real-time engagement tracking.',
    stars: '📱 Technical Advisor',
    link: 'https://wave-link-cards.vercel.app',
    image: '/images/wavelink.webp',
    category: 'startup-venture',
    metrics: [
      {
        label: 'Instant Connection',
        value: 'Zero-Friction',
        description: 'Tap-to-connect eliminates manual entry, reducing contact exchange friction by 90% and ensuring no missed networking opportunities.'
      },
      {
        label: 'Analytics Dashboard',
        value: 'Real-Time Insights',
        description: 'Track engagement, views, and connections with actionable data for networking optimization and relationship building.'
      }
    ]
  }
];
