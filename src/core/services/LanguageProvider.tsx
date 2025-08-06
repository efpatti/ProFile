"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "pt-br" | "en";

interface LanguageContextType {
 language: Language;
 setLanguage: (language: Language) => void;
 toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
 undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
 children,
}) => {
 const [language, setLanguage] = useState<Language>("pt-br");

 const toggleLanguage = () => {
  setLanguage((prev) => (prev === "pt-br" ? "en" : "pt-br"));
 };

 return (
  <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
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
