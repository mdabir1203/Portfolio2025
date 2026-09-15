// Photo library for the polaroid personality strip.
// Story reframed through Kotler + Ogilvy + Marie Forleo:
//
// KOTLER     — positioning, customer value, STP. The strip answers the
//              one question a technical recruiter actually asks: "who
//              shows up on day one?" Every photo earns its place by
//              proving a customer-visible behaviour, not a personality
//              label.
// OGILVY     — "On the average, five times as many people read the
//              headline as read the body copy." So: place the headline
//              in the section title, specific number, place, year in
//              the caption, and one factual sentence in the note.
//              Show, don't claim.
// FORLEO     — "Clarity over cleverness." The captions are first-
//              person, plain-spoken, and end in something the reader
//              can picture. The voice is mine, not a brand voice.
//
// 19 photos, varied per dimension. Each photo is tagged with the ENFP
// letter it best embodies (E · N · F · P).

export type EnfpDimension = 'E' | 'N' | 'F' | 'P';

export type PersonalityPhoto = {
  id: string;
  src: string;
  alt: string;
  /** A small, hand-written line shown beneath the photo — Ogilvy's headline. */
  caption: string;
  /** Where it was taken, in your voice. */
  place: string;
  /** A short sentence of context — Ogilvy's body copy, one specific fact. */
  note?: string;
  /** Editorial framing hint. */
  span?: 'tall' | 'wide' | 'square' | 'small';
  /** Who is in the photo. Used by the Polaroid to add a small "with [Name]" tag. */
  with?: string;
  /** Which ENFP dimension this photo best embodies. */
  dimension: EnfpDimension;
};

/** The four letters — each carries a Forleo-action statement that doubles
 *  as a recruiter-readable value line. The "punchline" is what makes the
 *  dimension a brand promise, not a label. */
export const ENFP_DIMENSIONS: Record<
  EnfpDimension,
  { letter: string; word: string; color: string; punchline: string; oneLiner: string }
> = {
  E: { letter: 'E', word: 'Extroverted', color: '#c95f3b', punchline: 'I find the largest room.', oneLiner: 'group energy' },
  N: { letter: 'N', word: 'Intuitive', color: '#5d6cc4', punchline: 'I read the room first.', oneLiner: 'travel + ideas' },
  F: { letter: 'F', word: 'Feeling', color: '#0f7569', punchline: 'I never speak first.', oneLiner: 'empathy + care' },
  P: { letter: 'P', word: 'Perceiving', color: '#c89241', punchline: 'Where the work happens.', oneLiner: 'spontaneity' },
};

export const PERSONALITY_PHOTOS: PersonalityPhoto[] = [
  // ── E · EXTROVERTED — I find the largest room ─────────────────────
  {
    id: 'e-audi-sport-50',
    src: '/images/personality/e-audi-sport-50.jpg',
    alt: 'Abir in the middle of a 50-person peer group outside Audi Sport',
    caption: 'the largest room in the building',
    place: 'Audi Sport HQ, 2023',
    note: '50-person peer event. I find rooms like this and walk in. Always have.',
    span: 'wide',
    dimension: 'E',
  },
  {
    id: 'e-aiesec-vp-hannover',
    src: '/images/personality/e-hannover-peer-2021.jpg',
    alt: 'Group photo at an AIESEC Hannover event, Abir posing as Vice President',
    caption: 'Posing as Vice President, AIESEC in Hannover',
    place: 'AIESEC Hannover, 2021',
    note: 'VP of AIESEC Hannover — led the team that placed interns with companies and ran the inter-cultural exchange. Different lens on the same autumn cohort.',
    span: 'wide',
    dimension: 'E',
  },
  {
    id: 'e-bowling-hannover',
    src: '/images/personality/e-bowling-hannover.jpg',
    alt: 'Bowling alley, Hannover, 16 peers, Abir in red skull-print shirt',
    caption: 'the loudest table on Friday',
    place: 'Hannover Sky, May 2022',
    note: '16 peers, the orange bowling ball was mine. The table always wins.',
    span: 'wide',
    dimension: 'E',
  },
  {
    id: 'e-with-sabbir',
    src: '/images/sabbir-shubho.webp',
    alt: 'Sabbir Shubho',
    caption: 'with Shubho',
    place: 'Chittagong, 2018',
    note: 'CUET batch. We still ship together when we can.',
    span: 'square',
    with: 'Sabbir',
    dimension: 'E',
  },

  // ── N · INTUITIVE — I read the room first ─────────────────────────
  {
    id: 'n-presents-42',
    src: '/images/personality/n-presents-42.jpg',
    alt: 'Abir presenting at 42 Wolfsburg, holding the mic',
    caption: 'on stage, mic in hand',
    place: '42 Wolfsburg, 2023',
    note: 'I read everyone else\'s code before I write my own. Always have.',
    span: 'tall',
    dimension: 'N',
  },
  {
    id: 'n-with-martje',
    src: '/images/martje-lott.webp',
    alt: 'Martje Lott',
    caption: 'with Martje',
    place: 'Frankfurt, 2024',
    note: 'HNM IT. Showed me what German reliability looks like in production.',
    span: 'square',
    with: 'Martje',
    dimension: 'N',
  },
  {
    id: 'n-dubai-skyline',
    src: '/images/personality/dubai-skyline.webp',
    alt: 'Dubai skyline at dusk',
    caption: 'I think in this city',
    place: 'Sheikh Zayed Road',
    note: 'The seven-million-city. The view I walk past to clear my head.',
    span: 'tall',
    dimension: 'N',
  },
  {
    id: 'n-dubai-marina',
    src: '/images/personality/dubai-marina.webp',
    alt: 'Dubai Marina at golden hour',
    caption: 'where decisions settle',
    place: 'Marina Promenade',
    note: 'Golden hour, post-deploy. Where the AED 111K and the 11.1:1 V:C got decided.',
    span: 'wide',
    dimension: 'N',
  },

  // ── F · FEELING — I never speak first ─────────────────────────────
  {
    id: 'f-interview',
    src: '/images/personality/f-interview.jpg',
    alt: 'Abir being interviewed at a conference, mask, blue tie',
    caption: 'I never speak first',
    place: 'Conference room, May 2022',
    note: 'In any room I just walked into. Post-pandemic, mask on, mic in their hand.',
    span: 'tall',
    dimension: 'F',
  },
  {
    id: 'f-with-junyub',
    src: '/images/junyub-kim.webp',
    alt: 'Junyub Kim',
    caption: 'with Junyub',
    place: 'Wolfsburg, 2023',
    note: '42 peer. Taught me Korean elevator etiquette. We still trade repos.',
    span: 'square',
    with: 'Junyub',
    dimension: 'F',
  },
  {
    id: 'f-github',
    src: '/images/personality/github-avatar.webp',
    alt: 'Abir — the GitHub profile shot',
    caption: 'the actual GitHub avatar',
    place: 'Home desk, JLT',
    note: 'Duffle coat, two coffees in. README-tested since 2024.',
    span: 'tall',
    dimension: 'F',
  },
  {
    id: 'f-passport',
    src: '/images/PassportPic_Abir.jpg',
    alt: 'Abir in a borrowed studio in Satwa',
    caption: 'Q3 2026, available now',
    place: 'Satwa, Dubai',
    note: 'Suit on loan. UAE Company Visa, no sponsorship needed.',
    span: 'square',
    dimension: 'F',
  },

  // ── P · PERCEIVING — where the work happens ───────────────────────
  {
    id: 'p-garden-jump',
    src: '/images/personality/p-garden-jump.jpg',
    alt: 'Group photo, six people doing a fun jump pose in a garden',
    caption: 'off-script is where the work happens',
    place: 'Workshop garden, May 2022',
    note: 'Six peers, one garden, no choreography. Hannover, 2022.',
    span: 'wide',
    dimension: 'P',
  },
  {
    id: 'p-train-laughs',
    src: '/images/personality/p-train-laughs.jpg',
    alt: 'Abir and three friends laughing at a German train station',
    caption: 'between cities, candid',
    place: 'Hannover Hbf, 2022',
    note: 'They didn\'t notice the shot. The best ones never do.',
    span: 'tall',
    dimension: 'P',
  },
  {
    id: 'p-harmonica-suit',
    src: '/images/personality/harmonica-suit.jpg',
    alt: 'Harmonica, played in a suit',
    caption: 'while riding a bike',
    place: 'Between meetings',
    note: 'GitHub fun fact, verified. The harmonica lives by the front door.',
    span: 'small',
    dimension: 'P',
  },
  {
    id: 'p-harmonica-vintage',
    src: '/images/personality/harmonica-vintage.jpg',
    alt: 'Vintage harmonica on a button accordion',
    caption: 'flew home in my carry-on',
    place: 'Wolfsburg flea market',
    note: 'Vintage. The accordion next to it was the original plan.',
    span: 'small',
    dimension: 'P',
  },

  // ── BONUS ALTS — three newer angles dropped into the strip so it
  //                  never reads as the same eight frames twice.
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'p-train-laughs-alt',
    src: '/images/personality/p-train-laughs-alt.jpg',
    alt: 'Abir laughing between two peers on a German train platform, glasses on',
    caption: 'the platform is the room',
    place: 'Hannover Hbf · 2022',
    note: 'Platform C, train to Berlin cancelled, the four of us stayed an extra hour. The conversation was the destination.',
    span: 'tall',
    dimension: 'P',
  },
  {
    id: 'n-hackathon-stage',
    src: '/images/personality/n-hackathon-stage.jpg',
    alt: 'Abir on stage at a hackathon, presenting into a mic, slide reads Polina psimoner',
    caption: 'demo, in front of everyone',
    place: 'Hackathon stage · 2023',
    note: 'Polina was the host. I pitched my AutoGPT agent to the room. The room said yes.',
    span: 'wide',
    dimension: 'N',
  },
  {
    id: 'e-audi-sport-50-alt',
    src: '/images/personality/e-audi-sport-50-alt.jpg',
    alt: 'Group photo outside Audi Sport HQ, Abir in front row in red shirt',
    caption: 'fifty strangers, one stage',
    place: 'Audi Sport HQ · 2023',
    note: 'Different angle, same room. The red shirt is a habit, not a costume.',
    span: 'wide',
    dimension: 'E',
  },
];

/** A short, recruiter-readable behaviour line paired to each letter.
 *  Used by MoodDial and the PersonalityHero punchline grid. */
export const ENFP_BEHAVIORS: Record<EnfpDimension, string[]> = {
  E: [
    'Walks into the largest room',
    'Holds the table at 1am',
    'Names everyone in the room',
  ],
  N: [
    'Reads the room before speaking',
    'Thinks in cities, not cubicles',
    'Sees the demo before it ships',
  ],
  F: [
    'Never speaks first in a new room',
    'Asks the question behind the question',
    'Stays after the meeting closes',
  ],
  P: [
    'Off-script is where the work happens',
    'Carries a harmonica for a reason',
    'Plans the trip after the ticket',
  ],
};
