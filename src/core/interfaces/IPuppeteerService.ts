/**
 * Service Pattern para captura de screenshots com Puppeteer
 * Abstração da lógica de negócio (SOLID - Dependency Inversion Principle)
 */

export interface PaletteInfo {
 label: string;
 color: string;
}

export interface IPuppeteerService {
 /**
  * Captura screenshot do banner
  */
 captureBanner(palette?: string, logoUrl?: string): Promise<Buffer>;

 /**
  * Captura PDF do currículo
  */
 captureResumePDF(
  palette?: string,
  lang?: string,
  bannerColor?: string,
  userId?: string
 ): Promise<Buffer>;

 /**
  * Obtém informações da paleta de cores
  */
 getPaletteInfo(palette: string | undefined): PaletteInfo | null;
}
