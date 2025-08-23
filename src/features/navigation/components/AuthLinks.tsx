"use client";
import Link from "next/link";
import { authRoutes } from "@/constants/routes";
import { useLanguage } from "@/core/services/LanguageProvider";
import { Button } from "@/shared/components/Button";

export const AuthLinks = () => {
 const { t } = useLanguage();
 return (
  <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
   {authRoutes.map((route) => {
    const isSignIn = route.key === "signIn";
    return (
     <Link key={route.href} href={route.href} className="contents">
      <Button
       variant={isSignIn ? "outline" : "primary"}
       size="sm"
       className={isSignIn ? "min-w-[90px]" : "min-w-[90px]"}
      >
       {t(`nav.${route.key}`)}
      </Button>
     </Link>
    );
   })}
  </div>
 );
};
