// components/BgBannerSelector.tsx
"use client";

import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { ColorSelector } from "./ColorSelector";

export const BgBannerSelector = ({
 selected,
 onSelect,
}: {
 selected: BgBannerColorName;
 onSelect: (color: BgBannerColorName) => void;
}) => {
 const colorOptions = Object.entries(bgBannerColor).map(([name, colorObj]) => ({
  value: name as BgBannerColorName,
  color: colorObj.bg,
 }));

 return (
  <ColorSelector
   options={colorOptions}
   selected={selected}
   onSelect={onSelect}
   selectedBg={selected}
  />
 );
};
