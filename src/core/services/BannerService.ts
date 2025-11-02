// Versão TypeScript migrada do BannerService.js
import { Developer } from "../models/Developer";
import { HtmlFormatter } from "../formatters/HtmlFormatter";
import { PaletteName } from "@/styles/shared_style_constants";
import type {
 IBannerService,
 DeveloperLike,
 FormatterLike,
 BannerUrlOptions,
} from "@/core/interfaces/IBannerService";

export class BannerService implements IBannerService {
 formatter: FormatterLike;
 dev: DeveloperLike;

 constructor({
  formatter,
  developer,
 }: { formatter?: FormatterLike; developer?: DeveloperLike } = {}) {
  this.formatter = formatter || new HtmlFormatter();
  this.dev =
   developer ||
   new Developer({
    name: "Enzo Ferracini Patti",
    role: "Fullstack Developer",
    stack: ["React", "Node.js", "TypeScript"],
    company: "Mottu",
    position: "Development Intern",
   });
 }

 static getBannerUrl({
  palette = "darkGreen",
  logo = "",
  host = "127.0.0.1",
  port = 3000,
 }: BannerUrlOptions) {
  let url = `http://${host}:${port}/?palette=${encodeURIComponent(palette)}`;
  if (logo) {
   url += `&logo=${encodeURIComponent(logo)}`;
  }
  return url;
 }

 renderTo(elementId: string, paletteName: PaletteName): void {
  const element =
   typeof document !== "undefined" ? document.getElementById(elementId) : null;
  if (element) {
   element.innerHTML = this.formatter.format(this.dev.toJSON(), paletteName);
  }
 }
}
