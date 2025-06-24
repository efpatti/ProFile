import React from "react";
import Image from "next/image";
import { TechIcons } from "./TechIcons";
import { CodeBlock } from "./CodeBlock";
import { Developer } from "@/core/models/Developer";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaGithub } from "react-icons/fa";
import { FaAward as AwardIcon } from "react-icons/fa";

const dev = new Developer({
 name: "Enzo Ferracini Patti",
 role: "Fullstack Developer",
 stack: ["React", "Node.js", "TypeScript"],
 company: "Mottu",
 position: "Development Intern",
});

interface BannerProps {
 logoUrl?: string;
}

export const Banner: React.FC<BannerProps> = ({ logoUrl }) => {
 return (
  <section
   id="banner"
   style={{
    background: "#181e29",
    borderColor: "var(--accent)",
    width: "1584px",
    height: "396px",
    paddingLeft: "250px", // Safe area for profile picture
   }}
   className="shadow-sm shadow-[color:var(--secondary)] flex flex-row gap-8 w-full relative"
  >
   {/* Left content - shifted right */}
   <div className="w-[900px] flex flex-col justify-center">
    <div className="flex justify-start items-center space-x-4">
     <h1 className="text-4xl font-bold text-white mb-2">{dev.name}</h1>
     {logoUrl && (
      <Image
       src={logoUrl}
       alt="Logo"
       width={40}
       height={40}
       className="h-10 w-10 rounded-full bg-white shadow"
      />
     )}
    </div>
    <p className="italic text-gray-300 mb-3 text-lg">
     Driven by curiosity and continuous learning
    </p>
    <div className="flex items-center flex-wrap gap-2 mb-4 text-slate-200">
     <span className="px-3 py-1 rounded-full border text-xs border-gray-700 bg-gray-900">
      Intern at <span className="font-bold text-[var(--accent)]">Mottu</span>
     </span>
     <span className="px-3 py-1 rounded-full border text-xs border-gray-700 bg-gray-900">
      Web Developer
     </span>
     <span className="px-3 py-1 rounded-full border text-xs border-gray-700 bg-gray-900">
      Computer Science Student
     </span>
     <span className="px-3 py-1 rounded-full border text-xs border-gray-700 bg-gray-900">
      Systems Development Technician
     </span>
    </div>
    <div
     className="highlight-bg p-3 rounded-lg border-l-4 mb-4 flex items-center gap-2 text-base bg-opacity-80"
     style={{
      borderColor: "var(--accent)",
      background: "var(--highlightBg)",
      maxWidth: "90%",
     }}
    >
     <span className="text-slate-200 mr-2">
      <AwardIcon />
     </span>
     <span className="truncate whitespace-normal text-slate-200">
      Recognized as the top graduate in Systems Development at SENAI
     </span>
     <span className="ml-2 px-2 py-0.5 rounded-full text-slate-200 bg-[var(--secondary)] text-xs text-shadow-lg/30 font-bold">
      2024
     </span>
    </div>
    <div className="flex flex-wrap gap-8 text-base items-center">
     <span className="flex items-center">
      <MdEmail className="mr-1" style={{ color: "var(--accent)" }} />
      <span className="text-slate-200">efpatti.dev@gmail.com</span>
     </span>
     <span className="flex items-center">
      <FaPhoneAlt className="mr-1" style={{ color: "var(--accent)" }} />
      <span className="text-slate-200">+55 (11) 97883-3101</span>
     </span>
     <span className="flex items-center">
      <FaGithub className="mr-1" style={{ color: "var(--accent)" }} />
      <span className="text-slate-200">github.com/efpatti</span>
     </span>
    </div>
   </div>

   {/* Right content */}
   <div className="flex-1 flex items-center justify-end pr-10">
    <div className="flex flex-col items-center justify-center gap-3">
     <div style={{ transform: "scale(0.9)" }}>
      <CodeBlock dev={dev} />
     </div>
     <TechIcons />
    </div>
   </div>
  </section>
 );
};
