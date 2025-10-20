import { FC, memo, useMemo } from 'react';
import type {
  PersonalityHighlight,
  SocialPlatformPhotos,
  SocialPhoto
} from '../data/social-photos';
import { personalityHighlights } from '../data/social-photos';

interface SocialPhotosSectionProps {
  platforms: SocialPlatformPhotos[];
}

const formatDate = (timestamp: string) => {
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  } catch (error) {
    console.error('Error formatting timestamp', error);
    return '';
  }
};

const platformColor: Record<SocialPhoto['platform'], string> = {
  facebook: 'from-[#1877f2]/70 to-[#0e4aa3]/70',
  instagram: 'from-[#f77737]/70 via-[#e4405f]/70 to-[#8a3ab9]/70'
};

const personalityTagColor: Record<PersonalityHighlight['mood'], string> = {
  'Long-range thinker': 'text-[#c2fff2] bg-[#064a42]/70 border-[#0a6a5f]/60',
  'Rapid prototyping energy': 'text-[#c9ebff] bg-[#0c3651]/70 border-[#10567c]/50',
  'Collaborative and calm': 'text-[#e2d8ff] bg-[#2d1f55]/70 border-[#4c3a80]/50',
  'Narrative-driven': 'text-[#ffd7e8] bg-[#4a1634]/70 border-[#7a2d59]/50',
  Adventurous: 'text-[#cff4ff] bg-[#0f4254]/70 border-[#1d6f89]/50',
  'People-centric': 'text-[#ffe6d8] bg-[#4f2815]/70 border-[#7c3e1f]/50'
};

const SocialPhotosSection: FC<SocialPhotosSectionProps> = ({ platforms }) => {
  const sortedPlatforms = useMemo(
    () =>
      platforms.map((platform) => ({
        ...platform,
        photos: [...platform.photos].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      })),
    [platforms]
  );

  return (
    <section className="mb-16 animate-fadeIn">
      <div className="mb-14 rounded-3xl border border-[#2f6f68]/60 bg-[#032523]/70 p-8 shadow-[0_18px_45px_rgba(0,150,136,0.18)]">
        <div className="flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#7fcfc2]">Personality Boards</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#c8fff4]">
              Expressing the many ways we show up offline
            </h2>
          </div>
          <p className="text-sm text-[#d0f4ed] md:max-w-md">
            These placeholders act like storyboard frames. Each tile marks a facet of our vibe, ready to be
            swapped with live photography whenever we capture it.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {personalityHighlights.map((highlight) => (
            <figure
              key={highlight.id}
              className="flex flex-col rounded-[28px] border border-[#184d46]/50 bg-[#021917]/80 p-5 shadow-[0_16px_40px_rgba(0,150,136,0.14)] backdrop-blur"
            >
              <div
                className={`relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[#1e5f56]/50 bg-gradient-to-br ${highlight.gradient} text-center`}
              >
                <span className="text-lg font-semibold text-[#e6fff9] drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                  {highlight.label}
                </span>
                <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-full border border-dashed border-[#a8f5e9]/30 bg-[#04322d]/70 py-2 text-xs font-medium uppercase tracking-[0.45em] text-[#8ae9dd]">
                  Placeholder
                </div>
              </div>
              <figcaption className="mt-5 space-y-3">
                <p className="text-sm leading-relaxed text-[#d5f6ef]">{highlight.caption}</p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                    personalityTagColor[highlight.mood] ?? 'text-[#c8fff4] bg-[#043633]/70 border-[#0c5a52]/50'
                  }`}
                >
                  {highlight.mood}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
          Social Highlights
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-[#d7f5ef]">
          A curated glimpse from Facebook and Instagram showing product launches, behind-the-scenes
          studio energy, and the community moments that keep our creative work grounded.
        </p>
      </div>

      <div className="grid gap-10">
        {sortedPlatforms.map((platform) => (
          <article
            key={platform.platform}
            className="rounded-3xl border border-[#2f6f68]/50 bg-[#052c28]/70 p-8 shadow-[0_24px_60px_rgba(0,150,136,0.22)]"
          >
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-[#a7ffeb] flex items-center gap-2">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${platformColor[platform.platform]} text-white shadow-[0_12px_26px_rgba(0,150,136,0.25)]`}
                    aria-hidden="true"
                  >
                    {platform.platform === 'facebook' ? 'f' : 'ig'}
                  </span>
                  {platform.displayName}
                </h3>
                <p className="text-[#9adcd1]">{platform.handle}</p>
              </div>
              <a
                href={platform.photos[0]?.link ?? '#'}
                className="inline-flex items-center gap-2 rounded-full border border-[#00bfa5]/50 bg-[#022b27]/80 px-4 py-2 text-sm font-semibold text-[#a7ffeb] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#035049]/70 hover:text-[#c8fff4]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit profile
                <span aria-hidden="true">↗</span>
              </a>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
              {platform.photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-[#1f655d]/50 bg-[#021c1a]/70 transition-transform duration-500 hover:-translate-y-2"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#021c1a]/95 via-[#021c1a]/40 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm text-[#e3fbf6]">{photo.caption}</p>
                    <span className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#7fcfc2]">
                      {formatDate(photo.timestamp)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="rounded-2xl border border-[#2f6f68]/50 bg-[#042623]/70 p-6">
          <h3 className="text-lg font-semibold text-[#a7ffeb]">Connecting to the real feeds</h3>
          <p className="mt-3 text-sm text-[#d7f5ef]">
            Facebook and Instagram both expose APIs for pulling media, but they require secure server-side
            tokens. You&apos;ll want to connect through the Meta Graph API (for Facebook Pages) and the
            Instagram Basic Display or Graph API for business accounts.
          </p>
        </div>
        <div className="rounded-2xl border border-[#2f6f68]/50 bg-[#052c28]/70 p-6">
          <h3 className="text-lg font-semibold text-[#a7ffeb]">Implementation checklist</h3>
          <ol className="mt-3 space-y-2 text-sm text-[#d7f5ef] list-decimal list-inside">
            <li>Create an app inside <span className="font-semibold text-[#a7ffeb]">Meta for Developers</span> and generate tokens.</li>
            <li>Store long-lived access tokens on the server (never ship them to the browser).</li>
            <li>Build an API route (Edge Function or serverless) that fetches media and forwards the curated JSON.</li>
            <li>Swap the static data in <code className="rounded bg-[#021c1a]/80 px-2 py-1 text-[#7fcfc2]">social-photos.ts</code> with live responses.</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default memo(SocialPhotosSection);
