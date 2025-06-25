"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaletteProvider, PaletteName } from "@/styles/PaletteProvider";
import { Banner } from "@/components/Banner";
import { PaletteSelector } from "@/components/PaletteSelector";
import { LogoSearch } from "@/components/LogoSearch";
import { DownloadBannerButton } from "@/components/DownloadBannerButton";
import { BgBannerSelector } from "@/components/BgBannerSelector";
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
    <PaletteSelector />
    <LogoSearch onLogoSelect={setLogoUrl} />
    <Banner logoUrl={logoUrl} bgColor={bgBannerColor[bgBanner]} />
    <DownloadBannerButton logoUrl={logoUrl} />
    <BgBannerSelector selected={bgBanner} onSelect={setBgBanner} />
   </div>
  </PaletteProvider>
 );
}
