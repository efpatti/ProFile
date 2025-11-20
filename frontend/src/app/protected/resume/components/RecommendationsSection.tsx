import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { RecommendationItem } from "@/core/store/useResumeStore";

interface RecommendationsSectionProps {
 recommendations?: RecommendationItem[];
 selectedBg: BgBannerColorName;
 language: string;
}

export function RecommendationsSection({
 recommendations,
 selectedBg,
 language,
}: RecommendationsSectionProps) {
 const title = language === "pt-br" ? "Recomendações" : "Recommendations";
 const textMuted = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-600";
 const textStrong = isDarkBackground(selectedBg)
  ? "text-gray-200"
  : "text-gray-800";

 if (!recommendations || recommendations.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textMuted} text-sm`}>
     {language === "pt-br"
      ? "Peça recomendações para aumentar a credibilidade do seu currículo."
      : "Request recommendations to increase the credibility of your resume."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {recommendations.map((item) => (
    <div className="mb-6 p-4 rounded-lg" key={item.id}>
     <h4 className={`${textStrong} font-bold`}>{item.recommenderName}</h4>
     <p className={`${textMuted} text-sm mb-2`}>{item.relationship}</p>
     {item.date && <p className={`${textMuted} text-xs mb-2`}>{item.date}</p>}
     <blockquote className={`${textMuted} italic perfect-justify`}>
      {item.text}
     </blockquote>
    </div>
   ))}
  </Section>
 );
}
