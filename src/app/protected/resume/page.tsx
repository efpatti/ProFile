"use client";

import React, { useState, useEffect } from "react";
import Section from "@/components/Section";
import SkillCategory from "@/components/SkillCategory";
// import { resumeData } from "@/data/resumeData";
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
// import { SettingsPanel } from "@/components/SettingsPanel";
import dynamic from "next/dynamic";
const SettingsPanel = dynamic(
 () => import("@/components/SettingsPanel").then((m) => m.SettingsPanel),
 { ssr: false, loading: () => null }
);
import { usePalette } from "@/styles/PaletteProvider";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/core/services/LanguageProvider";
import {
 getDoc,
 doc,
 collection,
 query,
 where,
 getDocs,
 orderBy,
 limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import useSWR from "swr";
import { fetchSkillsForUser } from "@/core/services/SkillsService";

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
 const effectiveUserId = forcedUserId || user?.uid || undefined;
 const [displayName, setDisplayName] = useState<string | undefined>(
  user?.displayName || undefined
 );
 const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>(
  undefined
 );
 const [header, setHeader] = useState<{
  subtitle: string;
  contacts: any[];
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
 const [profileLoaded, setProfileLoaded] = useState(false);
 const [headerLoaded, setHeaderLoaded] = useState(false);
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
   profileLoaded &&
   headerLoaded &&
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
  profileLoaded,
  headerLoaded,
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

 // SWR cache for skills (no real-time needed)
 const { data: rawSkills } = useSWR(
  effectiveUserId ? ["skills", effectiveUserId, language] : null,
  () => fetchSkillsForUser(effectiveUserId!, language, 50),
  { revalidateOnFocus: false }
 );

 useEffect(() => {
  if (!rawSkills) return;
  // Agrupa e ordena por categoria
  const grouped = rawSkills.reduce((acc, { category, item }) => {
   if (!acc[category]) acc[category] = { title: category, items: [] };
   acc[category].items.push(item);
   return acc;
  }, {} as Record<string, { title: string; items: string[] }>);
  const orderedCategories = [...new Set(rawSkills.map((s) => s.category))];
  const formatted = orderedCategories.map((c) => grouped[c]);
  setSkills(formatted);
  setSkillsLoaded(true);
 }, [rawSkills]);

 useEffect(() => {
  if (!effectiveUserId) return;
  const uid = effectiveUserId;

  // Reset flags on dependency change
  setSkillsLoaded(false);
  setProfileLoaded(false);
  setHeaderLoaded(false);
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
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
     const data = userSnap.data() as any;
     const fromDoc =
      (typeof data.name === "string" && data.name.trim()) ||
      (typeof data.displayName === "string" && data.displayName.trim()) ||
      undefined;
     if (fromDoc) setDisplayName(fromDoc);
    }
   } catch (e) {
    console.error("Error fetching top-level user doc:", e);
   } finally {
    setUserLoaded(true);
   }
  };

  const fetchProfile = async () => {
   try {
    const profileRef = doc(db, "users", uid, "profile", language);
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
     setProfile(docSnap.data());
    } else {
     console.log("No such document!");
    }
   } finally {
    setProfileLoaded(true);
   }
  };

  const fetchHeader = async () => {
   try {
    const headerDocRef = doc(db, "users", uid, "header", language);
    const headerDocSnap = await getDoc(headerDocRef);

    let subtitle = "";
    if (headerDocSnap.exists()) {
     subtitle = headerDocSnap.data().subtitle || "";
    }

    const contactsColRef = collection(
     db,
     "users",
     uid,
     "header",
     language,
     "contacts"
    );
    const q = query(contactsColRef);
    const contactsSnapshot = await getDocs(q);
    const contacts = contactsSnapshot.docs.map((doc) => doc.data());

    setHeader({ subtitle, contacts });
   } catch (error) {
    console.error("Error fetching header:", error);
    setHeader(null); // Reset on error
   } finally {
    setHeaderLoaded(true);
   }
  };

  const fetchExperience = async () => {
   try {
    const experienceRef = collection(db, "users", uid, "experience");
    const q = query(
     experienceRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const experienceData = querySnapshot.docs.map((doc) => doc.data());
     setExperience(experienceData);
    } else {
     console.log("No experience documents found!");
     setExperience([]);
    }
   } finally {
    setExperienceLoaded(true);
   }
  };

  const fetchLanguages = async () => {
   try {
    const langDocRef = doc(db, "users", uid, "languages", language);
    const docSnap = await getDoc(langDocRef);

    if (docSnap.exists()) {
     const data = docSnap.data();
     setLanguages({
      title: data.title || "Idiomas",
      items: data.items || [],
     });
    } else {
      console.log("No languages document found!");
      setLanguages({ title: "Idiomas", items: [] });
    }
   } finally {
    setLanguagesLoaded(true);
   }
  };

  const fetchEducation = async () => {
   try {
    const educationRef = collection(db, "users", uid, "education");
    const q = query(
     educationRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const educationData = querySnapshot.docs.map((doc) => doc.data());
     setEducation(educationData);
    } else {
     console.log("No education documents found!");
     setEducation([]);
    }
   } finally {
    setEducationLoaded(true);
   }
  };

  const fetchProjects = async () => {
   try {
    const projectsRef = collection(db, "users", uid, "projects");
    const q = query(
     projectsRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const projectsData = querySnapshot.docs.map((doc) => doc.data());
     setProjects(projectsData);
    } else {
     console.log("No projects documents found!");
     setProjects([]);
    }
   } finally {
    setProjectsLoaded(true);
   }
  };

  const fetchCertifications = async () => {
   try {
    const certificationsRef = collection(db, "users", uid, "certifications");
    const q = query(
     certificationsRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const certificationsData = querySnapshot.docs.map((doc) => doc.data());
     setCertifications(certificationsData);
    } else {
     console.log("No certifications documents found!");
     setCertifications([]);
    }
   } finally {
    setCertificationsLoaded(true);
   }
  };

  const fetchInterests = async () => {
   try {
    const interestsRef = collection(db, "users", uid, "interests");
    const q = query(
     interestsRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(100)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const interestsData = querySnapshot.docs.map(
      (doc) => doc.data() as { category: string; item: string; order: number }
     );

     const groupedInterests = interestsData.reduce((acc, interest) => {
      if (!acc[interest.category]) {
       acc[interest.category] = [];
      }
      acc[interest.category].push(interest.item);
      return acc;
     }, {} as Record<string, string[]>);

     const formattedInterests = Object.entries(groupedInterests)
      .map(([title, items]) => ({
       title,
       items,
      }))
      .sort((a, b) => {
       const orderA =
        interestsData.find((s) => s.category === a.title)?.order || 0;
       const orderB =
        interestsData.find((s) => s.category === b.title)?.order || 0;
       return orderA - orderB;
      });

     setInterests(formattedInterests);
    } else {
     console.log("No interests documents found!");
     setInterests([]);
    }
   } finally {
    setInterestsLoaded(true);
   }
  };

  const fetchRecommendations = async () => {
   try {
    const recommendationsRef = collection(db, "users", uid, "recommendations");
    const q = query(
     recommendationsRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const recommendationsData = querySnapshot.docs.map((doc) => doc.data());
     setRecommendations(recommendationsData);
    } else {
     console.log("No recommendations documents found!");
     setRecommendations([]);
    }
   } finally {
    setRecommendationsLoaded(true);
   }
  };

  const fetchAwards = async () => {
   try {
    const awardsRef = collection(db, "users", uid, "awards");
    const q = query(
     awardsRef,
     where("language", "==", language),
     orderBy("order", "asc"),
     limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const awardsData = querySnapshot.docs.map((doc) => doc.data());
     setAwards(awardsData);
    } else {
     console.log("No awards documents found!");
     setAwards([]);
    }
   } finally {
    setAwardsLoaded(true);
   }
  };

  fetchTopLevelUser();
  fetchProfile();
  fetchExperience();
  fetchLanguages();
  fetchEducation();
  fetchProjects();
  fetchCertifications();
  fetchInterests();
  fetchRecommendations();
  fetchAwards();
  fetchHeader();
 }, [effectiveUserId, language]);

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

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

 // Add handler for background selection
 const handleSelectBg = (bg: BgBannerColorName) => setSelectedBg(bg);

 // --- PDF Handlers ---
 const handleGeneratePDFPuppeteer = () => {
  window.open(
   `/api/download-resume?palette=${palette}&lang=${language}&bannerColor=${selectedBg}${
    effectiveUserId ? `&user=${effectiveUserId}` : ""
   }`,
   "_blank"
  );
 };

 const handleGeneratePDFHtml2Pdf = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // @ts-ignore
  const html2pdf = (await import("html2pdf.js")).default;
  html2pdf().from(el).save("resume-html2pdf.pdf");
 };

 const handleGeneratePDFJsPDF = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // Cria um clone do elemento para manipular as cores
  const clone = el.cloneNode(true) as HTMLElement;
  // Substitui oklch() por #fff (ou outra cor fallback)
  const replaceOklch = (node: HTMLElement) => {
   if (node.style) {
    if (node.style.background && node.style.background.includes("oklch")) {
     node.style.background = "#fff";
    }
    if (node.style.color && node.style.color.includes("oklch")) {
     node.style.color = "#222";
    }
   }
   Array.from(node.children).forEach((child) =>
    replaceOklch(child as HTMLElement)
   );
  };
  replaceOklch(clone);
  document.body.appendChild(clone);
  const { jsPDF } = await import("jspdf");
  // @ts-ignore
  await doc.html(clone, {
   callback: function (doc: any) {
    doc.save("resume-jspdf.pdf");
    clone.remove();
   },
  });
 };

 const handleGeneratePDFPdfLib = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // Cria um clone do elemento para manipular as cores
  const clone = el.cloneNode(true) as HTMLElement;
  // Substitui oklch() por #fff (ou outra cor fallback)
  const replaceOklch = (node: HTMLElement) => {
   if (node.style) {
    if (node.style.background && node.style.background.includes("oklch")) {
     node.style.background = "#fff";
    }
    if (node.style.color && node.style.color.includes("oklch")) {
     node.style.color = "#222";
    }
   }
   Array.from(node.children).forEach((child) =>
    replaceOklch(child as HTMLElement)
   );
  };
  replaceOklch(clone);
  document.body.appendChild(clone);
  const { PDFDocument } = await import("pdf-lib");
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(clone);
  const imgData = canvas.toDataURL("image/png");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([canvas.width, canvas.height]);
  const pngImage = await pdfDoc.embedPng(imgData);
  page.drawImage(pngImage, {
   x: 0,
   y: 0,
   width: canvas.width,
   height: canvas.height,
  });
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-pdflib.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  clone.remove();
  URL.revokeObjectURL(url);
 };

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 if (!isClient) {
  return null;
 }

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <button
     className={`font-semibold py-2 px-4 cursor-pointer rounded transition-colors duration-200 text-white rounded-md ${btnClasses}`}
     onClick={toggleLanguage}
    >
     {language === "pt-br" ? "PT" : "EN"}
    </button>
   </div>
   <div
    className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
    style={{ background: effectiveBgColor.bg }}
    id="resume"
    data-ready={ready ? "1" : "0"}
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
        className={
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }
        style={{ marginBottom: "0.75rem" }}
       >
        {profile?.content || "erro"}
       </p>
      </Section>
      {/* Languages */}
      <Section title={languages?.title || "Languages"} accent={"#2563eb"}>
       <ul
        className={`list-disc pl-5 space-y-1 ${
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }`}
       >
        {(languages?.items || []).map((item, index) => (
         <li key={index}>{item}</li>
        ))}
       </ul>
      </Section>
      {/* Education */}
      <Section title={"Education"} accent={"#2563eb"}>
       {(education || []).map((item, index) => (
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
      <Section title={"Experience"} accent={"#2563eb"}>
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
          {(item.details || []).map((detail: any, i: number) => (
           <li key={i} className="leading-snug">
            {detail}
           </li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Projects */}
      <Section title={"Projects"} accent={"#2563eb"}>
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
      <Section title={"Certifications"} accent={"#2563eb"}>
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
      <Section title={"Skills"} accent={"#2563eb"}>
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
      {/* Interests */}
      <Section title={"Interests"} accent={"#2563eb"}>
       {(interests || []).map((cat: any, index: number) => (
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
          {(cat.items || []).map((item: any, i: number) => (
           <li key={i}>{item}</li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Recommendations */}
      <Section title={"Recommendations"} accent={"#2563eb"}>
       {(recommendations || []).map((item: any, index: number) => (
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
      <Section title={"Awards"} accent={"#2563eb"}>
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
