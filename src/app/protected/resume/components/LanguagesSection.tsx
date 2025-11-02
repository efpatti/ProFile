import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";

interface LanguagesSectionProps {
 languages?: string[];
 selectedBg: BgBannerColorName;
 language: string;
}

export function LanguagesSection({
 languages,
 selectedBg,
 language,
}: LanguagesSectionProps) {
 const title = language === "pt-br" ? "Idiomas" : "Languages";
 const textClass = isDarkBackground(selectedBg)
  ? "text-gray-300"
  : "text-gray-700";

 if (!languages || languages.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textClass} text-sm`}>
     {language === "pt-br"
      ? "Informe os idiomas que você domina no painel de configurações."
      : "Add the languages you speak in the settings panel."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   <ul className={`list-disc pl-7 space-y-1 ${textClass}`}>
    {languages.map((item, index) => (
     <li key={`${item}-${index}`}>{item}</li>
    ))}
   </ul>
  </Section>
 );
}
