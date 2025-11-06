import { FC, memo } from 'react';
import { trustPillars, trustPractices, trustSignals } from '../data/trust';

const TrustByDesignSection: FC = () => (
  <section className="mb-20 animate-fadeIn">
    <div className="text-center mb-12">
      <p className="text-sm uppercase tracking-[0.4em] text-[#7fcfc2]">Governance</p>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_20px_45px_rgba(0,150,136,0.25)]">
        Trust by Design
      </h2>
      <p className="mt-4 text-lg text-[#d7f5ef] max-w-3xl mx-auto">
        Trust is not a final polish—it is the architecture, the process, and the promise. This portfolio shows how I wire privacy,
        security, and responsible AI into every delivery track from day zero.
      </p>
    </div>

    <div className="grid gap-8 md:grid-cols-3 mb-14">
      {trustPillars.map((pillar) => (
        <article
          key={pillar.title}
          className="bg-[#043530]/80 border border-[#2f6f68]/60 rounded-2xl p-8 shadow-[0_28px_60px_rgba(0,150,136,0.2)] transition-transform duration-300 hover:-translate-y-1"
        >
          <h3 className="text-2xl font-semibold text-[#a7ffeb] mb-3 tracking-wide">{pillar.title}</h3>
          <p className="text-[#d7f5ef] mb-5 leading-relaxed">{pillar.description}</p>
          <ul className="space-y-3 text-[#c7f2ea]">
            {pillar.commitments.map((commitment) => (
              <li key={commitment} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#00bfa5] shadow-[0_0_12px_rgba(0,191,165,0.6)]" aria-hidden="true" />
                <span>{commitment}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>

    <div className="bg-[#02211f]/80 border border-[#1f655d]/60 rounded-3xl p-10 mb-14 shadow-[0_20px_55px_rgba(0,150,136,0.18)]">
      <h3 className="text-center text-2xl font-semibold text-[#c8fff4] tracking-wide mb-8">Proof points and readiness signals</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {trustSignals.map((signal) => (
          <div
            key={signal.label}
            className="rounded-2xl border border-[#2f6f68]/60 bg-[#033832]/75 p-6 text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#7fcfc2] mb-3">{signal.label}</p>
            <p className="text-2xl font-semibold text-[#a7ffeb] mb-2">{signal.value}</p>
            <p className="text-sm text-[#d7f5ef] leading-relaxed">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid gap-8 md:grid-cols-3">
      {trustPractices.map((practice) => (
        <div
          key={practice.title}
          className="bg-[#04302b]/80 border border-[#1f655d]/60 rounded-2xl p-8 shadow-[0_18px_48px_rgba(0,150,136,0.18)]"
        >
          <h3 className="text-xl font-semibold text-[#a7ffeb] mb-4 tracking-wide">{practice.title}</h3>
          <ul className="space-y-3 text-[#c7f2ea] leading-relaxed">
            {practice.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-[#00bfa5]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mt-16 rounded-3xl border border-[#2f6f68]/60 bg-gradient-to-r from-[#033f38]/95 via-[#044a42]/95 to-[#03524a]/95 p-10 text-center shadow-[0_26px_60px_rgba(0,150,136,0.22)]">
      <h3 className="text-3xl font-semibold text-[#c8fff4] mb-4">Built for dependable partnerships</h3>
      <p className="text-lg text-[#d7f5ef] max-w-3xl mx-auto mb-6">
        Whether we are launching an internal copilot or a public-facing AI product, we co-create a trust framework, measure it,
        and keep it observable long after launch. Let&apos;s architect outcomes users can believe in.
      </p>
      <p className="text-sm uppercase tracking-[0.35em] text-[#7fcfc2]">Evidence available on request • Security reviews welcome</p>
    </div>
  </section>
);

export default memo(TrustByDesignSection);
