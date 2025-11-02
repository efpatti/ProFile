"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/core/services/AuthProvider";
import { usePalette } from "@/styles/pallete_provider";
import { useLanguage } from "@/core/services/LanguageProvider";
import { Button } from "@/shared/components/button";
import {
 bgBannerColor,
 type PaletteName,
 type BgBannerColorName,
} from "@/styles/shared_style_constants";
import { useResumeData } from "./hooks/useResumeData";
import { ResumeHeader } from "./components/ResumeHeader";
import { ProfileSection } from "./components/ProfileSection";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { LanguagesSection } from "./components/LanguagesSection";
import { EducationSection } from "./components/EducationSection";
import { RecommendationsSection } from "./components/RecommendationsSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { InterestsSection } from "./components/InterestsSection";
import { AwardsSection } from "./components/AwardsSection";

const SettingsShell = dynamic(
 () => import("@/components/SettingsShell").then((m) => m.SettingsShell),
 {
  ssr: false,
  loading: () => null,
 }
);

const defaultBg: BgBannerColorName = "midnightSlate";

const getBgColorObj = (bgName: BgBannerColorName) => {
 const bgObj = bgBannerColor[bgName];
 const bg = bgObj.colors.find((c) => "bg" in c)?.bg || "#000";
 return { bg };
};

const ensureUrl = (value: string) =>
 value.startsWith("http://") || value.startsWith("https://")
  ? value
  : `https://${value}`;

export default function ResumePage() {
 const searchParams = useSearchParams();
 const paletteFromQuery = searchParams?.get("palette") as PaletteName | null;
 const bannerColorFromQuery = searchParams?.get(
  "bannerColor"
 ) as BgBannerColorName | null;
 const forcedUserId = searchParams?.get("user");
 const { language, toggleLanguage } = useLanguage();
 const [isClient, setIsClient] = useState(false);
 const { bannerColor, palette, setPalette, setBannerColor } = usePalette();
 const [selectedBg, setSelectedBg] = useState<BgBannerColorName>(
  bannerColorFromQuery || bannerColor || defaultBg
 );
 const { user } = useAuth();
 const effectiveUserId = forcedUserId || user?.id || undefined;

 const {
  isReady,
  displayName,
  currentLogoUrl,
  setCurrentLogoUrl,
  header,
  profile,
  skillsByGroup,
  experiences,
  education,
  languages: languagesList,
  projects,
  certifications,
  interests,
  recommendations,
  awards,
 } = useResumeData(effectiveUserId);

 useEffect(() => {
  setIsClient(true);
 }, []);

 useEffect(() => {
  if (paletteFromQuery && paletteFromQuery !== palette) {
   setPalette(paletteFromQuery);
  }
  if (bannerColorFromQuery && bannerColorFromQuery !== bannerColor) {
   setSelectedBg(bannerColorFromQuery);
   setBannerColor(bannerColorFromQuery);
  }
 }, [
  paletteFromQuery,
  palette,
  setPalette,
  bannerColorFromQuery,
  bannerColor,
  setBannerColor,
 ]);

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 const handleSelectBg = (bg: BgBannerColorName) => {
  setSelectedBg(bg);
  setBannerColor(bg);
 };

 const contacts = useMemo(() => {
  const items: { text: string; href?: string }[] = [];
  const addContact = (text?: string | null, href?: string) => {
   if (!text) return;
   if (items.some((item) => item.text === text)) return;
   items.push({ text, href });
  };

  addContact(
   header?.email,
   header?.email ? `mailto:${header.email}` : undefined
  );
  addContact(user?.email, user?.email ? `mailto:${user.email}` : undefined);
  addContact(
   profile?.phone,
   profile?.phone ? `tel:${profile.phone}` : undefined
  );
  addContact(
   profile?.website,
   profile?.website ? ensureUrl(profile.website) : undefined
  );
  addContact(
   profile?.linkedin,
   profile?.linkedin ? ensureUrl(profile.linkedin) : undefined
  );
  addContact(
   profile?.github,
   profile?.github ? ensureUrl(profile.github) : undefined
  );

  return items;
 }, [
  header?.email,
  profile?.phone,
  profile?.website,
  profile?.linkedin,
  profile?.github,
  user?.email,
 ]);

 const effectiveBgColor = getBgColorObj(selectedBg);
 if (!isClient) return null;

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <Button variant="outline" size="sm" onClick={toggleLanguage} full={false}>
     {language === "pt-br" ? "PT" : "EN"}
    </Button>
   </div>
   <div
    className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
    style={{ background: effectiveBgColor.bg }}
    id="resume"
    data-ready={isReady ? "1" : "0"}
   >
    <SettingsShell
     selectedBg={selectedBg}
     onSelectBg={handleSelectBg}
     logoUrl={currentLogoUrl}
     onLogoSelect={setCurrentLogoUrl}
     showDownloadButton
     position="right"
     downloadType="resume"
    />
    <ResumeHeader
     displayName={displayName}
     userName={user?.displayName}
     subtitle={header?.title ?? null}
     contacts={contacts}
    />
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
     <div>
      <ProfileSection
       profile={profile}
       language={language}
       selectedBg={selectedBg}
      />
      <LanguagesSection
       languages={languagesList}
       language={language}
       selectedBg={selectedBg}
      />
      <EducationSection
       education={education}
       language={language}
       selectedBg={selectedBg}
      />
      <ExperienceSection
       experiences={experiences}
       language={language}
       selectedBg={selectedBg}
      />
      <RecommendationsSection
       recommendations={recommendations}
       language={language}
       selectedBg={selectedBg}
      />
      <CertificationsSection
       certifications={certifications}
       language={language}
       selectedBg={selectedBg}
      />
     </div>
     <div>
      <SkillsSection
       skills={skillsByGroup}
       language={language}
       selectedBg={selectedBg}
      />
      <ProjectsSection
       projects={projects}
       language={language}
       selectedBg={selectedBg}
      />
      <InterestsSection
       interests={interests}
       language={language}
       selectedBg={selectedBg}
      />
      <AwardsSection
       awards={awards}
       language={language}
       selectedBg={selectedBg}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
