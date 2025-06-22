import { DevDataFormatter } from "./DevDataFormatter.js";
import { accentColor, keyColor } from "../../utils/styleConstants.js";

export class HtmlFormatter extends DevDataFormatter {
 constructor() {
  super();
 }

 indent(level) {
  return "&nbsp;".repeat(level * 2);
 }

 formatArray(key, array) {
  let formatted = `${this.indent(
   1
  )}<span style='color:${keyColor}'>${key}</span>: [<br>`;
  array.forEach((item, i) => {
   formatted += `${this.indent(
    2
   )}<span style='color:${accentColor}'>&quot;${item}&quot;</span>${
    i < array.length - 1 ? "," : ""
   }<br>`;
  });
  formatted += `${this.indent(1)}],<br>`;
  return formatted;
 }

 format(dev) {
  let formatted = `<span style='color:${accentColor};font-weight:bold;'>const</span> <span style='color:${keyColor};font-weight:bold;'>dev</span> <span style='color:${keyColor}'>=</span> {<br>`;

  for (let key in dev) {
   if (Array.isArray(dev[key])) {
    formatted += this.formatArray(key, dev[key]);
   } else {
    formatted += `${this.indent(
     1
    )}<span style='color:${keyColor}'>${key}</span>: <span style='color:${accentColor}'>&quot;${
     dev[key]
    }&quot;</span>,<br>`;
   }
  }

  formatted += "};";
  return formatted;
 }
}
