import type { PaletteName } from "@/styles/shared_style_constants";

/**
 * Service Pattern para geração de Banners
 * Abstração da lógica de negócio (SOLID - Dependency Inversion Principle)
 */

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
 /**
  * Renderiza banner em um elemento DOM
  */
 renderTo(elementId: string, paletteName: PaletteName): void;
}

export interface BannerUrlOptions {
 palette?: string;
 logo?: string;
 host?: string;
 port?: number;
}
