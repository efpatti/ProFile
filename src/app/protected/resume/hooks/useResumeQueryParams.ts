/**
 * useResumeQueryParams - Single Responsibility
 *
 * Responsabilidade ÚNICA:
 * - Extrair e processar query params da URL
 * - Sincronizar palette/bannerColor com query string
 *
 * Uncle Bob: "Extract methods until you can't extract anymore"
 */

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePalette } from "@/styles/pallete_provider";
import type {
 PaletteName,
 BgBannerColorName,
} from "@/styles/shared_style_constants";

export function useResumeQueryParams() {
 const searchParams = useSearchParams();
 const { palette, bannerColor, setPalette, setBannerColor } = usePalette();

 const paletteFromQuery = searchParams?.get("palette") as PaletteName | null;
 const bannerColorFromQuery = searchParams?.get(
  "bannerColor"
 ) as BgBannerColorName | null;
 const forcedUserId = searchParams?.get("user");

 // Sync palette from query params
 useEffect(() => {
  if (paletteFromQuery && paletteFromQuery !== palette) {
   setPalette(paletteFromQuery);
  }
 }, [paletteFromQuery, palette, setPalette]);

 // Sync banner color from query params
 useEffect(() => {
  if (bannerColorFromQuery && bannerColorFromQuery !== bannerColor) {
   setBannerColor(bannerColorFromQuery);
  }
 }, [bannerColorFromQuery, bannerColor, setBannerColor]);

 return {
  paletteFromQuery,
  bannerColorFromQuery,
  forcedUserId,
  palette,
  bannerColor,
 };
}
