import { motion } from "framer-motion";

export const testimonials = [
  {
    quote:
      "I had the pleasure of working with Abir, and during that time, I was able to see firsthand his exceptional technical abilities as well as his collaborative approach. Abir is not only a highly skilled professional but also someone who actively supports his colleagues' growth and fosters a positive, team-oriented environment. Abir is a pioneering and passionate individual, consistently demonstrating innovative thinking in addressing challenges. Although we didn't have a close working relationship initially, he was proactive in reaching out to offer his help whenever I encountered technical difficulties, such as debugging and analyzing complex code issues. His willingness to assist not only helped me resolve issues effectively but also created a supportive environment that allowed our professional relationship to grow. Over time, thanks to his enthusiasm and collaborative nature, we became much closer, both professionally and personally. Thanks to his broad perspective and technical insight, I was able to significantly improve my ability to architect solutions and approach problems from a strategic level. Abir's technical talent, paired with his reliable, results-oriented mindset, makes him a perfect fit for any business-focused role. His dedication to excellence and collaborative nature would be a tremendous asset to any organization.",
    author: "Junyub Kim",
    role: "Strategic Planner at General Motors | Software Developer",
  },
  {
    quote:
      "Mr. Mohammad Abir is very hard worker and talented student. I have known him since my school days. Once he made up his mind on something, he put a great effort no matter how hard that task is. I wish him good luck on his future endeavors.",
    author: "Sabbir Ahamed Shubho",
    role: "Embedded Software Developer | Linux Enthusiast",
  },
  {
    quote:
      "Herr Mohammad Abir Abbas ist ehrenamtlich bei AIESEC e.V. tätig. Er ist Vorsitzender für das Team Praktikanten im Unternehmen zu vermitteln und das interkulturelle Verständnis zu fördern.",
    author: "Martje Lott",
    role: "Wissenschaftliche Mitarbeiterin und Doktorandin an der Universität Hamburg",
  },
];

export default function TestimonialsMarquee() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bento)] py-10">
      {/* Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[color:var(--bento)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[color:var(--bento)] to-transparent" />

      <div className="marquee flex gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={`${i}-${idx}`}
                className="flex w-[min(92vw,380px)] flex-col space-y-4 rounded-xl border border-white/5 bg-white/[0.02] p-6 md:w-[min(92vw,520px)]"
              >
                <p className="max-h-[min(55vh,26rem)] overflow-y-auto pr-1 text-sm italic leading-relaxed text-foreground/80 md:text-base [scrollbar-width:thin]">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-display text-lg text-[color:var(--accent-teal)]">
                    {t.author}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
