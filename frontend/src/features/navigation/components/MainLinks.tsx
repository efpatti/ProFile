"use client";
import Link from "next/link";
import {
 mainPublicRoutes,
 bannerAndResumeRoutes,
 contactRoute,
} from "@/constants/routes";
import { useLanguage } from "@/core/services/LanguageProvider";

export const MainLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
 const { t } = useLanguage();
 return (
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
      {t(`nav.${route.key}`)}
     </Link>
    ))}
   {contactRoute && (
    <Link
     key={contactRoute.href}
     href={contactRoute.href}
     className="text-white/90 text-sm hover:text-white transition-all flex items-center group"
    >
     {t(`nav.${contactRoute.key}`)}
    </Link>
   )}
  </div>
 );
};
