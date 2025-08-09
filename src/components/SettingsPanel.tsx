// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadButton } from "@/components/DownloadButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FaCog, FaTimes } from "react-icons/fa";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { useLanguage } from "@/core/services/LanguageProvider";
import ExperienceEditor from "./ExperienceEditor";

interface SettingsPanelProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right";
 downloadType?: "banner" | "resume";
}

export const SettingsPanel = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left",
 downloadType = "banner",
}: SettingsPanelProps) => {
 const [isOpen, setIsOpen] = useState(false);
 const { language } = useLanguage();

 const handleLogoSelect = (url: string) => {
  onLogoSelect?.(url);
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

   {/* Sidebar Panel */}
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
       Skills
      </h3>
      <SkillsEditor lang={language} />
     </div>

     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       {language === "pt-br" ? "Experiência" : "Experience"}
      </h3>
      <ExperienceEditor lang={language} />
     </div>

     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Education
      </h3>
      <EducationEditor lang={language} />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Languages
      </h3>
      <LanguagesEditor lang={language} />
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
