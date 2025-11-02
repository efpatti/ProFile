export const colorPalettes = {
 // Vermelhos (1)
 fireRed: {
  colors: [
   { accent: "#ef4444" },
   { key: "#fef2f2" },
   { highlightBg: "rgba(239, 68, 68, 0.1)" },
   { accent30: "rgba(239, 68, 68, 0.3)" },
   { secondary: "#f87171" },
   { secondarySoft: "#fee2e2" },
  ],
  colorName: [{ "pt-br": "Vermelho Fogo", en: "Fire Red" }],
 },
 // Laranjas (2)
 sunsetOrange: {
  colors: [
   { accent: "#f97316" },
   { key: "#fff7ed" },
   { highlightBg: "rgba(249, 115, 22, 0.1)" },
   { accent30: "rgba(249, 115, 22, 0.3)" },
   { secondary: "#fdba74" },
   { secondarySoft: "#ffedd5" },
  ],
  colorName: [{ "pt-br": "Pôr do Sol", en: "Sunset Orange" }],
 },
 // Amarelos (3)
 goldenYellow: {
  colors: [
   { accent: "#eab308" },
   { key: "#fefce8" },
   { highlightBg: "rgba(234, 179, 8, 0.1)" },
   { accent30: "rgba(234, 179, 8, 0.3)" },
   { secondary: "#facc15" },
   { secondarySoft: "#fef9c3" },
  ],
  colorName: [{ "pt-br": "Amarelo Dourado", en: "Golden Yellow" }],
 },
 // Verdes (4-6)
 darkGreen: {
  colors: [
   { accent: "#22c55e" },
   { key: "#f7fafc" },
   { highlightBg: "rgba(34, 197, 94, 0.1)" },
   { accent30: "rgba(34, 197, 94, 0.3)" },
   { secondary: "#4ade80" },
   { secondarySoft: "#bbf7d0" },
  ],
  colorName: [{ "pt-br": "Verde Floresta", en: "Dark Green" }],
 },
 teal: {
  colors: [
   { accent: "#14b8a6" },
   { key: "#f0fdfa" },
   { highlightBg: "rgba(20, 184, 166, 0.1)" },
   { accent30: "rgba(20, 184, 166, 0.3)" },
   { secondary: "#2dd4bf" },
   { secondarySoft: "#ccfbf1" },
  ],
  colorName: [{ "pt-br": "Turquesa", en: "Teal" }],
 },
 emerald: {
  colors: [
   { accent: "#10b981" },
   { key: "#ecfdf5" },
   { highlightBg: "rgba(16, 185, 129, 0.1)" },
   { accent30: "rgba(16, 185, 129, 0.3)" },
   { secondary: "#34d399" },
   { secondarySoft: "#d1fae5" },
  ],
  colorName: [{ "pt-br": "Esmeralda", en: "Emerald" }],
 },
 // Azuis (7-9)
 deepBlue: {
  colors: [
   { accent: "#3b82f6" },
   { key: "#f8fafc" },
   { highlightBg: "rgba(59, 130, 246, 0.1)" },
   { accent30: "rgba(59, 130, 246, 0.3)" },
   { secondary: "#60a5fa" },
   { secondarySoft: "#dbeafe" },
  ],
  colorName: [{ "pt-br": "Azul Profundo", en: "Deep Blue" }],
 },
 cyan: {
  colors: [
   { accent: "#06b6d4" },
   { key: "#ecfeff" },
   { highlightBg: "rgba(6, 182, 212, 0.1)" },
   { accent30: "rgba(6, 182, 212, 0.3)" },
   { secondary: "#22d3ee" },
   { secondarySoft: "#cffafe" },
  ],
  colorName: [{ "pt-br": "Ciano", en: "Cyan" }],
 },
 indigo: {
  colors: [
   { accent: "#6366f1" },
   { key: "#eef2ff" },
   { highlightBg: "rgba(99, 102, 241, 0.1)" },
   { accent30: "rgba(99, 102, 241, 0.3)" },
   { secondary: "#818cf8" },
   { secondarySoft: "#e0e7ff" },
  ],
  colorName: [{ "pt-br": "Índigo", en: "Indigo" }],
 },
 // Violetas (10-11)
 vibrantPurple: {
  colors: [
   { accent: "#a855f7" },
   { key: "#faf5ff" },
   { highlightBg: "rgba(168, 85, 247, 0.1)" },
   { accent30: "rgba(168, 85, 247, 0.3)" },
   { secondary: "#c084fc" },
   { secondarySoft: "#ede9fe" },
  ],
  colorName: [{ "pt-br": "Lavanda", en: "Vibrant Purple" }],
 },
 deepPurple: {
  colors: [
   { accent: "#8b5cf6" },
   { key: "#f5f3ff" },
   { highlightBg: "rgba(139, 92, 246, 0.1)" },
   { accent30: "rgba(139, 92, 246, 0.3)" },
   { secondary: "#a78bfa" },
   { secondarySoft: "#ede9fe" },
  ],
  colorName: [{ "pt-br": "Roxo Profundo", en: "Deep Purple" }],
 },
 // Rosas/Magentas (12)
 hotPink: {
  colors: [
   { accent: "#ec4899" },
   { key: "#fdf2f8" },
   { highlightBg: "rgba(236, 72, 153, 0.1)" },
   { accent30: "rgba(236, 72, 153, 0.3)" },
   { secondary: "#f472b6" },
   { secondarySoft: "#fce7f3" },
  ],
  colorName: [{ "pt-br": "Rosa Quente", en: "Hot Pink" }],
 },
 // Neutros Escuros (13)
 obsidian: {
  colors: [
   { accent: "#18181b" },
   { key: "#f4f4f5" },
   { highlightBg: "rgba(24,24,27,0.1)" },
   { accent30: "rgba(24,24,27,0.3)" },
   { secondary: "#27272a" },
   { secondarySoft: "#e4e4e7" },
  ],
  colorName: [{ "pt-br": "Obsidiana", en: "Obsidian" }],
 },
} as const;

export const bgBannerColor = {
 // Brancos e variações
 pureWhite: {
  colors: [{ bg: "#ffffff" }, { text: "#000000" }],
  colorName: [{ "pt-br": "Branco Puro", en: "Pure White" }],
 },
 snowWhite: {
  colors: [{ bg: "#f8fafc" }, { text: "#1a1a1a" }],
  colorName: [{ "pt-br": "Branco Neve", en: "Snow White" }],
 },
 lightAsh: {
  colors: [{ bg: "#e5e7eb" }, { text: "#23272f" }],
  colorName: [{ "pt-br": "Cinza Claro", en: "Light Ash" }],
 },
 // Pretos e variações
 graphite: {
  colors: [{ bg: "#23272f" }, { text: "#f3f4f6" }],
  colorName: [{ "pt-br": "Grafite", en: "Graphite" }],
 },
 midnightSlate: {
  colors: [{ bg: "#181e29" }, { text: "#f8fafc" }],
  colorName: [{ "pt-br": "Azul Meia-Noite", en: "Midnight Slate" }],
 },
 onyx: {
  colors: [{ bg: "#101014" }, { text: "#f8fafc" }],
  colorName: [{ "pt-br": "Ônix", en: "Onyx" }],
 },
} as const;

export type PaletteName = keyof typeof colorPalettes;
export const defaultPalette: PaletteName = "darkGreen";

export const bannerDimensions = {
 width: 1584,
 height: 396,
};

export type BgBannerColorName = keyof typeof bgBannerColor;
