"use client";

import React, { useState, useEffect } from "react";
import Section from "@/components/Section";
import SkillCategory from "@/components/SkillCategory";
import { resumeData } from "@/data/resumeData";
import { FaAward, FaExternalLinkAlt } from "react-icons/fa";
import {
 defaultPalette,
 colorPalettes,
 bgBannerColor,
 type PaletteName,
 type BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { useAuth } from "@/core/services/AuthProvider";
import { isDarkBackground } from "@/utils/color";
import { SettingsPanel } from "@/components/SettingsPanel";
import { usePalette } from "@/styles/PaletteProvider";
import { useSearchParams } from "next/navigation";

const defaultBg: BgBannerColorName = "midnightSlate";

const ResumePage: React.FC = () => {
 const searchParams = useSearchParams();
 const paletteFromQuery = searchParams
  ? (searchParams.get("palette") as PaletteName | null)
  : null;
 const bannerColorFromQuery = searchParams
  ? (searchParams.get("bannerColor") as BgBannerColorName | null)
  : null;
 const [currentLang, setCurrentLang] = useState<"pt-br" | "en">("pt-br");
 const [data, setData] = useState(resumeData["pt-br"]);
 const [isClient, setIsClient] = useState(false);
 const [paletteName] = useState<PaletteName>(defaultPalette);
 const { bannerColor, palette, setPalette, setBannerColor } = usePalette();
 const [selectedBg, setSelectedBg] = useState<BgBannerColorName>(
  bannerColorFromQuery || bannerColor || defaultBg
 );
 const { user } = useAuth();
 const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>(
  undefined
 );

 useEffect(() => {
  setIsClient(true);
  setData(resumeData[currentLang]);
 }, [currentLang]);

 // Força o contexto a usar a palette da query string, se existir
 useEffect(() => {
  if (paletteFromQuery && paletteFromQuery !== palette) {
   setPalette(paletteFromQuery);
  }
  if (bannerColorFromQuery && bannerColorFromQuery !== bannerColor) {
   setSelectedBg(bannerColorFromQuery);
   setBannerColor(bannerColorFromQuery);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [paletteFromQuery, bannerColorFromQuery]);

 const toggleLanguage = () => {
  setCurrentLang(currentLang === "pt-br" ? "en" : "pt-br");
 };

 function getBtnClasses(paletteName: PaletteName): string {
  const palette = colorPalettes[paletteName];
  if (!palette) return "bg-[var(--accent)] hover:bg-[var(--accent)]/90";
  const btnObj = palette.colors.find(
   (c: any) => typeof c === "object" && c !== null && "btn" in c
  ) as { btn?: string[] } | undefined;
  return btnObj && btnObj.btn
   ? btnObj.btn.join(" ")
   : "bg-[var(--accent)] hover:bg-[var(--accent)]/90";
 }
 const btnClasses = getBtnClasses(paletteName);

 // Função utilitária para obter o objeto de cor do bg
 function getBgColorObj(bgName: BgBannerColorName) {
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
 const effectiveBgColor = getBgColorObj(selectedBg);

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 if (!isClient) {
  return null;
 }

 // Add handler for background selection
 const handleSelectBg = (bg: BgBannerColorName) => setSelectedBg(bg);

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <button
     className={`font-semibold py-2 px-4 cursor-pointer rounded transition-colors duration-200 text-white rounded-md ${btnClasses}`}
     onClick={toggleLanguage}
    >
     {currentLang === "pt-br" ? "PT" : "EN"}
    </button>
   </div>
   <div
    className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
    style={{ background: effectiveBgColor.bg }}
   >
    {/* Shared settings panel for bg/logo/download */}
    <SettingsPanel
     selectedBg={selectedBg}
     onSelectBg={handleSelectBg}
     logoUrl={currentLogoUrl}
     onLogoSelect={setCurrentLogoUrl}
     showDownloadButton={true}
     position="right"
     downloadType="resume"
     lang={currentLang}
    />
    {/* Header */}
    <div className="p-8 bg-[var(--accent)]">
     <h1 className="text-3xl font-bold mb-2">
      {user?.displayName || data.header.name}
     </h1>
     <h2 className="text-xl opacity-90 mb-6">{data.header.title}</h2>
     <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
      {data.header.contacts.map((contact) => (
       <a
        key={contact.text}
        href={contact.href}
        className="flex items-center gap-2 hover:underline transition-colors duration-200 text-sm"
        target={contact.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
       >
        {contact.icon &&
         (() => {
          try {
           const Icon = require("react-icons/fa")[contact.icon];
           return Icon ? <Icon className="text-white" /> : null;
          } catch {
           return null;
          }
         })()}
        <span>{contact.text}</span>
       </a>
      ))}
     </div>
    </div>
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
     {/* Left Column */}
     <div>
      {/* Profile */}
      <Section title={data.sections.profile.title} accent={"#2563eb"}>
       <p
        className={
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }
        style={{ marginBottom: "0.75rem" }}
       >
        {data.sections.profile.content}
       </p>
      </Section>
      {/* Languages */}
      <Section title={data.sections.languages.title} accent={"#2563eb"}>
       <ul
        className={`list-disc pl-5 space-y-1 ${
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }`}
       >
        {data.sections.languages.items.map((item, index) => (
         <li key={index}>{item}</li>
        ))}
       </ul>
      </Section>
      {/* Education */}
      <Section title={data.sections.education.title} accent={"#2563eb"}>
       {data.sections.education.items.map((item, index) => (
        <div className="mb-6" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-2"
            : "text-gray-500 text-sm mb-2"
          }
         >
          {item.period}
         </p>
        </div>
       ))}
      </Section>
      {/* Experience */}
      <Section title={data.sections.experience.title} accent={"#2563eb"}>
       {data.sections.experience.items.map((item, index) => (
        <div
         className="mb-6 p-4 rounded-lg transition-shadow duration-300"
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200 text-lg"
            : "font-bold text-gray-800 text-lg"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-3"
            : "text-gray-500 text-sm mb-3"
          }
         >
          {item.period}
         </p>
         <ul
          className={
           isDarkBackground(selectedBg)
            ? "list-disc pl-5 space-y-2 text-gray-400"
            : "list-disc pl-5 space-y-2 text-gray-700"
          }
         >
          {item.details.map((detail, i) => (
           <li key={i} className="leading-snug">
            {detail}
           </li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Projects */}
      <Section title={data.sections.projects.title} accent={"#2563eb"}>
       {data.sections.projects.items.map((item, index) => (
        <div
         className={`mb-6 p-4 rounded-lg transition-shadow duration-300 `}
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200 text-lg"
            : "font-bold text-gray-800 text-lg"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 mb-3"
            : "text-gray-700 mb-3"
          }
         >
          {item.description}
         </p>
         <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center hover:underline transition-colors duration-200 
            text-[var(--accent)]`}
         >
          <FaExternalLinkAlt className="mr-1" />
          {item.link.text}
         </a>
        </div>
       ))}
      </Section>
      {/* Certifications */}
      <Section title={data.sections.certifications.title} accent={"#2563eb"}>
       {data.sections.certifications.items.map((item, index) => (
        <div
         className="mb-6 p-4 rounded-lg transition-shadow duration-300"
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.title}
         </h4>
         {item.examCode && (
          <p
           className={
            isDarkBackground(selectedBg)
             ? "text-gray-400 text-sm mb-2"
             : "text-gray-500 text-sm mb-2"
           }
          >
           {currentLang === "pt-br" ? "Código do exame" : "Exam code"}:{" "}
           {item.examCode}
          </p>
         )}
         <a
          href={item.linkCredly}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center hover:underline transition-colors duration-200 
            text-[var(--accent)]`}
         >
          <FaExternalLinkAlt className="mr-1" />
          {currentLang === "pt-br" ? "Ver credencial" : "View credential"}
         </a>
        </div>
       ))}
      </Section>
     </div>
     {/* Right Column */}
     <div>
      {/* Skills */}
      <Section title={data.sections.skills.title} accent={"#2563eb"}>
       {data.sections.skills.categories.map((category, index) => (
        <SkillCategory
         key={index}
         category={category}
         textClass={
          isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
         }
        />
       ))}
      </Section>
      {/* Interests */}
      <Section title={data.sections.interests.title} accent={"#2563eb"}>
       {data.sections.interests.categories.map((cat, index) => (
        <div className="mb-4" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-semibold text-gray-200 mb-2"
            : "font-semibold text-gray-700 mb-2"
          }
         >
          {cat.title}
         </h4>
         <ul
          className={
           isDarkBackground(selectedBg)
            ? "list-disc pl-5 space-y-1 text-gray-400"
            : "list-disc pl-5 space-y-1 text-gray-700"
          }
         >
          {cat.items.map((item, i) => (
           <li key={i}>{item}</li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Recommendations */}
      <Section title={data.sections.recommendations.title} accent={"#2563eb"}>
       {data.sections.recommendations.items.map((item, index) => (
        <div className="mb-6 rounded-r-lg" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.name}
         </h4>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "text-md text-gray-400 mb-2"
            : "text-md text-gray-600 mb-2"
          }
         >
          {item.position}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-3"
            : "text-gray-500 text-sm mb-3"
          }
         >
          {item.period}
         </p>
         <blockquote
          className={
           isDarkBackground(selectedBg)
            ? "italic text-gray-300"
            : "italic text-gray-700"
          }
          dangerouslySetInnerHTML={{ __html: item.text }}
         />
        </div>
       ))}
      </Section>
      {/* Awards */}
      <Section title={data.sections.awards.title} accent={"#2563eb"}>
       {data.sections.awards.items.map((item, index) => (
        <div
         className={`flex items-start gap-3 mb-4 p-3 rounded-lg transition-shadow duration-300 `}
         key={index}
        >
         <div className="flex space-x-2">
          <div>
           <FaAward className={"inline-block text-[var(--accent)]"} />
          </div>
          <div>
           <p
            className={
             isDarkBackground(selectedBg)
              ? "font-semibold text-gray-200"
              : "font-semibold text-gray-800"
            }
           >
            {item.title}
           </p>
           <p
            className={
             isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-600"
            }
           >
            {item.description}
           </p>
          </div>
         </div>
        </div>
       ))}
      </Section>
     </div>
    </div>
   </div>
   <div className="text-center my-8">
    <button className="font-semibold py-2 px-4 rounded" disabled>
     {data.buttons.generatePDF}
    </button>
   </div>
  </div>
 );
};

export default ResumePage;
