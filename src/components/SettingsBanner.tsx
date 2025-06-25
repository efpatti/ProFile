// components/SettingsBanner.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FiSettings } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

interface SettingsBannerProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
}

export const SettingsBanner: React.FC<SettingsBannerProps> = ({
 selectedBg,
 onSelectBg,
}) => {
 const [isOpen, setIsOpen] = useState(false);

 return (
  <>
   {/* Floating Settings Button */}
   <motion.button
    onClick={() => setIsOpen(true)}
    className="relative p-2 rounded-full bg-white shadow-lg hover:shadow-xl focus:outline-none"
    whileHover={{ scale: 1.1, rotate: 30 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0.7 }}
    animate={{ opacity: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
   >
    <FiSettings className="w-6 h-6 text-gray-800" />
   </motion.button>

   {/* Dialog */}
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
