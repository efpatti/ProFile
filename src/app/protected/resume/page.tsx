"use client";

import React, { useState, useEffect } from "react";
import Section from "@/components/Section";
import SkillCategory from "@/components/SkillCategory";
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
import dynamic from "next/dynamic";
const SettingsShell = dynamic(
 () => import("@/components/SettingsShell").then((m) => m.SettingsShell),
 { ssr: false, loading: () => null }
);
import { usePalette } from "@/styles/PaletteProvider";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/core/services/LanguageProvider";
import { Button } from "@/shared/components/Button";
import useResumeStore from "@/core/store/useResumeStore";

const defaultBg: BgBannerColorName = "midnightSlate";

const ResumePage: React.FC = () => {
 const searchParams = useSearchParams();
 const paletteFromQuery = searchParams
  ? (searchParams.get("palette") as PaletteName | null)
  : null;
 const bannerColorFromQuery = searchParams
  ? (searchParams.get("bannerColor") as BgBannerColorName | null)
  : null;
 const forcedUserId = searchParams ? searchParams.get("user") : null;
 const { language, toggleLanguage } = useLanguage();
 // const [data, setData] = useState(resumeData["pt-br"]);
 const [isClient, setIsClient] = useState(false);
 const [paletteName] = useState<PaletteName>(defaultPalette);
 const { bannerColor, palette, setPalette, setBannerColor } = usePalette();
 const [selectedBg, setSelectedBg] = useState<BgBannerColorName>(
  bannerColorFromQuery || bannerColor || defaultBg
 );
 const { user } = useAuth();
 const effectiveUserId = forcedUserId || user?.id || undefined;
 const [displayName, setDisplayName] = useState<string | undefined>(
  user?.displayName || undefined
 );
 const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>(
  undefined
 );
 const [header, setHeader] = useState<{
  name: string;
  title: string;
  email: string;
  subtitle?: string;
  contacts?: any[];
 } | null>(null);
 const [experience, setExperience] = useState<any[]>();
 const [skills, setSkills] = useState<any[]>();
 const [profile, setProfile] = useState<any>();
 const [languages, setLanguages] = useState<{
  title: string;
  items: string[];
 }>();
 const [education, setEducation] = useState<any[]>();
 const [projects, setProjects] = useState<any[]>();
 const [certifications, setCertifications] = useState<any[]>();
 const [interests, setInterests] = useState<any[]>();
 const [recommendations, setRecommendations] = useState<any[]>();
 const [awards, setAwards] = useState<any[]>();

 // Loading flags for reliable export readiness
 const [skillsLoaded, setSkillsLoaded] = useState(false);
 const [experienceLoaded, setExperienceLoaded] = useState(false);
 const [languagesLoaded, setLanguagesLoaded] = useState(false);
 const [educationLoaded, setEducationLoaded] = useState(false);
 const [projectsLoaded, setProjectsLoaded] = useState(false);
 const [certificationsLoaded, setCertificationsLoaded] = useState(false);
 const [interestsLoaded, setInterestsLoaded] = useState(false);
 const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);
 const [awardsLoaded, setAwardsLoaded] = useState(false);
 const [userLoaded, setUserLoaded] = useState(false);
 const [ready, setReady] = useState(false);

 useEffect(() => {
  const allLoaded =
   skillsLoaded &&
   experienceLoaded &&
   languagesLoaded &&
   educationLoaded &&
   projectsLoaded &&
   certificationsLoaded &&
   interestsLoaded &&
   recommendationsLoaded &&
   awardsLoaded &&
   userLoaded;
  setReady(allLoaded);
 }, [
  skillsLoaded,
  experienceLoaded,
  languagesLoaded,
  educationLoaded,
  projectsLoaded,
  certificationsLoaded,
  interestsLoaded,
  recommendationsLoaded,
  awardsLoaded,
  userLoaded,
 ]);

 useEffect(() => {
  setIsClient(true);
 }, [language]);

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

 // --- PDF/DOCX Handlers (migrated to server-side export via /api/resume/export) ---
 // Os handlers antigos (html2pdf/jspdf/pdf-lib) foram removidos para evitar dependências pesadas.
 // Utilize a rota /api/resume/export para gerar arquivos com qualidade consistente.

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 const {
  loadResume,
  skills: storeSkills,
  experiences: storeExperience,
  education: storeEducation,
  languages: storeLanguages,
  projects: storeProjects,
  certifications: storeCertifications,
  interests: storeInterests,
  recommendations: storeRecommendations,
  awards: storeAwards,
  profile: storeProfile,
  header: storeHeader,
  isLoading: resumeLoading,
 } = useResumeStore();

 // Trigger aggregated load (id + language) when dependencies change
 useEffect(() => {
  if (effectiveUserId) {
   loadResume(effectiveUserId);
  }
 }, [effectiveUserId, loadResume]);

 // Derive grouped skills from store
 useEffect(() => {
  if (!storeSkills) return;
  const grouped = storeSkills.reduce(
   (
    acc: Record<string, { title: string; items: string[] }>,
    { category, name = "" }
   ) => {
    if (!acc[category]) acc[category] = { title: category, items: [] };
    acc[category].items.push(name ?? "");
    return acc;
   },
   {} as Record<string, { title: string; items: string[] }>
  );
  const ordered = [...new Set(storeSkills.map((s) => s.category))].map(
   (c) => grouped[c]
  );
  setSkills(ordered);
  if (!resumeLoading) setSkillsLoaded(true);
 }, [storeSkills, resumeLoading]);

 // Sync experience from store
 useEffect(() => {
  if (storeExperience) {
   setExperience(storeExperience);
   if (!resumeLoading) setExperienceLoaded(true);
  }
 }, [storeExperience, resumeLoading]);

 // Sync education from store
 useEffect(() => {
  if (storeEducation) {
   setEducation(storeEducation);
   if (!resumeLoading) setEducationLoaded(true);
  }
 }, [storeEducation, resumeLoading]);

 // Sync languages from store
 useEffect(() => {
  if (storeLanguages) {
   setLanguages({
    title: "Languages",
    items: storeLanguages,
   });
   if (!resumeLoading) setLanguagesLoaded(true);
  }
 }, [storeLanguages, resumeLoading]);

 // Sync projects from store
 useEffect(() => {
  if (storeProjects) {
   setProjects(storeProjects);
   if (!resumeLoading) setProjectsLoaded(true);
  }
 }, [storeProjects, resumeLoading]);

 // Sync certifications from store
 useEffect(() => {
  if (storeCertifications) {
   setCertifications(storeCertifications);
   if (!resumeLoading) setCertificationsLoaded(true);
  }
 }, [storeCertifications, resumeLoading]);

 // Sync interests from store
 useEffect(() => {
  if (storeInterests && storeInterests.items) {
   // Converter array simples para formato com categorias
   setInterests([
    {
     title: "Interests",
     items: storeInterests.items,
    },
   ]);
   if (!resumeLoading) setInterestsLoaded(true);
  }
 }, [storeInterests, resumeLoading]);

 // Sync recommendations from store
 useEffect(() => {
  if (storeRecommendations) {
   setRecommendations(storeRecommendations);
   if (!resumeLoading) setRecommendationsLoaded(true);
  }
 }, [storeRecommendations, resumeLoading]);

 // Sync awards from store
 useEffect(() => {
  if (storeAwards) {
   setAwards(storeAwards);
   if (!resumeLoading) setAwardsLoaded(true);
  }
 }, [storeAwards, resumeLoading]);

 // Sync profile from store
 useEffect(() => {
  if (storeProfile !== undefined) {
   setProfile(storeProfile);
  }
 }, [storeProfile]);

 // Sync header from store
 useEffect(() => {
  if (storeHeader !== undefined) {
   setHeader(storeHeader);
  }
 }, [storeHeader]);

 useEffect(() => {
  if (!effectiveUserId) return;
  const uid = effectiveUserId;

  setSkillsLoaded(false);
  setExperienceLoaded(false);
  setLanguagesLoaded(false);
  setEducationLoaded(false);
  setProjectsLoaded(false);
  setCertificationsLoaded(false);
  setInterestsLoaded(false);
  setRecommendationsLoaded(false);
  setAwardsLoaded(false);
  setUserLoaded(false);

  const fetchTopLevelUser = async () => {
   try {
    // Buscar dados do usuário via API
    const response = await fetch("/api/user/preferences");
    if (response.ok) {
     const data = await response.json();
     const fromDoc =
      (typeof data.displayName === "string" && data.displayName.trim()) ||
      undefined;
     if (fromDoc) setDisplayName(fromDoc);
    }
   } catch (e) {
    console.error("Error fetching user data:", e);
   } finally {
    setUserLoaded(true);
   }
  };

  const fetchProfile = async () => {
   if (storeProfile !== undefined) setProfile(storeProfile);
  };

  const fetchHeader = async () => {
   if (storeHeader !== undefined) setHeader(storeHeader);
  };

  const fetchCertifications = async () => {
   // moved to store; keep compatibility for any legacy callers
   if (storeCertifications) {
    setCertifications(storeCertifications);
    setCertificationsLoaded(true);
   }
  };

  const fetchInterests = async () => {
   if (storeInterests && storeInterests.items) {
    setInterests([
     {
      title: "Interests",
      items: storeInterests.items,
     },
    ]);
    setInterestsLoaded(true);
   }
  };

  const fetchRecommendations = async () => {
   if (storeRecommendations) {
    setRecommendations(storeRecommendations);
    setRecommendationsLoaded(true);
   }
  };

  const fetchAwards = async () => {
   if (storeAwards) {
    setAwards(storeAwards);
    setAwardsLoaded(true);
   }
  };

  fetchTopLevelUser();
  fetchProfile();
  fetchCertifications();
  fetchInterests();
  fetchRecommendations();
  fetchAwards();
  fetchHeader();
 }, [effectiveUserId, language]);

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

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

 // Add handler for background selection
 const handleSelectBg = (bg: BgBannerColorName) => setSelectedBg(bg);

 if (!isClient) {
  return null;
 }

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <Button variant="outline" size="sm" onClick={toggleLanguage} full={false}>
     {language === "pt-br" ? "PT" : "EN"}
    </Button>
   </div>
   <div
    className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
    style={{ background: effectiveBgColor.bg }}
    id="resume"
    data-ready={ready ? "1" : "0"}
   >
    {/* Shared settings panel for bg/logo/download */}
    <SettingsShell
     selectedBg={selectedBg}
     onSelectBg={handleSelectBg}
     logoUrl={currentLogoUrl}
     onLogoSelect={setCurrentLogoUrl}
     showDownloadButton={true}
     position="right"
     downloadType="resume"
    />
    {/* Header */}
    <div className="p-8 bg-[var(--accent)] text-white">
     <h1 className="text-3xl font-bold mb-2">
      {displayName || user?.displayName || "Seu Nome"}
     </h1>
     <h2 className="text-xl opacity-90 mb-6">
      {header?.subtitle || "Título Profissional"}
     </h2>
     <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
      {(header?.contacts || []).map((contact: any) => (
       <a
        key={contact.text}
        href={contact.href}
        className="flex items-center gap-2 hover:underline transition-colors duration-200 text-sm text-white"
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
      <Section title={profile?.title || "Profile"} accent={"#2563eb"}>
       <p
        className={`${
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        } perfect-justify`}
        style={{ marginBottom: "0.75rem" }}
       >
        {profile?.content || "erro"}
       </p>
      </Section>
      {/* Languages */}
      <Section title={languages?.title || "Languages"} accent={"#2563eb"}>
       <ul
        className={`list-disc pl-7 space-y-1  ${
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }`}
       >
        {(languages?.items || []).map((item, index) => (
         <li key={index}>{item}</li>
        ))}
       </ul>
      </Section>
      {/* Education */}
      <Section title={"Educação"} accent={"#2563eb"}>
       {(education || []).map((item, index) => (
        <div className="p-2" key={index}>
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
      <Section title={"Experiência"} accent={"#2563eb"}>
       {(experience || []).map((item: any, index: number) => (
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
          {item.title} - {item.company}
          {item.locate ? `, ${item.locate}` : ""}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-3"
            : "text-gray-500 text-sm mb-3"
          }
         >
          {item.periodDisplay}
         </p>
         {Array.isArray(item.details) && item.details.length > 0 ? (
          <ul
           className={
            isDarkBackground(selectedBg)
             ? "list-disc pl-5 space-y-2 text-gray-400"
             : "list-disc pl-5 space-y-2 text-gray-700"
           }
          >
           {item.details.map((detail: string, i: number) => (
            <li key={i} className="perfect-justify">
             {detail}
            </li>
           ))}
          </ul>
         ) : (
          <p
           className={
            isDarkBackground(selectedBg) ? "text-gray-300" : "text-gray-700"
           }
          >
           {item.description}
          </p>
         )}
        </div>
       ))}
      </Section>
      {/* Recommendations (moved here from right column) */}
      <Section title={"Recomendações"} accent={"#2563eb"}>
       {(recommendations || []).map((item: any, index: number) => (
        <div className="mb-6 p-4 rounded-r-lg" key={index}>
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
            ? "italic text-gray-300 perfect-justify"
            : "italic text-gray-700 perfect-justify"
          }
          dangerouslySetInnerHTML={{ __html: item.text }}
         />
        </div>
       ))}
      </Section>

      {/* Certifications (kept abaixo da seção trocada) */}
      <Section title={"Certificações"} accent={"#2563eb"}>
       {(certifications || []).map((item: any, index: number) => (
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
           {language === "pt-br" ? "Código do exame" : "Exam code"}:{" "}
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
          {language === "pt-br" ? "Ver credencial" : "View credential"}
         </a>
        </div>
       ))}
      </Section>
     </div>
     {/* Right Column */}
     <div>
      {/* Skills */}
      <Section title={"Habilidades"} accent={"#2563eb"}>
       {(skills || []).map((category: any, index: number) => (
        <SkillCategory
         key={index}
         category={category}
         textClass={
          isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
         }
        />
       ))}
      </Section>
      {/* Projects (moved here from left column) */}
      <Section title={"Projetos"} accent={"#2563eb"}>
       {(projects || []).map((item: any, index: number) => (
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
            ? "text-gray-400 mb-3 perfect-justify"
            : "text-gray-700 mb-3 perfect-justify"
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
      {/* Interests (moved here from left column) */}
      <Section title={"Interesses"} accent={"#2563eb"}>
       {(interests || []).map((cat: any, index: number) => (
        <div className="mb-4 p-4" key={index}>
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
          {(cat.items || []).map((item: any, i: number) => (
           <li key={i}>{item}</li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Awards (restored) */}
      <Section title={"Prêmios"} accent={"#2563eb"}>
       {(awards || []).map((item: any, index: number) => (
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
  </div>
 );
};

export default ResumePage;
