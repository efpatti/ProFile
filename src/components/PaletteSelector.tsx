// components/PaletteSelector.tsx
"use client";

import { motion } from "framer-motion";
import { usePalette, paletteTokens } from "@/styles/PaletteProvider";

type PaletteOption = {
 name: keyof typeof paletteTokens;
 label: string;
};

const PALETTE_OPTIONS: PaletteOption[] = [
 { name: "darkGreen", label: "Verde Floresta" },
 { name: "deepBlue", label: "Azul Profundo" },
 { name: "vibrantPurple", label: "Lavanda" },
 { name: "sunsetOrange", label: "Pôr do Sol" },
 { name: "teal", label: "Turquesa" },
];

export const PaletteSelector: React.FC = () => {
 const { palette, setPalette } = usePalette();

 return (
  <div className="flex flex-wrap gap-4">
   {PALETTE_OPTIONS.map((option) => (
    <motion.button
     key={option.name}
     onClick={() => setPalette(option.name)}
     className="relative rounded-full w-10 h-10 focus:outline-none"
     whileHover={{ scale: 1.1 }}
     animate={{ borderWidth: palette === option.name ? 4 : 0 }}
     transition={{ type: "spring", stiffness: 300 }}
     style={{
      backgroundColor: paletteTokens[option.name].accent,
      borderColor: palette === option.name ? "var(--accent)" : undefined,
     }}
     title={option.label}
    ></motion.button>
   ))}
  </div>
 );
};
