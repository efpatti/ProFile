"use client";
import React, { useState } from "react";
import { Banner } from "@/components/Banner";
import { PaletteSelector } from "@/components/PaletteSelector";
import { LogoSearch } from "@/components/LogoSearch";
import { DownloadBannerButton } from "@/components/DownloadBannerButton";

export default function Home() {
 const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

 return (
  <div className="flex flex-col items-center min-h-screen p-8 gap-8">
   <PaletteSelector />
   <LogoSearch onLogoSelect={setLogoUrl} />
   <Banner logoUrl={logoUrl} />
   <DownloadBannerButton logoUrl={logoUrl} />
  </div>
 );
}
