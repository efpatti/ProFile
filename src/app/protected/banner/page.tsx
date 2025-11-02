"use client";
import { useState } from "react";
import { Banner, getBgColorObj } from "@/components/Banner";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import { useAuth } from "@/core/services/AuthProvider";

export default function Home() {
 const { user } = useAuth();
 const [logoUrl] = useState<string | undefined>("/mottu.jpg");
 const [bgBanner, setBgBanner] = useState<BgBannerColorName>("midnightSlate");

 return (
  <div className="flex flex-col items-center min-h-screen justify-center p-8 gap-8">
   <Banner
    logoUrl={logoUrl}
    bgColor={getBgColorObj(bgBanner)}
    selectedBg={bgBanner}
    onSelectBg={(color: string) => setBgBanner(color as BgBannerColorName)}
    user={user}
   />
  </div>
 );
}
