import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { EducationItem } from "@/core/store/useResumeStore";

interface EducationSectionProps {
 education?: EducationItem[];
 selectedBg: BgBannerColorName;
 language: string;
}

const formatPeriod = (item: EducationItem, language: string) => {
 const start = item.startDate || "";
 const end = item.endDate ?? (language === "pt-br" ? "Atual" : "Current");
 return `${start} • ${end}`;
};

export function EducationSection({
 education,
 selectedBg,
 language,
}: EducationSectionProps) {
 const title = language === "pt-br" ? "Educação" : "Education";
 const textMuted = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-600";
 const textStrong = isDarkBackground(selectedBg)
  ? "text-gray-200"
  : "text-gray-800";

 if (!education || education.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textMuted} text-sm`}>
     {language === "pt-br"
      ? "Inclua sua formação acadêmica para fortalecer o currículo."
      : "Add your academic background to strengthen the resume."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {education.map((item) => (
    <div className="p-2" key={item.id}>
     <h4 className={`${textStrong} font-bold`}>
      {item.degree} • {item.institution}
     </h4>
     <p className={`${textMuted} text-sm mb-2`}>{item.field}</p>
     <p className={`${textMuted} text-xs`}>{formatPeriod(item, language)}</p>
     {item.description && (
      <p className={`${textMuted} text-sm mt-2`}>{item.description}</p>
     )}
    </div>
   ))}
  </Section>
 );
}
