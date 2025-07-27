// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadBannerButton } from "./DownloadBannerButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

interface SettingsPanelProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right"; // nova prop opcional
}

export const SettingsPanel = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left", // padrão é esquerda
}: SettingsPanelProps) => {
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
    <DownloadBannerButton logoUrl={currentLogoUrl} selectedBg={selectedBg} />
   )}
  </div>
 );
};

// SettingsPanel já está implementado corretamente para uso compartilhado.
// Nenhuma alteração necessária aqui.
