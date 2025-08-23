"use client";
import React from "react";
import { AuthProvider } from "@/core/services/AuthProvider";
import { PaletteProvider } from "@/styles/PaletteProvider";
import { LanguageProvider } from "@/core/services/LanguageProvider";
import { PaletteSyncWrapper } from "@/components/PaletteSyncWrapper";
import { BannerColorSyncWrapper } from "@/components/BannerColorSyncWrapper";

const AppProvidersBase: React.FC<{ children: React.ReactNode }> = ({
 children,
}) => {
 return (
  <AuthProvider>
   <PaletteProvider>
    <LanguageProvider>
     <PaletteSyncWrapper />
     <BannerColorSyncWrapper />
     {children}
    </LanguageProvider>
   </PaletteProvider>
  </AuthProvider>
 );
};

export const AppProviders = AppProvidersBase;
