/**
 * Banner Capture Service - Single Responsibility Pattern
 *
 * Responsabilidade ÚNICA:
 * - Capturar screenshots de banners em alta qualidade
 * - Configurar viewport e aguardar renderização completa
 * - Retornar buffer PNG do banner renderizado
 *
 * Uncle Bob: "Do one thing and do it well"
 */

import { Page } from "puppeteer";
import { browserManager } from "./BrowserManager";
import { BannerService } from "./BannerService";
import { paletteActiveState } from "@/styles/pallete_provider";
import { VIEWPORT, TIMEOUT, DEBUG_PATH, DEFAULT } from "@/constants/ui";

export class BannerCaptureService {
 /**
  * Captura screenshot de banner com alta qualidade
  */
 static async capture(
  palette: string = paletteActiveState.value,
  logoUrl: string = ""
 ): Promise<Buffer> {
  const browser = await browserManager.getBrowser();
  const page = await browser.newPage();

  try {
   await this.setupPage(page);
   const url = this.buildBannerUrl(palette, logoUrl);
   await this.navigateToPage(page, url);
   await this.waitForBannerReady(page, logoUrl);
   await this.applyQualityStyles(page);
   return await this.captureBannerElement(page);
  } finally {
   await page.close();
  }
 }

 /**
  * Configura viewport em alta resolução
  */
 private static async setupPage(page: Page): Promise<void> {
  await page.setViewport({
   width: VIEWPORT.BANNER.WIDTH,
   height: VIEWPORT.BANNER.HEIGHT,
   deviceScaleFactor: VIEWPORT.BANNER.SCALE_FACTOR,
  });
 }

 /**
  * Constrói URL do banner usando BannerService
  */
 private static buildBannerUrl(palette: string, logoUrl: string): string {
  return BannerService.getBannerUrl({
   palette,
   logo: logoUrl,
   host: DEFAULT.HOST,
   port: DEFAULT.PORT,
  });
 }

 /**
  * Navega para página do banner com error handling
  */
 private static async navigateToPage(page: Page, url: string): Promise<void> {
  try {
   await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT.PAGE_LOAD,
   });
  } catch (err) {
   await page.screenshot({ path: DEBUG_PATH.BANNER_GOTO_ERROR });
   console.error("[BannerCaptureService] Error during page.goto:", err);
   throw err;
  }

  // DEBUG: Screenshot e log após navegação
  await page.screenshot({ path: DEBUG_PATH.BANNER_AFTER_GOTO });
  const html = await page.content();
  console.log("[BannerCaptureService] HTML after goto:\n", html);
 }

 /**
  * Aguarda renderização completa do banner
  */
 private static async waitForBannerReady(
  page: Page,
  logoUrl: string
 ): Promise<void> {
  // Espera pelo elemento #banner
  try {
   await page.waitForSelector("#banner", { timeout: TIMEOUT.SELECTOR_WAIT });
  } catch (err) {
   await this.debugBannerError(page);
   throw err;
  }

  // Aguarda fontes carregarem
  await page.evaluateHandle("document.fonts.ready");

  // Aguarda logo se existir
  if (logoUrl) {
   await this.waitForLogo(page);
  }

  // Aguarda code block renderizar
  await this.waitForCodeBlock(page);
 }

 /**
  * Debug quando #banner não é encontrado
  */
 private static async debugBannerError(page: Page): Promise<void> {
  await page.screenshot({ path: DEBUG_PATH.BANNER_WAIT_ERROR });
  const html = await page.content();

  const bannerMatch = html.match(
   /<section[^>]*id=["']banner["'][^>]*>([\s\S]*?)<\/section>/i
  );
  if (bannerMatch) {
   console.error(
    "[BannerCaptureService] #banner HTML snippet:",
    bannerMatch[0]
   );
  } else {
   const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
   console.error(
    "[BannerCaptureService] <body> HTML snippet:",
    bodyMatch ? bodyMatch[1].slice(0, 1000) : html.slice(0, 1000)
   );
  }
 }

 /**
  * Aguarda logo carregar completamente
  */
 private static async waitForLogo(page: Page): Promise<void> {
  await page.waitForSelector("#company-logo", { timeout: TIMEOUT.LOGO_LOAD });
  await page.waitForFunction(
   () => {
    const img = document.getElementById(
     "company-logo"
    ) as HTMLImageElement | null;
    return img ? img.complete && img.naturalWidth > 0 : true;
   },
   { timeout: TIMEOUT.LOGO_LOAD }
  );
 }

 /**
  * Aguarda code block renderizar
  */
 private static async waitForCodeBlock(page: Page): Promise<void> {
  // DEBUG: Screenshot e log antes
  await page.screenshot({ path: DEBUG_PATH.BANNER_BEFORE_CODE });
  const codeBefore = await page.$eval(
   "#code",
   (el: Element) => (el as HTMLElement).innerHTML
  );
  console.log("[BannerCaptureService] #code before wait:", codeBefore);

  // Aguarda conteúdo renderizar
  await page.waitForFunction(
   () => {
    const code = document.getElementById("code");
    return code && code.innerHTML.trim().length > 0;
   },
   { timeout: TIMEOUT.CODE_BLOCK_RENDER }
  );

  // DEBUG: Screenshot e log depois
  await page.screenshot({ path: DEBUG_PATH.BANNER_AFTER_CODE });
  const codeAfter = await page.$eval(
   "#code",
   (el: Element) => (el as HTMLElement).innerHTML
  );
  console.log("[BannerCaptureService] #code after wait:", codeAfter);
 }

 /**
  * Aplica estilos de qualidade (antialiasing)
  */
 private static async applyQualityStyles(page: Page): Promise<void> {
  await page.addStyleTag({
   content: `
      #banner, #banner * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
        image-rendering: pixelated !important;
      }
    `,
  });
 }

 /**
  * Captura screenshot do elemento #banner
  */
 private static async captureBannerElement(page: Page): Promise<Buffer> {
  const banner = await page.$("#banner");
  if (!banner) {
   console.error("[BannerCaptureService] #banner not found!");
   throw new Error("Banner element not found");
  }

  return (await banner.screenshot({
   encoding: "binary",
   type: "png",
   captureBeyondViewport: true,
   omitBackground: false,
  })) as Buffer;
 }
}
