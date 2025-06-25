// components/BgBannerSelector.tsx
"use client";

import { motion } from "framer-motion";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";

interface BgBannerSelectorProps {
 selected: BgBannerColorName;
 onSelect: (color: BgBannerColorName) => void;
}

const COLORS = Object.entries(bgBannerColor) as [
 BgBannerColorName,
 { bg: string; text: string }
][];

export const BgBannerSelector: React.FC<BgBannerSelectorProps> = ({
 selected,
 onSelect,
}) => {
 return (
  <div className="flex flex-wrap gap-4">
   {COLORS.map(([name, colorObj]) => (
    <motion.button
     key={name}
     onClick={() => onSelect(name)}
     className="relative rounded-full w-10 h-10 focus:outline-none"
     whileHover={{ scale: 1.1 }}
     animate={{ borderWidth: selected === name ? 4 : 0 }}
     transition={{ type: "spring", stiffness: 300 }}
     style={{
      backgroundColor: colorObj.bg,
      borderColor: selected === name ? "var(--accent)" : undefined,
     }}
    ></motion.button>
   ))}
  </div>
 );
};
