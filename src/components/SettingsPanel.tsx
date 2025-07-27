// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadButton } from "@/components/DownloadButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

interface SettingsPanelProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right";
}

export const SettingsPanel = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left", // padrão é esquerda
 downloadType = "banner",
 lang,
}: SettingsPanelProps & {
 downloadType?: "banner" | "resume";
 lang?: string;
}) => {
 const [currentLogoUrl, setCurrentLogoUrl] = useState(logoUrl);

 const handleLogoSelect = (url: string) => {
  setCurrentLogoUrl(url);
  onLogoSelect?.(url);
 };

 return (
  <div
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
     logoUrl={currentLogoUrl}
     selectedBg={selectedBg}
     type={downloadType}
     lang={lang}
    />
   )}
  </div>
 );
};
