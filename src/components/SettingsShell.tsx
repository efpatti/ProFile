// components/SettingsShell.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadButton } from "@/components/DownloadButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FaCog, FaTimes } from "react-icons/fa";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { useLanguage } from "@/core/services/LanguageProvider";
import ExperienceEditor from "./ExperienceEditor";
import useResumeStore from "@/core/store/useResumeStore";
import { useAuth } from "@/core/services/AuthProvider";

interface SettingsShellProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right";
 downloadType?: "banner" | "resume";
}

export const SettingsShell = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left",
 downloadType = "banner",
}: SettingsShellProps) => {
 const [isOpen, setIsOpen] = useState(false);
 const { language } = useLanguage();
 const { user } = useAuth();
 const {
  loadResume,
  skills,
  experiences,
  education,
  languages: languagesData,
  updateSkills,
  updateExperiences,
  updateEducation,
  updateLanguages,
  saveResume,
  isLoading: loading,
 } = useResumeStore();

 // Transform languages array to object format for LanguagesEditor
 const languagesForEditor = useMemo(
  () => ({
   title: language === "pt-br" ? "Idiomas" : "Languages",
   items: languagesData || [],
  }),
  [languagesData, language]
 );

 useEffect(() => {
  if (user) loadResume(user.uid);
 }, [user, language, loadResume]);

 const handleLogoSelect = (url: string) => {
  onLogoSelect?.(url);
 };

 const handleSkillsSaved = async (updated: any) => {
  updateSkills(updated);
  if (user) await saveResume(user.uid);
 };
 const handleExperienceSaved = async (updated: any) => {
  updateExperiences(updated);
  if (user) await saveResume(user.uid);
 };
 const handleEducationSaved = async (updated: any) => {
  updateEducation(updated);
  if (user) await saveResume(user.uid);
 };
 const handleLanguagesSaved = async (updated: any) => {
  updateLanguages(updated);
  if (user) await saveResume(user.uid);
 };

 return (
  <>
   <div
    data-no-print
    className={`${
     position === "right" ? "absolute top-4 right-4" : "absolute top-4 left-4"
    } z-50 flex flex-row gap-2 items-center`}
   >
    <SettingsBanner
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={handleLogoSelect}
    />
    {showDownloadButton && (
     <DownloadButton
      logoUrl={logoUrl}
      selectedBg={selectedBg}
      type={downloadType}
      lang={language}
     />
    )}
   </div>

   {/* Sidebar Shell */}
   <div
    data-no-print
    className={`fixed top-0 ${
     position === "right" ? "right-0" : "left-0"
    } h-full w-96 bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
     isOpen
      ? "translate-x-0"
      : position === "right"
      ? "translate-x-full"
      : "-translate-x-full"
    } overflow-y-auto p-6`}
   >
    <div className="flex justify-between items-center mb-8">
     <h2 className="text-2xl font-bold">Edit Content</h2>
     <button
      onClick={() => setIsOpen(false)}
      className="p-2 hover:bg-gray-700 rounded-full"
      aria-label="Close settings"
     >
      <FaTimes />
     </button>
    </div>

    <div className="space-y-8">
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Skills{" "}
       {loading && <span className="text-xs text-gray-500 ml-2">...</span>}
      </h3>
      <SkillsEditor
       lang={language}
       initialSkills={skills}
       onSaved={handleSkillsSaved}
      />
     </div>

     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       {language === "pt-br" ? "Experiência" : "Experience"}{" "}
       {loading && <span className="text-xs text-gray-500 ml-2">...</span>}
      </h3>
      <ExperienceEditor
       lang={language}
       initialItems={experiences}
       onSaved={handleExperienceSaved}
      />
     </div>

     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Education{" "}
       {loading && <span className="text-xs text-gray-500 ml-2">...</span>}
      </h3>
      <EducationEditor
       lang={language}
       initialItems={education}
       onSaved={handleEducationSaved}
      />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Languages{" "}
       {loading && <span className="text-xs text-gray-500 ml-2">...</span>}
      </h3>
      <LanguagesEditor
       lang={language}
       initialData={languagesForEditor}
       onSaved={handleLanguagesSaved}
      />
     </div>
    </div>
   </div>

   {/* Overlay */}
   {isOpen && (
    <div
     data-no-print
     className="fixed inset-0 bg-black/50 z-30"
     onClick={() => setIsOpen(false)}
    ></div>
   )}
  </>
 );
};
