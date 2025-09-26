import { FC, memo } from 'react';

interface ContactSectionProps {
  bookMeeting: () => void;
}

const ContactSection: FC<ContactSectionProps> = ({ bookMeeting }) => (
  <section className="mb-16 animate-fadeIn">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
      Let's Create Magic Together
    </h2>

    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
      <div className="bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]">
        <h3 className="text-2xl font-semibold text-[#a7ffeb] mb-6">Send Me a Message</h3>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[#d7f5ef] mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-[#033832]/70 border border-[#2f6f68]/40 rounded-lg text-[#f4fffb] placeholder-[#7fcfc2] focus:outline-none focus:ring-2 focus:ring-[#00bfa5] transition-all duration-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[#d7f5ef] mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-[#033832]/70 border border-[#2f6f68]/40 rounded-lg text-[#f4fffb] placeholder-[#7fcfc2] focus:outline-none focus:ring-2 focus:ring-[#00bfa5] transition-all duration-300"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-[#d7f5ef] mb-2">Message</label>
            <textarea
              id="message"
              rows={5}
              className="w-full p-3 bg-[#033832]/70 border border-[#2f6f68]/40 rounded-lg text-[#f4fffb] placeholder-[#7fcfc2] focus:outline-none focus:ring-2 focus:ring-[#00bfa5] transition-all duration-300 resize-none"
              placeholder="Tell me about your project or idea..."
            ></textarea>
          </div>
          <button
            type="button"
            className="w-full bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#4DB6AC] text-[#052321] font-semibold tracking-wide py-3 px-6 rounded-lg border border-[#00bfa5]/40 transition-all duration-300 shadow-[0_20px_45px_rgba(0,150,136,0.35)] hover:-translate-y-0.5"
            onClick={bookMeeting}
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]">
        <h3 className="text-2xl font-semibold text-[#a7ffeb] mb-6">Quick Connect</h3>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-[#c8fff4] mb-4">Connect With Me</h4>
          <div className="space-y-4">
            <a
              href="https://www.github.com/mdabir1203"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-[#033832]/60 border border-[#2f6f68]/40 rounded-lg hover:border-[#00bfa5] hover:bg-[#02423b]/70 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#033832] via-[#00695C] to-[#00a99d] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#c8fff4]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span className="text-[#d7f5ef] group-hover:text-[#c8fff4] transition-colors duration-300">GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/abir-abbas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-[#033832]/60 border border-[#2f6f68]/40 rounded-lg hover:border-[#00bfa5] hover:bg-[#02423b]/70 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#052321]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="text-[#d7f5ef] group-hover:text-[#c8fff4] transition-colors duration-300">LinkedIn</span>
            </a>

            <a
              href="https://www.medium.com/@md.abir1203"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-[#033832]/60 border border-[#2f6f68]/40 rounded-lg hover:border-[#00bfa5] hover:bg-[#02423b]/70 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#FF8A65] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#052321]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.75 2.5h18.5c.138 0 .25.112.25.25v18.5a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25V2.75c0-.138.112-.25.25-.25zM21 19V5H3v14h18zM7.25 7a.75.75 0 0 0 0 1.5h.774a.75.75 0 0 0 0-1.5H7.25zm0 3.75a.75.75 0 0 0 0 1.5h.774a.75.75 0 0 0 0-1.5H7.25zm0 3.75a.75.75 0 0 0 0 1.5h.774a.75.75 0 0 0 0-1.5H7.25zm0 3.75a.75.75 0 0 0 0 1.5h.774a.75.75 0 0 0 0-1.5H7.25zm3.25-11.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 3.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 3.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 3.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z"/>
                </svg>
              </div>
              <span className="text-[#d7f5ef] group-hover:text-[#c8fff4] transition-colors duration-300">Medium</span>
            </a>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-[#c8fff4] mb-4">Schedule a Meeting</h4>
          <button
            onClick={bookMeeting}
            className="w-full bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#FF8A65] hover:from-[#009688] hover:via-[#00a99d] hover:to-[#FF7043] text-[#052321] font-semibold tracking-wide py-3 px-6 rounded-lg border border-[#00bfa5]/40 transition-all duration-300 shadow-[0_24px_50px_rgba(0,150,136,0.3)] hover:-translate-y-0.5"
          >
            Book a Meeting with Calendly
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default memo(ContactSection);
