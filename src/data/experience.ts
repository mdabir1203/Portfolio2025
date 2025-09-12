export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  details: string[];
}

export const experiences: Experience[] = [
  {
    role: 'Education Mentor',
    company: 'Quantum School Bangladesh · Freelance',
    period: 'May 2025 – Aug 2025',
    location: 'Remote',
    details: [
      'Showcased how to leverage Generative AI to prototype quantum circuits',
      'Used Cursor-like IDE and Perplexity to build intuition for circuit design',
      'Guided contributions to open-source projects on GitHub',
      'Workshop video: 1st Quantum BootCamp – Part 01'
    ]
  },
  {
    role: 'Co-Founder',
    company: 'Deep Blue Digital · Part-time',
    period: 'Sep 2024 – Aug 2025',
    location: 'Chattogram, Bangladesh · Remote',
    details: [
      'Architected a high-performance WordPress website',
      'Built a digital marketplace with Engaze.ai for fast payments',
      'Implemented AI-driven growth marketing using Midjourney and Zapier'
    ]
  },
  {
    role: 'Information Technology Support Engineer',
    company: 'HNM IT Solutions · Contract',
    period: 'Oct 2023 – Jan 2024',
    location: 'Frankfurt, Hesse, Germany · Remote',
    details: [
      'Updated routers to enhance security and compatibility',
      'Diagnosed networks by running tests and verifying configurations',
      'Methodically isolated and resolved technical issues'
    ]
  },
  {
    role: 'Robotics Instructor',
    company: 'phaeno gGmbH · Contract',
    period: 'Jun 2022 – Aug 2022',
    location: 'Wolfsburg, Lower Saxony, Germany · On-site',
    details: [
      'Taught Scratch programming in robotics for children'
    ]
  },
  {
    role: 'Data Miner',
    company: 'Fieldsports GmbH · Part-time',
    period: 'Jul 2020 – Oct 2020',
    location: 'Hannover, Lower Saxony, Germany',
    details: [
      'Mined 3,000 travel contacts and information using Python and Beautiful Soup to launch a travel website'
    ]
  }
];
