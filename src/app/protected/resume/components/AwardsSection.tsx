import Section from "@/components/Section";
import { FaAward } from "react-icons/fa";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { AwardItem } from "@/core/store/useResumeStore";

interface AwardsSectionProps {
 awards?: AwardItem[];
 selectedBg: BgBannerColorName;
 language: string;
}

export function AwardsSection({
 awards,
 selectedBg,
 language,
}: AwardsSectionProps) {
 const title = language === "pt-br" ? "Prêmios" : "Awards";
 const textMuted = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-600";
 const textStrong = isDarkBackground(selectedBg)
  ? "text-gray-200"
  : "text-gray-800";

 if (!awards || awards.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textMuted} text-sm`}>
     {language === "pt-br"
      ? "Liste prêmios e reconhecimentos para reforçar suas conquistas."
      : "List awards and recognitions to reinforce your achievements."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {awards.map((award) => (
    <div
     className="flex items-start gap-3 mb-4 p-3 rounded-lg transition-shadow duration-300"
     key={award.id}
    >
     <FaAward className="text-[var(--accent)] mt-1" />
     <div>
      <p className={`${textStrong} font-semibold`}>{award.title}</p>
      <p className={`${textMuted} text-sm`}>{award.issuer}</p>
      <p className={`${textMuted} text-xs mb-2`}>{award.date}</p>
      {award.description && (
       <p className={`${textMuted} text-sm`}>{award.description}</p>
      )}
     </div>
    </div>
   ))}
  </Section>
 );
}
