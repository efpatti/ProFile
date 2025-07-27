"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoSVG from "@/components/LogoSVG";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
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

const MainLinks = () => (
 <div className="hidden md:flex bg-gradient-to-r from-zinc-900/30 via-zinc-700/30 to-zinc-900/30 backdrop-blur-sm rounded-full px-8 py-2 space-x-8 border border-white/10 shadow-lg">
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
 <div className="flex items-center space-x-3">
  {authRoutes.map((route) => (
   <Link
    key={route.href}
    href={route.href}
    className={
     route.href.includes("sign-in")
      ? "text-sm font-medium text-white border border-blue-400/50 px-4 py-1.5 rounded-md hover:bg-blue-500/20 hover:border-blue-400 transition-all"
      : "text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-1.5 rounded-md transition-all shadow-md hover:shadow-blue-500/20"
    }
   >
    {route.title.en}
   </Link>
  ))}
 </div>
);

const AuthActions = ({ isLogged }: { isLogged: boolean }) => (
 <div className="flex items-center space-x-4">
  <a
   href="https://github.com/seurepo"
   target="_blank"
   rel="noopener noreferrer"
   className="text-white/80 hover:text-white transition-all p-2 hover:bg-white/10 rounded-full"
  >
   <FaGithub size={18} />
  </a>
  {!isLogged && <AuthLinks />}
 </div>
);

const ProfileMenu = ({ user }: { user: UserWithProfile | null }) => {
 const [open, setOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);

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
     <span className="font-bold text-lg">{displayName[0]?.toUpperCase()}</span>
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
 const { isLogged, user } = useAuth();

 useEffect(() => {
  const handleScroll = () => {
   setIsScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
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
    <Link href="/" className="flex items-center">
     <LogoSVG className="w-36 h-36 hover:opacity-90 transition" />
    </Link>

    <MainLinks />

    <div className="flex items-center space-x-4">
     {isLogged && <ProfileMenu user={user} />}
     <AuthActions isLogged={isLogged} />
    </div>
   </div>
  </motion.nav>
 );
};

export default Navbar;
