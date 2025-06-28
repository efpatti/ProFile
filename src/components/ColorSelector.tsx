// components/ColorSelector.tsx
"use client";

import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import {
 Listbox,
 ListboxButton,
 ListboxOption,
 ListboxOptions,
} from "@headlessui/react";

import { isLightColor } from "@/utils/color";
import { isDarkBackground } from "@/utils/color";

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
 selectedBg: BgBannerColorName;
}

export const ColorSelector = <T extends string>({
 options,
 selected,
 onSelect,
 className = "",
 selectedBg,
}: ColorSelectorProps<T>) => {
 const selectedOption =
  options.find((option) => option.value === selected) || options[0];
 const selectedIsLight = isLightColor(selectedOption.color);

 return (
  <div className={className}>
   <Listbox value={selected} onChange={onSelect}>
    {({ open }) => (
     <div>
      <ListboxButton
       className={`relative flex items-center gap-2 w-full rounded-lg py-2 pl-3 pr-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${
        selectedIsLight ? "bg-black/10 text-black" : "bg-white/10 text-white"
       }`}
       style={{
        backgroundColor: isDarkBackground(selectedBg) ? "white" : "black",
       }}
      >
       <span
        className="block truncate rounded-full h-6 w-6"
        style={{ backgroundColor: selectedOption.color }}
       ></span>
       <span
        className={`pointer-events-none absolute right-2 h-5 w-5 ${
         isDarkBackground(selectedBg) ? "text-black/70" : "text-white/70"
        } ${open ? "rotate-180" : ""}`}
       >
        ▼
       </span>
      </ListboxButton>
      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
       {options.map((option) => {
        const textColor = isDarkBackground(selectedBg)
         ? "text-white"
         : "text-black";
        const hoverBg = isDarkBackground(selectedBg)
         ? "bg-white/10"
         : "bg-black/10";
        return (
         <ListboxOption
          key={option.value}
          value={option.value}
          className={({ active, selected }) =>
           `relative cursor-default select-none py-2 pl-10 pr-4 flex items-center gap-2 ${textColor} ${
            active && hoverBg
           } ${selected ? "font-medium" : "font-normal"}`
          }
         >
          {({ selected }) => (
           <div>
            <span
             className="block truncate rounded-full h-6 w-6"
             style={{ backgroundColor: option.color }}
            ></span>
            {selected ? (
             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              ✔
             </span>
            ) : null}
           </div>
          )}
         </ListboxOption>
        );
       })}
      </ListboxOptions>
     </div>
    )}
   </Listbox>
  </div>
 );
};
