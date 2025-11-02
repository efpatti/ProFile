// components/FloatingActionButton.tsx
"use client";

import { motion } from "framer-motion";
import { BgBannerColorName } from "@/styles/shared_style_constants";
import { ReactNode } from "react";
import { isDarkBackground } from "@/utils/color"; // Import the utility function

interface FloatingActionButtonProps {
 icon: ReactNode;
 hoverIcon?: ReactNode;
 selectedBg: BgBannerColorName;
 onClick: () => void;
 tooltipText: string;
 className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
 icon,
 hoverIcon = icon,
 selectedBg,
 onClick,
 tooltipText,
 className = "",
}) => {
 return (
  <motion.button
   onClick={onClick}
   className={`relative inline-flex justify-center items-center 
        aspect-square rounded-full outline-none overflow-hidden 
        cursor-pointer group ${className}`}
   whileTap={{ scale: 0.95 }}
   initial={{ opacity: 0.7 }}
   animate={{ opacity: 1 }}
   transition={{ type: "spring", stiffness: 300 }}
   data-tooltip={tooltipText}
  >
   {/* Inner container - ajustado para centralização perfeita */}
   <span className="relative z-10 flex items-center justify-center w-full h-full p-2 overflow-hidden rounded-full">
    {/* Icons container - agora com flex e centralização */}
    <span className="relative flex items-center justify-center w-6 h-6 overflow-hidden">
     {/* Default icon */}
     <span
      className={`absolute flex items-center justify-center w-full h-full 
              transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
              group-hover:translate-y-full
              ${
               isDarkBackground(selectedBg) ? "text-black" : "text-white"
              } text-2xl`}
     >
      {icon}
     </span>
     {/* Hover icon */}
     <span
      className={`absolute flex items-center justify-center w-full h-full 
              transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
              group-hover:translate-y-0 -translate-y-full
              ${
               isDarkBackground(selectedBg) ? "text-white" : "text-black"
              } text-2xl`}
     >
      {hoverIcon}
     </span>
    </span>
   </span>

   {/* Background elements (mantido igual) */}
   <span
    className={`absolute top-0 left-0 z-0 w-full h-full rounded-full 
          before:absolute before:inset-0 before:block before:rounded-full 
          before:transition-colors before:duration-300 before:ease-linear 
          ${
           isDarkBackground(selectedBg)
            ? "before:bg-white group-hover:before:bg-[#101419]"
            : "before:bg-[#101419] group-hover:before:bg-white"
          }
          after:absolute after:inset-0 after:block after:rounded-full 
          after:blur-[5px] after:transition-opacity after:duration-400 
          after:ease-[cubic-bezier(0.55,0.085,0.68,0.53)] 
          ${
           isDarkBackground(selectedBg)
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
    {tooltipText}
   </span>
  </motion.button>
 );
};
