import { FC, memo } from 'react';
import { Service } from '../data/services';

interface ServicesSectionProps {
  services: Service[];
  bookMeeting: () => void;
}

const ServicesSection: FC<ServicesSectionProps> = ({ services, bookMeeting }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">AI Development Services</h2>
    <p className="text-xl text-[#E0F2F1] text-center mb-12 max-w-3xl mx-auto">
      I provide expert AI development services to bring your ideas to life. Here's a breakdown of my offerings:
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div
          key={index}
          className="package-card bg-[#FAFAFA]/10 border border-[#4DB6AC]/30 rounded-xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-[0_20px_40px_rgba(77,182,172,0.3)] group"
        >
          <h3 className="text-2xl font-bold text-[#009688] mb-3">{service.title}</h3>
          <p className="text-[#E0F2F1] mb-6">{service.description}</p>

          <div className="mb-6">
            <div className="package-price text-3xl font-bold text-[#4DB6AC] mb-4">{service.price}</div>
            <p className="text-sm text-[#B2DFDB]">Best for: {service.bestFor}</p>
          </div>

          <ul className="mb-8 space-y-2">
            {service.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-[#E0F2F1]">
                <svg className="w-5 h-5 text-[#4DB6AC] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className="package-button w-full bg-gradient-to-r from-[#009688] to-[#4DB6AC] hover:from-[#00695C] hover:to-[#009688] text-[#FAFAFA] font-bold py-3 px-6 rounded-lg border-2 border-transparent transition-all duration-300 text-shadow-glow transform hover:scale-105 hover:shadow-lg hover:shadow-[0_0_45px_rgba(0,150,136,0.4)]"
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
