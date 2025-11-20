import Section from "@/components/Section";
import SkillCategory from "@/components/SkillCategory";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";

interface SkillsSectionProps {
 skills?: { title: string; items: string[] }[];
 selectedBg: BgBannerColorName;
 language: string;
}

export function SkillsSection({
 skills,
 selectedBg,
 language,
}: SkillsSectionProps) {
 const title = language === "pt-br" ? "Habilidades" : "Skills";
 const textClass = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-700";

 if (!skills || skills.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textClass} text-sm`}>
     {language === "pt-br"
      ? "Adicione suas habilidades no painel de configurações."
      : "Add your skills in the settings panel."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {skills.map((category) => (
    <SkillCategory
     key={category.title}
     category={category}
     textClass={textClass}
    />
   ))}
  </Section>
 );
}
