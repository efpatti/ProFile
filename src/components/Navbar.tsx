"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/core/services/AuthProvider";
import { useLanguage } from "@/core/services/LanguageProvider";
import { MainLinks } from "@/features/navigation/components/MainLinks";
import { AuthLinks } from "@/features/navigation/components/AuthLinks";
import { MenuButton } from "@/features/navigation/components/MenuButton";
import { MobileMenu } from "@/features/navigation/components/MobileMenu";
import { ProfileMenu } from "@/features/navigation/components/ProfileMenu";

const Navbar = () => {
 const [isScrolled, setIsScrolled] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const { isLogged, user } = useAuth();
 const { t, toggleLanguage, language } = useLanguage();

 useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
  <>
   <nav
    className={`fixed top-0 w-full z-50 transition-all duration-300 ${
     isScrolled
      ? "backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.6)]"
      : "bg-transparent"
    }`}
   >
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
     <Link
      href="/"
      className="flex items-center group"
      onClick={() => setMenuOpen(false)}
     >
      <div className="relative flex items-center">
       <span className="ml-[-28px] pl-2 text-lg font-semibold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent hidden sm:inline-flex">
        ProFile
       </span>
      </div>
     </Link>
     <MainLinks />
     <div className="flex items-center">
      <div className="flex items-center gap-2 rounded-xl bg-zinc-800/40 border border-white/10 backdrop-blur-md px-2 h-10 shadow-sm">
       {/* Accent dot shows active palette accent */}
       <span
        className="hidden md:inline-block w-2.5 h-2.5 rounded-full shadow ring-2 ring-white/10"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
       />
       {/* Language segmented control */}
       <div
        className="flex text-[10px] font-semibold tracking-wide rounded-md overflow-hidden border border-white/10"
        role="tablist"
        aria-label="Language selector"
       >
        {(["en", "pt-br"] as const).map((lng) => {
         const active = language === lng;
         return (
          <button
           key={lng}
           role="tab"
           aria-selected={active}
           onClick={() => (active ? null : toggleLanguage())}
           className={
            "px-2 py-1 transition-all focus:outline-none focus-ring " +
            (active
             ? "bg-white/15 text-white"
             : "text-white/60 hover:text-white hover:bg-white/5")
           }
          >
           {lng === "en" ? "EN" : "PT"}
          </button>
         );
        })}
       </div>
       {isLogged && <ProfileMenu user={user} />}
       {!isLogged && <AuthLinks />}
       <MenuButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
      </div>
     </div>
    </div>
   </nav>
   <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
    <div className="w-full space-y-6">
     <MainLinks isMobile />
     {isLogged && (
      <Link
       href="/protected/profile"
       className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 hover:to-[var(--accent)]/60 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
       onClick={() => setMenuOpen(false)}
      >
       My Profile
      </Link>
     )}
     {!isLogged && <AuthLinks />}
    </div>
   </MobileMenu>
  </>
 );
};

export default Navbar;
