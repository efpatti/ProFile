// Versão TypeScript migrada do DevDataFormatter.js
export abstract class DevDataFormatter {
 constructor() {
  if (new.target === DevDataFormatter) {
   throw new Error("Abstract class cannot be instantiated");
  }
 }
 abstract format(dev: Record<string, unknown>): string;
}
