import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { Interests } from "@/core/store/useResumeStore";

interface InterestsSectionProps {
 interests?: Interests;
 selectedBg: BgBannerColorName;
 language: string;
}

export function InterestsSection({
 interests,
 selectedBg,
 language,
}: InterestsSectionProps) {
 const title = language === "pt-br" ? "Interesses" : "Interests";
 const textClass = isDarkBackground(selectedBg)
  ? "text-gray-300"
  : "text-gray-700";

 if (!interests || interests.items.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textClass} text-sm`}>
     {language === "pt-br"
      ? "Compartilhe interesses pessoais para mostrar sua personalidade."
      : "Share personal interests to showcase your personality."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   <ul className={`list-disc pl-5 space-y-1 ${textClass}`}>
    {interests.items.map((item, index) => (
     <li key={`${item}-${index}`}>{item}</li>
    ))}
   </ul>
  </Section>
 );
}
