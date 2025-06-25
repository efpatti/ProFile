/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
 ],
 theme: {
  extend: {
   colors: {
    accent: {
     darkGreen: "#22c55e",
     deepBlue: "#3b82f6",
     vibrantPurple: "#a855f7",
     sunsetOrange: "#f97316",
     teal: "#14b8a6",
    },
    key: {
     darkGreen: "#f7fafc",
     deepBlue: "#f8fafc",
     vibrantPurple: "#faf5ff",
     sunsetOrange: "#fff7ed",
     teal: "#f0fdfa",
    },
    secondary: {
     darkGreen: "#4ade80",
     deepBlue: "#60a5fa",
     vibrantPurple: "#c084fc",
     sunsetOrange: "#fdba74",
     teal: "#2dd4bf",
    },
    secondarySoft: {
     darkGreen: "#bbf7d0",
     deepBlue: "#dbeafe",
     vibrantPurple: "#ede9fe",
     sunsetOrange: "#ffedd5",
     teal: "#ccfbf1",
    },
    highlightBg: {
     darkGreen: "rgba(34, 197, 94, 0.1)",
     deepBlue: "rgba(59, 130, 246, 0.1)",
     vibrantPurple: "rgba(168, 85, 247, 0.1)",
     sunsetOrange: "rgba(249, 115, 22, 0.1)",
     teal: "rgba(20, 184, 166, 0.1)",
    },
    accent30: {
     darkGreen: "rgba(34, 197, 94, 0.3)",
     deepBlue: "rgba(59, 130, 246, 0.3)",
     vibrantPurple: "rgba(168, 85, 247, 0.3)",
     sunsetOrange: "rgba(249, 115, 22, 0.3)",
     teal: "rgba(20, 184, 166, 0.3)",
    },
   },
  },
 },
 plugins: ["tailwindcss-text-shadow"],
};
