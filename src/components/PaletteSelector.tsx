import React from "react";
import { usePalette, paletteTokens } from "@/styles/PaletteProvider";
import { svgPathProperties } from "svg-path-properties";

type PaletteOption = {
 name: keyof typeof paletteTokens;
 label: string;
};

const PALETTE_OPTIONS: PaletteOption[] = [
 { name: "darkGreen", label: "Verde Floresta" },
 { name: "deepBlue", label: "Azul Profundo" },
 { name: "vibrantPurple", label: "Lavanda" },
 { name: "sunsetOrange", label: "Pôr do Sol" },
 { name: "teal", label: "Turquesa" },
];

const PATH_D = `
  M60,10 
  C85,10 110,30 110,60 
  C110,90 85,110 60,110 
  C40,110 25,95 20,80 
  C15,65 25,60 35,60 
  C50,60 50,40 40,30 
  C35,25 40,10 60,10Z
`;

export const PaletteSelector: React.FC = () => {
 const { palette, setPalette } = usePalette();

 // Parâmetros do arco ajustado
 const ARC_CENTER = { x: 60, y: 58 }; // centro mais baixo
 const ARC_RADIUS = 28; // raio mais fechado
 const ARC_START_ANGLE = -100; // ângulo inicial (graus)
 const ARC_END_ANGLE = 100; // ângulo final (graus)
 const ARC_COUNT = 5;

 // Calcula posições igualmente espaçadas ao longo do arco
 const arcPositions = Array.from({ length: ARC_COUNT }).map((_, i) => {
  const angle =
   ((ARC_END_ANGLE - ARC_START_ANGLE) / (ARC_COUNT - 1)) * i + ARC_START_ANGLE;
  const rad = (angle * Math.PI) / 180;
  return {
   x: ARC_CENTER.x + ARC_RADIUS * Math.cos(rad),
   y: ARC_CENTER.y + ARC_RADIUS * Math.sin(rad),
  };
 });

 // Nova ordem para corresponder à posição visual desejada
 const paletteOrder = [
  "darkGreen",
  "deepBlue",
  "vibrantPurple",
  "sunsetOrange",
  "teal",
 ];

 return (
  <div className="relative w-48 h-48">
   <svg
    viewBox="0 0 120 120"
    className="absolute inset-0 z-0"
    xmlns="http://www.w3.org/2000/svg"
   >
    <defs>
     <pattern
      id="wood-bg"
      patternUnits="userSpaceOnUse"
      width="120"
      height="120"
     >
      <image
       href="/wood2.jpg"
       x="0"
       y="0"
       width="120"
       height="120"
       preserveAspectRatio="none"
      />
     </pattern>
    </defs>

    <path d={PATH_D} fill="url(#wood-bg)" stroke="#aaa" strokeWidth="2" />

    {paletteOrder.map((name, i) => {
     const opt = PALETTE_OPTIONS.find((o) => o.name === name)!;
     const pos = arcPositions[i];
     const isActive = palette === opt.name;
     return (
      <circle
       key={opt.name}
       cx={pos.x}
       cy={pos.y}
       r={isActive ? 9 : 8}
       stroke={isActive ? "white" : "#222"}
       strokeWidth={isActive ? 2 : 0.5}
       fill={paletteTokens[opt.name].accent}
       style={{
        cursor: "pointer",
        transition: "all 0.3s",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
       }}
       onClick={() => setPalette(opt.name)}
      >
       <title>{opt.label}</title>
      </circle>
     );
    })}
   </svg>
  </div>
 );
};
