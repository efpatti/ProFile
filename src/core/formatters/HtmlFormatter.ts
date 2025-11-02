// Versão TypeScript migrada do HtmlFormatter.js
import { DevDataFormatter } from "./DevDataFormatter";
import {
 colorPalettes,
 defaultPalette,
 PaletteName,
} from "@/styles/shared_style_constants";

export interface IFormatter {
 format(
  data: Record<string, unknown>,
  paletteName: PaletteName,
  textColor?: string
 ): string;
}

export class HtmlFormatter extends DevDataFormatter implements IFormatter {
 indent(level: number): string {
  return "&nbsp;".repeat(level * 2);
 }

 formatArray(
  key: string,
  array: string[],
  accentColor: string,
  keyColor: string,
  textColor?: string // novo parâmetro
 ): string {
  let formatted = `${this.indent(1)}<span style='color:${
   textColor || keyColor
  }'>${key}</span>: [<br>`;
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

 format(
  dev: Record<string, unknown>,
  paletteName: PaletteName = defaultPalette,
  textColor?: string
 ): string {
  const palette = colorPalettes[paletteName] || colorPalettes[defaultPalette];
  const colorsArr = palette.colors;
  // Utilitário para buscar cor pelo nome
  function getColor<T extends string>(name: T): string | undefined {
   const found = colorsArr.find((c) =>
    Object.prototype.hasOwnProperty.call(c, name)
   );
   return found ? (found as Record<T, string>)[name] : undefined;
  }
  const accentColor = getColor("accent") ?? "#22c55e";
  const keyColor = getColor("key") ?? "#f7fafc";
  const secondaryColor = getColor("secondary") ?? "#4ade80";
  const devTextColor = textColor || keyColor;
  let formatted = `<span style='color:${secondaryColor};font-weight:bold;text-shadow:0 0 1px ${secondaryColor},0 0 12px ${secondaryColor}99;'>const</span> <span style='color:${devTextColor};font-weight:bold;'>dev</span> <span style='color:${devTextColor}'>=</span> {<br>`;
  for (const key in dev) {
   if (Array.isArray(dev[key])) {
    formatted += this.formatArray(
     key,
     dev[key] as string[],
     accentColor,
     keyColor,
     devTextColor // passa a cor ativa
    );
   } else {
    formatted += `${this.indent(
     1
    )}<span style='color:${devTextColor}'>${key}</span>: <span style='color:${accentColor}'>&quot;${
     dev[key]
    }&quot;</span>,<br>`;
   }
  }
  formatted += "};";
  return formatted;
 }
}
