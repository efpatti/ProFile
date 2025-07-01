"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoSVG from "@/components/LogoSVG";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
 const [isScrolled, setIsScrolled] = useState(false);

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
     ? "backdrop-blur-md bg-zinc-900/60 border-b border-zinc-800/50"
     : "bg-transparent"
   }`}
  >
   <div className="max-w-7xl mx-auto flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center space-x-2">
     <LogoSVG className="w-40 h-40" />
    </div>

    {/* Links principais */}
    <div className="hidden md:flex bg-[#0a0a1f] rounded-full px-6 py-2 space-x-6">
     <Link href="/" className="text-white text-sm hover:opacity-80 transition">
      Home <span className="ml-1">▾</span>
     </Link>
     <Link
      href="/about"
      className="text-white text-sm hover:opacity-80 transition"
     >
      About <span className="ml-1">▾</span>
     </Link>
     <Link
      href="/docs"
      className="text-white text-sm hover:opacity-80 transition"
     >
      Docs
     </Link>
     <Link
      href="/blog"
      className="text-white text-sm hover:opacity-80 transition"
     >
      Blog
     </Link>
    </div>

    {/* Ações - GitHub, YouTube, Login, Sign up */}
    <div className="flex items-center space-x-3">
     <a
      href="https://github.com/seurepo"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white text-sm flex items-center space-x-1"
     >
      <FaGithub size={20} />
     </a>

     <Link
      href="/auth/sign-in"
      className="text-sm font-medium text-white border border-blue-500 px-4 py-1.5 rounded-md hover:bg-blue-600/10 transition"
     >
      Log in
     </Link>
     <Link
      href="/auth/sign-up"
      className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition"
     >
      Sign up
     </Link>
    </div>
   </div>
  </motion.nav>
 );
};

export default Navbar;
