import puppeteer from "puppeteer";
import path from "path";

export class PuppeteerService {
 static async captureBanner(palette = "darkGreen", logo = "") {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Define o viewport para o tamanho exato do banner LinkedIn
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 3 }); // Qualidade máxima (retina)
  const pageUrl = `http://localhost:3000?palette=${palette}${logo ? `&logo=${encodeURIComponent(logo)}` : ""}`;
  await page.goto(pageUrl);

  // Aguarda o banner aparecer
  await page.waitForSelector("#banner");
  // Aguarda as fontes carregarem
  await page.evaluateHandle("document.fonts.ready");

  // Força a paleta e a logo no DOM antes do screenshot
  await page.evaluate((palette, logo) => {
   document.body.setAttribute("data-palette", palette);
   if (window.setPaletteVars) window.setPaletteVars(palette);
   if (logo) {
    const logoEl = document.getElementById("company-logo");
    if (logoEl) {
     logoEl.src = `https://img.logo.dev/${logo}?token=pk_fnCdcveMSlWxQcDxxOsXhQ`;
     logoEl.alt = `Logo de ${logo}`;
    }
   }
  }, palette, logo);

  // Aguarda o código estilizado ser renderizado
  await page.waitForFunction(() => {
   const code = document.getElementById("code");
   return code && code.innerHTML.trim().length > 0;
  });

  const banner = await page.$("#banner");
  const buffer = await banner.screenshot({ encoding: "binary" });

  await browser.close();
  return buffer;
 }
}
