// components/ColorSelector.tsx
"use client";

import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import {
 Listbox,
 ListboxButton,
 ListboxOption,
 ListboxOptions,
} from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

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
}: ColorSelectorProps<T>) => {
 const selectedOption =
  options.find((option) => option.value === selected) || options[0];

 return (
  <div className={className}>
   <Listbox value={selected} onChange={onSelect}>
    {({ open }) => (
     <div className="relative">
      <ListboxButton
       className={`relative w-full rounded-lg py-2 pl-3 pr-10 text-left transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 text-white
       shadow-sm border border-gray-700`}
      >
       <span className="flex items-center gap-3">
        <span
         className="block h-5 w-5 rounded-full border border-white/30"
         style={{ backgroundColor: selectedOption.color }}
        />
        {selectedOption.label && (
         <span className="block truncate">{selectedOption.label}</span>
        )}
       </span>
       <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <FiChevronDown
         className={`h-5 w-5 transition-transform ${
          open && "rotate-180"
         } text-gray-300
         }`}
        />
       </span>
      </ListboxButton>

      <ListboxOptions
       className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg py-1 shadow-lg ring-1 bg-gray-800 focus:outline-none ring-gray-700 custom-organic-scroll
       `}
      >
       {options.map((option) => (
        <ListboxOption
         key={option.value}
         value={option.value}
         className={({ active }) =>
          `relative cursor-default select-none py-2 pl-10 pr-4
           text-gray-100
          ${active ? "bg-gray-700" : ""}`
         }
        >
         {({ selected }) => (
          <div className="flex items-center gap-3">
           <span
            className="block h-5 w-5 rounded-full border border-white/30"
            style={{ backgroundColor: option.color }}
           />
           {option.label && (
            <span
             className={`block truncate ${
              selected ? "font-medium" : "font-normal"
             }`}
            >
             {option.label}
            </span>
           )}
           {selected ? (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
               fillRule="evenodd"
               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
               clipRule="evenodd"
              />
             </svg>
            </span>
           ) : null}
          </div>
         )}
        </ListboxOption>
       ))}
      </ListboxOptions>
     </div>
    )}
   </Listbox>
  </div>
 );
};
