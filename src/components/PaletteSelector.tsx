"use client";

import { paletteTokens } from "@/styles/PaletteProvider";
import { ColorSelector } from "./ColorSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { useEffect, useCallback } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/core/services/AuthProvider";

const PALETTE_OPTIONS = (Object.keys(paletteTokens) as PaletteName[]).map(
 (key) => {
  const palette = paletteTokens[key];
  const colorsArr = palette.colors;
  const accentObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "accent")
  );
  const accent = accentObj ? (accentObj as { accent: string }).accent : "#000";
  const colorName = palette.colorName[0]["pt-br"] ?? key;
  return {
   value: key,
   label: colorName,
   color: accent,
  };
 }
) as { value: PaletteName; label: string; color: string }[];

interface PaletteSelectorProps {
 bgName: BgBannerColorName;
 selected: PaletteName;
 onSelect: (p: PaletteName) => void;
}

export const PaletteSelector = ({
 bgName,
 selected,
 onSelect,
}: PaletteSelectorProps) => {
 const { user } = useAuth();

 // Atualiza Firestore ao mudar a cor
 const handleSelect = useCallback(
  async (palette: PaletteName) => {
   onSelect(palette);
   if (user) {
    await updateDoc(doc(db, "users", user.uid), { palette });
   }
  },
  [user, onSelect]
 );

 useEffect(() => {
  if (!user) return;
  // One-time fetch instead of realtime subscription
  (async () => {
   const docSnap = await getDoc(doc(db, "users", user.uid));
   if (docSnap.exists()) {
    const data = docSnap.data() as { palette?: PaletteName };
    if (data.palette && data.palette !== selected) {
     onSelect(data.palette);
    }
   }
  })();
 }, [user]);

 return (
  <ColorSelector
   options={PALETTE_OPTIONS}
   selected={selected}
   onSelect={handleSelect}
   selectedBg={bgName}
  />
 );
};
