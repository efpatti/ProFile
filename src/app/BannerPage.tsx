import React, { useState } from "react";
import { Banner } from "../components/Banner";
import { PaletteSelector } from "../components/PaletteSelector";
import { LogoSearch } from "../components/LogoSearch";
import { DownloadBannerButton } from "../components/DownloadBannerButton";

const BannerPage: React.FC = () => {
 const [logo, setLogo] = useState<string>("mottu.jpg");

 return (
  <main className="bg-[#0e1111] font-['Inter'] flex flex-col items-center min-h-screen">
   <DownloadBannerButton logoUrl={logo} />
   <PaletteSelector />
   <Banner logoUrl={logo} />
   <LogoSearch onLogoSelect={setLogo} />
  </main>
 );
};

export default BannerPage;
