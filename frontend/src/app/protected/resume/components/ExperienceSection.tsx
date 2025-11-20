import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { Experience } from "@/core/store/useResumeStore";

interface ExperienceSectionProps {
 experiences?: Experience[];
 selectedBg: BgBannerColorName;
 language: string;
}

const formatDate = (value: string | null | undefined, language: string) => {
 if (!value) {
  return language === "pt-br" ? "Presente" : "Present";
 }

 const parsed = new Date(value);
 if (Number.isNaN(parsed.getTime())) {
  return value;
 }

 return parsed.toLocaleDateString(language === "pt-br" ? "pt-BR" : "en-US", {
  month: "short",
  year: "numeric",
 });
};

export function ExperienceSection({
 experiences,
 selectedBg,
 language,
}: ExperienceSectionProps) {
 const title = language === "pt-br" ? "Experiência" : "Experience";
 const textMuted = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-600";
 const textStrong = isDarkBackground(selectedBg)
  ? "text-gray-200"
  : "text-gray-800";

 if (!experiences || experiences.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textMuted} text-sm`}>
     {language === "pt-br"
      ? "Cadastre experiências profissionais para enriquecer seu currículo."
      : "Add professional experiences to enrich your resume."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {experiences.map((item) => {
    const endLabel = item.isCurrentJob
     ? language === "pt-br"
       ? "Presente"
       : "Present"
     : formatDate(item.endDate, language);

    return (
     <div
      className="mb-6 p-4 rounded-lg transition-shadow duration-300"
      key={item.id}
     >
      <h4 className={`${textStrong} text-lg font-bold`}>
       {item.role} - {item.company}
      </h4>
      <p className={`${textMuted} text-sm mb-3`}>
       {formatDate(item.startDate, language)} • {endLabel}
      </p>
      {item.description && (
       <p className={`${textMuted} mb-3`}>{item.description}</p>
      )}
      {item.technologies.length > 0 && (
       <ul className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-[var(--accent)]">
        {item.technologies.map((tech) => (
         <li
          key={`${item.id}-${tech}`}
          className="px-2 py-1 rounded bg-[var(--accent)]/10"
         >
          {tech}
         </li>
        ))}
       </ul>
      )}
     </div>
    );
   })}
  </Section>
 );
}
