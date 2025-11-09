import type { PaletteName } from "@/styles/shared_style_constants";

export interface DeveloperLike {
 toJSON(): Record<string, unknown>;
}

export interface FormatterLike {
 format(
  data: Record<string, unknown>,
  paletteName: PaletteName,
  textColor?: string
 ): string;
}

export interface IBannerService {
 renderTo(elementId: string, paletteName: PaletteName): void;
}

export interface BannerUrlOptions {
 palette?: string;
 logo?: string;
 host?: string;
 port?: number;
}
