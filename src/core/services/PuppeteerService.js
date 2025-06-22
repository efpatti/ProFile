import puppeteer from "puppeteer";
import path from "path";

export class PuppeteerService {
 static async captureBanner() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Define o viewport para o tamanho exato do banner LinkedIn
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 3 }); // Qualidade máxima (retina)
  const pageUrl = "http://localhost:3000";
  await page.goto(pageUrl);

  // Aguarda o banner aparecer
  await page.waitForSelector("#banner");
  // Aguarda as fontes carregarem
  await page.evaluateHandle("document.fonts.ready");

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
