"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/core/services/LanguageProvider";
import {
 Dialog,
 DialogPanel,
 DialogTitle,
 Tab,
 TabGroup,
 TabList,
 TabPanel,
 TabPanels,
} from "@headlessui/react";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoGear as SettingsIcon } from "react-icons/go";
import clsx from "clsx";
import { FiImage as ImageIcon, FiEdit3 as EditIcon } from "react-icons/fi";
import { FaPaintRoller as PaintIcon } from "react-icons/fa";
import { usePalette } from "@/styles/pallete_provider";
import { useAuth } from "@/core/services/AuthProvider";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { LogoSearch } from "./LogoSearch";
import { FiX as CloseIcon, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { BgBannerColorName } from "@/styles/shared_style_constants";

const LazySkeleton = () => (
 <div className="animate-pulse space-y-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
  <div className="h-4 w-40 bg-zinc-700/60 rounded" />
  <div className="h-3 w-3/4 bg-zinc-700/40 rounded" />
  <div className="h-3 w-2/3 bg-zinc-700/30 rounded" />
 </div>
);

const SkillsEditor = dynamic(() => import("./SkillsEditor"), {
 loading: () => <LazySkeleton />,
 ssr: false,
});
const ExperienceEditor = dynamic(() => import("./ExperienceEditor"), {
 loading: () => <LazySkeleton />,
 ssr: false,
});
const EducationEditor = dynamic(() => import("./EducationEditor"), {
 loading: () => <LazySkeleton />,
 ssr: false,
});
const LanguagesEditor = dynamic(() => import("./LanguagesEditor"), {
 loading: () => <LazySkeleton />,
 ssr: false,
});

interface SettingsBannerProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect: (url: string) => void;
}

export const SettingsBanner: React.FC<SettingsBannerProps> = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
}) => {
 const [isOpen, setIsOpen] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
 const [showError, setShowError] = useState(false);
 const { palette, setPalette } = usePalette();
 const { user } = useAuth();
 const { language } = useLanguage();
 const [openSections, setOpenSections] = useState<Record<string, boolean>>({
  skills: true,
 });

 const toggleSection = useCallback((key: string) => {
  setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
 }, []);

 const expandAll = useCallback(() => {
  setOpenSections({
   skills: true,
   experience: true,
   education: true,
   languages: true,
  });
 }, []);
 const collapseAll = useCallback(() => {
  setOpenSections({});
 }, []);

 const handleApplyChanges = async () => {
  if (!user) {
   setIsOpen(false);
   return;
  }

  setIsSaving(true);
  try {
   await fetch("/api/user/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     palette,
     bannerColor: selectedBg,
    }),
   });

   setShowSuccess(true);
   setTimeout(() => {
    setShowSuccess(false);
    setIsOpen(false);
   }, 1500);
  } catch (error) {
   console.error("[SettingsBanner] handleApplyChanges error", error);
   setShowError(true);
   setTimeout(() => setShowError(false), 3000);
  } finally {
   setIsSaving(false);
  }
 };

 return (
  <>
   <FloatingActionButton
    icon={<SettingsIcon />}
    selectedBg={selectedBg}
    onClick={() => setIsOpen(true)}
    tooltipText="Configurações"
   />

   <Dialog
    open={isOpen}
    onClose={() => setIsOpen(false)}
    className="relative z-50 custom-organic-scroll"
   >
    <AnimatePresence>
     {isOpen && (
      <>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
       />

       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-0 flex items-center justify-center p-4"
       >
        <DialogPanel className="relative bg-zinc-950 rounded-xl max-w-3xl w-full mx-4 p-6 shadow-2xl h-[600px] border border-zinc-800">
         <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-1 rounded-full text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Fechar configurações"
         >
          <CloseIcon size={20} />
         </button>

         <DialogTitle className="text-2xl font-bold text-gray-100 mb-6">
          Configurações
         </DialogTitle>

         <TabGroup>
          <TabList className="flex space-x-1 mb-6">
           {[
            { label: "Appearance", icon: <PaintIcon /> },
            { label: "Edit Content", icon: <EditIcon /> },
           ].map(({ label, icon }) => (
            <Tab
             key={label}
             className={({ selected }) =>
              clsx(
               "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg outline-none transition-all duration-200",
               selected
                ? "bg-zinc-800 text-white"
                : "text-gray-300 hover:bg-zinc-800/50"
              )
             }
            >
             {icon}
             {label}
            </Tab>
           ))}
          </TabList>

          <TabPanels className="h-[410px] overflow-y-auto pr-2">
           {/* Appearance Panel */}
           <TabPanel className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Banner Color</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Choose your header background
              </p>
              <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
             </div>

             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Color Palette</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Select application theme
              </p>
              <PaletteSelector
               bgName={selectedBg}
               selected={palette}
               onSelect={setPalette}
              />
             </div>
            </div>
           </TabPanel>
           {/* Editors Panel */}
           <TabPanel className="space-y-6" unmount>
            <div className="flex justify-end gap-2 mb-2">
             <button
              onClick={expandAll}
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300"
             >
              {language === "pt-br" ? "Expandir" : "Expand"}
             </button>
             <button
              onClick={collapseAll}
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300"
             >
              {language === "pt-br" ? "Recolher" : "Collapse"}
             </button>
            </div>
            <ContentSection
             id="current-company"
             title={language === "pt-br" ? "Empresa Atual" : "Current Company"}
             open={!!openSections.currentCompany}
             onToggle={() => toggleSection("currentCompany")}
            >
             <LogoSearch onLogoSelect={onLogoSelect} />
            </ContentSection>
            <ContentSection
             id="skills"
             title={language === "pt-br" ? "Habilidades" : "Skills"}
             open={!!openSections.skills}
             onToggle={() => toggleSection("skills")}
            >
             {user && openSections.skills && <SkillsEditor lang={language} />}
            </ContentSection>
            <ContentSection
             id="experience"
             title={language === "pt-br" ? "Experiência" : "Experience"}
             open={!!openSections.experience}
             onToggle={() => toggleSection("experience")}
            >
             {user && openSections.experience && (
              <ExperienceEditor lang={language} />
             )}
            </ContentSection>
            <ContentSection
             id="education"
             title={language === "pt-br" ? "Educação" : "Education"}
             open={!!openSections.education}
             onToggle={() => toggleSection("education")}
            >
             {user && openSections.education && (
              <EducationEditor lang={language} />
             )}
            </ContentSection>
            <ContentSection
             id="languages"
             title={language === "pt-br" ? "Idiomas" : "Languages"}
             open={!!openSections.languages}
             onToggle={() => toggleSection("languages")}
            >
             {user && openSections.languages && (
              <LanguagesEditor lang={language} />
             )}
            </ContentSection>
           </TabPanel>
          </TabPanels>
         </TabGroup>

         <div className="mt-6 flex justify-end">
          <button
           onClick={handleApplyChanges}
           disabled={isSaving}
           className={`px-4 py-2 rounded-lg transition-colors 
                        bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                        ${isSaving ? "opacity-70 cursor-not-allowed" : ""}
                        flex items-center gap-2`}
          >
           {isSaving ? (
            <>
             <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
             >
              <circle
               className="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
              ></circle>
              <path
               className="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
             </svg>
             Salvando...
            </>
           ) : (
            "Aplicar Alterações"
           )}
          </button>
         </div>
        </DialogPanel>
       </motion.div>
      </>
     )}
    </AnimatePresence>
   </Dialog>

   {/* Diálogo de Sucesso */}
   <Dialog
    open={showSuccess}
    onClose={() => setShowSuccess(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <DialogPanel className="w-full max-w-sm rounded-xl bg-green-600/90 backdrop-blur-md p-6 text-white border border-green-500/30">
      <div className="flex items-center gap-3">
       <FiCheck className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Configurações salvas com sucesso!
       </Dialog.Title>
      </div>
     </DialogPanel>
    </motion.div>
   </Dialog>

   {/* Diálogo de Erro */}
   <Dialog
    open={showError}
    onClose={() => setShowError(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <DialogPanel className="w-full max-w-sm rounded-xl bg-red-600/90 backdrop-blur-md p-6 text-white border border-red-500/30">
      <div className="flex items-center gap-3">
       <FiAlertTriangle className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Erro ao salvar configurações
       </Dialog.Title>
      </div>
     </DialogPanel>
    </motion.div>
   </Dialog>
  </>
 );
};

interface DialogItemTitleProps {
 children: React.ReactNode;
}

const DialogItemTitle: React.FC<DialogItemTitleProps> = ({ children }) => {
 return (
  <h3 className={`text-lg font-semibold mb-1 text-gray-100`}>{children}</h3>
 );
};

interface ContentSectionProps {
 id: string;
 title: string;
 open: boolean;
 onToggle: () => void;
 children: React.ReactNode;
}

const ContentSection = ({
 id,
 title,
 open,
 onToggle,
 children,
}: ContentSectionProps) => {
 return (
  <section
   id={id}
   className="border border-zinc-800/60 rounded-lg overflow-hidden bg-zinc-900/40 backdrop-blur-sm"
  >
   <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-200 hover:bg-zinc-800/70 transition-colors"
   >
    <span>{title}</span>
    <svg
     className={`h-4 w-4 transition-transform ${
      open ? "rotate-180" : "rotate-0"
     }`}
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     viewBox="0 0 24 24"
    >
     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
   </button>
   <motion.div
    initial={false}
    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="overflow-hidden"
   >
    <div className="p-4 space-y-4">{children}</div>
   </motion.div>
  </section>
 );
};
