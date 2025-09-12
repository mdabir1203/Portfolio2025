export interface ExperienceDetail {
  text: string;
  link?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  details: ExperienceDetail[];
}

export const experiences: Experience[] = [
  {
    role: 'Education Mentor',
    company: 'Quantum School Bangladesh · Freelance',
    period: 'May 2025 – Aug 2025',
    location: 'Remote',
    details: [
      { text: 'Showcased how to leverage Generative AI to prototype quantum circuits' },
      { text: 'Used Cursor-like IDE and Perplexity to build intuition for circuit design' },
      { text: 'Guided contributions to open-source projects on GitHub' },
      {
        text: 'Workshop video: 1st Quantum BootCamp – Part 01',
        link: 'https://www.youtube.com/watch?v=2ptmYpUoopw&t=4s'
      },
      {
        text: 'Workshop video: 2nd Quantum BootCamp – Part 02',
        link: 'https://www.youtube.com/watch?v=HMLGoo7D6yk'
      }
    ]
  },
  {
    role: 'Co-Founder',
    company: 'Deep Blue Digital · Part-time',
    period: 'Sep 2024 – Aug 2025',
    location: 'Chattogram, Bangladesh · Remote',
    details: [
      { text: 'Architected a high-performance WordPress website' },
      { text: 'Built a digital marketplace with Engaze.ai for fast payments' },
      { text: 'Implemented AI-driven growth marketing using Midjourney and Zapier' }
    ]
  },
  {
    role: 'Information Technology Support Engineer',
    company: 'HNM IT Solutions · Contract',
    period: 'Oct 2023 – Jan 2024',
    location: 'Frankfurt, Hesse, Germany · Remote',
    details: [
      { text: 'Updated routers to enhance security and compatibility' },
      { text: 'Diagnosed networks by running tests and verifying configurations' },
      { text: 'Methodically isolated and resolved technical issues' }
    ]
  },
  {
    role: 'Robotics Instructor',
    company: 'phaeno gGmbH · Contract',
    period: 'Jun 2022 – Aug 2022',
    location: 'Wolfsburg, Lower Saxony, Germany · On-site',
    details: [
      { text: 'Taught Scratch programming in robotics for children' }
    ]
  },
  {
    role: 'Data Miner',
    company: 'Fieldsports GmbH · Part-time',
    period: 'Jul 2020 – Oct 2020',
    location: 'Hannover, Lower Saxony, Germany',
    details: [
      { text: 'Mined 3,000 travel contacts and information using Python and Beautiful Soup to launch a travel website' }
    ]
  }
];
