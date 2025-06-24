// Versão TypeScript migrada do PuppeteerService.js
import puppeteer from "puppeteer";

export class PuppeteerService {
 static async captureBanner(
  palette: string = "darkGreen",
  logoUrl: string = ""
 ): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 3 });
  const pageUrl = `http://localhost:3000?palette=${palette}${
   logoUrl ? `&logo=${encodeURIComponent(logoUrl)}` : ""
  }`;
  await page.goto(pageUrl);

  // DEBUG: Take screenshot after goto
  await page.screenshot({ path: "/tmp/banner_debug_after_goto.png" });

  // DEBUG: Log HTML after goto
  const html = await page.content();
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] HTML after goto:\n", html);

  await page.waitForSelector("#banner");
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

  const banner = await page.$("#banner");
  if (!banner) {
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] #banner not found!");
   throw new Error("Banner element not found");
  }
  // @ts-expect-error puppeteer screenshot returns Buffer
  const buffer: Buffer = await banner.screenshot({ encoding: "binary" });
  await browser.close();
  return buffer;
 }
}
