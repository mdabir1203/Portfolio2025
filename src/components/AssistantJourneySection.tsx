import { FC, memo } from 'react';

const AssistantJourneySection: FC = () => (
  <section className="mb-16 animate-fadeIn">
    <div className="text-center mb-12">
      <p className="text-xs uppercase tracking-[0.3em] text-[#4DB6AC]">Assistant Playground</p>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-[#a7ffeb] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
        Under Construction
      </h2>
      <p className="mt-4 max-w-3xl mx-auto text-[#d7f5ef]">
        We&apos;re rebuilding the interactive assistant journey to make it even more powerful. In the meantime, explore a
        behind-the-scenes look at how we craft AI assistants and the strategy guiding the next release.
      </p>
    </div>

    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-[#1f655d] bg-[#052c28]/70 shadow-[0_30px_60px_rgba(0,150,136,0.25)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00bfa5]/10 via-transparent to-[#FF7043]/10 pointer-events-none" />
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 h-full w-full rounded-3xl"
            src="https://www.youtube.com/embed/Q50NBn4a7N0"
            title="Building Better AI Assistants"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-[#9adcd1]">
        Want updates when the assistant experience launches? Check back soon—the next evolution of the BlackBox Assistant is on
        the way.
      </p>
    </div>
  </section>
);

export default memo(AssistantJourneySection);
