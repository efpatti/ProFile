"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaletteProvider, PaletteName } from "@/styles/PaletteProvider";
import { Banner } from "@/components/Banner";
import { LogoSearch } from "@/components/LogoSearch";
import { DownloadBannerButton } from "@/components/DownloadBannerButton";
import { SettingsBanner } from "@/components/SettingsBanner";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";

export default function Home() {
 const searchParams = useSearchParams();
 const palette = (searchParams?.get("palette") as PaletteName) || "darkGreen";
 const [logoUrl, setLogoUrl] = useState<string | undefined>(
  searchParams?.get("logo") || "/mottu.jpg"
 );
 const [bgBanner, setBgBanner] = useState<BgBannerColorName>("midnightSlate");

 return (
  <PaletteProvider initialPalette={palette}>
   <div className="flex flex-col items-center min-h-screen p-8 gap-8">
    <LogoSearch onLogoSelect={setLogoUrl} />
    <Banner logoUrl={logoUrl} bgColor={bgBannerColor[bgBanner]} />
    <DownloadBannerButton logoUrl={logoUrl} />
    <SettingsBanner
     selectedBg={bgBanner}
     onSelectBg={(color: string) => setBgBanner(color as BgBannerColorName)}
    />
   </div>
  </PaletteProvider>
 );
}
