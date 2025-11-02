// Versão TypeScript migrada do PuppeteerService.js
import puppeteer from "puppeteer";
import { BannerService } from "@/core/services/BannerService";
import { colorPalettes, PaletteName } from "@/styles/shared_style_constants";
import { paletteActiveState } from "@/styles/pallete_provider";
import { VIEWPORT, PDF, TIMEOUT, DEBUG_PATH, DEFAULT } from "@/constants/ui";

// Properly typed browser reference reused across calls
type PuppeteerBrowser = import("puppeteer").Browser;
let browser: PuppeteerBrowser | null = null;

async function getBrowser() {
 if (!browser) {
  browser = await puppeteer.launch();
 }
 return browser;
}

async function closeBrowser() {
 if (browser) {
  await browser.close();
  browser = null;
 }
}

export class PuppeteerService {
 static async captureBanner(
  palette: string = paletteActiveState.value,
  logoUrl: string = ""
 ): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  // Aumenta a resolução para máxima qualidade
  await page.setViewport({
   width: VIEWPORT.BANNER.WIDTH,
   height: VIEWPORT.BANNER.HEIGHT,
   deviceScaleFactor: VIEWPORT.BANNER.SCALE_FACTOR,
  });
  // Use BannerService to generate the correct URL
  const pageUrl = BannerService.getBannerUrl({
   palette,
   logo: logoUrl,
   host: DEFAULT.HOST,
   port: DEFAULT.PORT,
  });
  try {
   await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT.PAGE_LOAD,
   });
  } catch (err) {
   // DEBUG: Take screenshot on navigation error
   await page.screenshot({ path: DEBUG_PATH.BANNER_GOTO_ERROR });
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] Error during page.goto:", err);
   throw err;
  }

  // DEBUG: Take screenshot after goto
  await page.screenshot({ path: DEBUG_PATH.BANNER_AFTER_GOTO });

  // DEBUG: Log HTML after goto
  const html = await page.content();
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] HTML after goto:\n", html);

  // Espera pelo #banner com timeout maior e debug limpo
  try {
   await page.waitForSelector("#banner", { timeout: TIMEOUT.SELECTOR_WAIT });
  } catch (err) {
   await page.screenshot({ path: DEBUG_PATH.BANNER_WAIT_ERROR });
   const html = await page.content();
   // Tenta extrair só o trecho do #banner ou um resumo do body
   const bannerMatch = html.match(
    /<section[^>]*id=["']banner["'][^>]*>([\s\S]*?)<\/section>/i
   );
   if (bannerMatch) {
    console.error("[PuppeteerService] #banner HTML snippet:", bannerMatch[0]);
   } else {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    console.error(
     "[PuppeteerService] <body> HTML snippet:",
     bodyMatch ? bodyMatch[1].slice(0, 1000) : html.slice(0, 1000)
    );
   }
   console.error("[PuppeteerService] Error waiting for #banner:", err);
   throw err;
  }

  await page.evaluateHandle("document.fonts.ready");

  // Aguarda a logo carregar, se existir
  if (logoUrl) {
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

  // DEBUG: Screenshot before waiting for code block
  await page.screenshot({ path: DEBUG_PATH.BANNER_BEFORE_CODE });

  // DEBUG: Log code block contents before waiting
  const codeBlockBefore = await page.$eval(
   "#code",
   (el: Element) => (el as HTMLElement).innerHTML
  );
  // eslint-disable-next-line no-console
  console.log(
   "[PuppeteerService] #code contents before wait:",
   codeBlockBefore
  );

  // DEBUG: Increase timeout for waitForFunction
  await page.waitForFunction(
   () => {
    const code = document.getElementById("code");
    return code && code.innerHTML.trim().length > 0;
   },
   { timeout: TIMEOUT.CODE_BLOCK_RENDER }
  );

  // DEBUG: Screenshot after waiting for code block
  await page.screenshot({ path: DEBUG_PATH.BANNER_AFTER_CODE });

  // DEBUG: Log code block contents after waiting
  const codeBlockAfter = await page.$eval(
   "#code",
   (el: Element) => (el as HTMLElement).innerHTML
  );
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] #code contents after wait:", codeBlockAfter);

  // Adiciona CSS global de antialiasing e image-rendering para o banner
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

  const banner = await page.$("#banner");
  if (!banner) {
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] #banner not found!");
   throw new Error("Banner element not found");
  }
  // Screenshot com máxima qualidade
  const buffer = (await banner.screenshot({
   encoding: "binary",
   type: "png",
   captureBeyondViewport: true,
   omitBackground: false,
  })) as Buffer;
  await page.close();
  return buffer;
 }

 static getPaletteInfo(palette: string | undefined) {
  if (!palette || !(palette in colorPalettes)) return null;
  const info = colorPalettes[palette as PaletteName];
  return {
   label: info.colorName?.[0]?.["pt-br"] || palette,
   color: info.colors?.[0]?.accent || "#888",
  };
 }

 static async captureResumePDF(
  palette: string = paletteActiveState.value,
  lang: string = DEFAULT.LANGUAGE,
  bannerColor?: string,
  userId?: string
 ): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setViewport({
   width: VIEWPORT.RESUME.WIDTH,
   height: VIEWPORT.RESUME.HEIGHT,
   deviceScaleFactor: VIEWPORT.RESUME.SCALE_FACTOR,
  });

  let pageUrl = `http://${DEFAULT.HOST}:${
   DEFAULT.PORT
  }/protected/resume?export=1&palette=${encodeURIComponent(
   palette
  )}&lang=${encodeURIComponent(lang)}`;
  if (bannerColor) pageUrl += `&bannerColor=${encodeURIComponent(bannerColor)}`;
  if (userId) pageUrl += `&user=${encodeURIComponent(userId)}`;

  try {
   await page.goto(pageUrl, {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT.PAGE_LOAD,
   });
  } catch (err) {
   await page.screenshot({ path: DEBUG_PATH.RESUME_GOTO_ERROR });
   console.error("[PuppeteerService] Error during resume page.goto:", err);
   throw err;
  }

  // Wait for resume container and readiness flag populated by the app
  await page.waitForSelector("#resume", { timeout: TIMEOUT.SELECTOR_WAIT });
  await page.waitForSelector('#resume[data-ready="1"]', {
   timeout: TIMEOUT.SELECTOR_WAIT,
  });

  // Extract only the necessary parts to render #resume identically
  const origin = new URL(pageUrl).origin;
  const { linkTags, styleTags, resumeHTML, cssVars } = await page.evaluate(
   () => {
    const linkTags = Array.from(
     document.querySelectorAll('head link[rel="stylesheet"]')
    ).map((l) => (l as HTMLLinkElement).outerHTML);
    const styleTags = Array.from(document.querySelectorAll("head style")).map(
     (s) => (s as HTMLStyleElement).outerHTML
    );
    const resumeEl = document.querySelector("#resume") as HTMLElement | null;
    // Collect CSS variables set on :root (documentElement)
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
   }
  );

  // Replace page content with a minimal doc containing only #resume and the collected styles
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
          /* Let PDF width/height drive the final page size; keep margins zero */
          @page { margin: 0; }
          /* Hide any non-print elements that might exist inside resume */
          [data-no-print] { display: none !important; visibility: hidden !important; }
          /* Prevent unwanted page breaks inside resume sections */
          #resume, #resume * { break-inside: avoid; page-break-inside: avoid; }
          /* Ensure header text remains white on accent background */
          #resume .bg-\[var\(--accent\)\], #resume .bg-\[var\(--accent\)\] * { color: #fff !important; }
          /* Remove focus outlines, rings and underline without changing color */
          #resume a, #resume a:visited, #resume a:active { text-decoration: none !important; outline: none !important; box-shadow: none !important; }
          #resume *:focus { outline: none !important; box-shadow: none !important; }
          #resume [class*="ring-"], #resume [class*="focus:ring-"] { box-shadow: none !important; }
          /* Avoid unintended right borders next to section underlines */
          #resume [class*="border-b"] { border-right: 0 !important; }
        </style>
      </head>
      <body>
        ${resumeHTML}
      </body>
    </html>`,
   { waitUntil: "domcontentloaded" }
  );

  // Ensure print styles and fonts are applied in the new content
  await page.emulateMediaType("print");
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((resolve) => setTimeout(resolve, TIMEOUT.FONT_READY));

  // Compute exact content height (in mm) to force a single-page PDF without breaks
  const contentHeightMm = await page.evaluate(() => {
   const pxToMm = 0.264583; // 96 CSS px per inch
   const el = document.querySelector("#resume") as HTMLElement | null;
   const heightPx = el
    ? Math.ceil(el.scrollHeight)
    : Math.ceil(document.body.scrollHeight);
   return Math.ceil(heightPx * pxToMm) + 2; // add a small 2mm buffer
  });

  const buffer = Buffer.from(
   await page.pdf({
    printBackground: true,
    // A3 width portrait is 297mm; height dynamically measured to fit exactly one page
    width: `${PDF.A3_WIDTH_MM}mm`,
    height: `${contentHeightMm}mm`,
    preferCSSPageSize: false,
    margin: PDF.MARGIN,
   })
  );
  await page.close();
  return buffer;
 }
}

export { closeBrowser };
