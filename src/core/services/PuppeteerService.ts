// Versão TypeScript migrada do PuppeteerService.js
import puppeteer from "puppeteer";
import { BannerService } from "@/core/services/BannerService";

export class PuppeteerService {
 static async captureBanner(
  palette: string = "darkGreen",
  logoUrl: string = ""
 ): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Aumenta a resolução para máxima qualidade
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 4 });
  // Use BannerService to generate the correct URL
  const pageUrl = BannerService.getBannerUrl({
   palette,
   logo: logoUrl,
   host: "127.0.0.1",
   port: 3000,
  });
  try {
   await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout
  } catch (err) {
   // DEBUG: Take screenshot on navigation error
   await page.screenshot({ path: "/tmp/banner_debug_goto_error.png" });
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] Error during page.goto:", err);
   throw err;
  }

  // DEBUG: Take screenshot after goto
  await page.screenshot({ path: "/tmp/banner_debug_after_goto.png" });

  // DEBUG: Log HTML after goto
  const html = await page.content();
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] HTML after goto:\n", html);

  // Espera pelo #banner com timeout maior e debug limpo
  try {
   await page.waitForSelector("#banner", { timeout: 60000 });
  } catch (err) {
   await page.screenshot({
    path: "/tmp/banner_debug_waitforselector_error.png",
   });
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
   await page.waitForSelector("#company-logo", { timeout: 5000 });
   await page.waitForFunction(
    () => {
     const img = document.getElementById(
      "company-logo"
     ) as HTMLImageElement | null;
     return img ? img.complete && img.naturalWidth > 0 : true;
    },
    { timeout: 5000 }
   );
  }

  // DEBUG: Screenshot before waiting for code block
  await page.screenshot({ path: "/tmp/banner_debug_before_wait_code.png" });

  // DEBUG: Log code block contents before waiting
  const codeBlockBefore = await page.$eval("#code", (el) => el.innerHTML);
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
   { timeout: 20000 }
  );

  // DEBUG: Screenshot after waiting for code block
  await page.screenshot({ path: "/tmp/banner_debug_after_wait_code.png" });

  // DEBUG: Log code block contents after waiting
  const codeBlockAfter = await page.$eval("#code", (el) => el.innerHTML);
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
  // @ts-expect-error puppeteer screenshot returns Buffer
  const buffer: Buffer = await banner.screenshot({
   encoding: "binary",
   type: "png",
   captureBeyondViewport: true,
   omitBackground: false,
  });
  await browser.close();
  return buffer;
 }

 static async captureResumePDF(
  palette: string = "darkGreen",
  lang: string = "pt-br"
 ): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1700, deviceScaleFactor: 2 });
  const pageUrl = `http://127.0.0.1:3000/resume?palette=${palette}&lang=${lang}`;
  try {
   await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout
  } catch (err) {
   await page.screenshot({ path: "/tmp/resume_debug_goto_error.png" });
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] Error during resume page.goto:", err);
   throw err;
  }
  await page.waitForSelector(".pdf");
  await page.evaluateHandle("document.fonts.ready");
  // Aguarda renderização completa
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Gera o PDF
  const buffer = Buffer.from(
   await page.pdf({
    printBackground: true,
    format: "A4",
    preferCSSPageSize: true,
   })
  );
  await browser.close();
  return buffer;
 }
}
