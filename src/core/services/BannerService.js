import { Developer } from "../models/Developer.js";
import { HtmlFormatter } from "../formatters/HtmlFormatter.js";

export class BannerService {
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

 renderTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
   element.innerHTML = this.formatter.format(this.dev.toJSON());
  }
 }
}
