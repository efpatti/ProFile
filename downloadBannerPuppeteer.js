// Script para gerar imagem do banner usando Puppeteer
// Execute com: node downloadBannerPuppeteer.js

import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
 const browser = await puppeteer.launch();
 const page = await browser.newPage();

 // Define o viewport para o tamanho exato do banner LinkedIn
 await page.setViewport({ width: 1584, height: 396 });

 // Abre o arquivo local index.html (ajustado para src/public/index.html)
 const filePath = `file:${path.resolve(__dirname, "src/public/index.html")}`;
 await page.goto(filePath);

 // Aguarda o banner renderizar
 await page.waitForSelector("#banner");
 // Aguarda as fontes carregarem
 await page.evaluateHandle("document.fonts.ready");

 // Faz o screenshot apenas do banner
 const banner = await page.$("#banner");
 await banner.screenshot({ path: "linkedin-banner.png" });

 await browser.close();
 console.log("Banner salvo como linkedin-banner.png");
})();
