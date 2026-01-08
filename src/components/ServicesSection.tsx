import { FC, memo } from 'react';
import { Service } from '../data/services';

interface ServicesSectionProps {
  services: Service[];
  bookMeeting: () => void;
}

const ServicesSection: FC<ServicesSectionProps> = ({ services, bookMeeting }) => (
  <section className="mb-12 sm:mb-16 animate-fadeIn">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      AI Development Services
    </h2>
    <p className="text-base sm:text-lg md:text-xl text-[#d7f5ef] text-center mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
      We provide expert AI development services to bring your ideas to life. Here's a breakdown of my offerings:
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {services.map((service, index) => (
        <div
          key={index}
          className="package-card bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-5 sm:p-6 md:p-8 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]"
        >
          <h3 className="text-2xl font-semibold text-[#a7ffeb] mb-3 tracking-wide">{service.title}</h3>
          <p className="text-[#d7f5ef] mb-6 leading-relaxed">{service.description}</p>

          <div className="mb-6">
            <div className="package-price text-3xl font-semibold text-[#00bfa5] mb-2">{service.price}</div>
            <p className="text-sm text-[#7fcfc2] uppercase tracking-[0.2em]">Best for: {service.bestFor}</p>
          </div>

          <ul className="mb-8 space-y-2">
            {service.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-[#d7f5ef]">
                <svg className="w-5 h-5 text-[#00bfa5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="package-button w-full bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3 sm:py-3 px-6 rounded-lg border border-[#00bfa5]/40 transition-all duration-300 shadow-[0_20px_45px_rgba(0,150,136,0.35)] hover:-translate-y-0.5 min-h-[44px] flex items-center justify-center"
            onClick={bookMeeting}
          >
            Book a Meeting
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default memo(ServicesSection);
