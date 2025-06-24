// Versão TypeScript migrada do BannerService.js
import { Developer } from "../models/Developer";
import { HtmlFormatter } from "../formatters/HtmlFormatter";
import { PaletteName } from "@/styles/sharedStyleConstants";

export class BannerService {
 formatter: HtmlFormatter;
 dev: Developer;

 constructor() {
  this.formatter = new HtmlFormatter();
  this.dev = new Developer({
   name: "Enzo Ferracini Patti",
   role: "Fullstack Developer",
   stack: ["React", "Node.js", "TypeScript"],
   company: "Mottu",
   position: "Development Intern",
  });
 }

 renderTo(elementId: string, paletteName: PaletteName) {
  const element = document.getElementById(elementId);
  if (element) {
   element.innerHTML = this.formatter.format(this.dev.toJSON(), paletteName);
  }
 }
}
