"use client";
import { useState } from "react";
import { Banner } from "@/components/Banner";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";

export default function Home() {
 const [logoUrl] = useState<string | undefined>("/mottu.jpg");
 const [bgBanner, setBgBanner] = useState<BgBannerColorName>("midnightSlate");

 return (
  <div className="flex flex-col items-center min-h-screen justify-center p-8 gap-8">
   <Banner
    logoUrl={logoUrl}
    bgColor={bgBannerColor[bgBanner]}
    selectedBg={bgBanner}
    onSelectBg={(color: string) => setBgBanner(color as BgBannerColorName)}
   />
  </div>
 );
}
