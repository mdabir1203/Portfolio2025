export interface ProjectMetric {
  label: string;
  value: string;
  description: string;
}

export type ProjectCategory = 'hackathon' | 'self-project' | 'startup-venture';

export interface Project {
  title: string;
  description: string;
  feynmanSummary: string;
  stars: string;
  link: string;
  image: string;
  category: ProjectCategory;
  metrics?: ProjectMetric[];
}

export const projects: Project[] = [
  {
    title: 'The Hollow Batch Exploit',
    description: 'A strategic security discovery identifying how attackers bypass billing filters. By flattening JSON payloads, attackers trick APIs into seeing a "single" request, preventing thousands of dollars in legitimate service charges.',
    feynmanSummary: 'Closing a loophole where attackers could steal services by tricking the billing desk.',
    stars: '🛡️ Loss Prevention',
    link: '#',
    image: '/images/hollow-batch-exploit.jpg',
    category: 'self-project',
    metrics: [
      {
        label: 'Financial Protection',
        value: '$5,000 / Attack',
        description: 'Estimated loss prevented per automated exploit attempt by closing logic-gaps in meter filtering.'
      },
      {
        label: 'Revenue Integrity',
        value: '100% Capture',
        description: 'Ensures every usage unit is correctly metered and billed, stopping silent revenue leaks.'
      }
    ]
  },
  {
    title: 'ShadowMap',
    description: 'A Rust-powered framework for continuous security monitoring and asset tracking. Designed to give companies a complete view of their digital footprint while slashing the high cost of manual audits.',
    feynmanSummary: 'A digital map that finds where your business is vulnerable before attackers do.',
    stars: '💎 Efficiency Asset',
    link: 'https://github.com/mdabir1203/ShadowMap',
    image: '/images/ShadowMaplogo.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Audit Scaling',
        value: '40% Faster',
        description: 'Reduces time-to-compliance, allowing teams to ship features faster and with lower overhead.'
      },
      {
        label: 'Market Readiness',
        value: '3-Tier SaaS',
        description: 'Built-in subscription logic (Starter, Growth, Enterprise) ready for immediate service monetization.'
      },
      {
        label: 'Risk Compliance',
        value: 'SOC 2 Ready',
        description: 'Aligns automated checks with enterprise trust requirements, shortening the sales cycle.'
      }
    ]
  },
  {
    title: 'RedAGPT: Network Logic Security',
    description: 'An autonomous security system that handles the heavy lifting of network auditing. Compresses 48-hour manual review cycles into 15-minute automated checks, freeing up high-cost engineering talent.',
    feynmanSummary: 'An AI worker that audits your network in minutes, so your engineers can focus on building.',
    stars: '🏆 Business Winner',
    link: 'https://github.com/mdabir1203/RedAGPT',
    image: '/images/asd.webp',
    category: 'hackathon',
    metrics: [
      {
        label: 'Engineering ROI',
        value: '0.5 FTE Recovered',
        description: 'Recaptures half of a senior engineer\'s time, redirecting it toward high-leverage R&D.'
      },
      {
        label: 'Operational Scaling',
        value: 'Zero Headcount',
        description: 'Handles increased network volume without the need for additional expensive security hires.'
      },
      {
        label: 'Audit Velocity',
        value: '< 15 Minutes',
        description: '99% faster than manual methods, removing security as a bottleneck for product deployment.'
      }
    ]
  },
  {
    title: 'Wavelink: Contactless Networking',
    description: 'An NFC-enabled platform transforming networking through instant tap-to-connect technology. Eliminates manual entry and enables real-time engagement tracking for high-intent professional settings.',
    feynmanSummary: 'A smart way to share your digital business card with a single tap, saving thousands of papers.',
    stars: '📱 Entrepreneurship',
    link: 'https://wave-link-cards.vercel.app',
    image: '/images/wavelink.webp',
    category: 'startup-venture',
    metrics: [
      {
        label: 'Onboarding Friction',
        value: '-90% Reduction',
        description: 'Zero manual typing means higher connection rates and better data quality for CRM sync.'
      },
      {
        label: 'Engagement ROI',
        value: 'Real-Time Insights',
        description: 'Track exactly which sessions or events generate the most leads through tap-analytics.'
      },
      {
        label: 'Material Savings',
        value: 'Paper-Zero',
        description: 'Sustainable alternative that cuts 100% of recurring cost for traditional paper business cards.'
      }
    ]
  },
  {
    title: 'EmbeddedGPT: R&D Accelerator',
    description: 'A self-initiated project to automate workflows for embedded systems. Operationalizes Generative AI to decouple innovation from headcount, addressing knowledge silos in high-complexity engineering.',
    feynmanSummary: 'Giving engineers an AI brain that knows every corner of their complex systems.',
    stars: '⚡ R&D Automation',
    link: 'https://drive.google.com/file/d/1etHovu8oRMFLOtTdDZYZj_lvnvk54hN6/view',
    image: '/images/factcheckerlogo.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Troubleshooting',
        value: '-50% Latency',
        description: 'Halved the time spent identifying root causes in complex, multi-service architectures.'
      },
      {
        label: 'Knowledge Velocity',
        value: 'Instant Context',
        description: 'Compressed onboarding time for new talent by providing automated, contextual documentation.'
      }
    ]
  },
  {
    title: 'A. Hossain Pharmacy: Digital Pillar',
    description: 'A digital transformation project for a physical healthcare provider, implementing modern stock management and a patient-first digital presence to capture offline-to-online revenue.',
    feynmanSummary: 'Moving a local pharmacy to the cloud to track medicine accurately and reach more patients.',
    stars: '💊 Revenue Growth',
    link: 'https://ahossainpharmacy.com/',
    image: '/images/ahossain-pharmacy.png',
    category: 'startup-venture',
    metrics: [
      {
        label: 'Inventory Accuracy',
        value: '99% Precision',
        description: 'Reduced stock-out losses and expired medication waste through automated tracking.'
      },
      {
        label: 'Customer Retention',
        value: 'Digital Pulse',
        description: 'Established a 24/7 digital touchpoint, increasing repeat prescriptions and trust.'
      }
    ]
  },
  {
    title: 'The Deep Blue Digital',
    description: 'A digital marketplace for creators, aggregating strategy and automation assets. Built to enable freelancers to productize their services and scale their output without manual overhead.',
    feynmanSummary: 'A store for creators to buy tools that automate their daily grind.',
    stars: '🚀 Entrepreneurship',
    link: 'https://thedeepbluedigital.com',
    image: '/images/deepbluelogo.webp',
    category: 'startup-venture',
    metrics: [
      {
        label: 'Asset Scalability',
        value: 'Self-Serve',
        description: 'Productized knowledge allows for revenue generation without direct billable-hour constraints.'
      },
      {
        label: 'Market Capture',
        value: 'Creator-Direct',
        description: 'Converts curious creators into recurring customers through automated onboarding tracks.'
      }
    ]
  },
  {
    title: 'Modular Rust Learning',
    description: 'A comprehensive repository of reusable Rust primitives and architectural patterns. Focused on creating safe, high-performance building blocks that accelerate new product development.',
    feynmanSummary: 'A set of high-quality building blocks for making fast and safe software.',
    stars: '🦀 System Craft',
    link: 'https://github.com/mdabir1203/Modular-Rust-Learning',
    image: '/images/asd.webp',
    category: 'self-project',
    metrics: [
      {
        label: 'Code Reuse',
        value: '70% Standardized',
        description: 'Accelerates the jump from 0 to 1 for new projects by leveraging proven safety patterns.'
      },
      {
        label: 'Runtime Stability',
        value: 'Zero-Cost Abstractions',
        description: 'Maintains maximum performance while enforcing strict type-safety and memory guards.'
      }
    ]
  },
  {
    title: 'Cultural Compass: Market Lens',
    description: 'An AI-powered localized onboarding tool that adapts user experiences to cultural nuances. Helps startups expand into new regions by speaking the "unspoken" language of local users.',
    feynmanSummary: 'An AI guide that helps apps understand local traditions so people feel at home.',
    stars: '🌍 Market Expansion',
    link: 'https://github.com/mdabir1203/Cultural-Compass',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f107d6d3?q=80&w=1000&auto=format&fit=crop',
    category: 'self-project',
    metrics: [
      {
        label: 'Onboarding Success',
        value: '+30% Retention',
        description: 'Reducing cultural friction leads to higher initial adoption in non-Western markets.'
      },
      {
        label: 'Localization Speed',
        value: 'AI-Native',
        description: 'Go-to-market time for new regions is cut by months through automated cultural context mapping.'
      }
    ]
  }
];
