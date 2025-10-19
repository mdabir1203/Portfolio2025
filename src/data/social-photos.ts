export interface SocialPhoto {
  id: string;
  platform: 'facebook' | 'instagram';
  imageUrl: string;
  caption: string;
  timestamp: string;
  link: string;
}

export interface SocialPlatformPhotos {
  platform: 'facebook' | 'instagram';
  displayName: string;
  handle: string;
  photos: SocialPhoto[];
}

export interface PersonalityHighlight {
  id: string;
  label: string;
  caption: string;
  mood: string;
  gradient: string;
}

export const socialPhotos: SocialPlatformPhotos[] = [
  {
    platform: 'facebook',
    displayName: 'Facebook',
    handle: '@abirabbasmd',
    photos: [
      {
        id: 'fb-01',
        platform: 'facebook',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        caption: 'Behind the scenes from a weekend hackathon with the crew. #buildinpublic',
        timestamp: '2024-11-08T10:15:00.000Z',
        link: 'https://www.facebook.com/'
      },
      {
        id: 'fb-02',
        platform: 'facebook',
        imageUrl: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80',
        caption: 'Sharing the highlights from my latest mentoring session for early-stage founders.',
        timestamp: '2024-10-22T08:45:00.000Z',
        link: 'https://www.facebook.com/'
      },
      {
        id: 'fb-03',
        platform: 'facebook',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
        caption: 'Prototype sneak peek from a rapid iteration sprint.',
        timestamp: '2024-09-28T18:30:00.000Z',
        link: 'https://www.facebook.com/'
      }
    ]
  },
  {
    platform: 'instagram',
    displayName: 'Instagram',
    handle: '@uknowwho_ab1r',
    photos: [
      {
        id: 'ig-01',
        platform: 'instagram',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
        caption: 'Coffee-fueled design sprints with the team ☕️',
        timestamp: '2024-12-02T14:05:00.000Z',
        link: 'https://www.instagram.com/uknowwho_ab1r/'
      },
      {
        id: 'ig-02',
        platform: 'instagram',
        imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
        caption: 'From sketch to shipping — capturing the product journey.',
        timestamp: '2024-11-19T09:55:00.000Z',
        link: 'https://www.instagram.com/uknowwho_ab1r/'
      },
      {
        id: 'ig-03',
        platform: 'instagram',
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
        caption: 'Late-night UI polish before launch. ✨',
        timestamp: '2024-10-05T21:20:00.000Z',
        link: 'https://www.instagram.com/uknowwho_ab1r/'
      }
    ]
  }
];

export const personalityHighlights: PersonalityHighlight[] = [
  {
    id: 'personality-visionary',
    label: 'Visionary Strategist',
    caption: 'Mapping product ecosystems and aligning them with heartfelt human stories.',
    mood: 'Long-range thinker',
    gradient: 'from-[#1d3b3b] via-[#0f6f62] to-[#033931]'
  },
  {
    id: 'personality-builder',
    label: 'Hands-on Builder',
    caption: 'Getting into the weeds with prototypes until the experience finally sparks.',
    mood: 'Rapid prototyping energy',
    gradient: 'from-[#1b2d47] via-[#0f4f69] to-[#02263e]'
  },
  {
    id: 'personality-mentor',
    label: 'Community Mentor',
    caption: 'Holding space for founders to ask honest questions and find their own spark.',
    mood: 'Collaborative and calm',
    gradient: 'from-[#2a223f] via-[#51388f] to-[#1d1744]'
  },
  {
    id: 'personality-storyteller',
    label: 'Story-first Creator',
    caption: 'Translating complex builds into narratives that feel personal and actionable.',
    mood: 'Narrative-driven',
    gradient: 'from-[#322230] via-[#7d335d] to-[#2a1025]'
  },
  {
    id: 'personality-explorer',
    label: 'Curious Explorer',
    caption: 'Always chasing the next perspective shift—new cities, new teams, new insights.',
    mood: 'Adventurous',
    gradient: 'from-[#20343c] via-[#1c6b7a] to-[#072f42]'
  },
  {
    id: 'personality-host',
    label: 'Gathering Host',
    caption: 'Designing intimate sessions where builders feel seen, heard, and energized.',
    mood: 'People-centric',
    gradient: 'from-[#2f2b2a] via-[#aa5b31] to-[#3f2211]'
  }
];
