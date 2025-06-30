// components/PaletteSelector.tsx
"use client";

import { usePalette, paletteTokens } from "@/styles/PaletteProvider";
import { ColorSelector } from "./ColorSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

const PALETTE_OPTIONS = (Object.keys(paletteTokens) as PaletteName[]).map(
 (key) => {
  const palette = paletteTokens[key];
  // Busca o valor de accent
  const colorsArr = palette.colors;
  const accentObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "accent")
  );
  const accent = accentObj ? (accentObj as { accent: string }).accent : "#000";
  // Busca o nome pt-br
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
}

export const PaletteSelector = ({ bgName }: PaletteSelectorProps) => {
 const { palette, setPalette } = usePalette();

 return (
  <ColorSelector
   options={PALETTE_OPTIONS}
   selected={palette}
   onSelect={setPalette}
   selectedBg={bgName}
  />
 );
};
