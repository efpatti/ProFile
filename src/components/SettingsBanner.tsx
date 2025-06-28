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
        className={`fixed inset-0 ${
         isDarkBackground(selectedBg) ? "bg-black/30" : "bg-white/30"
        }  backdrop-blur-sm`}
       />

       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className={`relative ${
         isDarkBackground(selectedBg) ? "bg-black" : "bg-white"
        } rounded-xl max-w-2xl w-full mx-4 p-6 shadow-2xl h-[600px]`}
       >
        <DialogTitle
         className={`text-2xl font-bold ${
          isDarkBackground(selectedBg) ? "text-gray-100" : "text-gray-900"
         } mb-4`}
        >
         Configurações
        </DialogTitle>

        <TabGroup>
         <TabList className="flex space-x-2 border-b border-gray-200 mb-4">
          {["Your Information", "Appearance"].map((label) => (
           <Tab
            key={label}
            className={({ selected }) =>
             clsx(
              "px-4 py-2 text-sm font-medium rounded-t-lg outline-none transition-colors ease-in-out duration-200 cursor-pointer",
              selected
               ? isDarkBackground(selectedBg)
                 ? "bg-gray-100 text-gray-900"
                 : "bg-gray-900 text-gray-100"
               : isDarkBackground(selectedBg)
               ? "text-gray-300 hover:bg-gray-100 hover:text-gray-900"
               : "text-gray-600 hover:bg-gray-900 hover:text-gray-100"
             )
            }
           >
            {label}
           </Tab>
          ))}
         </TabList>

         <TabPanels className="overflow-y-auto h-[410px]">
          {/* Your Information */}
          <TabPanel className="space-y-6">
           <div>
            <DialogItemTitle selectedBg={selectedBg}>
             Logo da Marca
            </DialogItemTitle>
            <LogoSearch onLogoSelect={onLogoSelect} />
           </div>
          </TabPanel>

          {/* Appearance */}
          <TabPanel className="flex justify-center">
           <div className="flex justify-between space-x-5">
            <div>
             <DialogItemTitle selectedBg={selectedBg}>
              Banner Color
             </DialogItemTitle>
             <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
            </div>

            <div>
             <DialogItemTitle selectedBg={selectedBg}>Pallete</DialogItemTitle>
             <PaletteSelector bgName={selectedBg} />
            </div>
           </div>
          </TabPanel>
         </TabPanels>
        </TabGroup>

        <div className="mt-6 flex justify-end">
         <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
         >
          Aplicar
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
   className={`text-lg font-medium $text-gray-800 mb-3 ${
    isDarkBackground(selectedBg) ? "text-gray-100" : "text-gray-900"
   }`}
  >
   {children}
  </h3>
 );
};
