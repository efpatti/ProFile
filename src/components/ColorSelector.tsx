// components/ColorSelector.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ColorOption<T extends string> {
 value: T;
 color: string;
 label?: string;
}

interface ColorSelectorProps<T extends string> {
 options: ColorOption<T>[];
 selected: T;
 onSelect: (value: T) => void;
 className?: string;
}

export const ColorSelector = <T extends string>({
 options,
 selected,
 onSelect,
 className = "",
}: ColorSelectorProps<T>) => {
 const [localSelected, setLocalSelected] = useState<T>(selected);

 // Sincroniza com o valor externo quando muda
 useEffect(() => {
  setLocalSelected(selected);
 }, [selected]);

 const handleSelect = (value: T) => {
  // Feedback visual imediato
  setLocalSelected(value);
  // Chama a função de seleção
  onSelect(value);
 };

 return (
  <div className={`flex flex-wrap gap-4 ${className}`}>
   {options.map((option) => (
    <motion.button
     key={option.value}
     onClick={() => handleSelect(option.value)}
     className="relative rounded-full w-10 h-10 focus:outline-none"
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.95 }} // Adiciona feedback ao clicar
     animate={{
      borderWidth: localSelected === option.value ? 4 : 0,
      scale: localSelected === option.value ? 1.05 : 1,
     }}
     transition={{ type: "spring", stiffness: 300 }}
     style={{
      backgroundColor: option.color,
      borderColor: localSelected === option.value ? "red" : undefined,
     }}
     title={option.label || option.value}
    ></motion.button>
   ))}
  </div>
 );
};
