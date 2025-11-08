"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { BgBannerColorName } from "@/styles/shared_style_constants";

const SettingsShell = dynamic(
 () => import("@/components/SettingsShell").then((m) => m.SettingsShell),
 {
  ssr: false,
  loading: () => null,
 }
);

interface ResumeContainerProps {
 isReady: boolean;
 backgroundColor: string;
 selectedBg: BgBannerColorName;
 onSelectBg: (bg: BgBannerColorName) => void;
 logoUrl: string | null;
 onLogoSelect: (url: string | null) => void;
 children: React.ReactNode;
}

export function ResumeContainer({
 isReady,
 backgroundColor,
 selectedBg,
 onSelectBg,
 logoUrl,
 onLogoSelect,
 children,
}: ResumeContainerProps) {
 return (
  <div
   className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
   style={{ background: backgroundColor }}
   id="resume"
   data-ready={isReady ? "1" : "0"}
  >
   <SettingsShell
    selectedBg={selectedBg}
    onSelectBg={onSelectBg}
    logoUrl={logoUrl || undefined}
    onLogoSelect={onLogoSelect}
    showDownloadButton
    position="right"
    downloadType="resume"
   />
   {children}
  </div>
 );
}
