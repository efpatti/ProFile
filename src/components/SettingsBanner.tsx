"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/core/services/LanguageProvider";
import {
 Dialog,
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
import { usePalette } from "@/styles/PaletteProvider";
import { useAuth } from "@/core/services/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { LogoSearch } from "./LogoSearch";
import { FiX as CloseIcon, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

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

 const handleApplyChanges = async () => {
  if (!user) {
   setIsOpen(false);
   return;
  }

  setIsSaving(true);
  try {
   await updateDoc(doc(db, "users", user.uid), {
    palette,
    bannerColor: selectedBg,
    updatedAt: new Date().toISOString(),
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
    className="relative z-50"
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
        <Dialog.Panel className="relative bg-zinc-950 rounded-xl max-w-3xl w-full mx-4 p-6 shadow-2xl h-[600px] border border-zinc-800">
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
            { label: "Company Logo", icon: <ImageIcon /> },
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

           {/* Logo Panel */}
           <TabPanel>
            <div>
             <DialogItemTitle>Company</DialogItemTitle>
             <LogoSearch onLogoSelect={onLogoSelect} />
            </div>
           </TabPanel>

           {/* Editors Panel */}
           <TabPanel className="space-y-8">
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Skills
             </h3>
             {user && <SkillsEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Education
             </h3>
             {user && <EducationEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Languages
             </h3>
             {user && <LanguagesEditor lang={language} />}
            </div>
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
        </Dialog.Panel>
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
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-green-600/90 backdrop-blur-md p-6 text-white border border-green-500/30">
      <div className="flex items-center gap-3">
       <FiCheck className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Configurações salvas com sucesso!
       </Dialog.Title>
      </div>
     </Dialog.Panel>
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
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-red-600/90 backdrop-blur-md p-6 text-white border border-red-500/30">
      <div className="flex items-center gap-3">
       <FiAlertTriangle className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Erro ao salvar configurações
       </Dialog.Title>
      </div>
     </Dialog.Panel>
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
