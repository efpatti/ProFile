import Section from "@/components/Section";
import { FaExternalLinkAlt } from "react-icons/fa";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { ProjectItem } from "@/core/store/useResumeStore";

interface ProjectsSectionProps {
 projects?: ProjectItem[];
 selectedBg: BgBannerColorName;
 language: string;
}

const ensureUrl = (value: string) =>
 value.startsWith("http://") || value.startsWith("https://")
  ? value
  : `https://${value}`;

export function ProjectsSection({
 projects,
 selectedBg,
 language,
}: ProjectsSectionProps) {
 const title = language === "pt-br" ? "Projetos" : "Projects";
 const textClass = isDarkBackground(selectedBg)
  ? "text-gray-300"
  : "text-gray-700";

 if (!projects || projects.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textClass} text-sm`}>
     {language === "pt-br"
      ? "Adicione projetos relevantes para demonstrar suas habilidades."
      : "Add relevant projects to showcase your skills."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {projects.map((project) => (
    <div
     className="mb-6 p-4 rounded-lg transition-shadow duration-300"
     key={project.id}
    >
     <h4 className={`${textClass} font-bold text-lg`}>{project.name}</h4>
     <p className={`${textClass} perfect-justify mb-3`}>
      {project.description}
     </p>
     {project.technologies.length > 0 && (
      <ul className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-[var(--accent)] mb-3">
       {project.technologies.map((tech) => (
        <li
         key={`${project.id}-${tech}`}
         className="px-2 py-1 rounded bg-[var(--accent)]/10"
        >
         {tech}
        </li>
       ))}
      </ul>
     )}
     {project.url && (
      <a
       href={ensureUrl(project.url)}
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex items-center gap-2 hover:underline transition-colors duration-200 text-[var(--accent)]"
      >
       <FaExternalLinkAlt />
       {language === "pt-br" ? "Ver projeto" : "View project"}
      </a>
     )}
    </div>
   ))}
  </Section>
 );
}
