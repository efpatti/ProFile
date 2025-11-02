import Section from "@/components/Section";
import { isDarkBackground } from "@/utils/color";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import type { Profile } from "@/core/store/useResumeStore";

interface ProfileSectionProps {
 profile?: Profile | null;
 language: string;
 selectedBg: BgBannerColorName;
}

export function ProfileSection({
 profile,
 language,
 selectedBg,
}: ProfileSectionProps) {
 const title = language === "pt-br" ? "Perfil" : "Profile";
 const bioFallback =
  language === "pt-br"
   ? "Adicione um resumo profissional para destacar suas conquistas."
   : "Add a professional summary to highlight your achievements.";

 const detailItems = [
  profile?.location && {
   label: language === "pt-br" ? "Localização" : "Location",
   value: profile.location,
  },
  profile?.phone && {
   label: language === "pt-br" ? "Telefone" : "Phone",
   value: profile.phone,
  },
  profile?.website && {
   label: language === "pt-br" ? "Website" : "Website",
   value: profile.website,
  },
  profile?.linkedin && {
   label: "LinkedIn",
   value: profile.linkedin,
  },
  profile?.github && {
   label: "GitHub",
   value: profile.github,
  },
 ].filter(Boolean) as { label: string; value: string }[];

 const textClass = isDarkBackground(selectedBg)
  ? "text-gray-300"
  : "text-gray-700";

 return (
  <Section title={title} accent="#2563eb">
   <p className={`${textClass} perfect-justify mb-3`}>
    {profile?.bio?.trim() || bioFallback}
   </p>
   {detailItems.length > 0 && (
    <ul className={`space-y-1 text-sm ${textClass}`}>
     {detailItems.map(({ label, value }) => (
      <li key={label}>
       <span className="font-semibold mr-2">{label}:</span>
       <span>{value}</span>
      </li>
     ))}
    </ul>
   )}
  </Section>
 );
}
