"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
 colorPalettes,
 type PaletteName as SharedPaletteName,
 bgBannerColor,
} from "./sharedStyleConstants";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Adaptando os tipos para manter compatibilidade
export type PaletteName = SharedPaletteName;
export type BannerColorName = keyof typeof bgBannerColor;

interface PaletteContextProps {
 palette: PaletteName;
 setPalette: (p: PaletteName) => void;
 bannerColor: BannerColorName;
 setBannerColor: (b: BannerColorName) => void;
 paletteTokens: typeof colorPalettes;
}

const PaletteContext = createContext<PaletteContextProps | undefined>(
 undefined
);

export const paletteActiveState = {
 value: "darkGreen" as PaletteName,
 set(newPalette: PaletteName) {
  this.value = newPalette;
 },
};

export const bannerColorActiveState = {
 value: "pureWhite" as BannerColorName,
 set(newBannerColor: BannerColorName) {
  this.value = newBannerColor;
 },
};

// Exporta os tokens para uso fora do contexto React
export const paletteTokens = colorPalettes;

export const usePalette = () => {
 const ctx = useContext(PaletteContext);
 if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
 return ctx;
};

export const PaletteProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const { user } = useAuth();
 const [palette, setPalette] = useState<PaletteName | undefined>(undefined);
 const [bannerColor, setBannerColor] = useState<BannerColorName | undefined>(
  undefined
 );
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!user) {
   setPalette("darkGreen");
   setBannerColor("pureWhite");
   setLoading(false);
   return;
  }
  let ignore = false;
  const fetchPalette = async () => {
   const userDoc = await getDoc(doc(db, "users", user.uid));
   if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.palette && !ignore) setPalette(data.palette as PaletteName);
    else if (!ignore) setPalette("darkGreen");
    if (data.bannerColor && !ignore)
     setBannerColor(data.bannerColor as BannerColorName);
    else if (!ignore) setBannerColor("pureWhite");
   } else {
    if (!ignore) setPalette("darkGreen");
    if (!ignore) setBannerColor("pureWhite");
   }
   setLoading(false);
  };
  fetchPalette();
  return () => {
   ignore = true;
  };
 }, [user]);

 useEffect(() => {
  console.log("[PaletteProvider] useEffect palette", { palette });
  if (!palette) return;
  paletteActiveState.value = palette;
  const tokensArr = colorPalettes[palette].colors;
  // Utilitário para pegar valor pelo nome (corrigido para tipagem)
  function getColor<T extends string>(name: T): string | undefined {
   const found = tokensArr.find((c) =>
    Object.prototype.hasOwnProperty.call(c, name)
   );
   return found ? (found as Record<T, string>)[name] : undefined;
  }

  // Aplicando as cores como variáveis CSS
  const accent = getColor("accent") ?? null;
  document.documentElement.style.setProperty("--accent", accent);
  const key = getColor("key") ?? null;
  document.documentElement.style.setProperty("--key", key);
  const secondary = getColor("secondary") ?? null;
  document.documentElement.style.setProperty("--secondary", secondary);
  const secondarySoft = getColor("secondarySoft") ?? null;
  document.documentElement.style.setProperty("--secondary-soft", secondarySoft);

  // Para cores com opacidade (convertendo para rgba)
  const highlightBg = getColor("highlightBg")?.match(/rgba?\(([^)]+)\)/)?.[1];
  if (highlightBg) {
   document.documentElement.style.setProperty("--highlight-bg", highlightBg);
  }

  const accent30 = getColor("accent30")?.match(/rgba?\(([^)]+)\)/)?.[1];
  if (accent30) {
   document.documentElement.style.setProperty("--accent-30", accent30);
  }
 }, [palette]);

 useEffect(() => {
  console.log("[PaletteProvider] useEffect bannerColor", { bannerColor });
  if (!bannerColor) return;
  bannerColorActiveState.value = bannerColor;
 }, [bannerColor]);

 if (loading || !palette || !bannerColor) return null;

 console.log("[PaletteProvider] render", { loading, palette, bannerColor });

 return (
  <PaletteContext.Provider
   value={{
    palette,
    setPalette,
    bannerColor,
    setBannerColor,
    paletteTokens: colorPalettes,
   }}
  >
   {children}
  </PaletteContext.Provider>
 );
};
