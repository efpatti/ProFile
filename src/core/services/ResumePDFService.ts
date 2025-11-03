/**
 * Resume PDF Service - Single Responsibility Pattern
 *
 * Responsabilidade ÚNICA:
 * - Gerar PDFs de currículos com layout perfeito
 * - Extrair estilos e renderizar página limpa
 * - Calcular dimensões exatas para evitar quebras de página
 *
 * Uncle Bob: "A class should have only one reason to change"
 */

import { Page } from "puppeteer";
import { browserManager } from "./BrowserManager";
import { paletteActiveState } from "@/styles/pallete_provider";
import { VIEWPORT, PDF, TIMEOUT, DEBUG_PATH, DEFAULT } from "@/constants/ui";

interface ResumePDFOptions {
 palette?: string;
 lang?: string;
 bannerColor?: string;
 userId?: string;
}

export class ResumePDFService {
 /**
  * Gera PDF do currículo
  */
 static async generate(options: ResumePDFOptions = {}): Promise<Buffer> {
  const {
   palette = paletteActiveState.value,
   lang = DEFAULT.LANGUAGE,
   bannerColor,
   userId,
  } = options;

  const browser = await browserManager.getBrowser();
  const page = await browser.newPage();

  try {
   await this.setupPage(page);
   const url = this.buildResumeUrl({ palette, lang, bannerColor, userId });
   await this.navigateToPage(page, url);
   await this.waitForResumeReady(page);

   const { linkTags, styleTags, resumeHTML, cssVars } =
    await this.extractStyles(page, url);
   await this.renderCleanPage(page, url, {
    linkTags,
    styleTags,
    resumeHTML,
    cssVars,
   });

   return await this.generatePDF(page);
  } finally {
   await page.close();
  }
 }

 /**
  * Configura viewport para PDF
  */
 private static async setupPage(page: Page): Promise<void> {
  await page.setViewport({
   width: VIEWPORT.RESUME.WIDTH,
   height: VIEWPORT.RESUME.HEIGHT,
   deviceScaleFactor: VIEWPORT.RESUME.SCALE_FACTOR,
  });
 }

 /**
  * Constrói URL do currículo com parâmetros
  */
 private static buildResumeUrl(options: ResumePDFOptions): string {
  const { palette, lang, bannerColor, userId } = options;

  let url = `http://${DEFAULT.HOST}:${
   DEFAULT.PORT
  }/protected/resume?export=1&palette=${encodeURIComponent(
   palette!
  )}&lang=${encodeURIComponent(lang!)}`;

  if (bannerColor) {
   url += `&bannerColor=${encodeURIComponent(bannerColor)}`;
  }
  if (userId) {
   url += `&user=${encodeURIComponent(userId)}`;
  }

  return url;
 }

 /**
  * Navega para página do currículo
  */
 private static async navigateToPage(page: Page, url: string): Promise<void> {
  try {
   await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT.PAGE_LOAD,
   });
  } catch (err) {
   await page.screenshot({ path: DEBUG_PATH.RESUME_GOTO_ERROR });
   console.error("[ResumePDFService] Error during page.goto:", err);
   throw err;
  }
 }

 /**
  * Aguarda currículo estar pronto
  */
 private static async waitForResumeReady(page: Page): Promise<void> {
  await page.waitForSelector("#resume", { timeout: TIMEOUT.SELECTOR_WAIT });
  await page.waitForSelector('#resume[data-ready="1"]', {
   timeout: TIMEOUT.SELECTOR_WAIT,
  });
 }

 /**
  * Extrai estilos e HTML do currículo
  */
 private static async extractStyles(
  page: Page,
  pageUrl: string
 ): Promise<{
  linkTags: string[];
  styleTags: string[];
  resumeHTML: string;
  cssVars: string;
 }> {
  return await page.evaluate(() => {
   const linkTags = Array.from(
    document.querySelectorAll('head link[rel="stylesheet"]')
   ).map((l) => (l as HTMLLinkElement).outerHTML);

   const styleTags = Array.from(document.querySelectorAll("head style")).map(
    (s) => (s as HTMLStyleElement).outerHTML
   );

   const resumeEl = document.querySelector("#resume") as HTMLElement | null;

   // Coleta CSS variables de :root
   const rootStyle = document.documentElement.style;
   const varNames = Array.from(rootStyle).filter((n) => n.startsWith("--"));
   const cssVars = varNames
    .map((name) => `${name}: ${rootStyle.getPropertyValue(name)};`)
    .join(" ");

   return {
    linkTags,
    styleTags,
    resumeHTML: resumeEl ? resumeEl.outerHTML : "",
    cssVars,
   };
  });
 }

 /**
  * Renderiza página limpa com apenas o currículo
  */
 private static async renderCleanPage(
  page: Page,
  pageUrl: string,
  styles: {
   linkTags: string[];
   styleTags: string[];
   resumeHTML: string;
   cssVars: string;
  }
 ): Promise<void> {
  const origin = new URL(pageUrl).origin;
  const { linkTags, styleTags, resumeHTML, cssVars } = styles;

  await page.setContent(
   `<!doctype html>
    <html>
      <head>
        <base href="${origin}">
        ${linkTags.join("\n")}
        ${styleTags.join("\n")}
        <style>
          :root { ${cssVars} }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 0; }
          [data-no-print] { display: none !important; visibility: hidden !important; }
          #resume, #resume * { break-inside: avoid; page-break-inside: avoid; }
          #resume .bg-\\[var\\(--accent\\)\\], #resume .bg-\\[var\\(--accent\\)\\] * { color: #fff !important; }
          #resume a, #resume a:visited, #resume a:active { text-decoration: none !important; outline: none !important; box-shadow: none !important; }
          #resume *:focus { outline: none !important; box-shadow: none !important; }
          #resume [class*="ring-"], #resume [class*="focus:ring-"] { box-shadow: none !important; }
          #resume [class*="border-b"] { border-right: 0 !important; }
        </style>
      </head>
      <body>
        ${resumeHTML}
      </body>
    </html>`,
   { waitUntil: "domcontentloaded" }
  );

  // Aplica print styles e aguarda fontes
  await page.emulateMediaType("print");
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((resolve) => setTimeout(resolve, TIMEOUT.FONT_READY));
 }

 /**
  * Gera PDF com dimensões calculadas
  */
 private static async generatePDF(page: Page): Promise<Buffer> {
  // Calcula altura exata do conteúdo
  const contentHeightMm = await this.calculateContentHeight(page);

  return Buffer.from(
   await page.pdf({
    printBackground: true,
    width: `${PDF.A3_WIDTH_MM}mm`,
    height: `${contentHeightMm}mm`,
    preferCSSPageSize: false,
    margin: PDF.MARGIN,
   })
  );
 }

 /**
  * Calcula altura do conteúdo em mm
  */
 private static async calculateContentHeight(page: Page): Promise<number> {
  return await page.evaluate(() => {
   const pxToMm = 0.264583; // 96 CSS px per inch
   const el = document.querySelector("#resume") as HTMLElement | null;
   const heightPx = el
    ? Math.ceil(el.scrollHeight)
    : Math.ceil(document.body.scrollHeight);
   return Math.ceil(heightPx * pxToMm) + 2; // buffer de 2mm
  });
 }
}
