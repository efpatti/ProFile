// Arquivo convertido de JS para TS para uso em componentes React/Next.js
export const colorPalettes = {
 darkGreen: {
  accent: "#22c55e",
  key: "#f7fafc",
  highlightBg: "rgba(34, 197, 94, 0.1)",
  accent30: "rgba(34, 197, 94, 0.3)",
  btn: ["bg-green-600", "hover:bg-green-700"],
  secondary: "#4ade80",
  secondarySoft: "#bbf7d0",
 },
 deepBlue: {
  accent: "#3b82f6",
  key: "#f8fafc",
  highlightBg: "rgba(59, 130, 246, 0.1)",
  accent30: "rgba(59, 130, 246, 0.3)",
  btn: ["bg-blue-500", "hover:bg-blue-600"],
  secondary: "#60a5fa",
  secondarySoft: "#dbeafe",
 },
 vibrantPurple: {
  accent: "#a855f7",
  key: "#faf5ff",
  highlightBg: "rgba(168, 85, 247, 0.1)",
  accent30: "rgba(168, 85, 247, 0.3)",
  btn: ["bg-purple-500", "hover:bg-purple-600"],
  secondary: "#c084fc",
  secondarySoft: "#ede9fe",
 },
 sunsetOrange: {
  accent: "#f97316",
  key: "#fff7ed",
  highlightBg: "rgba(249, 115, 22, 0.1)",
  accent30: "rgba(249, 115, 22, 0.3)",
  btn: ["bg-orange-500", "hover:bg-orange-600"],
  secondary: "#fdba74",
  secondarySoft: "#ffedd5",
 },
 teal: {
  accent: "#14b8a6",
  key: "#f0fdfa",
  highlightBg: "rgba(20, 184, 166, 0.1)",
  accent30: "rgba(20, 184, 166, 0.3)",
  btn: ["bg-teal-500", "hover:bg-teal-600"],
  secondary: "#2dd4bf",
  secondarySoft: "#ccfbf1",
 },
} as const;

export type PaletteName = keyof typeof colorPalettes;
export const defaultPalette: PaletteName = "darkGreen";
export const bannerDimensions = {
 width: 1584,
 height: 396,
};
