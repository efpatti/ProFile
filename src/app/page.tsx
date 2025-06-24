"use client";
import { PaletteProvider, PaletteName } from "@/styles/PaletteProvider";
import { Banner } from "@/components/Banner";
import { PaletteSelector } from "@/components/PaletteSelector";
import { LogoSearch } from "@/components/LogoSearch";
import { DownloadBannerButton } from "@/components/DownloadBannerButton";
import React, { useState } from "react";

export default function Home({
 searchParams,
}: {
 searchParams: { [key: string]: string };
}) {
 const palette = (searchParams.palette as PaletteName) || "darkGreen";
 const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
 return (
  <PaletteProvider initialPalette={palette}>
   <div className="flex flex-col items-center min-h-screen p-8 gap-8">
    <PaletteSelector />
    <LogoSearch onLogoSelect={setLogoUrl} />
    <Banner logoUrl={logoUrl} />
    <DownloadBannerButton logoUrl={logoUrl} />
   </div>
  </PaletteProvider>
 );
}
