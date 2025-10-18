// Polyfill para localStorage no servidor (SSR)
// Evita erro: localStorage.getItem is not a function

if (typeof window === "undefined") {
 // Polyfill simples para SSR
 (global as any).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
 };
}

export {};
