// PersonalitySection — orchestrator that composes the ENFP chapter.
//
// Three chapters, one shared paper-coloured background:
//   1. PersonalityHero  — massive 4-letter mark + behaviour cards
//   2. MoodDial         — interactive letter selector with crossfade content
//   3. PersonalityStrip — the chosen polaroid variant (B), recruiter-natural
//
// Why three chapters instead of one?
//   * AEO/GEO 2026: AI engines screenshot-quote distinct H1/H2/H3 blocks.
//     Three chapters means three quotable surfaces, each with a single idea.
//   * Recruiters skim in 8 seconds. Three short chapters beat one long block.

import { PersonalityHero } from './PersonalityHero';
import { MoodDial } from './MoodDial';
import { PersonalityStrip } from './PersonalityStrip';

export function PersonalitySection() {
  return (
    <div
      id="personality"
      className="cin-personality-zone relative w-full overflow-x-hidden"
      aria-label="ENFP Personality — Mohammad Abir Abbas"
    >
      <PersonalityHero />
      <MoodDial />
      <PersonalityStrip />
    </div>
  );
}
