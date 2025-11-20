"use client";
import React from "react";
import { AuthProvider } from "@/core/services/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { PaletteProvider } from "@/styles/pallete_provider";
import { LanguageProvider } from "@/core/services/LanguageProvider";
import { PaletteSyncWrapper } from "@/components/PaletteSyncWrapper";
import { BannerColorSyncWrapper } from "@/components/BannerColorSyncWrapper";
import { ToastProvider } from "./ToastProvider";

const AppProvidersBase: React.FC<{ children: React.ReactNode }> = ({
 children,
}) => {
 return (
  <AuthProvider>
   <ThemeProvider>
    <PaletteProvider>
     <LanguageProvider>
      <PaletteSyncWrapper>
       <BannerColorSyncWrapper>
        {children}
        <ToastProvider />
       </BannerColorSyncWrapper>
      </PaletteSyncWrapper>
     </LanguageProvider>
    </PaletteProvider>
   </ThemeProvider>
  </AuthProvider>
 );
};

export const AppProviders = AppProvidersBase;
