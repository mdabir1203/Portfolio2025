import { FC, memo, useMemo } from 'react';
import { Project, ProjectCategory } from '../data/projects';

interface ProjectsSectionProps {
  projects: Project[];
}

const categoryLabels: Record<ProjectCategory, string> = {
  'hackathon': 'Hackathon Projects',
  'self-project': 'Self Projects',
  'startup-venture': 'Startup Ventures'
};

const categoryOrder: ProjectCategory[] = ['hackathon', 'self-project', 'startup-venture'];

const ProjectsSection: FC<ProjectsSectionProps> = ({ projects }) => {
  const groupedProjects = useMemo(() => {
    const grouped: Record<ProjectCategory, Project[]> = {
      'hackathon': [],
      'self-project': [],
      'startup-venture': []
    };

    projects.forEach(project => {
      grouped[project.category].push(project);
    });

    return grouped;
  }, [projects]);

  return (
    <section className="mb-12 sm:mb-16 animate-fadeIn">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-[#c8fff4] via-[#4DB6AC] to-[#009688] bg-clip-text text-transparent drop-shadow-[0_16px_40px_rgba(0,150,136,0.25)]">
        My Digital Creations
      </h2>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-6">
        {categoryOrder.map((category) => {
          const categoryProjects = groupedProjects[category];
          if (categoryProjects.length === 0) return null;

          return (
            <div key={category} className="flex flex-col space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#a7ffeb] tracking-wide border-b border-[#2f6f68]/40 pb-2 sm:pb-3 lg:sticky lg:top-0 lg:bg-[#021513]/95 lg:backdrop-blur-sm lg:z-10">
                {categoryLabels[category]}
              </h3>
              <div className="flex flex-col gap-4 sm:gap-6">
                {categoryProjects.map((project, index) => (
                  <div
                    key={index}
                    className="project-card bg-[#052c28]/70 border border-[#2f6f68]/40 rounded-xl p-4 sm:p-6 transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(0,150,136,0.22)]"
                  >
                    <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                    </div>
                    <h3 className="project-title text-xl sm:text-2xl font-semibold text-[#a7ffeb] tracking-wide mb-2 sm:mb-3">{project.title}</h3>
                    <p className="project-description text-sm sm:text-base text-[#d7f5ef] mb-4 sm:mb-6 leading-relaxed">{project.description}</p>
                    {project.metrics?.length ? (
                      <div className="grid gap-2 sm:gap-3 mb-4 sm:mb-6 grid-cols-1 sm:grid-cols-2">
                        {project.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="bg-[#04332f]/70 border border-[#2f6f68]/40 rounded-lg p-3 sm:p-4 shadow-inner shadow-[#01211e]/40 transition-all duration-300 group-hover:border-[#00bfa5]/60"
                          >
                            <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-[#7ddcd3] mb-1">{metric.label}</p>
                            <p className="text-lg sm:text-xl font-semibold text-[#c8fff4] mb-1">{metric.value}</p>
                            <p className="text-xs sm:text-sm text-[#b0f0e6] leading-relaxed">{metric.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="project-footer flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
                      <span className="project-stars text-[#FF8A65] font-semibold flex items-center justify-center sm:justify-start">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {project.stars}
                      </span>
                      <a
                        href={project.link}
                        className="project-link text-[#052321] font-semibold tracking-wide py-2.5 sm:py-2 px-4 sm:px-4 rounded-lg border border-[#00bfa5]/50 bg-gradient-to-r from-[#00a99d] via-[#4DB6AC] to-[#00bfa5] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,150,136,0.32)] text-center min-h-[44px] flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explore →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(ProjectsSection);
