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
   },
  },
 },
 plugins: ["tailwindcss-text-shadow"],
};
