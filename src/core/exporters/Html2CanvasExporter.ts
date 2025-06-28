// Versão TypeScript migrada do Html2CanvasExporter.js
import { BannerExporter } from "./BannerExporter";

export class Html2CanvasExporter extends BannerExporter {
 bannerElement: HTMLElement;
 constructor(bannerElement: HTMLElement) {
  super();
  this.bannerElement = bannerElement;
 }

 async loadLibrary(): Promise<void> {
  return new Promise((resolve) => {
   const script = document.createElement("script");
   script.src =
    "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
   script.onload = () => resolve();
   document.head.appendChild(script);
  });
 }

 async export(): Promise<HTMLCanvasElement> {
  await this.loadLibrary();
  await new Promise((r) => setTimeout(r, 200));
  return new Promise((resolve, reject) => {
   // @ts-expect-error html2canvas is loaded globally
   html2canvas(this.bannerElement, {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
    width: 1584,
    height: 396,
   })
    .then(resolve)
    .catch(reject);
  });
 }
}
