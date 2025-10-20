import { FC, memo } from 'react';
import { JourneyStep } from '../data/journey';

interface JourneySectionProps {
  journey: JourneyStep[];
}

const JourneySection: FC<JourneySectionProps> = ({ journey }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      My Digital Journey
    </h2>

    <div className="max-w-4xl mx-auto">
      {journey.map((step, index) => (
        <div
          key={index}
          className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
            <div className="bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]">
              <div className="text-2xl font-semibold text-[#c8fff4] mb-2 tracking-wide">{step.year}</div>
              <h3 className="text-xl font-semibold text-[#a7ffeb] mb-3">{step.title}</h3>
              <p className="text-[#d7f5ef] leading-relaxed">{step.description}</p>
            </div>
          </div>

          <div className="w-1/12 flex justify-center">
            <div className="w-4 h-4 bg-gradient-to-r from-[#00bfa5] to-[#FF8A65] rounded-full border-4 border-[#2f6f68]/50 shadow-[0_0_25px_rgba(0,150,136,0.35)]"></div>
            {index < journey.length - 1 && (
              <div className="absolute w-0.5 h-32 bg-gradient-to-b from-[#00bfa5] via-[#4DB6AC] to-[#009688] my-2"></div>
            )}
          </div>

          <div className="w-5/12"></div>
        </div>
      ))}
    </div>

    <div className="text-center mt-16 p-8 bg-gradient-to-r from-[#033832]/80 to-[#02423b]/80 rounded-xl border border-[#2f6f68]/40 shadow-[0_26px_60px_rgba(0,150,136,0.22)]">
      <h3 className="text-2xl font-semibold text-[#c8fff4] mb-4 tracking-wide">Builder Philosophy</h3>
      <p className="text-xl text-[#d7f5ef] max-w-3xl mx-auto leading-relaxed">
        "We build boldly, break fearlessly, and aim for horizons yet unseen"
      </p>
    </div>
  </section>
);

export default memo(JourneySection);
