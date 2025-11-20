/**
 * Puppeteer Service - Refactored with SRP
 *
 * ANTES: God Class com 311 linhas e 3 responsabilidades
 * DEPOIS: Facade Pattern delegando para serviços especializados
 *
 * Responsabilidades delegadas:
 * - BrowserManager: Gerencia ciclo de vida do browser
 * - BannerCaptureService: Captura screenshots de banners
 * - ResumePDFService: Gera PDFs de currículos
 *
 * Uncle Bob: "Classes should be small. Smaller than that."
 */

import { BannerCaptureService } from "./BannerCaptureService";
import { ResumePDFService } from "./ResumePDFService";
import { browserManager, closeBrowser } from "./BrowserManager";
import { colorPalettes, PaletteName } from "@/styles/shared_style_constants";
import { paletteActiveState } from "@/styles/pallete_provider";

/**
 * PuppeteerService - Facade para serviços Puppeteer
 * Mantém compatibilidade com código existente
 */
export class PuppeteerService {
 /**
  * Captura screenshot de banner
  * @deprecated Use BannerCaptureService.capture() diretamente
  */
 static async captureBanner(
  palette: string = paletteActiveState.value,
  logoUrl: string = ""
 ): Promise<Buffer> {
  return BannerCaptureService.capture(palette, logoUrl);
 }

 /**
  * Obtém informações de paleta de cores
  * Método utilitário - não relacionado a Puppeteer
  */
 static getPaletteInfo(palette: string | undefined) {
  if (!palette || !(palette in colorPalettes)) return null;
  const info = colorPalettes[palette as PaletteName];
  return {
   label: info.colorName?.[0]?.["pt-br"] || palette,
   color: info.colors?.[0]?.accent || "#888",
  };
 }

 /**
  * Gera PDF do currículo
  * @deprecated Use ResumePDFService.generate() diretamente
  */
 static async captureResumePDF(
  palette: string = paletteActiveState.value,
  lang: string = "pt-br",
  bannerColor?: string,
  userId?: string
 ): Promise<Buffer> {
  return ResumePDFService.generate({
   palette,
   lang,
   bannerColor,
   userId,
  });
 }
}

// Export do browser manager para compatibilidade
export { closeBrowser };
