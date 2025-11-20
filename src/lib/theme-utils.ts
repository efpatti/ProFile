/**
 * Theme Utilities
 * Maps settings palette IDs to internal palette names and provides theme utilities
 */

import type { PaletteName } from "@/styles/shared_style_constants";
import type { Palette } from "@/types/settings";

/**
 * Maps user-facing palette IDs (from settings) to internal PaletteName
 */
export const PALETTE_ID_MAP: Record<Palette, PaletteName> = {
  ocean: "cyan",           // Ocean Blue → Cyan
  forest: "darkGreen",     // Forest Green → Dark Green
  sunset: "sunsetOrange",  // Sunset Orange → Sunset Orange
  lavender: "vibrantPurple", // Lavender Purple → Vibrant Purple
  slate: "obsidian",       // Professional Slate → Obsidian
  emerald: "emerald",      // Emerald Mint → Emerald
};

/**
 * Reverse mapping: internal palette name to settings ID
 */
export const INTERNAL_TO_SETTINGS_MAP: Record<PaletteName, Palette> = {
  cyan: "ocean",
  darkGreen: "forest",
  sunsetOrange: "sunset",
  vibrantPurple: "lavender",
  obsidian: "slate",
  emerald: "emerald",
  // Other internal palettes that don't map to settings
  fireRed: "sunset",
  goldenYellow: "sunset",
  teal: "ocean",
  deepBlue: "ocean",
  indigo: "lavender",
  deepPurple: "lavender",
  hotPink: "lavender",
};

/**
 * Get internal palette name from settings palette ID
 */
export function getInternalPaletteName(settingsPalette: Palette): PaletteName {
  return PALETTE_ID_MAP[settingsPalette] || "darkGreen";
}

/**
 * Get settings palette ID from internal palette name
 */
export function getSettingsPaletteId(internalPalette: PaletteName): Palette {
  return INTERNAL_TO_SETTINGS_MAP[internalPalette] || "forest";
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: "light" | "dark" | "auto") {
  const root = document.documentElement;

  if (theme === "auto") {
    // Use system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

/**
 * Get effective theme (resolves "auto" to actual theme)
 */
export function getEffectiveTheme(theme: "light" | "dark" | "auto"): "light" | "dark" {
  if (theme === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

/**
 * Listen to system theme changes
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener("change", handler);

  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}
