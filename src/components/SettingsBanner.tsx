// components/SettingsBanner.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { Dialog } from "@headlessui/react";
import { FiSettings } from "react-icons/fi";

interface SettingsBannerProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
}

export const SettingsBanner: React.FC<SettingsBannerProps> = ({
 selectedBg,
 onSelectBg,
}) => {
 const [isOpen, setIsOpen] = useState(false);
 const isDarkBackground = ["midnightSlate", "graphite", "onyx"].includes(
  selectedBg
 );

 return (
  <>
   {/* Floating Settings Button */}
   <motion.button
    onClick={() => setIsOpen(true)}
    className="relative inline-flex justify-center items-center 
          aspect-square rounded-full outline-none overflow-hidden 
          cursor-pointer group"
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
    data-tooltip="Configurações"
   >
    {/* Inner container */}
    <span className="relative z-10 block p-3 overflow-hidden rounded-full">
     {/* Icons container */}
     <span className="relative block w-6 h-6 overflow-hidden">
      {/* Default icon */}
      <FiSettings
       className={`absolute top-0 left-0 w-full h-full 
                transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
                group-hover:translate-y-full
                ${isDarkBackground ? "text-black" : "text-white"}`}
      />
      {/* Hover icon */}
      <FiSettings
       className={`absolute top-0 left-0 w-full h-full 
                transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
                group-hover:translate-y-0 -translate-y-full
                ${isDarkBackground ? "text-white" : "text-black"}`}
      />
     </span>
    </span>

    {/* Background elements */}
    <span
     className={`absolute top-0 left-0 z-0 w-full h-full rounded-full 
            before:absolute before:inset-0 before:block before:rounded-full 
            before:transition-colors before:duration-300 before:ease-linear 
            ${
             isDarkBackground
              ? "before:bg-white group-hover:before:bg-[#101419]"
              : "before:bg-[#101419] group-hover:before:bg-white"
            }
            after:absolute after:inset-0 after:block after:rounded-full 
            after:blur-[5px] after:transition-opacity after:duration-400 
            after:ease-[cubic-bezier(0.55,0.085,0.68,0.53)] 
            ${
             isDarkBackground
              ? "after:bg-[#101419] group-hover:after:opacity-100"
              : "after:bg-white group-hover:after:opacity-100"
            } 
            after:opacity-0`}
    ></span>

    {/* Tooltip (mantido igual) */}
    <span
     className="absolute left-1/2 -top-11 -translate-x-1/2 z-[-1] 
            px-3 py-1 text-sm text-white bg-[#070707] rounded opacity-0 
            invisible pointer-events-none transition-all duration-400 
            ease-[cubic-bezier(0.47,2,0.41,1.5)] group-hover:top-0 
            group-hover:opacity-100 group-hover:visible"
    >
     Configurações
    </span>
   </motion.button>
   <AnimatePresence>
    {isOpen && (
     <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
     >
      <div className="flex items-center justify-center min-h-screen">
       {/* Backdrop */}
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
       />

       {/* Dialog Content */}
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-white rounded-xl max-w-md w-full mx-4 p-6 shadow-2xl"
       >
        <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
         Configurações de Aparência
        </Dialog.Title>

        <div className="space-y-8">
         <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
           Cor do Banner
          </h3>
          <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
         </div>

         <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
           Paleta de Cores
          </h3>
          <PaletteSelector />
         </div>
        </div>

        <div className="mt-8 flex justify-end">
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
