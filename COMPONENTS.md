## src/components/LanguagesEditor.tsx
```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ lang }) => {
 const { user } = useAuth();
 const [items, setItems] = useState<string[]>([]);
 const [title, setTitle] = useState("Idiomas");
 const [isLoading, setIsLoading] = useState(true);
 const [editing, setEditing] = useState(false);
 const [newItem, setNewItem] = useState("");
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   const docRef = doc(db, "users", user.uid, "languages", lang);
   getDoc(docRef)
    .then((docSnap) => {
     if (docSnap.exists()) {
      const data = docSnap.data();
      setItems(data.items || []);
      setTitle(data.title || "Idiomas");
     }
     setIsLoading(false);
    })
    .catch((error) => {
     console.error("Error fetching languages:", error);
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleAddItem = () => {
  if (newItem.trim() !== "") {
   setItems([...items, newItem.trim()]);
   setNewItem("");
  }
 };

 const handleRemoveItem = (indexToRemove: number) => {
  setItems(items.filter((_, index) => index !== indexToRemove));
 };

 const handleUpdateItem = (indexToUpdate: number, value: string) => {
  const updatedItems = [...items];
  updatedItems[indexToUpdate] = value;
  setItems(updatedItems);
 };

 const handleSave = async () => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid, "languages", lang);
  try {
   await setDoc(docRef, { title, items, language: lang }, { merge: true });
   setEditing(false);
   alert("Idiomas salvos com sucesso!");
  } catch (error) {
   console.error("Erro ao salvar idiomas:", error);
   alert("Ocorreu um erro ao salvar os idiomas.");
  }
 };

 if (isLoading) return <div className="text-white">Carregando idiomas...</div>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Idiomas" : "Languages"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing ? "Visualizar" : "Editar"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="space-y-4"
     >
      {items.map((item, index) => (
       <Reorder.Item
        key={index}
        value={item}
        as="div"
        dragListener={false}
        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
       >
        <motion.div
         className="cursor-grab p-2 text-gray-400 hover:text-white"
         drag="x"
         dragControls={controls}
         onPointerDown={(e) => controls.start(e)}
         whileDrag={{ opacity: 0.7 }}
        >
         <FaGripVertical />
        </motion.div>

        <input
         type="text"
         value={item}
         onChange={(e) => handleUpdateItem(index, e.target.value)}
         className="bg-gray-600 text-white p-2 rounded flex-grow"
        />

        <button
         onClick={() => handleRemoveItem(index)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-4">
      <input
       type="text"
       value={newItem}
       onChange={(e) => setNewItem(e.target.value)}
       className="bg-gray-600 text-white p-2 rounded flex-grow"
       placeholder="Novo idioma"
      />
      <button
       onClick={handleAddItem}
       className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
      >
       <FaPlus />
      </button>
     </div>

     <div className="mt-6">
      <button
       onClick={handleSave}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded ml-auto"
      >
       <FaSave /> Salvar Idiomas
      </button>
     </div>
    </div>
   ) : (
    <div className="flex flex-wrap gap-2">
     {items.map((item, index) => (
      <div
       key={index}
       className="bg-gray-700 text-white px-4 py-2 rounded-full"
      >
       {item}
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

export default LanguagesEditor;
```

## src/components/ColorSelector.tsx
```tsx
"use client";

// components/ColorSelector.tsx
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

 // Exibe o valor da cor selecionada (útil para debug ou UX)
 // Exemplo: Verde Floresta (darkGreen)
 // Você pode customizar o estilo abaixo conforme o design desejado

 return (
  <div className={className}>
   {/* Removido o bloco 'Selecionado:' e info extra */}
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
         <span className="block truncate">
          {selectedOption.label}{" "}
          <span className="text-xs text-gray-500">
           ({selectedOption.value})
          </span>
         </span>
        )}
       </span>
       <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <FiChevronDown
         className={`h-5 w-5 transition-transform ${
          open ? "rotate-180" : ""
         } text-gray-300`}
        />
       </span>
      </ListboxButton>

      <ListboxOptions
       className={`absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg py-1 shadow-lg ring-1 bg-gray-800 focus:outline-none ring-gray-700 custom-organic-scroll
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
```

## src/components/BgBannerSelector.tsx
```tsx
// components/BgBannerSelector.tsx
"use client";

import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { ColorSelector } from "./ColorSelector";

export const BgBannerSelector = ({
 selected,
 onSelect,
}: {
 selected: BgBannerColorName;
 onSelect: (color: BgBannerColorName) => void;
}) => {
 const colorOptions = Object.entries(bgBannerColor).map(([name, colorObj]) => {
  const colorsArr = colorObj.colors;
  const bgObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "bg")
  );
  const bg = bgObj ? (bgObj as { bg: string }).bg : "#fff";
  const colorName = colorObj.colorName[0]["pt-br"] ?? name;
  return {
   value: name as BgBannerColorName,
   color: bg,
   label: colorName,
  };
 });

 return (
  <ColorSelector
   options={colorOptions}
   selected={selected}
   onSelect={onSelect}
   selectedBg={selected}
  />
 );
};
```

## src/components/CodeBlock.tsx
```tsx
import React, { useEffect, useRef } from "react";
import { HtmlFormatter } from "@/core/formatters/HtmlFormatter";
import { Developer } from "@/core/models/Developer";
import { usePalette } from "@/styles/PaletteProvider";

interface CodeBlockProps {
 dev: Developer;
 bgColor: { bg: string; text: string };
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ dev, bgColor }) => {
 const codeRef = useRef<HTMLPreElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  const formatter = new HtmlFormatter();
  if (codeRef.current) {
   codeRef.current.innerHTML = formatter.format(
    dev.toJSON(),
    palette,
    bgColor.text
   );
  }
 }, [dev, palette, bgColor.text]);

 return (
  <pre
   id="code"
   ref={codeRef}
   className="p-6 shadow-md shadow-[color:var(--secondary)] rounded-lg text-sm font-mono mb-4 w-full max-w-2xl mx-auto overflow-x-auto"
   style={{
    borderColor: "var(--accent)",
    color: bgColor.text,
    backgroundColor: bgColor.bg,
   }}
  />
 );
};
```

## src/components/Navbar.tsx
```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogoSVG from "@/components/LogoSVG";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaTimes } from "react-icons/fa";
import { useAuth } from "@/core/services/AuthProvider";
import {
 mainPublicRoutes,
 bannerAndResumeRoutes,
 contactRoute,
 profileRoute,
 authRoutes,
} from "@/constants/routes";
import type { UserWithProfile } from "@/core/services/AuthProvider";
import Image from "next/image";
import { handleSignOut } from "@/core/services/signOut";
import { colorPalettes, PaletteName } from "@/styles/sharedStyleConstants";
import { usePalette } from "@/styles/PaletteProvider";

// Mobile Menu component
interface MobileMenuProps {
 isOpen: boolean;
 onClose: () => void;
 children: React.ReactNode;
}

const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => (
 <AnimatePresence>
  {isOpen && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-sm pt-16"
   >
    <motion.div
     initial={{ y: -20 }}
     animate={{ y: 0 }}
     exit={{ y: -20 }}
     className="container mx-auto p-6 overflow-y-auto h-full"
    >
     {children}
     <div className="mt-8 flex justify-center">
      <button
       onClick={onClose}
       className="px-6 py-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg flex items-center gap-2"
      >
       <FaTimes /> Close
      </button>
     </div>
    </motion.div>
   </motion.div>
  )}
 </AnimatePresence>
);

// Hamburger Menu Button component
interface MenuButtonProps {
 onClick: () => void;
 isOpen: boolean;
}

const MenuButton = ({ onClick, isOpen }: MenuButtonProps) => (
 <button
  onClick={onClick}
  className="md:hidden p-2 text-gray-400 hover:text-white"
  aria-label="Menu"
 >
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
   <path
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth={2}
    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
   />
  </svg>
 </button>
);

const MainLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
 <div
  className={`${
   isMobile ? "flex flex-col space-y-4" : "hidden md:flex"
  } bg-gradient-to-r from-zinc-900/30 via-zinc-700/30 to-zinc-900/30 backdrop-blur-sm rounded-xl px-6 py-4 ${
   isMobile ? "space-y-4" : "space-x-8"
  } border border-white/10 shadow-lg`}
 >
  {[...mainPublicRoutes, ...bannerAndResumeRoutes]
   .filter(Boolean)
   .map((route) => (
    <Link
     key={route.href}
     href={route.href}
     className="text-white/90 text-sm hover:text-white transition-all flex items-center group"
    >
     {route.title.en}
    </Link>
   ))}
  {contactRoute && (
   <Link
    key={contactRoute.href}
    href={contactRoute.href}
    className="text-white/90 text-sm hover:text-white transition-all flex items-center group"
   >
    {contactRoute.title.en}
   </Link>
  )}
 </div>
);

const AuthLinks = () => (
 <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
  {authRoutes.map((route) => (
   <Link
    key={route.href}
    href={route.href}
    className={
     route.href.includes("sign-in")
      ? "text-sm font-medium text-white border border-blue-400/50 px-4 py-1.5 rounded-md hover:bg-blue-500/20 hover:border-blue-400 transition-all text-center"
      : "text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-1.5 rounded-md transition-all shadow-md hover:shadow-blue-500/20 text-center"
    }
   >
    {route.title.en}
   </Link>
  ))}
 </div>
);

const AuthActions = ({
 isLogged,
 isMobile = false,
}: {
 isLogged: boolean;
 isMobile?: boolean;
}) => (
 <div
  className={`flex ${
   isMobile ? "flex-col space-y-4 items-stretch" : "items-center space-x-4"
  }`}
 >
  <a
   href="https://github.com/seurepo"
   target="_blank"
   rel="noopener noreferrer"
   className={`text-white/80 hover:text-white transition-all p-2 hover:bg-white/10 rounded-full ${
    isMobile ? "self-center" : ""
   }`}
  >
   <FaGithub size={18} />
  </a>
  {!isLogged && <AuthLinks />}
 </div>
);

const getPaletteInfo = (palette: string | undefined) => {
 if (!palette || !(palette in colorPalettes)) return null;
 const info = colorPalettes[palette as PaletteName];
 return {
  label: info.colorName?.[0]?.["pt-br"] || palette,
  color: info.colors?.[0]?.accent || "#888",
 };
};

const ProfileMenu = ({ user }: { user: UserWithProfile | null }) => {
 const [open, setOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  if (!open) return;
  function handleClick(e: MouseEvent) {
   if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    setOpen(false);
   }
  }
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
 }, [open]);

 const avatar = user?.photoURL || undefined;
 const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
 const email = user?.email || "";
 const paletteInfo = getPaletteInfo(palette);

 return (
  <div className="relative ml-4" ref={menuRef}>
   <button
    onClick={() => setOpen((v) => !v)}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
    aria-label="Open user menu"
   >
    {avatar ? (
     <Image
      src={avatar}
      alt="avatar"
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover"
      unoptimized
     />
    ) : (
     <span className="flex flex-col items-center justify-center w-full">
      <span className="font-bold text-lg">{displayName[0]?.toUpperCase()}</span>
      {paletteInfo && (
       <span className="flex items-center gap-2 mt-1 text-xs font-semibold">
        <span
         className="inline-block w-3 h-3 rounded-full border border-white/40"
         style={{ backgroundColor: paletteInfo.color }}
        />
        <span>Paleta: {paletteInfo.label}</span>
       </span>
      )}
     </span>
    )}
   </button>
   {open && (
    <motion.div
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.2 }}
     className="absolute right-0 mt-2 w-64 bg-zinc-800/95 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-xl py-4 z-50 flex flex-col items-center"
    >
     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-3 shadow-lg">
      {avatar ? (
       <Image
        src={avatar}
        alt="avatar"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover"
        unoptimized
       />
      ) : (
       <span className="font-bold text-3xl">
        {displayName[0]?.toUpperCase()}
       </span>
      )}
     </div>
     <div className="text-white font-semibold text-base mb-1 text-center px-4">
      {displayName}
     </div>
     <div className="text-zinc-400 text-xs mb-4 text-center px-4 truncate w-full">
      {email}
     </div>
     {paletteInfo && (
      <div className="flex items-center gap-2 mb-4">
       <span
        className="inline-block w-4 h-4 rounded-full border border-white/40"
        style={{ backgroundColor: paletteInfo.color }}
       />
       <span className="text-xs text-white/80 font-semibold">
        Paleta ativa: {paletteInfo.label}
       </span>
      </div>
     )}
     <Link
      href={profileRoute?.href || "/profile"}
      className="w-11/12 text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition mb-2 shadow-md"
      onClick={() => setOpen(false)}
     >
      My Profile
     </Link>
     <button
      className="w-11/12 text-center px-4 py-2 text-white/80 hover:text-white text-sm mt-1"
      onClick={handleSignOut}
     >
      Sign Out
     </button>
    </motion.div>
   )}
  </div>
 );
};

const Navbar = () => {
 const [isScrolled, setIsScrolled] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const { isLogged, user } = useAuth();

 useEffect(() => {
  const handleScroll = () => {
   setIsScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
  <>
   <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`fixed top-0 w-full z-50 transition-all duration-300 ${
     isScrolled
      ? "backdrop-blur-md bg-zinc-900/80 border-b border-zinc-800/50"
      : "bg-transparent"
    }`}
   >
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
     {/* Logo */}
     <Link
      href="/"
      className="flex items-center"
      onClick={() => setMenuOpen(false)}
     >
      <LogoSVG className="w-36 h-36 hover:opacity-90 transition" />
     </Link>

     <MainLinks />

     <div className="flex items-center space-x-4">
      {isLogged && <ProfileMenu user={user} />}
      <AuthActions isLogged={isLogged} />
      <MenuButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
     </div>
    </div>
   </motion.nav>

   <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
    <div className="w-full space-y-6">
     <MainLinks isMobile />
     {isLogged && (
      <Link
       href={profileRoute?.href || "/profile"}
       className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition shadow-md"
       onClick={() => setMenuOpen(false)}
      >
       My Profile
      </Link>
     )}
     <AuthActions isLogged={isLogged} isMobile />
    </div>
   </MobileMenu>
  </>
 );
};

export default Navbar;
```

## src/components/DownloadButton.tsx
```tsx
// components/DownloadButton.tsx
"use client";

import { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoDownload as DownloadIcon } from "react-icons/go";

export const DownloadButton = ({
 logoUrl,
 selectedBg,
 type = "banner",
 lang,
}: {
 logoUrl?: string;
 selectedBg: BgBannerColorName;
 type?: "banner" | "resume";
 lang?: string;
}) => {
 const { palette } = usePalette();
 const [loading, setLoading] = useState(false);

 if (!palette) return null;

 const handleDownload = async () => {
  setLoading(true);
  console.log("[DownloadButton] palette enviado para download:", palette);
  const params = new URLSearchParams({ palette });
  if (logoUrl) params.append("logo", logoUrl);
  if (type === "resume" && lang) params.append("lang", lang);
  if (type === "resume" && selectedBg) params.append("bannerColor", selectedBg);
  const endpoint =
   type === "resume" ? "/api/download-resume" : "/api/download-banner";
  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok) {
   setLoading(false);
   alert("Download failed: " + (await res.text()));
   return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = type === "resume" ? "resume.pdf" : "linkedin-banner.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  setLoading(false);
 };

 return (
  <FloatingActionButton
   icon={<DownloadIcon />}
   selectedBg={selectedBg}
   onClick={handleDownload}
   tooltipText="Download"
   className={loading ? "opacity-50 cursor-not-allowed" : ""}
  />
 );
};
```

## src/components/LogoSVG.tsx
```tsx
const colors = [
 "#ef4444", // 0 - vermelho
 "#f97316", // 1 - laranja
 "#eab308", // 2 - amarelo
 "#22c55e", // 3 - verde
 "#14b8a6", // 4 - ciano
 "#10b981", // 5 - verde-água
 "#3b82f6", // 6 - azul
 "#06b6d4", // 7 - azul claro
 "#6366f1", // 8 - roxo claro
 "#a855f7", // 9 - roxo
 "#8b5cf6", // 10 - roxo escuro
 "#ec4899", // 11 - rosa
] as const;

const LogoSVG = ({ className }: { className?: string }) => (
 <svg
  version="1.0"
  xmlns="http://www.w3.org/2000/svg"
  width="1024pt"
  height="1024pt"
  viewBox="0 0 1024 1024"
  preserveAspectRatio="xMidYMid meet"
  className={className}
 >
  <defs>
   {/* Gradiente para o triângulo com 5 cores */}
   <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor={colors[0]} /> {/* Vermelho */}
    <stop offset="25%" stopColor={colors[3]} /> {/* Verde */}
    <stop offset="50%" stopColor={colors[6]} /> {/* Azul */}
    <stop offset="75%" stopColor={colors[9]} /> {/* Roxo */}
    <stop offset="100%" stopColor={colors[2]} /> {/* Amarelo */}
   </linearGradient>
  </defs>
  <g
   transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
   stroke="none"
  >
   {/* Triângulo com gradiente de 5 cores */}
   <path
    d="M2012 6523 c-21 -8 -59 -71 -399 -653 -182 -311 -391 -668 -465 -795
-74 -126 -142 -244 -152 -262 -21 -41 -20 -86 2 -111 15 -18 193 -131 975
-616 143 -89 161 -98 195 -93 22 3 146 66 312 160 151 85 345 193 430 241 85
48 161 94 168 103 9 13 12 131 12 510 l0 494 -119 127 c-66 70 -294 301 -508
515 -394 393 -403 400 -451 380z m917 -1510 l1 -432 -107 -59 c-60 -33 -219
-123 -355 -200 l-248 -140 0 174 0 174 279 0 c260 0 280 1 302 19 l24 19 3
392 3 392 -218 219 -217 219 -243 0 -244 0 -24 -26 -25 -27 0 -574 0 -575 29
-29 c27 -27 35 -29 105 -29 l76 0 0 -161 c0 -88 -3 -159 -7 -157 -5 2 -35 20
-68 41 -33 21 -233 146 -444 277 -210 131 -385 241 -388 243 -4 5 101 187 394
682 88 149 233 396 323 550 90 154 168 288 174 297 9 15 73 -46 443 -420 l432
-437 0 -432z m-719 432 c0 -268 -23 -245 251 -245 l207 0 -1 -265 -2 -265
-322 0 -323 0 0 490 0 490 95 0 95 0 0 -205z m409 -101 c2 -2 -55 -4 -127 -4
l-132 0 0 134 0 134 128 -130 c70 -71 129 -131 131 -134z"
    fill="url(#triangleGradient)"
   />
   <path
    d="M2185 4995 c-14 -13 -25 -36 -25 -50 0 -14 11 -37 25 -50 23 -24 28
-25 170 -25 142 0 147 1 170 25 14 13 25 36 25 50 0 14 -11 37 -25 50 -23 24
-28 25 -170 25 -142 0 -147 -1 -170 -25z"
    fill="#f8fbff"
   />

   {/* Bolinha do i - agora branca */}
   <path
    d="M7368 5804 c-15 -8 -35 -28 -43 -44 -44 -84 13 -170 113 -170 34 0
49 6 79 34 31 28 38 41 38 74 0 22 -6 51 -14 64 -28 53 -114 74 -173 42z"
    fill="#f8fbff"
   />

   {/* Letra P */}
   <path
    d="M3660 5185 l0 -595 90 0 90 0 0 219 0 219 173 4 c216 5 260 19 354
113 75 76 98 135 98 265 0 152 -59 259 -175 318 -88 44 -148 52 -407 52 l-223
0 0 -595z m505 406 c120 -54 151 -229 59 -331 -47 -52 -116 -70 -267 -70
l-117 0 0 210 0 210 143 0 c116 0 149 -4 182 -19z"
    fill="#f8fbff"
   />

   {/* Letra F - agora branca */}
   <path
    d="M6280 5185 l0 -595 90 0 90 0 0 250 0 250 235 0 235 0 0 80 0 80
-235 0 -235 0 0 180 0 180 265 0 265 0 0 85 0 85 -355 0 -355 0 0 -595z"
    fill="#f8fbff"
   />

   {/* Letra l - agora branca */}
   <path
    d="M7880 5700 l0 -80 120 0 120 0 0 -435 0 -435 -110 0 -110 0 0 -80 0
-80 300 0 300 0 0 80 0 80 -100 0 -100 0 0 515 0 515 -210 0 -210 0 0 -80z"
    fill="#f8fbff"
   />

   {/* Letra r */}
   <path
    d="M5020 5471 c-64 -13 -129 -52 -173 -101 l-42 -49 3 74 4 75 -96 0
-96 0 0 -440 0 -440 93 0 92 0 0 258 c0 291 3 301 84 375 62 56 154 73 294 54
l57 -7 0 89 c0 68 -4 92 -16 101 -18 15 -152 23 -204 11z"
    fill="#f8fbff"
   />

   {/* Letra o */}
   <path
    d="M5609 5467 c-98 -28 -201 -114 -240 -201 -65 -149 -65 -357 2 -488
34 -67 113 -142 182 -174 57 -27 71 -29 177 -29 103 0 121 3 170 26 149 70
227 200 237 394 9 173 -33 293 -134 385 -72 66 -144 93 -258 97 -52 1 -109 -3
-136 -10z m206 -166 c86 -39 126 -119 133 -262 6 -121 -12 -182 -72 -244 -77
-80 -192 -86 -279 -14 -19 16 -45 50 -58 76 -21 42 -24 63 -24 168 0 111 2
124 27 170 14 28 37 60 50 72 56 53 151 67 223 34z"
    fill="#f8fbff"
   />

   {/* Letra E - agora branca */}
   <path
    d="M8822 5459 c-116 -41 -207 -147 -242 -286 -47 -183 -5 -378 105 -488
81 -81 176 -115 325 -115 100 0 141 8 228 42 l53 21 -7 86 c-4 47 -8 88 -10
90 -2 2 -12 -3 -21 -12 -32 -28 -127 -59 -200 -64 -82 -7 -152 8 -203 41 -37
24 -83 99 -95 154 l-7 32 301 0 301 0 0 83 c0 98 -19 179 -62 259 -62 116
-155 169 -307 175 -79 3 -107 0 -159 -18z m238 -161 c35 -18 51 -35 73 -77 15
-30 27 -66 27 -80 l0 -26 -202 3 c-200 2 -203 2 -200 23 11 68 68 146 122 168
46 18 132 13 180 -11z"
    fill="#f8fbff"
   />

   {/* Letra i - agora branca */}
   <path
    d="M7142 5389 l3 -82 108 2 107 2 0 -280 0 -281 -120 0 -120 0 0 -64 c0
-35 -3 -71 -6 -80 -6 -14 27 -16 325 -16 l331 0 0 80 0 80 -115 0 -115 0 0
360 0 360 -200 0 -201 0 3 -81z"
    fill="#f8fbff"
   />
  </g>
 </svg>
);

export default LogoSVG;
```

## src/components/GenericEditor.tsx
```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import { motion, Reorder, useDragControls } from "framer-motion";

export interface BaseItem {
 id: string;
 order: number;
 language: string;
}

interface GenericEditorProps<T extends BaseItem> {
 lang: string;
 fetchItems: (userId: string, lang: string) => Promise<T[]>;
 saveItems: (
  userId: string,
  itemsToSave: T[],
  itemsToDelete: string[]
 ) => Promise<void>;
 createNewItem: (lang: string, currentLength: number) => T;
 renderItem: (
  item: T,
  handleInputChange: (id: string, field: keyof T, value: any) => void
 ) => React.ReactNode;
 title: string;
 addItemButtonText: string;
 errorMessages: {
  load: string;
  save: string;
  precondition: string;
 };
}

export function GenericEditor<T extends BaseItem>({
 lang,
 fetchItems,
 saveItems,
 createNewItem,
 renderItem,
 title,
 addItemButtonText,
 errorMessages,
}: GenericEditorProps<T>) {
 const { user } = useAuth();
 const [items, setItems] = useState<T[]>([]);
 const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchItems(user.uid, lang)
    .then((fetchedItems) => {
     setItems(fetchedItems);
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     if (err.code === "failed-precondition") {
      setError(errorMessages.precondition);
     } else {
      setError(errorMessages.load);
     }
     setIsLoading(false);
    });
  }
 }, [user, lang, fetchItems, errorMessages.load, errorMessages.precondition]);

 const handleAddItem = () => {
  const newItem = createNewItem(lang, items.length);
  setItems([...items, newItem]);
 };

 const handleDeleteItem = (id: string) => {
  const itemExistsInDb = !items
   .find((item) => item.id === id)
   ?.id.includes("-");
  if (itemExistsInDb) {
   setItemsToDelete([...itemsToDelete, id]);
  }
  setItems(items.filter((item) => item.id !== id));
 };

 const handleSave = async () => {
  if (!user) return;
  try {
   await saveItems(user.uid, items, itemsToDelete);
   setItemsToDelete([]);
   alert(`${title} salvos com sucesso!`);
  } catch (error) {
   console.error(`Erro ao salvar ${title}:`, error);
   alert(errorMessages.save);
  }
 };

 const handleInputChange = (id: string, field: keyof T, value: any) => {
  setItems(
   items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 if (isLoading) return <div>Carregando editor de {title.toLowerCase()}...</div>;
 if (error) return <div className="text-red-500">{error}</div>;

 return (
  <div className="p-4 bg-gray-800 rounded-lg">
   <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>

   <Reorder.Group
    axis="y"
    values={items}
    onReorder={setItems}
    className="space-y-4"
   >
    {items.map((item) => (
     <Reorder.Item
      key={item.id}
      value={item}
      as="div"
      dragListener={false}
      className="flex items-center mb-4 group"
     >
      <motion.div
       className="cursor-grab p-2 text-gray-400 hover:text-white active:text-white active:cursor-grabbing"
       drag="x"
       dragControls={controls}
       onPointerDown={(e) => controls.start(e)}
       whileDrag={{ scale: 0.98, opacity: 0.8 }}
      >
       <FaGripVertical />
      </motion.div>

      <motion.div
       className="bg-gray-700 p-4 rounded-md w-full flex items-center gap-4 flex-grow"
       layout
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, x: -100 }}
       transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
       <div className="flex-grow">{renderItem(item, handleInputChange)}</div>
       <motion.button
        onClick={() => handleDeleteItem(item.id)}
        className="text-red-500 hover:text-red-400 p-2 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        <FaTrash />
       </motion.button>
      </motion.div>
     </Reorder.Item>
    ))}
   </Reorder.Group>

   <div className="mt-4 flex gap-4">
    <motion.button
     onClick={handleAddItem}
     className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     {addItemButtonText}
    </motion.button>
    <motion.button
     onClick={handleSave}
     className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     Salvar Alterações
    </motion.button>
   </div>
  </div>
 );
}
```

## src/components/BannerColorSyncWrapper.tsx
```tsx
// src/components/BannerColorSyncWrapper.tsx
"use client";
import { useUserBannerColorSync } from "@/core/services/useUserBannerColorSync";
import { useBannerColorFirestoreSync } from "@/core/services/useBannerColorFirestoreSync";

export function BannerColorSyncWrapper() {
 useUserBannerColorSync();
 useBannerColorFirestoreSync();
 return null;
}
```

## src/components/SettingsBanner.tsx
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/core/services/LanguageProvider";
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
import { FiImage as ImageIcon, FiEdit3 as EditIcon } from "react-icons/fi";
import { FaPaintRoller as PaintIcon } from "react-icons/fa";
import { usePalette } from "@/styles/PaletteProvider";
import { useAuth } from "@/core/services/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { LogoSearch } from "./LogoSearch";
import { FiX as CloseIcon, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

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
 const [isSaving, setIsSaving] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
 const [showError, setShowError] = useState(false);
 const { palette, setPalette } = usePalette();
 const { user } = useAuth();
 const { language } = useLanguage();

 const handleApplyChanges = async () => {
  if (!user) {
   setIsOpen(false);
   return;
  }

  setIsSaving(true);
  try {
   await updateDoc(doc(db, "users", user.uid), {
    palette,
    bannerColor: selectedBg,
    updatedAt: new Date().toISOString(),
   });

   setShowSuccess(true);
   setTimeout(() => {
    setShowSuccess(false);
    setIsOpen(false);
   }, 1500);
  } catch (error) {
   console.error("[SettingsBanner] handleApplyChanges error", error);
   setShowError(true);
   setTimeout(() => setShowError(false), 3000);
  } finally {
   setIsSaving(false);
  }
 };

 return (
  <>
   <FloatingActionButton
    icon={<SettingsIcon />}
    selectedBg={selectedBg}
    onClick={() => setIsOpen(true)}
    tooltipText="Configurações"
   />

   <Dialog
    open={isOpen}
    onClose={() => setIsOpen(false)}
    className="relative z-50"
   >
    <AnimatePresence>
     {isOpen && (
      <>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
       />

       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-0 flex items-center justify-center p-4"
       >
        <Dialog.Panel className="relative bg-zinc-950 rounded-xl max-w-3xl w-full mx-4 p-6 shadow-2xl h-[600px] border border-zinc-800">
         <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-1 rounded-full text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Fechar configurações"
         >
          <CloseIcon size={20} />
         </button>

         <DialogTitle className="text-2xl font-bold text-gray-100 mb-6">
          Configurações
         </DialogTitle>

         <TabGroup>
          <TabList className="flex space-x-1 mb-6">
           {[
            { label: "Appearance", icon: <PaintIcon /> },
            { label: "Company Logo", icon: <ImageIcon /> },
            { label: "Edit Content", icon: <EditIcon /> },
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

          <TabPanels className="h-[410px] overflow-y-auto pr-2">
           {/* Appearance Panel */}
           <TabPanel className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Banner Color</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Choose your header background
              </p>
              <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
             </div>

             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Color Palette</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Select application theme
              </p>
              <PaletteSelector
               bgName={selectedBg}
               selected={palette}
               onSelect={setPalette}
              />
             </div>
            </div>
           </TabPanel>

           {/* Logo Panel */}
           <TabPanel>
            <div>
             <DialogItemTitle>Company</DialogItemTitle>
             <LogoSearch onLogoSelect={onLogoSelect} />
            </div>
           </TabPanel>

           {/* Editors Panel */}
           <TabPanel className="space-y-8">
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Skills
             </h3>
             {user && <SkillsEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Education
             </h3>
             {user && <EducationEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Languages
             </h3>
             {user && <LanguagesEditor lang={language} />}
            </div>
           </TabPanel>
          </TabPanels>
         </TabGroup>

         <div className="mt-6 flex justify-end">
          <button
           onClick={handleApplyChanges}
           disabled={isSaving}
           className={`px-4 py-2 rounded-lg transition-colors 
                        bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                        ${isSaving ? "opacity-70 cursor-not-allowed" : ""}
                        flex items-center gap-2`}
          >
           {isSaving ? (
            <>
             <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
             >
              <circle
               className="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
              ></circle>
              <path
               className="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
             </svg>
             Salvando...
            </>
           ) : (
            "Aplicar Alterações"
           )}
          </button>
         </div>
        </Dialog.Panel>
       </motion.div>
      </>
     )}
    </AnimatePresence>
   </Dialog>

   {/* Diálogo de Sucesso */}
   <Dialog
    open={showSuccess}
    onClose={() => setShowSuccess(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-green-600/90 backdrop-blur-md p-6 text-white border border-green-500/30">
      <div className="flex items-center gap-3">
       <FiCheck className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Configurações salvas com sucesso!
       </Dialog.Title>
      </div>
     </Dialog.Panel>
    </motion.div>
   </Dialog>

   {/* Diálogo de Erro */}
   <Dialog
    open={showError}
    onClose={() => setShowError(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-red-600/90 backdrop-blur-md p-6 text-white border border-red-500/30">
      <div className="flex items-center gap-3">
       <FiAlertTriangle className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Erro ao salvar configurações
       </Dialog.Title>
      </div>
     </Dialog.Panel>
    </motion.div>
   </Dialog>
  </>
 );
};

interface DialogItemTitleProps {
 children: React.ReactNode;
}

const DialogItemTitle: React.FC<DialogItemTitleProps> = ({ children }) => {
 return (
  <h3 className={`text-lg font-semibold mb-1 text-gray-100`}>{children}</h3>
 );
};
```

## src/components/SettingsPanel.tsx
```tsx
// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadButton } from "@/components/DownloadButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FaCog, FaTimes } from "react-icons/fa";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { useLanguage } from "@/core/services/LanguageProvider";

interface SettingsPanelProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right";
 downloadType?: "banner" | "resume";
}

export const SettingsPanel = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left",
 downloadType = "banner",
}: SettingsPanelProps) => {
 const [isOpen, setIsOpen] = useState(false);
 const { language } = useLanguage();

 const handleLogoSelect = (url: string) => {
  onLogoSelect?.(url);
 };

 return (
  <>
   <div
    className={`${
     position === "right" ? "absolute top-4 right-4" : "absolute top-4 left-4"
    } z-50 flex flex-row gap-2 items-center`}
   >
    <SettingsBanner
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={handleLogoSelect}
    />
    {showDownloadButton && (
     <DownloadButton
      logoUrl={logoUrl}
      selectedBg={selectedBg}
      type={downloadType}
      lang={language}
     />
    )}
   </div>

   {/* Sidebar Panel */}
   <div
    className={`fixed top-0 ${
     position === "right" ? "right-0" : "left-0"
    } h-full w-96 bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
     isOpen
      ? "translate-x-0"
      : position === "right"
      ? "translate-x-full"
      : "-translate-x-full"
    } overflow-y-auto p-6`}
   >
    <div className="flex justify-between items-center mb-8">
     <h2 className="text-2xl font-bold">Edit Content</h2>
     <button
      onClick={() => setIsOpen(false)}
      className="p-2 hover:bg-gray-700 rounded-full"
      aria-label="Close settings"
     >
      <FaTimes />
     </button>
    </div>

    <div className="space-y-8">
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Skills
      </h3>
      <SkillsEditor lang={language} />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Education
      </h3>
      <EducationEditor lang={language} />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Languages
      </h3>
      <LanguagesEditor lang={language} />
     </div>
    </div>
   </div>

   {/* Overlay */}
   {isOpen && (
    <div
     className="fixed inset-0 bg-black/50 z-30"
     onClick={() => setIsOpen(false)}
    ></div>
   )}
  </>
 );
};
```

## src/components/PaletteSyncWrapper.tsx
```tsx
"use client";
import { useUserPaletteSync } from "@/core/services/useUserPaletteSync";
import { usePaletteFirestoreSync } from "@/core/services/usePaletteFirestoreSync";

export function PaletteSyncWrapper() {
 useUserPaletteSync();
 usePaletteFirestoreSync();
 return null;
}
```

## src/components/EducationEditor.tsx
```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchEducationForUser,
 saveEducation,
 type EducationItem,
} from "@/core/services/EducationService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

// Componente de textarea auto-ajustável (opcional, pode manter inputs se preferir)
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder: string;
 className?: string;
}) => {
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = "auto";
   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={textareaRef}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};

const EducationEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchEducationForUser(user.uid, lang)
    .then((fetchedItems) => {
     setEducationItems(fetchedItems.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     setError("Falha ao carregar os dados de educação.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleUpdateItem = (
  id: string,
  field: keyof EducationItem,
  value: string
 ) => {
  setEducationItems((prev) =>
   prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 const handleRemoveItem = (id: string) => {
  setEducationItems((prev) => prev.filter((item) => item.id !== id));
 };

 const handleAddItem = () => {
  const newItem: EducationItem = {
   id: uuidv4(),
   title: "Nova Formação",
   period: "Ano de Início - Ano de Fim",
   language: lang,
   order: educationItems.length,
  };
  setEducationItems((prev) => [...prev, newItem]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveEducation(user.uid, educationItems, []);
   setEditing(false);
   alert("Dados de educação salvos com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar os dados de educação.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando educação...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Formação Acadêmica" : "Education"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing ? "Visualizar" : "Editar"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={educationItems}
      onReorder={setEducationItems}
      className="space-y-4"
     >
      {educationItems.map((item) => (
       <Reorder.Item
        key={item.id}
        value={item}
        as="div"
        dragListener={false}
        className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
       >
        <motion.div
         className="cursor-grab p-2 text-gray-400 hover:text-white"
         drag="x"
         dragControls={controls}
         onPointerDown={(e) => controls.start(e)}
         whileDrag={{ opacity: 0.7 }}
        >
         <FaGripVertical />
        </motion.div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
         <input
          type="text"
          value={item.title}
          onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Curso ou Formação"
         />
         <input
          type="text"
          value={item.period}
          onChange={(e) => handleUpdateItem(item.id, "period", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Período"
         />
        </div>

        <button
         onClick={() => handleRemoveItem(item.id)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-6">
      <button
       onClick={handleAddItem}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Formação
      </button>
      <button
       onClick={handleSaveChanges}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaSave /> Salvar
      </button>
     </div>
    </div>
   ) : (
    <div className="space-y-4">
     {educationItems.map((item) => (
      <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
       <h3 className="font-bold text-lg text-white">{item.title}</h3>
       <p className="text-gray-300">{item.period}</p>
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

function uuidv4() {
 return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
  const r = (Math.random() * 16) | 0,
   v = c == "x" ? r : (r & 0x3) | 0x8;
  return v.toString(16);
 });
}

export default EducationEditor;
```

## src/components/SkillsEditor.tsx
```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchSkillsForUser,
 saveSkills,
 type Skill,
} from "@/core/services/SkillsService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

// Componente de textarea auto-ajustável
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder: string;
 className?: string;
}) => {
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = "auto";
   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={textareaRef}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};

const SkillsEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [skills, setSkills] = useState<Skill[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editingTechnical, setEditingTechnical] = useState(false);
 const [editingProfessional, setEditingProfessional] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchSkillsForUser(user.uid, lang)
    .then((fetchedSkills) => {
     setSkills(fetchedSkills.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch(() => {
     setError("Falha ao carregar as skills.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 // Separa skills em técnicas e profissionais
 const technicalSkills = skills.filter(
  (skill) => skill.category !== "Profissionais"
 );
 const professionalSkills = skills.filter(
  (skill) => skill.category === "Profissionais"
 );

 const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
  if (!acc[skill.category]) {
   acc[skill.category] = [];
  }
  acc[skill.category].push(skill.item);
  return acc;
 }, {} as Record<string, string[]>);

 const handleUpdateSkill = (id: string, item: string, category: string) => {
  setSkills((prev) =>
   prev.map((skill) => (skill.id === id ? { ...skill, item, category } : skill))
  );
 };

 const handleRemoveSkill = (id: string) => {
  setSkills((prev) => prev.filter((skill) => skill.id !== id));
 };

 const handleAddSkill = (categoryType: "technical" | "professional") => {
  const newSkill: Skill = {
   category: categoryType === "technical" ? "Nova Categoria" : "Profissionais",
   item: "Nova Habilidade",
   language: lang,
   order: skills.length,
  };
  setSkills((prev) => [...prev, newSkill]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveSkills(user.uid, lang, skills);
   setEditingTechnical(false);
   setEditingProfessional(false);
   alert("Habilidades salvas com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar as habilidades.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando habilidades...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Habilidades" : "Skills"}
    </h2>
   </div>

   {/* Seção Técnicas */}
   <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Técnicas</h3>
     <button
      onClick={() => setEditingTechnical(!editingTechnical)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingTechnical ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingTechnical ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={technicalSkills}
       onReorder={(newItems) => {
        const professionalItems = skills.filter(
         (s) => s.category === "Profissionais"
        );
        setSkills([...newItems, ...professionalItems]);
       }}
       className="space-y-4"
      >
       {technicalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1 grid grid-cols-1 gap-3">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, skill.category)
           }
           placeholder="Habilidade"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("technical")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Técnica
      </button>
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedTechnicalSkills).map(([category, items]) => (
       <div key={category} className="bg-gray-700 p-4 rounded-lg">
        <h4 className="font-bold text-white mb-2">{category}</h4>
        <ul className="flex flex-wrap gap-2">
         {items.map((item, index) => (
          <li
           key={index}
           className="bg-gray-600 text-white px-3 py-1 rounded-xl text-sm whitespace-normal break-words max-w-full"
          >
           {item}
          </li>
         ))}
        </ul>
       </div>
      ))}
     </div>
    )}
   </div>

   {/* Seção Profissionais */}
   <div>
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Profissionais</h3>
     <button
      onClick={() => setEditingProfessional(!editingProfessional)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingProfessional ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingProfessional ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={professionalSkills}
       onReorder={(newItems) => {
        const technicalItems = skills.filter(
         (s) => s.category !== "Profissionais"
        );
        setSkills([...technicalItems, ...newItems]);
       }}
       className="space-y-4"
      >
       {professionalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, "Profissionais")
           }
           placeholder="Habilidade Profissional"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("professional")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Profissional
      </button>
     </div>
    ) : (
     <div className="bg-gray-700 p-4 rounded-lg">
      <ul className="flex flex-wrap gap-2">
       {professionalSkills.map((skill, index) => (
        <li
         key={index}
         className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm whitespace-normal break-words max-w-full"
        >
         {skill.item}
        </li>
       ))}
      </ul>
     </div>
    )}
   </div>

   {/* Botão de salvar quando em modo de edição */}
   {(editingTechnical || editingProfessional) && (
    <div className="mt-6">
     <button
      onClick={handleSaveChanges}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded"
     >
      <FaSave /> Salvar Todas as Alterações
     </button>
    </div>
   )}
  </div>
 );
};

export default SkillsEditor;
```

## src/components/Banner.tsx
```tsx
"use client";
import React from "react";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";
import { Developer } from "@/core/models/Developer";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaGithub } from "react-icons/fa";
import { FaAward as AwardIcon } from "react-icons/fa";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { SettingsPanel } from "@/components/SettingsPanel";
import type { User } from "firebase/auth";
import { usePalette } from "@/styles/PaletteProvider";

interface BannerProps {
 logoUrl?: string;
 bgColor?: { bg: string; text: string };
 selectedBg?: BgBannerColorName;
 onSelectBg?: (color: BgBannerColorName) => void;
 user?: User | null;
}

export function getBgColorObj(bgName: BgBannerColorName) {
 const bgObj = bgBannerColor[bgName];
 const colorsArr = bgObj.colors;
 const bg = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "bg")) as {
   bg: string;
  }
 ).bg;
 const text = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "text")) as {
   text: string;
  }
 ).text;
 return { bg, text };
}

export const Banner: React.FC<BannerProps> = ({
 logoUrl,
 bgColor,
 selectedBg,
 onSelectBg,
 user,
}) => {
 const { bannerColor } = usePalette();
 const [currentLogoUrl, setCurrentLogoUrl] = React.useState(logoUrl);

 const dev = new Developer({
  name: user?.displayName || "Your Name",
  role: "Fullstack Developer",
  stack: ["React", "Node.js", "TypeScript"],
  company: "Mottu",
  position: "Development Intern",
 });

 // Prioriza o valor do contexto global (bannerColor)
 const effectiveBgColor = bannerColor
  ? getBgColorObj(bannerColor)
  : selectedBg
  ? getBgColorObj(selectedBg)
  : bgColor || getBgColorObj("midnightSlate");

 return (
  <section
   id="banner"
   style={{
    background: effectiveBgColor.bg,
    color: effectiveBgColor.text,
    borderColor: "var(--accent)",
    width: "1584px",
    height: "396px",
    paddingLeft: "500px", // Safe area for profile picture
   }}
   className="shadow-sm shadow-[color:var(--secondary)] flex flex-row gap-0 w-full relative"
  >
   {/* Settings Banner no canto superior esquerdo */}
   {selectedBg && onSelectBg && (
    <SettingsPanel
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={setCurrentLogoUrl}
     logoUrl={currentLogoUrl}
     showDownloadButton={true}
     position="left"
     downloadType="banner"
    />
   )}

   {/* Left content - shifted right */}
   <div className="w-[900px] flex flex-col justify-center">
    <div className="flex justify-start items-center space-x-4">
     <h1
      className="text-4xl font-bold mb-2 font-inter"
      style={{ color: effectiveBgColor.text }}
     >
      {dev.name}
     </h1>
     <Image
      id="company-logo"
      src={currentLogoUrl || "/wood1.jpg"}
      alt="Logo"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full bg-white shadow"
     />
    </div>
    <p className="italic mb-3 text-lg" style={{ color: effectiveBgColor.text }}>
     Driven by curiosity and continuous learning
    </p>
    <div className="flex items-center flex-wrap gap-2 mb-4 text-slate-200">
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Intern at <span className="font-bold text-[var(--accent)]">Mottu</span>
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Computer Science Student
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Systems Development Technician
     </span>
    </div>
    <div
     className="highlight-bg p-3 rounded-lg border-l-4 mb-4 flex items-center gap-2 text-lg bg-opacity-80"
     style={{
      borderColor: "var(--accent)",
      background: "var(--highlightBg)",
      maxWidth: "93%",
     }}
    >
     <span className="text-slate-200 mr-2">
      <AwardIcon color={effectiveBgColor.text} />
     </span>
     <span
      className="truncate whitespace-normal"
      style={{ color: effectiveBgColor.text }}
     >
      Recognized as the top graduate in Systems Development at SENAI
     </span>
     <span className="ml-2 px-2 py-0.5 rounded-full text-slate-200 bg-[var(--secondary)] text-xs text-shadow-lg/30 font-bold">
      2024
     </span>
    </div>
    <div className="flex flex-wrap gap-8 text-lg items-center">
     <span className="flex items-center gap-3">
      <MdEmail className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>
       efpatti.dev@gmail.com
      </span>
     </span>
     <span className="flex items-center gap-3">
      <FaPhoneAlt className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>+55 (11) 97883-3101</span>
     </span>
     <span className="flex items-center gap-3">
      <FaGithub className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>github.com/efpatti</span>
     </span>
    </div>
   </div>

   {/* Right content */}
   <div className="flex-1 flex items-center justify-end pr-10">
    <div className="flex flex-col items-center justify-center gap-3">
     <div style={{ transform: "scale(0.9)" }}>
      <div className="font-jetbrains">
       <CodeBlock dev={dev} bgColor={effectiveBgColor} />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};
```

## src/components/PaletteSelector.tsx
```tsx
"use client";

import { paletteTokens } from "@/styles/PaletteProvider";
import { ColorSelector } from "./ColorSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { useEffect, useCallback } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/core/services/AuthProvider";

const PALETTE_OPTIONS = (Object.keys(paletteTokens) as PaletteName[]).map(
 (key) => {
  const palette = paletteTokens[key];
  const colorsArr = palette.colors;
  const accentObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "accent")
  );
  const accent = accentObj ? (accentObj as { accent: string }).accent : "#000";
  const colorName = palette.colorName[0]["pt-br"] ?? key;
  return {
   value: key,
   label: colorName,
   color: accent,
  };
 }
) as { value: PaletteName; label: string; color: string }[];

interface PaletteSelectorProps {
 bgName: BgBannerColorName;
 selected: PaletteName;
 onSelect: (p: PaletteName) => void;
}

export const PaletteSelector = ({
 bgName,
 selected,
 onSelect,
}: PaletteSelectorProps) => {
 const { user } = useAuth();

 // Atualiza Firestore ao mudar a cor
 const handleSelect = useCallback(
  async (palette: PaletteName) => {
   onSelect(palette);
   if (user) {
    await updateDoc(doc(db, "users", user.uid), { palette });
   }
  },
  [user, onSelect]
 );

 useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
   if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.palette && data.palette !== selected) {
     onSelect(data.palette);
    }
   }
  });

  return () => unsubscribe();
 }, [user, selected, onSelect]);

 return (
  <ColorSelector
   options={PALETTE_OPTIONS}
   selected={selected}
   onSelect={handleSelect}
   selectedBg={bgName}
  />
 );
};
```

## src/components/Section.tsx
```tsx
import React from "react";

interface SectionProps {
 title: string;
 children: React.ReactNode;
 accent?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, accent }) => (
 <section className="p-4">
  <h3
   className="text-xl font-semibold pb-2 mb-4 flex items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:shadow-[0_1px_2px_0_var(--accent)] p-1 text-[var(--accent)]"
   style={accent ? { boxShadow: `0 1px 0 0 ${accent}` } : {}}
  >
   {title}
  </h3>
  {children}
 </section>
);

export default Section;
```

## src/components/SkillCategory.tsx
```tsx
import React from "react";
import { SkillCategory } from "@/types/resume";

interface SkillCategoryProps {
 category: SkillCategory;
 textClass?: string;
}

const SkillCategoryComponent: React.FC<SkillCategoryProps> = ({
 category,
 textClass = "text-gray-700",
}) => {
 return (
  <div className="mb-4">
   <h4 className={`font-semibold mb-2 ${textClass}`}>{category.title}</h4>
   <ul className={`list-disc pl-5 space-y-1 ${textClass}`}>
    {category.items.map((item, index) => (
     <li key={index}>{item}</li>
    ))}
   </ul>
  </div>
 );
};

export default SkillCategoryComponent;
```

## src/components/LogoSearch.tsx
```tsx
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface LogoSearchProps {
 onLogoSelect: (logoUrl: string) => void;
}

interface LogoResult {
 domain: string;
 logo_url: string;
 name?: string;
}

export const LogoSearch: React.FC<LogoSearchProps> = ({ onLogoSelect }) => {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<LogoResult[]>([]);
 const [loading, setLoading] = useState(false);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);
 const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

 // Busca automática com debounce
 useEffect(() => {
  console.log("[LogoSearch] useEffect", { query });
  if (query.length < 2) {
   setResults([]);
   setShowSuggestions(false);
   return;
  }
  setLoading(true);
  if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  debounceTimeout.current = setTimeout(async () => {
   const res = await fetch(`/api/brand-search?q=${encodeURIComponent(query)}`);
   const data = await res.json();
   setResults(data.results || []);
   setShowSuggestions(true);
   setLoading(false);
  }, 400);
  return () => {
   if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };
 }, [query]);

 const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);

 const handleSelect = (logo: LogoResult) => {
  onLogoSelect(logo.logo_url);
  setShowSuggestions(false);
  setQuery(logo.domain);
 };

 const handleRemove = () => {
  onLogoSelect("/img/mottu.jpg");
  setQuery("");
  setShowSuggestions(false);
 };

 // Variantes de animação
 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
   y: 0,
   opacity: 1,
   transition: {
    type: "spring" as const,
    stiffness: 300,
   },
  },
  pulse: {
   scale: [1, 1.1, 1],
   transition: {
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut" as const,
   },
  },
 };

 console.log("[LogoSearch] render", { query, results, loading });

 return (
  <div className="mt-6 flex items-center gap-3 w-full max-w-2xl">
   <div className="relative flex-1">
    {/* Input com veias luminosas */}
    <motion.div
     initial={false}
     animate={{
      boxShadow:
       query.length > 0
        ? "0 0 10px rgb(255, 255, 255)"
        : "0 0 5px rgba(74, 222, 128, 0.2)",
     }}
     className="relative"
    >
     <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => query.length >= 2 && setShowSuggestions(true)}
      onBlur={handleBlur}
      placeholder=" "
      autoComplete="off"
      className="peer px-4 py-3 w-full bg-zinc-900 border-2 border-zinc-800/30 rounded-lg text-gray-200 focus:border-zinc-500 focus:ring-0 transition-all duration-300"
     />

     {/* Efeito de veias luminosas */}
     <motion.div
      initial={{ opacity: 0 }}
      animate={{
       opacity: query.length > 0 ? 0.7 : 0.3,
       backgroundImage:
        query.length > 0
         ? "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
         : "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
      }}
      className="absolute inset-0 rounded-6xl pointer-events-none"
     />

     <label
      htmlFor="company-domain"
      className="absolute left-3 top-3 px-1 text-zinc-300 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400/60 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-400 peer-focus:bg-zinc-900/90 z-10"
     >
      Digite o nome ou domínio (ex: Google ou google.com)
     </label>

     {/* Micélio animado (fungo) */}
     <motion.div
      initial={{ width: 0 }}
      animate={{
       width: query.length > 0 ? "100%" : "0%",
      }}
      className="absolute bottom-0 left-0 h-0.5 bg-zinc-400 origin-left"
     />
    </motion.div>

    {/* Sugestões com efeito orgânico e scroll personalizado */}
    <AnimatePresence>
     {showSuggestions && (
      <motion.div
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.2 }}
       className="absolute z-10 w-full mt-1 overflow-hidden"
      >
       <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-zinc-950/95 backdrop-blur-sm border-2 border-zinc-800/30 rounded-lg shadow-xl overflow-y-auto max-h-56 custom-organic-scroll"
       >
        <div className="pr-2">
         {" "}
         {/* Espaço para a barra de scroll */}
         {loading ? (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300 flex items-center gap-2"
          >
           <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full"
           />
           Carregando redes orgânicas...
          </motion.div>
         ) : results.length > 0 ? (
          results.map((brand) => (
           <motion.div
            key={brand.domain}
            variants={itemVariants}
            whileHover={{ backgroundColor: "rgb(54, 65, 83)" }}
            className="flex items-center px-4 py-3 cursor-pointer border-b border-zinc-900/30 last:border-b-0 bg-gray-700/50 transition-colors duration-200"
            onClick={() => handleSelect(brand)}
           >
            <motion.div
             variants={itemVariants}
             animate="pulse"
             className="relative w-8 h-8 rounded-full bg-white/10 p-1 mr-3"
            >
             <Image
              src={brand.logo_url}
              alt={brand.name || brand.domain}
              width={32}
              height={32}
              className="rounded-full"
             />
            </motion.div>
            <div>
             <div className="font-medium text-zinc-100">
              {brand.name || brand.domain}
             </div>
             <div className="text-xs text-zinc-300/70">{brand.domain}</div>
            </div>
           </motion.div>
          ))
         ) : (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300/70"
          >
           Nenhum organismo encontrado
          </motion.div>
         )}
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>

   {/* Botão de remover com efeito orgânico */}
   <motion.button
    onClick={handleRemove}
    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className="rounded-lg p-3 bg-red-900/30 text-red-400 ml-1 border-2 border-red-800/30"
    title="Remover logo"
   >
    <FaTrash />
   </motion.button>
  </div>
 );
};
```

## src/components/FloatingActionButton.tsx
```tsx
// components/FloatingActionButton.tsx
"use client";

import { motion } from "framer-motion";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
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
```

