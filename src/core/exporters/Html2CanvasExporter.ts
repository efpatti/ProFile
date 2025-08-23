// Versão TypeScript migrada do Html2CanvasExporter.js
import { BannerExporter } from "./BannerExporter";

export class Html2CanvasExporter extends BannerExporter {
 bannerElement: HTMLElement;
 constructor(bannerElement: HTMLElement) {
  super();
  this.bannerElement = bannerElement;
 }

 private async loadLibrary(): Promise<any> {
  // dynamic import for better code splitting
  const mod = await import("html2canvas");
  return mod.default || (mod as any);
 }

 async export(): Promise<HTMLCanvasElement> {
  const html2canvas = await this.loadLibrary();
  await new Promise((r) => setTimeout(r, 50));
  return html2canvas(this.bannerElement, {
   useCORS: true,
   backgroundColor: null,
   scale: 2,
   width: 1584,
   height: 396,
  });
 }
}
