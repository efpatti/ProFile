"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profileRoute } from "@/constants/routes";
import { colorPalettes, PaletteName } from "@/styles/shared_style_constants";
import { usePalette } from "@/styles/pallete_provider";
import type { UserWithProfile } from "@/core/services/AuthProvider";
import signOut from "@/core/services/signOut";

const getPaletteInfo = (palette: string | undefined) => {
 if (!palette || !(palette in colorPalettes)) return null;
 const info = colorPalettes[palette as PaletteName];
 return {
  label: info.colorName?.[0]?.["pt-br"] || palette,
  color: info.colors?.[0]?.accent || "#888",
 };
};

export const ProfileMenu = ({ user }: { user: UserWithProfile | null }) => {
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
  <div className="relative" ref={menuRef}>
   <button
    onClick={() => setOpen((v) => !v)}
    className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800/60 border border-white/10 hover:border-white/20 shadow-sm hover:shadow-md transition-all overflow-hidden group focus:outline-none focus-ring"
    aria-label="Open user menu"
    aria-haspopup="true"
    aria-expanded={open}
   >
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_30%,var(--accent)_0%,transparent_70%)] transition-opacity" />
    {avatar ? (
     <Image
      src={avatar}
      alt="avatar"
      width={36}
      height={36}
      className="w-9 h-9 rounded-full object-cover relative z-10"
      unoptimized
      loading="lazy"
     />
    ) : (
     <span className="relative z-10 flex items-center justify-center w-full h-full font-semibold text-sm text-white/90">
      {displayName[0]?.toUpperCase()}
     </span>
    )}
    {/* Accent ring */}
    <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-[var(--accent)]/60 transition-all" />
   </button>
   {open && (
    <motion.div
     initial={{ opacity: 0, y: 8, scale: 0.98 }}
     animate={{ opacity: 1, y: 0, scale: 1 }}
     exit={{ opacity: 0, y: 4, scale: 0.98 }}
     transition={{ duration: 0.18, ease: "easeOut" }}
     className="absolute right-0 mt-3 w-72 rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/60 bg-zinc-900/85 backdrop-blur-xl border border-white/10 z-50"
     style={{ willChange: "transform, opacity" }}
     role="menu"
    >
     {/* Header section */}
     <div className="relative h-24 bg-gradient-to-br from-[var(--accent)]/90 via-[var(--accent)] to-[var(--accent)]/70">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,white,transparent_55%)]" />
      <div className="absolute -bottom-8 left-5 w-20 h-20 rounded-2xl shadow-lg ring-4 ring-zinc-900/90 overflow-hidden bg-zinc-800/50 backdrop-blur flex items-center justify-center">
       {avatar ? (
        <Image
         src={avatar}
         alt="avatar"
         width={80}
         height={80}
         className="w-20 h-20 object-cover"
         unoptimized
         loading="lazy"
        />
       ) : (
        <span className="text-3xl font-bold text-white/95">
         {displayName[0]?.toUpperCase()}
        </span>
       )}
      </div>
     </div>
     <div className="pt-10 px-5 pb-4">
      <div className="flex flex-col gap-1">
       <h3 className="text-white font-semibold text-sm leading-tight truncate">
        {displayName}
       </h3>
       <p className="text-[11px] text-white/50 truncate" title={email}>
        {email}
       </p>
       {paletteInfo && (
        <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium text-white/70 border border-white/10 w-fit">
         <span
          className="w-2.5 h-2.5 rounded-full ring-2 ring-zinc-900"
          style={{ backgroundColor: paletteInfo.color }}
         />
         {paletteInfo.label}
        </div>
       )}
      </div>
     </div>
     <div className="px-3 pb-3 pt-1 border-t border-white/10 flex flex-col gap-2">
      <Link
       href={profileRoute?.href || "/profile"}
       className="w-full text-center text-sm font-medium rounded-lg px-4 py-2 bg-[var(--accent)] text-white/95 hover:brightness-110 transition shadow-md hover:shadow-lg active:scale-[0.985] focus:outline-none focus-ring"
       onClick={() => setOpen(false)}
       role="menuitem"
      >
       My Profile
      </Link>
      <button
       onClick={signOut}
       className="w-full text-center text-xs font-medium rounded-lg px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition focus:outline-none focus-ring"
       role="menuitem"
      >
       Sign Out
      </button>
     </div>
    </motion.div>
   )}
  </div>
 );
};
