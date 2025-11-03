/**
 * Resume Page - Refactored with SRP
 *
 * ANTES: 244 linhas com múltiplas responsabilidades
 * DEPOIS: ~60 linhas delegando para componentes especializados
 *
 * Responsabilidades delegadas:
 * - useResumeQueryParams: Query string processing
 * - useResumeContacts: Contact aggregation logic
 * - ResumeContainer: Container + SettingsShell
 * - ResumeGrid: Grid layout + sections
 *
 * Uncle Bob: "The first rule of functions is that they should be small.
 *             The second rule is that they should be smaller than that."
 */

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { usePalette } from "@/styles/pallete_provider";
import { useLanguage } from "@/core/services/LanguageProvider";
import { Button } from "@/shared/components/button";
import {
 bgBannerColor,
 type BgBannerColorName,
} from "@/styles/shared_style_constants";
import { useResumeData } from "./hooks/useResumeData";
import { useResumeQueryParams } from "./hooks/useResumeQueryParams";
import { useResumeContacts } from "./hooks/useResumeContacts";
import { ResumeContainer } from "./components/ResumeContainer";
import { ResumeHeader } from "./components/ResumeHeader";
import { ResumeGrid } from "./components/ResumeGrid";

const defaultBg: BgBannerColorName = "midnightSlate";

const getBgColorObj = (bgName: BgBannerColorName) => {
 const bgObj = bgBannerColor[bgName];
 const bg = bgObj.colors.find((c) => "bg" in c)?.bg || "#000";
 return { bg };
};

export default function ResumePage() {
 const { language, toggleLanguage } = useLanguage();
 const [isClient, setIsClient] = useState(false);
 const { bannerColor, setBannerColor } = usePalette();
 const { user } = useAuth();

 // Extract query params logic
 const { bannerColorFromQuery, forcedUserId } = useResumeQueryParams();

 // Determine effective user ID
 const effectiveUserId = forcedUserId || user?.id || undefined;

 // Manage selected background color
 const [selectedBg, setSelectedBg] = useState<BgBannerColorName>(
  bannerColorFromQuery || bannerColor || defaultBg
 );

 // Load resume data
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

 // Extract contacts logic
 const contacts = useResumeContacts({
  headerEmail: header?.email,
  userEmail: user?.email,
  phone: profile?.phone,
  website: profile?.website,
  linkedin: profile?.linkedin,
  github: profile?.github,
 });

 // Client-side only rendering
 useEffect(() => {
  setIsClient(true);
 }, []);

 // Sync banner color from context
 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 // Handle background color selection
 const handleSelectBg = (bg: BgBannerColorName) => {
  setSelectedBg(bg);
  setBannerColor(bg);
 };

 const effectiveBgColor = getBgColorObj(selectedBg);

 if (!isClient) return null;

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <Button variant="outline" size="sm" onClick={toggleLanguage} full={false}>
     {language === "pt-br" ? "PT" : "EN"}
    </Button>
   </div>

   <ResumeContainer
    isReady={isReady}
    backgroundColor={effectiveBgColor.bg}
    selectedBg={selectedBg}
    onSelectBg={handleSelectBg}
    logoUrl={currentLogoUrl ?? null}
    onLogoSelect={(url) => setCurrentLogoUrl(url ?? undefined)}
   >
    <ResumeHeader
     displayName={displayName}
     userName={user?.displayName}
     subtitle={header?.title ?? null}
     contacts={contacts}
    />

    <ResumeGrid
     profile={profile}
     languagesList={languagesList}
     education={education}
     experiences={experiences}
     recommendations={recommendations}
     certifications={certifications}
     skillsByGroup={skillsByGroup}
     projects={projects}
     interests={interests}
     awards={awards}
     language={language}
     selectedBg={selectedBg}
    />
   </ResumeContainer>
  </div>
 );
}
