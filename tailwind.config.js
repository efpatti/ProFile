/** @type {import('tailwindcss').Config} */
module.exports = {
 darkMode: 'class', // Enable dark mode via class
 content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
 ],
 theme: {
  extend: {
   colors: {
    accent: {
     DEFAULT: "var(--accent)",
     fg: "var(--key)",
     soft: "var(--secondary-soft)",
     secondary: "var(--secondary)",
     30: "rgba(var(--accent-30),0.9)",
    },
    surface: {
     DEFAULT: "#0f1115",
     elevated: "#181b21",
     subtle: "#1f242c",
    },
    border: {
     DEFAULT: "#2a3038",
     accent: "var(--accent)",
    },
   },
   boxShadow: {
    focus: "0 0 0 2px var(--accent), 0 0 0 4px rgba(var(--accent-30),0.4)",
   },
   transitionTimingFunction: {
    "soft-out": "cubic-bezier(.22,.61,.36,1)",
   },
  },
 },
 plugins: [
  function ({ addUtilities }) {
   addUtilities({
    ".focus-ring": {
     outline: "none",
     boxShadow: "0 0 0 2px var(--accent), 0 0 0 4px rgba(var(--accent-30),0.4)",
    },
    ".focus-ring-inset": {
     outline: "none",
     boxShadow:
      "inset 0 0 0 2px var(--accent), 0 0 0 4px rgba(var(--accent-30),0.4)",
    },
   });
  },
  "tailwindcss-text-shadow",
 ],
};
