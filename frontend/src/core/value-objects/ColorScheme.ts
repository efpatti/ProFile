const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;

class HexColor {
 private constructor(private readonly value: string) {}

 static create(color: string): HexColor {
  const normalized = color.trim().toUpperCase();

  if (!HEX_COLOR_PATTERN.test(normalized)) {
   throw new Error("Invalid hex color format");
  }

  return new HexColor(normalized);
 }

 toString(): string {
  return this.value;
 }
}

export class ColorScheme {
 private constructor(
  private readonly primary: HexColor,
  private readonly secondary: HexColor,
  private readonly accent: HexColor
 ) {}

 static create(
  primary: string,
  secondary: string,
  accent: string
 ): ColorScheme {
  return new ColorScheme(
   HexColor.create(primary),
   HexColor.create(secondary),
   HexColor.create(accent)
  );
 }

 static default(): ColorScheme {
  return ColorScheme.create("#1E40AF", "#475569", "#3B82F6");
 }

 getPrimary(): string {
  return this.primary.toString();
 }

 getSecondary(): string {
  return this.secondary.toString();
 }

 getAccent(): string {
  return this.accent.toString();
 }

 toJSON() {
  return {
   primary: this.getPrimary(),
   secondary: this.getSecondary(),
   accent: this.getAccent(),
  };
 }
}
