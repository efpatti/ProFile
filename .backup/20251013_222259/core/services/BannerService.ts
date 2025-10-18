// Versão TypeScript migrada do BannerService.js
import { Developer } from "../models/Developer";
import { HtmlFormatter } from "../formatters/HtmlFormatter";
import { PaletteName } from "@/styles/sharedStyleConstants";

export interface DeveloperLike {
 toJSON(): Record<string, unknown>;
}

export interface FormatterLike {
 format(
  data: Record<string, unknown>,
  paletteName: PaletteName,
  textColor?: string
 ): string;
}

export class BannerService {
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
 }: {
  palette?: string;
  logo?: string;
  host?: string;
  port?: number;
 }) {
  let url = `http://${host}:${port}/?palette=${encodeURIComponent(palette)}`;
  if (logo) {
   url += `&logo=${encodeURIComponent(logo)}`;
  }
  return url;
 }

 renderTo(elementId: string, paletteName: PaletteName) {
  const element =
   typeof document !== "undefined" ? document.getElementById(elementId) : null;
  if (element) {
   element.innerHTML = this.formatter.format(this.dev.toJSON(), paletteName);
  }
 }
}
