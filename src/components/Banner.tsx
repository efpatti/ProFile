"use client";
import React from "react";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";
import { Developer } from "@/core/models/Developer";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaGithub } from "react-icons/fa";
import { FaAward as AwardIcon } from "react-icons/fa";
import { DownloadBannerButton } from "./DownloadBannerButton";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { SettingsPanel } from "@/components/SettingsPanel";
import type { User } from "firebase/auth";
import { usePalette } from "@/styles/PaletteProvider";

interface BannerProps {
 logoUrl?: string;
 bgColor?: { bg: string; text: string };
 selectedBg?: BgBannerColorName;
 onSelectBg?: (color: BgBannerColorName) => void;
 user?: User | null;
}

export function getBgColorObj(bgName: BgBannerColorName) {
 const bgObj = bgBannerColor[bgName];
 const colorsArr = bgObj.colors;
 const bg = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "bg")) as {
   bg: string;
  }
 ).bg;
 const text = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "text")) as {
   text: string;
  }
 ).text;
 return { bg, text };
}

export const Banner: React.FC<BannerProps> = ({
 logoUrl,
 bgColor,
 selectedBg,
 onSelectBg,
 user,
}) => {
 const { bannerColor } = usePalette();
 const [currentLogoUrl, setCurrentLogoUrl] = React.useState(logoUrl);

 const dev = new Developer({
  name: user?.displayName || "Your Name",
  role: "Fullstack Developer",
  stack: ["React", "Node.js", "TypeScript"],
  company: "Mottu",
  position: "Development Intern",
 });

 // Prioriza o valor do contexto global (bannerColor)
 const effectiveBgColor = bannerColor
  ? getBgColorObj(bannerColor)
  : selectedBg
  ? getBgColorObj(selectedBg)
  : bgColor || getBgColorObj("midnightSlate");

 return (
  <section
   id="banner"
   style={{
    background: effectiveBgColor.bg,
    color: effectiveBgColor.text,
    borderColor: "var(--accent)",
    width: "1584px",
    height: "396px",
    paddingLeft: "500px", // Safe area for profile picture
   }}
   className="shadow-sm shadow-[color:var(--secondary)] flex flex-row gap-0 w-full relative"
  >
   {/* Settings Banner no canto superior esquerdo */}
   {selectedBg && onSelectBg && (
    <SettingsPanel
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={setCurrentLogoUrl}
     logoUrl={currentLogoUrl}
    />
   )}

   {/* Left content - shifted right */}
   <div className="w-[900px] flex flex-col justify-center">
    <div className="flex justify-start items-center space-x-4">
     <h1
      className="text-4xl font-bold mb-2 font-inter"
      style={{ color: effectiveBgColor.text }}
     >
      {dev.name}
     </h1>
     <Image
      id="company-logo"
      src={currentLogoUrl || "/wood1.jpg"}
      alt="Logo"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full bg-white shadow"
     />
    </div>
    <p className="italic mb-3 text-lg" style={{ color: effectiveBgColor.text }}>
     Driven by curiosity and continuous learning
    </p>
    <div className="flex items-center flex-wrap gap-2 mb-4 text-slate-200">
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Intern at <span className="font-bold text-[var(--accent)]">Mottu</span>
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Computer Science Student
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Systems Development Technician
     </span>
    </div>
    <div
     className="highlight-bg p-3 rounded-lg border-l-4 mb-4 flex items-center gap-2 text-lg bg-opacity-80"
     style={{
      borderColor: "var(--accent)",
      background: "var(--highlightBg)",
      maxWidth: "93%",
     }}
    >
     <span className="text-slate-200 mr-2">
      <AwardIcon color={effectiveBgColor.text} />
     </span>
     <span
      className="truncate whitespace-normal"
      style={{ color: effectiveBgColor.text }}
     >
      Recognized as the top graduate in Systems Development at SENAI
     </span>
     <span className="ml-2 px-2 py-0.5 rounded-full text-slate-200 bg-[var(--secondary)] text-xs text-shadow-lg/30 font-bold">
      2024
     </span>
    </div>
    <div className="flex flex-wrap gap-8 text-lg items-center">
     <span className="flex items-center gap-3">
      <MdEmail className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>
       efpatti.dev@gmail.com
      </span>
     </span>
     <span className="flex items-center gap-3">
      <FaPhoneAlt className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>+55 (11) 97883-3101</span>
     </span>
     <span className="flex items-center gap-3">
      <FaGithub className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>github.com/efpatti</span>
     </span>
    </div>
   </div>

   {/* Right content */}
   <div className="flex-1 flex items-center justify-end pr-10">
    <div className="flex flex-col items-center justify-center gap-3">
     <div style={{ transform: "scale(0.9)" }}>
      <div className="font-jetbrains">
       <CodeBlock dev={dev} bgColor={effectiveBgColor} />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};
