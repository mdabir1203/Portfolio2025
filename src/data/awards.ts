export interface Award {
  title: string;
  issuer: string;
  date?: string;
  description?: string;
  highlights?: string[];
  link?: string;
}

export const awards: Award[] = [
  {
    title: 'Wolfsburg Homie',
    issuer: '42 Wolfsburg',
    description: 'Awarded for embracing the 42 Wolfsburg community spirit—complete with legendary late-night coding sessions.',
    highlights: ['A playful nod for “sleeping too much” while still shipping code.']
  },
  {
    title: 'Redis Side Quest Hackathon Winner',
    issuer: 'Redis',
    description: 'Built RedAGPT, an agentic network security assistant, to win the Redis Side Quest hackathon challenge.',
    highlights: ['Showcased innovative use of agents to strengthen network security workflows.']
  },
  {
    title: 'Certificate of Achievement',
    issuer: 'Local Committee Hannover, AIESEC',
    date: 'Sep 2022',
    description: 'Recognized for leading the iGTA program with the highest number of completed actions.'
  },
  {
    title: 'Certificate of Appreciation',
    issuer: 'Local Committee Hannover, AIESEC',
    date: 'Sep 2022',
    description: 'Honored for activating leadership and empowering peers within the AIESEC network.'
  },
  {
    title: 'DigComp Digital Competence Certification',
    issuer: 'Joint Research Centre, European Commission (DigComp)',
    date: 'Sep 2022',
    description:
      'Validated proficiency across the European Union\'s five digital competence pillars, demonstrating critical, confident, and responsible engagement in digital spaces.',
    highlights: [
      'Combined recognition covering the Certificate of Proficiency in Digital Competence and the Digital Skills Assessment (DigComp).'
    ],
    link: 'https://joint-research-centre.ec.europa.eu/digcomp_en'
  },
  {
    title: 'Goethe-Institut A2 German Certification',
    issuer: 'Goethe-Institut',
    date: 'Aug 2019',
    highlights: [
      'Demonstrated command of everyday expressions and practical sentences in German.',
      'Capable of managing routine conversations and sharing essential personal information.',
      'Established a solid linguistic base for continued study and cultural collaboration.'
    ]
  }
];
