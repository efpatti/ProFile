import Section from "@/components/Section";
import { FaExternalLinkAlt } from "react-icons/fa";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { CertificationItem } from "@/core/store/useResumeStore";

interface CertificationsSectionProps {
 certifications?: CertificationItem[];
 selectedBg: BgBannerColorName;
 language: string;
}

const ensureUrl = (value: string) =>
 value.startsWith("http://") || value.startsWith("https://")
  ? value
  : `https://${value}`;

export function CertificationsSection({
 certifications,
 selectedBg,
 language,
}: CertificationsSectionProps) {
 const title = language === "pt-br" ? "Certificações" : "Certifications";
 const textMuted = isDarkBackground(selectedBg)
  ? "text-gray-400"
  : "text-gray-600";
 const textStrong = isDarkBackground(selectedBg)
  ? "text-gray-200"
  : "text-gray-800";

 if (!certifications || certifications.length === 0) {
  return (
   <Section title={title} accent="#2563eb">
    <p className={`${textMuted} text-sm`}>
     {language === "pt-br"
      ? "Adicione certificações relevantes para destacar sua especialização."
      : "Add relevant certifications to highlight your expertise."}
    </p>
   </Section>
  );
 }

 return (
  <Section title={title} accent="#2563eb">
   {certifications.map((item) => (
    <div className="mb-6 p-4 rounded-lg" key={item.id}>
     <h4 className={`${textStrong} font-bold`}>{item.name}</h4>
     <p className={`${textMuted} text-sm`}>{item.issuer}</p>
     <p className={`${textMuted} text-xs mb-3`}>{item.date}</p>
     {item.url && (
      <a
       href={ensureUrl(item.url)}
       target="_blank"
       rel="noopener noreferrer"
       className="inline-flex items-center gap-2 hover:underline transition-colors duration-200 text-[var(--accent)]"
      >
       <FaExternalLinkAlt />
       {language === "pt-br" ? "Ver credencial" : "View credential"}
      </a>
     )}
    </div>
   ))}
  </Section>
 );
}
