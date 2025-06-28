// components/SettingsBanner.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { LogoSearch } from "./LogoSearch";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
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
import { isDarkBackground } from "@/utils/color";
import { FiImage as ImageIcon } from "react-icons/fi";
import { FaPaintRoller as PaintIcon } from "react-icons/fa";

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

 return (
  <>
   <FloatingActionButton
    icon={<SettingsIcon />}
    selectedBg={selectedBg}
    onClick={() => setIsOpen(true)}
    tooltipText="Configurações"
   />

   <AnimatePresence>
    {isOpen && (
     <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
     >
      <div className="flex items-center justify-center min-h-screen">
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 
        backdrop-blur-sm bg-black/30`}
       />

       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative
        bg-zinc-950
        rounded-xl max-w-2xl w-full mx-4 p-6 shadow-2xl h-[600px]`}
       >
        <DialogTitle
         className={`text-2xl font-bold text-gray-100
         mb-6`}
        >
         Configurações
        </DialogTitle>

        <TabGroup>
         <TabList className="flex space-x-1 mb-6">
          {[
           { label: "Your Information", icon: <ImageIcon /> },
           { label: "Appearance", icon: <PaintIcon /> },
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

         <TabPanels className="overflow-y-auto h-[410px] pr-2">
          {/* Your Information */}
          <TabPanel className="space-y-6">
           <div>
            <DialogItemTitle selectedBg={selectedBg}>Company</DialogItemTitle>
            <LogoSearch onLogoSelect={onLogoSelect} />
           </div>
          </TabPanel>

          {/* Appearance */}
          <TabPanel>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
             <DialogItemTitle selectedBg={selectedBg}>
              Banner Color
             </DialogItemTitle>
             <p className="text-sm text-gray-400 mb-3">
              Choose your header background
             </p>
             <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
             <DialogItemTitle selectedBg={selectedBg}>
              Color Palette
             </DialogItemTitle>
             <p className="text-sm text-gray-400 mb-3">
              Select application theme
             </p>
             <PaletteSelector bgName={selectedBg} />
            </div>
           </div>
          </TabPanel>
         </TabPanels>
        </TabGroup>

        <div className="mt-6 flex justify-end">
         <button
          onClick={() => setIsOpen(false)}
          className={`px-4 py-2 rounded-lg transition-colors 
            bg-zinc-800 hover:bg-zinc-800/50 hover:text-gray-300 text-white cursor-pointer
          `}
         >
          Apply Changes
         </button>
        </div>
       </motion.div>
      </div>
     </Dialog>
    )}
   </AnimatePresence>
  </>
 );
};

interface DialogItemTitleProps {
 children: React.ReactNode;
 selectedBg: BgBannerColorName;
}

const DialogItemTitle: React.FC<DialogItemTitleProps> = ({
 children,
 selectedBg,
}) => {
 return (
  <h3
   className={`text-lg font-semibold mb-1 ${
    isDarkBackground(selectedBg) ? "text-gray-100" : "text-gray-900"
   }`}
  >
   {children}
  </h3>
 );
};
