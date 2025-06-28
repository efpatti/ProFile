// src/utils/color.ts (ou onde preferir organizar utilitários)
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

// Função para determinar se uma cor hex é clara ou escura (com base na luminância)
export const isLightColor = (hexColor: string): boolean => {
 const r = parseInt(hexColor.substr(1, 2), 16);
 const g = parseInt(hexColor.substr(3, 2), 16);
 const b = parseInt(hexColor.substr(5, 2), 16);
 const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
 return luminance > 0.5;
};

// Lista das cores que você considera "fundo escuro"
const darkBackgrounds: BgBannerColorName[] = [
 "midnightSlate",
 "graphite",
 "onyx",
];

// Função para verificar se o background selecionado é escuro
export const isDarkBackground = (selectedBg: BgBannerColorName): boolean => {
 return darkBackgrounds.includes(selectedBg);
};
