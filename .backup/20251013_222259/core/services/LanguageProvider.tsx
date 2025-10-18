"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { getDictionary, Locale } from "@/features/i18n";

interface LanguageContextType {
 language: Locale;
 setLanguage: (language: Locale) => void;
 toggleLanguage: () => void;
 t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
 undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
 children,
}) => {
 const [language, setLanguage] = useState<Locale>("pt-br");
 const dict = getDictionary(language);
 const t = (path: string) => {
  return (
   path
    .split(".")
    .reduce<any>((acc, key) => (acc ? acc[key] : undefined), dict) || path
  );
 };
 const toggleLanguage = () => {
  setLanguage((prev) => (prev === "pt-br" ? "en" : "pt-br"));
 };
 return (
  <LanguageContext.Provider
   value={{ language, setLanguage, toggleLanguage, t }}
  >
   {children}
  </LanguageContext.Provider>
 );
};

export const useLanguage = () => {
 const context = useContext(LanguageContext);
 if (context === undefined) {
  throw new Error("useLanguage must be used within a LanguageProvider");
 }
 return context;
};
