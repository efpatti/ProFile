"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const paletteTokens = {
 darkGreen: {
  accent: "#22c55e",
  key: "#f7fafc",
  highlightBg: "rgba(34, 197, 94, 0.1)",
  accent30: "rgba(34, 197, 94, 0.3)",
  btn: "#16a34a",
  secondary: "#4ade80",
  secondarySoft: "#bbf7d0",
 },
 deepBlue: {
  accent: "#3b82f6",
  key: "#f8fafc",
  highlightBg: "rgba(59, 130, 246, 0.1)",
  accent30: "rgba(59, 130, 246, 0.3)",
  btn: "#2563eb",
  secondary: "#60a5fa",
  secondarySoft: "#dbeafe",
 },
 vibrantPurple: {
  accent: "#a855f7",
  key: "#faf5ff",
  highlightBg: "rgba(168, 85, 247, 0.1)",
  accent30: "rgba(168, 85, 247, 0.3)",
  btn: "#9333ea",
  secondary: "#c084fc",
  secondarySoft: "#ede9fe",
 },
 sunsetOrange: {
  accent: "#f97316",
  key: "#fff7ed",
  highlightBg: "rgba(249, 115, 22, 0.1)",
  accent30: "rgba(249, 115, 22, 0.3)",
  btn: "#ea580c",
  secondary: "#fdba74",
  secondarySoft: "#ffedd5",
 },
 teal: {
  accent: "#14b8a6",
  key: "#f0fdfa",
  highlightBg: "rgba(20, 184, 166, 0.1)",
  accent30: "rgba(20, 184, 166, 0.3)",
  btn: "#0d9488",
  secondary: "#2dd4bf",
  secondarySoft: "#ccfbf1",
 },
};

export type PaletteName = keyof typeof paletteTokens;

interface PaletteContextProps {
 palette: PaletteName;
 setPalette: (p: PaletteName) => void;
}

const PaletteContext = createContext<PaletteContextProps | undefined>(
 undefined
);

export const paletteActiveState = {
 value: "darkGreen",
 set(newPalette: PaletteName) {
  this.value = newPalette;
 },
};

export const usePalette = () => {
 const ctx = useContext(PaletteContext);
 if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
 return ctx;
};

export const PaletteProvider: React.FC<{
 children: React.ReactNode;
 initialPalette?: PaletteName;
}> = ({ children, initialPalette = "darkGreen" }) => {
 const [palette, setPalette] = useState<PaletteName>(initialPalette);
 useEffect(() => {
  paletteActiveState.value = palette;
  const tokens = paletteTokens[palette];
  for (const [key, value] of Object.entries(tokens)) {
   document.documentElement.style.setProperty(`--${key}`, value);
  }
 }, [palette]);
 return (
  <PaletteContext.Provider value={{ palette, setPalette }}>
   {children}
  </PaletteContext.Provider>
 );
};
