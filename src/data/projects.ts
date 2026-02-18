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
    title: 'The Hollow Batch Exploit',
    description: 'A strategic security discovery that identifies how attackers can bypass billing filters. By flattening JSON payloads, attackers trick APIs into seeing a "single" request, preventing thousands of dollars in legitimate service charges.',
    stars: '🛡️ Loss Prevention',
    link: '#',
    image: '/images/hollow-batch-exploit.jpg',
    category: 'self-project',
    metrics: [
      {
        label: 'Financial Protection',
        value: '$5,000 / Attack',
        description: 'Estimated loss prevented per automated exploit attempt by closing the logic-gap in meter filtering.'
      },
      {
        label: 'Security Advantage',
        value: 'Logic Gating',
        description: 'Moves beyond simple bugs to identify fundamental flaws in how services are sold and protected.'
      }
    ]
  },
  {
    title: 'ShadowMap',
    description: 'A Rust-powered framework for continuous security monitoring and asset tracking. Designed to give companies a complete view of their digital footprint without the high cost of manual audits.',
    stars: '💎 Efficiency Asset',
    link: 'https://github.com/mdabir1203/ShadowMap',
    image: '/images/ShadowMaplogo.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Audit Scaling',
        value: '40% Faster',
        description: 'Reduces the time needed for security reviews, allowing teams to ship features faster and safer.'
      },
      {
        label: 'Cost Efficiency',
        value: 'Hybrid Logic',
        description: 'Combines automated speed with smart human judgment to minimize expensive false positives.'
      },
      {
        label: 'Market Readiness',
        value: '3 Tiers',
        description: 'Built-in subscription logic (Starter, Growth, Enterprise) ready for immediate service monetization.'
      },
      {
        label: 'Risk Compliance',
        value: 'SOC 2 Ready',
        description: 'Ensures that every security check aligns with standard enterprise trust and safety requirements.'
      }
    ]
  },
  {
    title: 'EmbeddedGPT: R&D Velocity Accelerator',
    description: 'Operationalizing Generative AI (GPT-4) directly into the R&D workflow to decouple innovation output from linear headcount growth. Addressed "knowledge silos" and reduced cognitive overload for high-complexity engineering teams.',
    stars: '⚡ R&D Automation',
    link: '#',
    image: '/images/1.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Troubleshooting Latency',
        value: '-50% Reduction',
        description: 'Halved the time spent identifying and fixing root causes in complex systems.'
      },
      {
        label: 'Time-to-Productivity',
        value: 'Accelerated',
        description: 'Compressed TTP for new engineering talent by providing instant, contextual knowledge access.'
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
    title: 'RedAGPT: Intelligent Automation',
    description: 'An autonomous security system that handles the heavy lifting of network auditing. It compresses 48-hour manual review cycles into 15-minute automated checks, freeing up high-cost engineering talent for innovation.',
    stars: '🏆 Business Winner',
    link: 'https://github.com/mdabir1203/RedAGPT',
    image: '/images/asd.webp',
    category: 'hackathon',
    metrics: [
      {
        label: 'Audit Velocity',
        value: '< 15 Minutes',
        description: '99% faster than manual methods. Security is no longer a bottleneck for product deployment.'
      },
      {
        label: 'Operational Scaling',
        value: 'Zero Headcount',
        description: 'Handles increased network volume without requiring additional engineering hires.'
      },
      {
        label: 'Risk Gating',
        value: 'Standardized',
        description: 'Eliminates human fatigue from the audit process, ensuring 100% of standard checks are met.'
      },
      {
        label: 'Engineering ROI',
        value: '0.5 FTE Recovered',
        description: 'Recaptures half of a senior engineer\'s time, redirecting it toward strategic research and development.'
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
