// components/PaletteSelector.tsx
"use client";

import { usePalette, paletteTokens } from "@/styles/PaletteProvider";
import { ColorSelector } from "./ColorSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

const PALETTE_OPTIONS = [
 { value: "darkGreen", label: "Verde Floresta" },
 { value: "deepBlue", label: "Azul Profundo" },
 { value: "vibrantPurple", label: "Lavanda" },
 { value: "sunsetOrange", label: "Pôr do Sol" },
 { value: "teal", label: "Turquesa" },
].map((opt) => ({
 ...opt,
 color: paletteTokens[opt.value as PaletteName].accent,
})) as { value: PaletteName; label: string; color: string }[];

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
