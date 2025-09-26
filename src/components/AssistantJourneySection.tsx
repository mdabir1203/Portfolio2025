import { FC, memo } from 'react';
import { assistantActs } from '../data/assistant-journey';

const AssistantJourneySection: FC = () => (
  <section className="mb-16 animate-fadeIn">
    <div className="text-center mb-12">
      <p className="text-xs uppercase tracking-[0.3em] text-[#4DB6AC]">BlackBox Assistant Journey</p>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-[#a7ffeb] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
        Interactive Demo Narrative
      </h2>
      <p className="mt-4 max-w-3xl mx-auto text-[#d7f5ef]">
        Walk through the exact conversational arc visitors experience with the BlackBox Assistant. Each act shows the prompt,
        the assistant’s response, and the business angle that ties technology to outcomes.
      </p>
    </div>

    <div className="grid gap-8">
      {assistantActs.map((act, index) => (
        <article
          key={act.id}
          className="group relative overflow-hidden rounded-2xl border border-[#1f655d] bg-[#052c28]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,150,136,0.25)]"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#00bfa5]/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#FF7043]/20 blur-3xl" />
          </div>

          <header className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#80f0df]">{`Act ${index + 1}`}</p>
              <h3 className="text-2xl font-semibold text-[#c8fff4]">{act.title}</h3>
            </div>
            <span className="rounded-full border border-[#1f655d] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF8A65]">
              {act.id.replace('-', ' ')}
            </span>
          </header>

          <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-[#1f655d]/60 bg-[#033832]/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#80f0df] mb-2">Visitor Prompt</p>
              <p className="text-sm text-[#e3fbf6] leading-relaxed">{act.visitorPrompt}</p>
            </div>
            <div className="rounded-xl border border-[#1f655d]/60 bg-[#02423b]/80 p-4 lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#FF8A65] mb-2">Assistant Response</p>
              <p className="whitespace-pre-line text-sm text-[#f4fffb] leading-relaxed">{act.botResponse}</p>
            </div>
          </div>

          <footer className="relative z-10 mt-4 rounded-xl border border-dashed border-[#FF8A65]/60 bg-[#052c28]/70 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#FF8A65]">Business Angle</p>
            <p className="mt-2 text-sm text-[#ffd9cd]">{act.businessAngle}</p>
            {act.ctaHref && act.ctaLabel && (
              <a
                href={act.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#031b18] shadow-[0_14px_28px_rgba(0,150,136,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {act.ctaLabel}
              </a>
            )}
          </footer>
        </article>
      ))}
    </div>
  </section>
);

export default memo(AssistantJourneySection);
