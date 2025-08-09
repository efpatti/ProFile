"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogoSVG from "@/components/LogoSVG";
import { useEffect, useRef, useState, memo } from "react";
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

const MobileMenu = memo(({ isOpen, onClose, children }: MobileMenuProps) => (
 <AnimatePresence>
  {isOpen && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-sm pt-16"
    style={{ willChange: "opacity" }}
   >
    <motion.div
     initial={{ y: -20 }}
     animate={{ y: 0 }}
     exit={{ y: -20 }}
     className="container mx-auto p-6 overflow-y-auto h-full"
     style={{ willChange: "transform" }}
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
));

// Hamburger Menu Button component
interface MenuButtonProps {
 onClick: () => void;
 isOpen: boolean;
}

const MenuButton = memo(({ onClick, isOpen }: MenuButtonProps) => (
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
));

const MainLinks = memo(({ isMobile = false }: { isMobile?: boolean }) => (
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
));

const AuthLinks = memo(() => (
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
));

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

const ProfileMenu = memo(({ user }: { user: UserWithProfile | null }) => {
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
      loading="lazy"
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
     style={{ willChange: "transform, opacity" }}
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
        loading="lazy"
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
});

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
    style={{ willChange: "transform, opacity" }}
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
