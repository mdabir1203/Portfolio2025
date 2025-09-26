import { FC, memo } from 'react';
import { JourneyStep } from '../data/journey';

interface JourneySectionProps {
  journey: JourneyStep[];
}

const JourneySection: FC<JourneySectionProps> = ({ journey }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">My Digital Journey</h2>

    <div className="max-w-4xl mx-auto">
      {journey.map((step, index) => (
        <div
          key={index}
          className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
            <div className="bg-[#FAFAFA]/10 border border-[#4DB6AC]/30 rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-[0_20px_40px_rgba(77,182,172,0.3)]">
              <div className="text-2xl font-bold text-[#4DB6AC] mb-2">{step.year}</div>
              <h3 className="text-xl font-bold text-[#009688] mb-3">{step.title}</h3>
              <p className="text-[#E0F2F1] leading-relaxed">{step.description}</p>
            </div>
          </div>

          <div className="w-1/12 flex justify-center">
            <div className="w-4 h-4 bg-gradient-to-r from-[#4DB6AC] to-[#009688] rounded-full border-4 border-[#4DB6AC]/30"></div>
            {index < journey.length - 1 && (
              <div className="absolute w-0.5 h-32 bg-gradient-to-b from-[#4DB6AC] to-[#009688] my-2"></div>
            )}
          </div>

          <div className="w-5/12"></div>
        </div>
      ))}
    </div>

    <div className="text-center mt-16 p-8 bg-gradient-to-r from-[rgba(0,73,67,0.35)] to-[rgba(0,105,92,0.35)] rounded-xl border border-[#4DB6AC]/30">
      <h3 className="text-2xl font-bold text-[#4DB6AC] mb-4">Builder Philosophy</h3>
      <p className="text-xl text-[#E0F2F1] max-w-3xl mx-auto leading-relaxed">
        "We build boldly, break fearlessly, and aim for horizons yet unseen"
      </p>
    </div>
  </section>
);

export default memo(JourneySection);
