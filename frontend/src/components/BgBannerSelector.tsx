"use client";

import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/shared_style_constants";
import { ColorSelector } from "./ColorSelector";

export const BgBannerSelector = ({
 selected,
 onSelect,
}: {
 selected: BgBannerColorName;
 onSelect: (color: BgBannerColorName) => void;
}) => {
 const colorOptions = Object.entries(bgBannerColor).map(([name, colorObj]) => {
  const colorsArr = colorObj?.colors || [];
  const bgObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "bg")
  );
  const bg = bgObj ? (bgObj as { bg: string }).bg : "#fff";
  const colorName = colorObj?.colorName?.[0]?.["pt-br"] ?? name;
  return {
   value: name as BgBannerColorName,
   color: bg,
   label: colorName,
  };
 });

 return (
  <ColorSelector
   options={colorOptions}
   selected={selected}
   onSelect={onSelect}
   selectedBg={selected}
  />
 );
};
