/**
 * Browser Manager - Single Responsibility Pattern
 *
 * Responsabilidade ÚNICA:
 * - Gerenciar ciclo de vida do browser Puppeteer (singleton)
 * - Reutilizar instância entre múltiplas capturas
 * - Prover interface limpa para obter/fechar browser
 *
 * Uncle Bob: "A class should have only one reason to change"
 */

import puppeteer, { Browser } from "puppeteer";

class BrowserManager {
 private static instance: BrowserManager | null = null;
 private browser: Browser | null = null;

 private constructor() {}

 /**
  * Singleton pattern - garante apenas uma instância
  */
 static getInstance(): BrowserManager {
  if (!BrowserManager.instance) {
   BrowserManager.instance = new BrowserManager();
  }
  return BrowserManager.instance;
 }

 /**
  * Obtém browser existente ou cria novo
  */
 async getBrowser(): Promise<Browser> {
  if (!this.browser) {
   this.browser = await puppeteer.launch();
  }
  return this.browser;
 }

 /**
  * Fecha browser e limpa referência
  */
 async closeBrowser(): Promise<void> {
  if (this.browser) {
   await this.browser.close();
   this.browser = null;
  }
 }

 /**
  * Verifica se browser está ativo
  */
 isActive(): boolean {
  return this.browser !== null;
 }
}

// Export singleton instance
export const browserManager = BrowserManager.getInstance();

// Legacy export para compatibilidade
export const closeBrowser = () => browserManager.closeBrowser();
