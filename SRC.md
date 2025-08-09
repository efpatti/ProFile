## src/core/models/Developer.ts
```
// Versão TypeScript migrada do Developer.js
export interface DeveloperProps {
 name: string;
 role: string;
 stack: string[];
 company: string;
 position: string;
}

export class Developer {
 name: string;
 role: string;
 stack: string[];
 company: string;
 position: string;

 constructor({ name, role, stack, company, position }: DeveloperProps) {
  this.name = name;
  this.role = role;
  this.stack = stack;
  this.company = company;
  this.position = position;
 }

 validate(): boolean {
  if (!this.name || !this.role) {
   throw new Error("Name and role are required");
  }
  return true;
 }

 toJSON() {
  return {
   name: this.name,
   role: this.role,
   stack: this.stack,
   company: this.company,
   position: this.position,
  };
 }
}
```

## src/core/formatters/HtmlFormatter.ts
```
// Versão TypeScript migrada do HtmlFormatter.js
import { DevDataFormatter } from "./DevDataFormatter";
import {
 colorPalettes,
 defaultPalette,
 PaletteName,
} from "@/styles/sharedStyleConstants";

export class HtmlFormatter extends DevDataFormatter {
 indent(level: number): string {
  return "&nbsp;".repeat(level * 2);
 }

 formatArray(
  key: string,
  array: string[],
  accentColor: string,
  keyColor: string,
  textColor?: string // novo parâmetro
 ): string {
  let formatted = `${this.indent(1)}<span style='color:${
   textColor || keyColor
  }'>${key}</span>: [<br>`;
  array.forEach((item, i) => {
   formatted += `${this.indent(
    2
   )}<span style='color:${accentColor}'>&quot;${item}&quot;</span>${
    i < array.length - 1 ? "," : ""
   }<br>`;
  });
  formatted += `${this.indent(1)}],<br>`;
  return formatted;
 }

 format(
  dev: Record<string, unknown>,
  paletteName: PaletteName = defaultPalette,
  textColor?: string
 ): string {
  const palette = colorPalettes[paletteName] || colorPalettes[defaultPalette];
  const colorsArr = palette.colors;
  // Utilitário para buscar cor pelo nome
  function getColor<T extends string>(name: T): string | undefined {
   const found = colorsArr.find((c) =>
    Object.prototype.hasOwnProperty.call(c, name)
   );
   return found ? (found as Record<T, string>)[name] : undefined;
  }
  const accentColor = getColor("accent") ?? "#22c55e";
  const keyColor = getColor("key") ?? "#f7fafc";
  const secondaryColor = getColor("secondary") ?? "#4ade80";
  const devTextColor = textColor || keyColor;
  let formatted = `<span style='color:${secondaryColor};font-weight:bold;text-shadow:0 0 1px ${secondaryColor},0 0 12px ${secondaryColor}99;'>const</span> <span style='color:${devTextColor};font-weight:bold;'>dev</span> <span style='color:${devTextColor}'>=</span> {<br>`;
  for (const key in dev) {
   if (Array.isArray(dev[key])) {
    formatted += this.formatArray(
     key,
     dev[key] as string[],
     accentColor,
     keyColor,
     devTextColor // passa a cor ativa
    );
   } else {
    formatted += `${this.indent(
     1
    )}<span style='color:${devTextColor}'>${key}</span>: <span style='color:${accentColor}'>&quot;${
     dev[key]
    }&quot;</span>,<br>`;
   }
  }
  formatted += "};";
  return formatted;
 }
}
```

## src/core/formatters/DevDataFormatter.ts
```
// Versão TypeScript migrada do DevDataFormatter.js
export abstract class DevDataFormatter {
 constructor() {
  if (new.target === DevDataFormatter) {
   throw new Error("Abstract class cannot be instantiated");
  }
 }
 abstract format(dev: Record<string, unknown>): string;
}
```

## src/core/exporters/BannerExporter.ts
```
// Versão TypeScript migrada do BannerExporter.js
export abstract class BannerExporter {
 abstract export(): Promise<unknown>;
}
```

## src/core/exporters/Html2CanvasExporter.ts
```
// Versão TypeScript migrada do Html2CanvasExporter.js
import { BannerExporter } from "./BannerExporter";

export class Html2CanvasExporter extends BannerExporter {
 bannerElement: HTMLElement;
 constructor(bannerElement: HTMLElement) {
  super();
  this.bannerElement = bannerElement;
 }

 async loadLibrary(): Promise<void> {
  return new Promise((resolve) => {
   const script = document.createElement("script");
   script.src =
    "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
   script.onload = () => resolve();
   document.head.appendChild(script);
  });
 }

 async export(): Promise<HTMLCanvasElement> {
  await this.loadLibrary();
  await new Promise((r) => setTimeout(r, 200));
  return new Promise((resolve, reject) => {
   // @ts-expect-error html2canvas is loaded globally
   html2canvas(this.bannerElement, {
    useCORS: true,
    backgroundColor: null,
    scale: 2,
    width: 1584,
    height: 396,
   })
    .then(resolve)
    .catch(reject);
  });
 }
}
```

## src/core/services/useUserBannerColorSync.ts
```
// src/core/services/useUserBannerColorSync.ts
"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { BannerColorName } from "@/styles/PaletteProvider";

export function useUserBannerColorSync() {
 const { user } = useAuth();
 const { setBannerColor } = usePalette();

 useEffect(() => {
  if (!user) return;
  const userDoc = doc(db, "users", user.uid);
  const unsubscribe = onSnapshot(userDoc, (snapshot) => {
   const data = snapshot.data();
   if (data && data.bannerColor) {
    setBannerColor(data.bannerColor as BannerColorName);
   }
  });
  return () => unsubscribe();
 }, [user, setBannerColor]);
}
```

## src/core/services/PuppeteerService.ts
```
// Versão TypeScript migrada do PuppeteerService.js
import puppeteer from "puppeteer";
import { BannerService } from "@/core/services/BannerService";
import { colorPalettes, PaletteName } from "@/styles/sharedStyleConstants";
import { paletteActiveState } from "@/styles/PaletteProvider";

export class PuppeteerService {
 static async captureBanner(
  palette: string = paletteActiveState.value,
  logoUrl: string = ""
 ): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Aumenta a resolução para máxima qualidade
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 4 });
  // Use BannerService to generate the correct URL
  const pageUrl = BannerService.getBannerUrl({
   palette,
   logo: logoUrl,
   host: "127.0.0.1",
   port: 3000,
  });
  try {
   await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout
  } catch (err) {
   // DEBUG: Take screenshot on navigation error
   await page.screenshot({ path: "/tmp/banner_debug_goto_error.png" });
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] Error during page.goto:", err);
   throw err;
  }

  // DEBUG: Take screenshot after goto
  await page.screenshot({ path: "/tmp/banner_debug_after_goto.png" });

  // DEBUG: Log HTML after goto
  const html = await page.content();
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] HTML after goto:\n", html);

  // Espera pelo #banner com timeout maior e debug limpo
  try {
   await page.waitForSelector("#banner", { timeout: 60000 });
  } catch (err) {
   await page.screenshot({
    path: "/tmp/banner_debug_waitforselector_error.png",
   });
   const html = await page.content();
   // Tenta extrair só o trecho do #banner ou um resumo do body
   const bannerMatch = html.match(
    /<section[^>]*id=["']banner["'][^>]*>([\s\S]*?)<\/section>/i
   );
   if (bannerMatch) {
    console.error("[PuppeteerService] #banner HTML snippet:", bannerMatch[0]);
   } else {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    console.error(
     "[PuppeteerService] <body> HTML snippet:",
     bodyMatch ? bodyMatch[1].slice(0, 1000) : html.slice(0, 1000)
    );
   }
   console.error("[PuppeteerService] Error waiting for #banner:", err);
   throw err;
  }

  await page.evaluateHandle("document.fonts.ready");

  // Aguarda a logo carregar, se existir
  if (logoUrl) {
   await page.waitForSelector("#company-logo", { timeout: 5000 });
   await page.waitForFunction(
    () => {
     const img = document.getElementById(
      "company-logo"
     ) as HTMLImageElement | null;
     return img ? img.complete && img.naturalWidth > 0 : true;
    },
    { timeout: 5000 }
   );
  }

  // DEBUG: Screenshot before waiting for code block
  await page.screenshot({ path: "/tmp/banner_debug_before_wait_code.png" });

  // DEBUG: Log code block contents before waiting
  const codeBlockBefore = await page.$eval("#code", (el) => el.innerHTML);
  // eslint-disable-next-line no-console
  console.log(
   "[PuppeteerService] #code contents before wait:",
   codeBlockBefore
  );

  // DEBUG: Increase timeout for waitForFunction
  await page.waitForFunction(
   () => {
    const code = document.getElementById("code");
    return code && code.innerHTML.trim().length > 0;
   },
   { timeout: 20000 }
  );

  // DEBUG: Screenshot after waiting for code block
  await page.screenshot({ path: "/tmp/banner_debug_after_wait_code.png" });

  // DEBUG: Log code block contents after waiting
  const codeBlockAfter = await page.$eval("#code", (el) => el.innerHTML);
  // eslint-disable-next-line no-console
  console.log("[PuppeteerService] #code contents after wait:", codeBlockAfter);

  // Adiciona CSS global de antialiasing e image-rendering para o banner
  await page.addStyleTag({
   content: `
      #banner, #banner * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
        image-rendering: -webkit-optimize-contrast !important;
        image-rendering: crisp-edges !important;
        image-rendering: pixelated !important;
      }
    `,
  });

  const banner = await page.$("#banner");
  if (!banner) {
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] #banner not found!");
   throw new Error("Banner element not found");
  }
  // Screenshot com máxima qualidade
  // @ts-expect-error puppeteer screenshot returns Buffer
  const buffer: Buffer = await banner.screenshot({
   encoding: "binary",
   type: "png",
   captureBeyondViewport: true,
   omitBackground: false,
  });
  await browser.close();
  return buffer;
 }

 static getPaletteInfo(palette: string | undefined) {
  if (!palette || !(palette in colorPalettes)) return null;
  const info = colorPalettes[palette as PaletteName];
  return {
   label: info.colorName?.[0]?.["pt-br"] || palette,
   color: info.colors?.[0]?.accent || "#888",
  };
 }

 static async captureResumePDF(
  palette: string = paletteActiveState.value,
  lang: string = "pt-br",
  bannerColor?: string
 ): Promise<Buffer> {
  // Não use label, use sempre o slug/código
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1700, deviceScaleFactor: 2 });
  let pageUrl = `http://127.0.0.1:3000/resume?palette=${palette}&lang=${lang}`;
  if (bannerColor) pageUrl += `&bannerColor=${bannerColor}`;
  try {
   await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout
  } catch (err) {
   await page.screenshot({ path: "/tmp/resume_debug_goto_error.png" });
   // eslint-disable-next-line no-console
   console.error("[PuppeteerService] Error during resume page.goto:", err);
   throw err;
  }
  await page.waitForSelector(".pdf");
  await page.evaluateHandle("document.fonts.ready");
  // Aguarda renderização completa
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Gera o PDF
  const buffer = Buffer.from(
   await page.pdf({
    printBackground: true,
    format: "A4",
    preferCSSPageSize: true,
   })
  );
  await browser.close();
  return buffer;
 }
}
```

## src/core/services/LanguageProvider.tsx
```
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type Language = "pt-br" | "en";

interface LanguageContextType {
 language: Language;
 setLanguage: (language: Language) => void;
 toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
 undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
 children,
}) => {
 const [language, setLanguage] = useState<Language>("pt-br");

 const toggleLanguage = () => {
  setLanguage((prev) => (prev === "pt-br" ? "en" : "pt-br"));
 };

 return (
  <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
   {children}
  </LanguageContext.Provider>
 );
};

export const useLanguage = () => {
 const context = useContext(LanguageContext);
 if (context === undefined) {
  throw new Error("useLanguage must be used within a LanguageProvider");
 }
 return context;
};
```

## src/core/services/usePaletteFirestoreSync.ts
```
// src/core/services/usePaletteFirestoreSync.ts
import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import type { PaletteName } from "@/styles/PaletteProvider";

export function usePaletteFirestoreSync() {
 const { user } = useAuth();
 const { palette } = usePalette();
 const prevPalette = useRef<PaletteName | null>(null);

 useEffect(() => {
  if (!user) return;
  if (prevPalette.current === palette) return;
  prevPalette.current = palette;
  // Atualiza o campo palette no Firestore
  updateDoc(doc(db, "users", user.uid), { palette }).catch(() => {});
 }, [palette, user]);
}
```

## src/core/services/AuthProvider.tsx
```
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Dados extras do Firestore para o usuário
export type UserProfileData = {
 displayName?: string | null;
 photoURL?: string | null;
 bannerColor?: string | null; // paleta ativa do usuário
 // Adicione outros campos customizados do Firestore aqui
};

export type UserWithProfile = User & UserProfileData;

interface AuthContextType {
 user: UserWithProfile | null;
 isLogged: boolean;
 loading: boolean;
 setUser: React.Dispatch<React.SetStateAction<UserWithProfile | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
 undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 const [user, setUser] = useState<UserWithProfile | null>(null);
 const [isLogged, setIsLogged] = useState(false);
 const [loading, setLoading] = useState<boolean>(true);

 console.log("[AuthProvider] render", { loading, user, isLogged });

 useEffect(() => {
  console.log("[AuthProvider] useEffect mounted");
  const unsubscribe = onAuthStateChanged(auth, (userState) => {
   console.log("[AuthProvider] onAuthStateChanged fired", userState);
   if (userState) {
    const userDoc = doc(db, "users", userState.uid);
    const unsubscribeSnapshot = onSnapshot(
     userDoc,
     (docSnapshot) => {
      const userData = docSnapshot.exists()
       ? (docSnapshot.data() as UserProfileData)
       : {};
      console.log("[AuthProvider] Firestore userData", userData);
      setUser({ ...userState, ...userData });
      setIsLogged(true);
      setLoading(false);
     },
     (err) => {
      console.error("[AuthProvider] Firestore onSnapshot error", err);
      setUser({ ...userState });
      setIsLogged(true);
      setLoading(false);
     }
    );
    // Limpa o snapshot listener ao deslogar
    return () => {
     console.log("[AuthProvider] Unsubscribing Firestore snapshot");
     unsubscribeSnapshot();
    };
   } else {
    setUser(null);
    setIsLogged(false);
    setLoading(false);
   }
  });
  return () => {
   console.log("[AuthProvider] Unsubscribing onAuthStateChanged");
   unsubscribe();
  };
 }, []);

 useEffect(() => {
  console.log("[AuthProvider] useEffect", { loading, user, isLogged });
 }, [loading, user, isLogged]);

 return (
  <AuthContext.Provider value={{ user, isLogged, loading, setUser }}>
   {loading ? <LoadingScreen /> : children}
  </AuthContext.Provider>
 );
};

const LoadingScreen = () => (
 <div className="h-screen w-full flex justify-center items-center bg-gray-100">
  <div className="flex gap-2">
   {[...Array(3)].map((_, i) => (
    <div
     key={i}
     className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
     style={{ animationDelay: `${i * 0.2}s` }}
    />
   ))}
  </div>
 </div>
);

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) throw new Error("useAuth must be used within an AuthProvider");
 return context;
};
```

## src/core/services/signOut.ts
```
// src/core/services/signOut.ts
"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function handleSignOut() {
 await signOut(auth);
}
```

## src/core/services/SkillsService.ts
```
import {
 collection,
 writeBatch,
 doc,
 getDocs,
 query,
 where,
 deleteDoc,
 addDoc,
 updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Skill {
 id?: string; // Firestore document ID
 category: string;
 item: string;
 language: "pt-br" | "en";
 order: number;
}

// Busca todas as skills para um usuário e idioma
export const fetchSkillsForUser = async (
 userId: string,
 language: "pt-br" | "en"
): Promise<Skill[]> => {
 const skillsRef = collection(db, "users", userId, "skills");
 const q = query(skillsRef, where("language", "==", language));
 const querySnapshot = await getDocs(q);
 return querySnapshot.docs.map((doc) => ({
  id: doc.id,
  ...(doc.data() as Omit<Skill, "id">),
 }));
};

// Salva todas as alterações (adições, atualizações, remoções)
export const saveSkills = async (
 userId: string,
 language: "pt-br" | "en",
 skills: Skill[]
) => {
 const batch = writeBatch(db);
 const skillsRef = collection(db, "users", userId, "skills");

 // Pega as skills existentes para comparar
 const existingSkills = await fetchSkillsForUser(userId, language);
 const existingSkillIds = new Set(existingSkills.map((s) => s.id));
 const newSkillIds = new Set(skills.map((s) => s.id).filter(Boolean));

 // 1. Deletar skills que foram removidas
 for (const skill of existingSkills) {
  if (!newSkillIds.has(skill.id)) {
   const docRef = doc(db, "users", userId, "skills", skill.id!);
   batch.delete(docRef);
  }
 }

 // 2. Adicionar ou atualizar skills
 skills.forEach((skill, index) => {
  const skillData = {
   category: skill.category,
   item: skill.item,
   language: language,
   order: index, // A ordem é definida pela posição no array
  };

  if (skill.id && existingSkillIds.has(skill.id)) {
   // Atualiza skill existente
   const docRef = doc(db, "users", userId, "skills", skill.id);
   batch.update(docRef, skillData);
  } else {
   // Adiciona nova skill
   const newDocRef = doc(collection(db, "users", userId, "skills"));
   batch.set(newDocRef, skillData);
  }
 });

 await batch.commit();
};
```

## src/core/services/LanguagesService.ts
```
```

## src/core/services/useUserPaletteSync.ts
```
// src/core/services/useUserPaletteSync.ts
"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { PaletteName } from "@/styles/PaletteProvider";

export function useUserPaletteSync() {
 const { user } = useAuth();
 const { setPalette } = usePalette();

 useEffect(() => {
  if (!user) return;
  let ignore = false;
  const fetchPalette = async () => {
   const userDoc = await getDoc(doc(db, "users", user.uid));
   if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.palette && !ignore) setPalette(data.palette as PaletteName);
   }
  };
  fetchPalette();
  return () => {
   ignore = true;
  };
 }, [user, setPalette]);
}
```

## src/core/services/useBannerColorFirestoreSync.ts
```
// src/core/services/useBannerColorFirestoreSync.ts
"use client";
import { useEffect } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { BannerColorName } from "@/styles/PaletteProvider";

// Sincroniza bannerColor global do Firestore em tempo real (caso use um valor global)
export function useBannerColorFirestoreSync() {
 const { setBannerColor } = usePalette();

 useEffect(() => {
  const bannerDoc = doc(db, "config", "bannerColor");
  const unsubscribe = onSnapshot(bannerDoc, (snapshot) => {
   const data = snapshot.data();
   if (data && data.value) {
    setBannerColor(data.value as BannerColorName);
   }
  });
  return () => unsubscribe();
 }, [setBannerColor]);
}
```

## src/core/services/EducationService.ts
```
import {
 collection,
 query,
 where,
 getDocs,
 writeBatch,
 doc,
 orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface EducationItem {
 id: string;
 title: string;
 period: string;
 order: number;
 language: string;
}

export const fetchEducationForUser = async (
 userId: string,
 lang: string
): Promise<EducationItem[]> => {
 const educationRef = collection(db, "users", userId, "education");
 const q = query(
  educationRef,
  where("language", "==", lang),
  orderBy("order", "asc")
 );
 const querySnapshot = await getDocs(q);
 return querySnapshot.docs.map(
  (doc) => ({ id: doc.id, ...doc.data() } as EducationItem)
 );
};

export const saveEducation = async (
 userId: string,
 itemsToSave: EducationItem[],
 itemsToDelete: string[]
): Promise<void> => {
 const batch = writeBatch(db);

 itemsToSave.forEach((item) => {
  const itemRef = doc(db, "users", userId, "education", item.id);
  batch.set(itemRef, {
   title: item.title,
   period: item.period,
   order: item.order,
   language: item.language,
  });
 });

 itemsToDelete.forEach((itemId) => {
  const itemRef = doc(db, "users", userId, "education", itemId);
  batch.delete(itemRef);
 });

 await batch.commit();
};
```

## src/core/services/BannerService.ts
```
// Versão TypeScript migrada do BannerService.js
import { Developer } from "../models/Developer";
import { HtmlFormatter } from "../formatters/HtmlFormatter";
import { PaletteName } from "@/styles/sharedStyleConstants";

export class BannerService {
 formatter: HtmlFormatter;
 dev: Developer;

 constructor() {
  this.formatter = new HtmlFormatter();
  this.dev = new Developer({
   name: "Enzo Ferracini Patti",
   role: "Fullstack Developer",
   stack: ["React", "Node.js", "TypeScript"],
   company: "Mottu",
   position: "Development Intern",
  });
 }

 static getBannerUrl({
  palette = "darkGreen",
  logo = "",
  host = "127.0.0.1",
  port = 3000,
 }: {
  palette?: string;
  logo?: string;
  host?: string;
  port?: number;
 }) {
  let url = `http://${host}:${port}/?palette=${encodeURIComponent(palette)}`;
  if (logo) {
   url += `&logo=${encodeURIComponent(logo)}`;
  }
  return url;
 }

 renderTo(elementId: string, paletteName: PaletteName) {
  const element = document.getElementById(elementId);
  if (element) {
   element.innerHTML = this.formatter.format(this.dev.toJSON(), paletteName);
  }
 }
}
```

## src/pages/api/brand-search.ts
```
import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = "sk_YNP0Kih5QnqisbIQftwkiA";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 const query = (req.query.q as string) || "";
 console.log("[brand-search] Query:", query); // debug
 if (!query || query.length < 2) {
  console.log(
   "[brand-search] Query too short or empty, returning empty results"
  );
  res.status(200).json({ results: [] });
  return;
 }
 try {
  const response = await fetch(
   `https://api.logo.dev/search?q=${encodeURIComponent(query)}`,
   {
    headers: {
     Authorization: `Bearer: ${API_KEY}`,
    },
   }
  );
  const data = await response.json();
  console.log("[brand-search] External API response:", data); // debug
  let results: any[] = [];
  if (Array.isArray(data)) {
   results = data;
  } else if (Array.isArray(data.results)) {
   results = data.results;
  }
  console.log("[brand-search] Final results:", results); // debug
  res.status(200).json({ results });
 } catch (error: unknown) {
  let errorMessage = "Erro na busca";
  if (error instanceof Error) {
   console.error("[brand-search] Erro ao buscar na logo.dev:", error.message);
   errorMessage = error.message;
  } else {
   console.error("[brand-search] Erro ao buscar na logo.dev:", error);
  }
  res.status(500).json({ results: [], error: errorMessage });
 }
}
```

## src/pages/api/download-resume.ts
```
import type { NextApiRequest, NextApiResponse } from "next";
import { PuppeteerService } from "@/core/services/PuppeteerService";
import { BannerService } from "@/core/services/BannerService";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 try {
  const palette = (req.query.palette as string) || "darkGreen";
  const lang = (req.query.lang as string) || "pt-br";
  const bannerColor = (req.query.bannerColor as string) || undefined;
  console.log("[API] palette recebido:", palette, "bannerColor:", bannerColor);
  // Adicione outros parâmetros se necessário
  const buffer = await PuppeteerService.captureResumePDF(
   palette,
   lang,
   bannerColor
  );
  if (!buffer || buffer.length < 1000) {
   res.status(500).json({
    error: "Resume PDF generation failed (empty or invalid buffer)",
   });
   return;
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.status(200).send(buffer);
 } catch (err) {
  console.error("Error generating resume PDF:", err);
  res.status(500).json({ error: "Failed to generate resume PDF" });
 }
}
```

## src/pages/api/download-banner.ts
```
import type { NextApiRequest, NextApiResponse } from "next";
import { PuppeteerService } from "@/core/services/PuppeteerService";
import { BannerService } from "@/core/services/BannerService";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 try {
  const palette = (req.query.palette as string) || "darkGreen";
  const logo = (req.query.logo as string) || "";
  const buffer = await PuppeteerService.captureBanner(palette, logo);
  console.log("[download-banner] Buffer length:", buffer?.length);
  if (!buffer || buffer.length < 1000) {
   console.error(
    "[download-banner] Invalid or empty buffer returned by Puppeteer"
   );
   res.status(500).json({
    error: "Banner image generation failed (empty or invalid buffer)",
   });
   return;
  }
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
   "Content-Disposition",
   "attachment; filename=linkedin-banner.png"
  );
  res.status(200).send(buffer);
 } catch (err) {
  console.error("Error generating banner:", err);
  res.status(500).json({ error: "Failed to generate banner" });
 }
}
```

## src/app/protected/resume/page.tsx
```
"use client";

import React, { useState, useEffect } from "react";
import Section from "@/components/Section";
import SkillCategory from "@/components/SkillCategory";
// import { resumeData } from "@/data/resumeData";
import { FaAward, FaExternalLinkAlt } from "react-icons/fa";
import {
 defaultPalette,
 colorPalettes,
 bgBannerColor,
 type PaletteName,
 type BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { useAuth } from "@/core/services/AuthProvider";
import { isDarkBackground } from "@/utils/color";
import { SettingsPanel } from "@/components/SettingsPanel";
import { usePalette } from "@/styles/PaletteProvider";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/core/services/LanguageProvider";
import {
 getDoc,
 doc,
 collection,
 query,
 where,
 getDocs,
 orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const defaultBg: BgBannerColorName = "midnightSlate";

const ResumePage: React.FC = () => {
 const searchParams = useSearchParams();
 const paletteFromQuery = searchParams
  ? (searchParams.get("palette") as PaletteName | null)
  : null;
 const bannerColorFromQuery = searchParams
  ? (searchParams.get("bannerColor") as BgBannerColorName | null)
  : null;
 const { language, toggleLanguage } = useLanguage();
 // const [data, setData] = useState(resumeData["pt-br"]);
 const [isClient, setIsClient] = useState(false);
 const [paletteName] = useState<PaletteName>(defaultPalette);
 const { bannerColor, palette, setPalette, setBannerColor } = usePalette();
 const [selectedBg, setSelectedBg] = useState<BgBannerColorName>(
  bannerColorFromQuery || bannerColor || defaultBg
 );
 const { user } = useAuth();
 const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>(
  undefined
 );
 const [header, setHeader] = useState<{
  subtitle: string;
  contacts: any[];
 } | null>(null);
 const [experience, setExperience] = useState<any[]>();
 const [skills, setSkills] = useState<any[]>();
 const [profile, setProfile] = useState<any>();
 const [languages, setLanguages] = useState<{
  title: string;
  items: string[];
 }>();
 const [education, setEducation] = useState<any[]>();
 const [projects, setProjects] = useState<any[]>();
 const [certifications, setCertifications] = useState<any[]>();
 const [interests, setInterests] = useState<any[]>();
 const [recommendations, setRecommendations] = useState<any[]>();
 const [awards, setAwards] = useState<any[]>();

 useEffect(() => {
  setIsClient(true);
 }, [language]);

 // Força o contexto a usar a palette da query string, se existir
 useEffect(() => {
  if (paletteFromQuery && paletteFromQuery !== palette) {
   setPalette(paletteFromQuery);
  }
  if (bannerColorFromQuery && bannerColorFromQuery !== bannerColor) {
   setSelectedBg(bannerColorFromQuery);
   setBannerColor(bannerColorFromQuery);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [paletteFromQuery, bannerColorFromQuery]);

 useEffect(() => {
  if (user) {
   const fetchProfile = async () => {
    const profileRef = doc(db, "users", user.uid, "profile", language);
    const docSnap = await getDoc(profileRef);
    if (docSnap.exists()) {
     setProfile(docSnap.data());
    } else {
     console.log("No such document!");
    }
   };

   const fetchHeader = async () => {
    try {
     const headerDocRef = doc(db, "users", user.uid, "header", language);
     const headerDocSnap = await getDoc(headerDocRef);

     let subtitle = "";
     if (headerDocSnap.exists()) {
      subtitle = headerDocSnap.data().subtitle || "";
     }

     const contactsColRef = collection(
      db,
      "users",
      user.uid,
      "header",
      language,
      "contacts"
     );
     const q = query(contactsColRef);
     const contactsSnapshot = await getDocs(q);
     const contacts = contactsSnapshot.docs.map((doc) => doc.data());

     setHeader({ subtitle, contacts });
    } catch (error) {
     console.error("Error fetching header:", error);
     setHeader(null); // Reset on error
    }
   };

   const fetchSkills = async () => {
    const skillsRef = collection(db, "users", user.uid, "skills");
    const q = query(
     skillsRef,
     where("language", "==", language),
     orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const skillsData = querySnapshot.docs.map(
      (doc) =>
       doc.data() as {
        category: string;
        item: string;
        order: number;
        id: string;
       }
     );

     // Agrupa os itens por categoria, mantendo a ordem da categoria
     const groupedSkills = skillsData.reduce((acc, { category, item }) => {
      if (!acc[category]) {
       acc[category] = { title: category, items: [] };
      }
      acc[category].items.push(item);
      return acc;
     }, {} as Record<string, { title: string; items: string[] }>);

     // A ordem já é garantida pelo `orderBy` da query,
     // então apenas convertemos o objeto para um array.
     // Usamos um Set para pegar as categorias na ordem correta.
     const orderedCategories = [
      ...new Set(skillsData.map((skill) => skill.category)),
     ];
     const formattedSkills = orderedCategories.map(
      (category) => groupedSkills[category]
     );

     setSkills(formattedSkills);
    } else {
     console.log("No skills documents found!");
     setSkills([]); // Limpa as skills se não encontrar nada
    }
   };

   const fetchExperience = async () => {
    const experienceRef = collection(db, "users", user.uid, "experience");
    const q = query(experienceRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const experienceData = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.order - b.order);
     setExperience(experienceData);
    } else {
     console.log("No experience documents found!");
    }
   };

   const fetchLanguages = async () => {
    const langDocRef = doc(db, "users", user.uid, "languages", language);
    const docSnap = await getDoc(langDocRef);

    if (docSnap.exists()) {
     const data = docSnap.data();
     setLanguages({
      title: data.title || "Idiomas",
      items: data.items || [],
     });
    } else {
     console.log("No languages document found!");
     setLanguages({ title: "Idiomas", items: [] });
    }
   };

   const fetchEducation = async () => {
    const educationRef = collection(db, "users", user.uid, "education");
    const q = query(
     educationRef,
     where("language", "==", language),
     orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const educationData = querySnapshot.docs.map((doc) => doc.data());
     setEducation(educationData);
    } else {
     console.log("No education documents found!");
     setEducation([]);
    }
   };

   const fetchProjects = async () => {
    const projectsRef = collection(db, "users", user.uid, "projects");
    const q = query(projectsRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const projectsData = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.order - b.order);
     setProjects(projectsData);
    } else {
     console.log("No projects documents found!");
    }
   };

   const fetchCertifications = async () => {
    const certificationsRef = collection(
     db,
     "users",
     user.uid,
     "certifications"
    );
    const q = query(certificationsRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const certificationsData = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.order - b.order);
     setCertifications(certificationsData);
    } else {
     console.log("No certifications documents found!");
    }
   };

   const fetchInterests = async () => {
    const interestsRef = collection(db, "users", user.uid, "interests");
    const q = query(interestsRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const interestsData = querySnapshot.docs.map(
      (doc) => doc.data() as { category: string; item: string; order: number }
     );

     const groupedInterests = interestsData.reduce((acc, interest) => {
      if (!acc[interest.category]) {
       acc[interest.category] = [];
      }
      acc[interest.category].push(interest.item);
      return acc;
     }, {} as Record<string, string[]>);

     const formattedInterests = Object.entries(groupedInterests)
      .map(([title, items]) => ({
       title,
       items,
      }))
      .sort((a, b) => {
       const orderA =
        interestsData.find((s) => s.category === a.title)?.order || 0;
       const orderB =
        interestsData.find((s) => s.category === b.title)?.order || 0;
       return orderA - orderB;
      });

     setInterests(formattedInterests);
    } else {
     console.log("No interests documents found!");
    }
   };

   const fetchRecommendations = async () => {
    const recommendationsRef = collection(
     db,
     "users",
     user.uid,
     "recommendations"
    );
    const q = query(recommendationsRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const recommendationsData = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.order - b.order);
     setRecommendations(recommendationsData);
    } else {
     console.log("No recommendations documents found!");
    }
   };

   const fetchAwards = async () => {
    const awardsRef = collection(db, "users", user.uid, "awards");
    const q = query(awardsRef, where("language", "==", language));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
     const awardsData = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.order - b.order);
     setAwards(awardsData);
    } else {
     console.log("No awards documents found!");
    }
   };

   fetchProfile();
   fetchSkills();
   fetchExperience();
   fetchLanguages();
   fetchEducation();
   fetchProjects();
   fetchCertifications();
   fetchInterests();
   fetchRecommendations();
   fetchAwards();
   fetchHeader();
  }
 }, [user, language]);

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 function getBtnClasses(paletteName: PaletteName): string {
  const palette = colorPalettes[paletteName];
  if (!palette) return "bg-[var(--accent)] hover:bg-[var(--accent)]/90";
  const btnObj = palette.colors.find(
   (c: any) => typeof c === "object" && c !== null && "btn" in c
  ) as { btn?: string[] } | undefined;
  return btnObj && btnObj.btn
   ? btnObj.btn.join(" ")
   : "bg-[var(--accent)] hover:bg-[var(--accent)]/90";
 }
 const btnClasses = getBtnClasses(paletteName);

 // Função utilitária para obter o objeto de cor do bg
 function getBgColorObj(bgName: BgBannerColorName) {
  const bgObj = bgBannerColor[bgName];
  const colorsArr = bgObj.colors;
  const bg = (
   colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "bg")) as {
    bg: string;
   }
  ).bg;
  const text = (
   colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "text")) as {
    text: string;
   }
  ).text;
  return { bg, text };
 }
 const effectiveBgColor = getBgColorObj(selectedBg);

 // Add handler for background selection
 const handleSelectBg = (bg: BgBannerColorName) => setSelectedBg(bg);

 // --- PDF Handlers ---
 const handleGeneratePDFPuppeteer = () => {
  window.open(
   `/api/download-resume?palette=${palette}&lang=${language}&bannerColor=${selectedBg}`,
   "_blank"
  );
 };

 const handleGeneratePDFHtml2Pdf = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // @ts-ignore
  const html2pdf = (await import("html2pdf.js")).default;
  html2pdf().from(el).save("resume-html2pdf.pdf");
 };

 const handleGeneratePDFJsPDF = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // Cria um clone do elemento para manipular as cores
  const clone = el.cloneNode(true) as HTMLElement;
  // Substitui oklch() por #fff (ou outra cor fallback)
  const replaceOklch = (node: HTMLElement) => {
   if (node.style) {
    if (node.style.background && node.style.background.includes("oklch")) {
     node.style.background = "#fff";
    }
    if (node.style.color && node.style.color.includes("oklch")) {
     node.style.color = "#222";
    }
   }
   Array.from(node.children).forEach((child) =>
    replaceOklch(child as HTMLElement)
   );
  };
  replaceOklch(clone);
  document.body.appendChild(clone);
  const { jsPDF } = await import("jspdf");
  // @ts-ignore
  await doc.html(clone, {
   callback: function (doc: any) {
    doc.save("resume-jspdf.pdf");
    clone.remove();
   },
  });
 };

 const handleGeneratePDFPdfLib = async () => {
  if (typeof window === "undefined") return;
  const el = document.getElementById("resume");
  if (!el) return alert("Resume element not found");
  // Cria um clone do elemento para manipular as cores
  const clone = el.cloneNode(true) as HTMLElement;
  // Substitui oklch() por #fff (ou outra cor fallback)
  const replaceOklch = (node: HTMLElement) => {
   if (node.style) {
    if (node.style.background && node.style.background.includes("oklch")) {
     node.style.background = "#fff";
    }
    if (node.style.color && node.style.color.includes("oklch")) {
     node.style.color = "#222";
    }
   }
   Array.from(node.children).forEach((child) =>
    replaceOklch(child as HTMLElement)
   );
  };
  replaceOklch(clone);
  document.body.appendChild(clone);
  const { PDFDocument } = await import("pdf-lib");
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(clone);
  const imgData = canvas.toDataURL("image/png");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([canvas.width, canvas.height]);
  const pngImage = await pdfDoc.embedPng(imgData);
  page.drawImage(pngImage, {
   x: 0,
   y: 0,
   width: canvas.width,
   height: canvas.height,
  });
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-pdflib.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  clone.remove();
  URL.revokeObjectURL(url);
 };

 useEffect(() => {
  if (bannerColor) setSelectedBg(bannerColor);
 }, [bannerColor]);

 if (!isClient) {
  return null;
 }

 return (
  <div className="min-h-screen bg-gray-950 p-4 md:p-8 w-full">
   <div className="flex justify-end mb-4">
    <button
     className={`font-semibold py-2 px-4 cursor-pointer rounded transition-colors duration-200 text-white rounded-md ${btnClasses}`}
     onClick={toggleLanguage}
    >
     {language === "pt-br" ? "PT" : "EN"}
    </button>
   </div>
   <div
    className="max-w-6xl pdf mx-auto overflow-hidden border-4 border-[var(--secondary)] relative"
    style={{ background: effectiveBgColor.bg }}
    id="resume"
   >
    {/* Shared settings panel for bg/logo/download */}
    <SettingsPanel
     selectedBg={selectedBg}
     onSelectBg={handleSelectBg}
     logoUrl={currentLogoUrl}
     onLogoSelect={setCurrentLogoUrl}
     showDownloadButton={true}
     position="right"
     downloadType="resume"
    />
    {/* Header */}
    <div className="p-8 bg-[var(--accent)]">
     <h1 className="text-3xl font-bold mb-2">
      {user?.displayName || "Seu Nome"}
     </h1>
     <h2 className="text-xl opacity-90 mb-6">
      {header?.subtitle || "Título Profissional"}
     </h2>
     <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base">
      {(header?.contacts || []).map((contact: any) => (
       <a
        key={contact.text}
        href={contact.href}
        className="flex items-center gap-2 hover:underline transition-colors duration-200 text-sm"
        target={contact.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
       >
        {contact.icon &&
         (() => {
          try {
           const Icon = require("react-icons/fa")[contact.icon];
           return Icon ? <Icon className="text-white" /> : null;
          } catch {
           return null;
          }
         })()}
        <span>{contact.text}</span>
       </a>
      ))}
     </div>
    </div>
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
     {/* Left Column */}
     <div>
      {/* Profile */}
      <Section title={profile?.title || "Profile"} accent={"#2563eb"}>
       <p
        className={
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }
        style={{ marginBottom: "0.75rem" }}
       >
        {profile?.content || "erro"}
       </p>
      </Section>
      {/* Languages */}
      <Section title={languages?.title || "Languages"} accent={"#2563eb"}>
       <ul
        className={`list-disc pl-5 space-y-1 ${
         isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
        }`}
       >
        {(languages?.items || []).map((item, index) => (
         <li key={index}>{item}</li>
        ))}
       </ul>
      </Section>
      {/* Education */}
      <Section title={"Education"} accent={"#2563eb"}>
       {(education || []).map((item, index) => (
        <div className="mb-6" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-2"
            : "text-gray-500 text-sm mb-2"
          }
         >
          {item.period}
         </p>
        </div>
       ))}
      </Section>
      {/* Experience */}
      <Section title={"Experience"} accent={"#2563eb"}>
       {(experience || []).map((item: any, index: number) => (
        <div
         className="mb-6 p-4 rounded-lg transition-shadow duration-300"
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200 text-lg"
            : "font-bold text-gray-800 text-lg"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-3"
            : "text-gray-500 text-sm mb-3"
          }
         >
          {item.period}
         </p>
         <ul
          className={
           isDarkBackground(selectedBg)
            ? "list-disc pl-5 space-y-2 text-gray-400"
            : "list-disc pl-5 space-y-2 text-gray-700"
          }
         >
          {(item.details || []).map((detail: any, i: number) => (
           <li key={i} className="leading-snug">
            {detail}
           </li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Projects */}
      <Section title={"Projects"} accent={"#2563eb"}>
       {(projects || []).map((item: any, index: number) => (
        <div
         className={`mb-6 p-4 rounded-lg transition-shadow duration-300 `}
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200 text-lg"
            : "font-bold text-gray-800 text-lg"
          }
         >
          {item.title}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 mb-3"
            : "text-gray-700 mb-3"
          }
         >
          {item.description}
         </p>
         <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center hover:underline transition-colors duration-200 
            text-[var(--accent)]`}
         >
          <FaExternalLinkAlt className="mr-1" />
          {item.link.text}
         </a>
        </div>
       ))}
      </Section>
      {/* Certifications */}
      <Section title={"Certifications"} accent={"#2563eb"}>
       {(certifications || []).map((item: any, index: number) => (
        <div
         className="mb-6 p-4 rounded-lg transition-shadow duration-300"
         key={index}
        >
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.title}
         </h4>
         {item.examCode && (
          <p
           className={
            isDarkBackground(selectedBg)
             ? "text-gray-400 text-sm mb-2"
             : "text-gray-500 text-sm mb-2"
           }
          >
           {language === "pt-br" ? "Código do exame" : "Exam code"}:{" "}
           {item.examCode}
          </p>
         )}
         <a
          href={item.linkCredly}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center hover:underline transition-colors duration-200 
            text-[var(--accent)]`}
         >
          <FaExternalLinkAlt className="mr-1" />
          {language === "pt-br" ? "Ver credencial" : "View credential"}
         </a>
        </div>
       ))}
      </Section>
     </div>
     {/* Right Column */}
     <div>
      {/* Skills */}
      <Section title={"Skills"} accent={"#2563eb"}>
       {(skills || []).map((category: any, index: number) => (
        <SkillCategory
         key={index}
         category={category}
         textClass={
          isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-700"
         }
        />
       ))}
      </Section>
      {/* Interests */}
      <Section title={"Interests"} accent={"#2563eb"}>
       {(interests || []).map((cat: any, index: number) => (
        <div className="mb-4" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-semibold text-gray-200 mb-2"
            : "font-semibold text-gray-700 mb-2"
          }
         >
          {cat.title}
         </h4>
         <ul
          className={
           isDarkBackground(selectedBg)
            ? "list-disc pl-5 space-y-1 text-gray-400"
            : "list-disc pl-5 space-y-1 text-gray-700"
          }
         >
          {(cat.items || []).map((item: any, i: number) => (
           <li key={i}>{item}</li>
          ))}
         </ul>
        </div>
       ))}
      </Section>
      {/* Recommendations */}
      <Section title={"Recommendations"} accent={"#2563eb"}>
       {(recommendations || []).map((item: any, index: number) => (
        <div className="mb-6 rounded-r-lg" key={index}>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "font-bold text-gray-200"
            : "font-bold text-gray-800"
          }
         >
          {item.name}
         </h4>
         <h4
          className={
           isDarkBackground(selectedBg)
            ? "text-md text-gray-400 mb-2"
            : "text-md text-gray-600 mb-2"
          }
         >
          {item.position}
         </h4>
         <p
          className={
           isDarkBackground(selectedBg)
            ? "text-gray-400 text-sm mb-3"
            : "text-gray-500 text-sm mb-3"
          }
         >
          {item.period}
         </p>
         <blockquote
          className={
           isDarkBackground(selectedBg)
            ? "italic text-gray-300"
            : "italic text-gray-700"
          }
          dangerouslySetInnerHTML={{ __html: item.text }}
         />
        </div>
       ))}
      </Section>
      {/* Awards */}
      <Section title={"Awards"} accent={"#2563eb"}>
       {(awards || []).map((item: any, index: number) => (
        <div
         className={`flex items-start gap-3 mb-4 p-3 rounded-lg transition-shadow duration-300 `}
         key={index}
        >
         <div className="flex space-x-2">
          <div>
           <FaAward className={"inline-block text-[var(--accent)]"} />
          </div>
          <div>
           <p
            className={
             isDarkBackground(selectedBg)
              ? "font-semibold text-gray-200"
              : "font-semibold text-gray-800"
            }
           >
            {item.title}
           </p>
           <p
            className={
             isDarkBackground(selectedBg) ? "text-gray-400" : "text-gray-600"
            }
           >
            {item.description}
           </p>
          </div>
         </div>
        </div>
       ))}
      </Section>
     </div>
    </div>
   </div>
  </div>
 );
};

export default ResumePage;
```

## src/app/protected/banner/page.tsx
```
"use client";
import { useState } from "react";
import { Banner, getBgColorObj } from "@/components/Banner";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { useAuth } from "@/core/services/AuthProvider";

export default function Home() {
 const { user } = useAuth();
 const [logoUrl] = useState<string | undefined>("/mottu.jpg");
 const [bgBanner, setBgBanner] = useState<BgBannerColorName>("midnightSlate");

 return (
  <div className="flex flex-col items-center min-h-screen justify-center p-8 gap-8">
   <Banner
    logoUrl={logoUrl}
    bgColor={getBgColorObj(bgBanner)}
    selectedBg={bgBanner}
    onSelectBg={(color: string) => setBgBanner(color as BgBannerColorName)}
    user={user}
   />
  </div>
 );
}
```

## src/app/protected/layout.tsx
```
"use client";

import { useAuth } from "@/core/services/AuthProvider";
import { ReactNode } from "react";
import AuthGuard from "./components/AuthGuard";

export default function Layout({ children }: { children: ReactNode }) {
 const { user, loading, isLogged } = useAuth();

 if (loading) return <>Auth loading...</>;
 if (!isLogged || !user) return <AuthGuard />;
 return children;
}
```

## src/app/protected/components/AuthGuard.tsx
```
import { LOGIN_PATH } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthGuard() {
 const pathname = usePathname();

 return (
  <div
   className="flex flex-col items-center justify-center min-h-screen text-black"
   style={{ background: "red", zIndex: 9999 }}
  >
   <div style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>
    DEBUG: AuthGuard Renderizado
   </div>
   <pre className="mb-4">Você está tentando acessar: {pathname}</pre>
   <div className="text-lg mb-2">Você encontrou uma área protegida!</div>
   <Link
    href={`${LOGIN_PATH}?continueTo=${pathname}`}
    className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
   >
    Fazer login
   </Link>
  </div>
 );
}
```

## src/app/export/banner/page.tsx
```
"use client";

import { Banner } from "../../../components/Banner";
import { useSearchParams } from "next/navigation";
import { BgBannerColorName } from "../../../styles/sharedStyleConstants";

export default function BannerExport() {
 const searchParams = useSearchParams();
 const palette =
  (searchParams?.get("palette") as BgBannerColorName) || "midnightSlate";
 const logo = searchParams?.get("logo") || undefined;
 const name = searchParams?.get("name") || "Seu Nome";

 return (
  <div
   style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafb",
    margin: 0,
    padding: 0,
   }}
  >
   <Banner selectedBg={palette} logoUrl={logo} />
  </div>
 );
}
```

## src/app/users/page.tsx
```
// src/app/users/page.tsx
import React from "react";

interface User {
 bannerColor?: string;
 createdAt?: number;
 email?: string;
 name?: string;
 pallete?: string;
 uid?: string;
 updatedAt?: number;
}

async function getUsers(): Promise<Record<string, User>> {
 // Use a REST API do Firebase Realtime Database
 const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
 if (!databaseUrl)
  throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL não definida");
 const res = await fetch(`${databaseUrl}/users.json`, { cache: "no-store" });
 if (!res.ok) throw new Error("Erro ao buscar usuários do Realtime Database");
 return res.json();
}

export default async function UsersPage() {
 let users: Record<string, User> = {};
 try {
  users = await getUsers();
 } catch (e) {
  return (
   <div className="p-8 text-red-500">Erro ao buscar usuários: {String(e)}</div>
  );
 }

 if (!users || Object.keys(users).length === 0) {
  return <div className="p-8">Nenhum usuário encontrado.</div>;
 }

 return (
  <div className="p-8 max-w-2xl mx-auto">
   <h1 className="text-2xl font-bold mb-6">Usuários do Realtime Database</h1>
   <ul className="space-y-4">
    {Object.entries(users).map(([uid, user]) => (
     <li key={uid} className="border rounded p-4 bg-zinc-800 text-white">
      <div>
       <b>UID:</b> {uid}
      </div>
      <div>
       <b>Nome:</b> {user.name || "-"}
      </div>
      <div>
       <b>Email:</b> {user.email || "-"}
      </div>
      <div>
       <b>Criado em:</b>{" "}
       {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}
```

## src/app/layout.tsx
```
import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PaletteProvider } from "@/styles/PaletteProvider";
import { AuthProvider } from "@/core/services/AuthProvider";
import { LanguageProvider } from "@/core/services/LanguageProvider";
import Navbar from "@/components/Navbar";
import { PaletteSyncWrapper } from "@/components/PaletteSyncWrapper";
import { BannerColorSyncWrapper } from "@/components/BannerColorSyncWrapper";

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
 display: "swap",
});
const manrope = Manrope({
 variable: "--font-manrope",
 subsets: ["latin"],
 display: "swap",
});
const jetbrains = JetBrains_Mono({
 variable: "--font-jetbrains",
 subsets: ["latin"],
 display: "swap",
});

export const metadata: Metadata = {
 title: "Create Next App",
 description: "Generated by create next app",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html
   lang="en"
   className={`${inter.variable} ${manrope.variable} ${jetbrains.variable}`}
  >
   <body>
    <AuthProvider>
     <PaletteProvider>
      <LanguageProvider>
       <PaletteSyncWrapper />
       <BannerColorSyncWrapper />
       <Navbar />
       {children}
      </LanguageProvider>
     </PaletteProvider>
    </AuthProvider>
   </body>
  </html>
 );
}
```

## src/app/auth/sign-up/page.tsx
```
"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import LogoSVG from "@/components/LogoSVG";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/services/AuthProvider";
import { doc, setDoc } from "firebase/firestore";
import { PaletteSelector } from "@/components/PaletteSelector";
import type { PaletteName } from "@/styles/PaletteProvider";

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: { staggerChildren: 0.1 as const },
 },
};

const itemVariants = {
 hidden: { y: 20, opacity: 0 },
 visible: {
  y: 0,
  opacity: 1,
  transition: { type: "spring" as const, stiffness: 100 },
 },
};

const Header = () => (
 <motion.div variants={itemVariants} className="p-8 pb-0">
  <div className="flex justify-center mb-6">
   <div className="h-30 w-40 bg-gradient-to-r flex items-center justify-center">
    <LogoSVG className="w-[500px] h-[400px]" />
   </div>
  </div>
  <h1 className="text-2xl font-bold text-center text-white mb-2">
   Create an account
  </h1>
  <p className="text-zinc-400 text-center">
   Get started with your free account
  </p>
 </motion.div>
);

const SocialButtons = () => (
 <motion.div
  variants={itemVariants}
  className="px-8 pt-6 flex justify-center space-x-4"
 >
  {[FaGithub, FaGoogle].map((Icon, i) => (
   <button
    key={i}
    className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors text-white"
   >
    <Icon className="text-lg" />
   </button>
  ))}
 </motion.div>
);

const Divider = () => (
 <motion.div variants={itemVariants} className="px-8 py-6 flex items-center">
  <div className="flex-1 h-px bg-zinc-700"></div>
  <span className="px-4 text-sm text-zinc-500">OR</span>
  <div className="flex-1 h-px bg-zinc-700"></div>
 </motion.div>
);

const InputField = ({
 id,
 label,
 type,
 Icon,
 placeholder,
}: {
 id: string;
 label: string;
 type: string;
 Icon: React.ElementType;
 placeholder: string;
}) => (
 <motion.div variants={itemVariants}>
  <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
   {label}
  </label>
  <div className="relative">
   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Icon className="text-zinc-500" />
   </div>
   <input
    id={id}
    type={type}
    defaultValue=""
    autoComplete="off"
    className="w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder={placeholder}
   />
  </div>
 </motion.div>
);

const Form = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [authLoading, setAuthLoading] = useState(true);
 const [userLogged, setUserLogged] = useState(false);
 const [palette, setPalette] = useState<PaletteName>("darkGreen");
 const router = useRouter();
 const { user, loading: globalAuthLoading } = useAuth();

 useEffect(() => {
  setAuthLoading(globalAuthLoading);
  setUserLogged(!!user);
 }, [globalAuthLoading, user]);

 useEffect(() => {
  if (!authLoading && userLogged) {
   router.replace("/");
  }
 }, [authLoading, userLogged, router]);

 if (authLoading) {
  return (
   <div className="flex justify-center items-center py-16">
    <span className="text-zinc-400 text-lg animate-pulse">Loading...</span>
   </div>
  );
 }

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  const form = e.currentTarget;
  const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
  const password = (form.elements.namedItem("password") as HTMLInputElement)
   ?.value;
  const confirmPassword = (
   form.elements.namedItem("confirmPassword") as HTMLInputElement
  )?.value;

  if (password !== confirmPassword) {
   setError("Passwords don't match");
   setLoading(false);
   return;
  }

  try {
   const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
   );
   await updateProfile(userCredential.user, { displayName: name });
   // Save to Firestore with palette
   await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    name,
    email,
    palette, // save palette
    createdAt: new Date().toISOString(),
   });
   router.push("/"); // redirect to home on success
  } catch (err) {
   const errorMsg = err instanceof Error ? err.message : String(err);
   setError(errorMsg || "Failed to create account");
  } finally {
   setLoading(false);
  }
 };

 return (
  <motion.form
   variants={containerVariants}
   className="px-8 pb-8 space-y-6"
   onSubmit={handleSubmit}
  >
   <InputField
    id="name"
    label="Full name"
    type="text"
    Icon={FaUser}
    placeholder="John Doe"
   />
   <InputField
    id="email"
    label="Email address"
    type="email"
    Icon={FaEnvelope}
    placeholder="you@example.com"
   />
   <InputField
    id="password"
    label="Password"
    type="password"
    Icon={FaLock}
    placeholder="••••••••"
   />
   <InputField
    id="confirmPassword"
    label="Confirm Password"
    type="password"
    Icon={FaLock}
    placeholder="••••••••"
   />
   <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-zinc-300 mb-1">
     Color palette
    </label>
    <PaletteSelector
     bgName="midnightSlate"
     selected={palette}
     onSelect={setPalette}
    />
   </motion.div>
   <motion.div variants={itemVariants}>
    <button
     type="submit"
     className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center"
     disabled={loading}
    >
     {loading ? (
      "Creating account..."
     ) : (
      <>
       Sign up <FiArrowRight className="ml-2" />
      </>
     )}
    </button>
   </motion.div>
   {error && (
    <motion.div
     variants={itemVariants}
     className="text-center text-red-400 text-sm"
    >
     {error}
    </motion.div>
   )}
   <motion.div
    variants={itemVariants}
    className="text-center text-zinc-400 text-sm"
   >
    Already have an account?{" "}
    <a
     href="/auth/sign-in"
     className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
    >
     Sign in
    </a>
   </motion.div>
  </motion.form>
 );
};

const Footer = () => (
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-6 text-center text-zinc-500 text-sm"
 >
  © {new Date().getFullYear()} ProFile. All rights reserved.
 </motion.div>
);

const SignUp = () => (
 <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
  <motion.div
   initial={{ scale: 0.95, opacity: 0 }}
   animate={{ scale: 1, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="w-full max-w-lg"
  >
   <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="bg-zinc-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-zinc-700/50"
   >
    <Header />
    <SocialButtons />
    <Divider />
    <Form />
   </motion.div>
   <Footer />
  </motion.div>
 </div>
);

export default SignUp;
```

## src/app/auth/sign-in/page.tsx
```
"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import LogoSVG from "@/components/LogoSVG"; // Componente SVG extraído
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/services/AuthProvider";

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
  opacity: 1,
  transition: { staggerChildren: 0.1 as const },
 },
};

const itemVariants = {
 hidden: { y: 20, opacity: 0 },
 visible: {
  y: 0,
  opacity: 1,
  transition: { type: "spring" as const, stiffness: 100 },
 },
};

const Header = () => (
 <motion.div variants={itemVariants} className="p-8 pb-0">
  <div className="flex justify-center mb-6">
   <div className="h-30 w-40 bg-gradient-to-r flex items-center justify-center">
    <LogoSVG className="w-[500px] h-[400px]" />
   </div>
  </div>
  <h1 className="text-2xl font-bold text-center text-white mb-2">
   Welcome back
  </h1>
  <p className="text-zinc-400 text-center">
   Log in to your account to continue
  </p>
 </motion.div>
);

const SocialButtons = () => (
 <motion.div
  variants={itemVariants}
  className="px-8 pt-6 flex justify-center space-x-4"
 >
  {[FaGithub, FaGoogle].map((Icon, i) => (
   <button
    key={i}
    className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors text-white"
   >
    <Icon className="text-lg" />
   </button>
  ))}
 </motion.div>
);

const Divider = () => (
 <motion.div variants={itemVariants} className="px-8 py-6 flex items-center">
  <div className="flex-1 h-px bg-zinc-700"></div>
  <span className="px-4 text-sm text-zinc-500">OR</span>
  <div className="flex-1 h-px bg-zinc-700"></div>
 </motion.div>
);

const InputField = ({
 id,
 label,
 type,
 Icon,
 placeholder,
}: {
 id: string;
 label: string;
 type: string;
 Icon: React.ElementType;
 placeholder: string;
}) => (
 <motion.div variants={itemVariants}>
  <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
   {label}
  </label>
  <div className="relative">
   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Icon className="text-zinc-500" />
   </div>
   <input
    id={id}
    type={type}
    defaultValue=""
    autoComplete="off"
    className="w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder={placeholder}
   />
  </div>
 </motion.div>
);

const Form = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [authLoading, setAuthLoading] = useState(true);
 const [userLogged, setUserLogged] = useState(false);
 const router = useRouter();
 const { user, loading: globalAuthLoading } = useAuth();

 useEffect(() => {
  setAuthLoading(globalAuthLoading);
  setUserLogged(!!user);
 }, [globalAuthLoading, user]);

 useEffect(() => {
  if (!authLoading && userLogged) {
   router.replace("/");
  }
 }, [authLoading, userLogged, router]);

 if (authLoading) {
  return (
   <div className="flex justify-center items-center py-16">
    <span className="text-zinc-400 text-lg animate-pulse">Loading...</span>
   </div>
  );
 }

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  const form = e.currentTarget;
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
  const password = (form.elements.namedItem("password") as HTMLInputElement)
   ?.value;
  try {
   await signInWithEmailAndPassword(auth, email, password);
   // TODO: redirect or show success
  } catch (err) {
   const errorMsg = err instanceof Error ? err.message : String(err);
   setError(errorMsg || "Failed to sign in");
  } finally {
   setLoading(false);
  }
 };

 return (
  <motion.form
   variants={containerVariants}
   className="px-8 pb-8 space-y-6"
   onSubmit={handleSubmit}
  >
   <InputField
    id="email"
    label="Email address"
    type="email"
    Icon={FaEnvelope}
    placeholder="you@example.com"
   />
   <motion.div variants={itemVariants}>
    <div className="flex justify-between items-center mb-1">
     <label
      htmlFor="password"
      className="block text-sm font-medium text-zinc-300"
     >
      Password
     </label>
     <a
      href="#"
      className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
     >
      Forgot?
     </a>
    </div>
    <div className="relative">
     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaLock className="text-zinc-500" />
     </div>
     <input
      id="password"
      type="password"
      defaultValue=""
      autoComplete="off"
      className="w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      placeholder="••••••••"
     />
    </div>
   </motion.div>
   <motion.div variants={itemVariants}>
    <button
     type="submit"
     className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center"
     disabled={loading}
    >
     {loading ? (
      "Logging in..."
     ) : (
      <>
       Log in <FiArrowRight className="ml-2" />
      </>
     )}
    </button>
   </motion.div>
   {error && (
    <motion.div
     variants={itemVariants}
     className="text-center text-red-400 text-sm"
    >
     {error}
    </motion.div>
   )}
   <motion.div
    variants={itemVariants}
    className="text-center text-zinc-400 text-sm"
   >
    Don&apos;t have an account?{" "}
    <a
     href="/auth/sign-up"
     className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
    >
     Sign up
    </a>
   </motion.div>
  </motion.form>
 );
};

const Footer = () => (
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mt-6 text-center text-zinc-500 text-sm"
 >
  © {new Date().getFullYear()} ProFile. All rights reserved.
 </motion.div>
);

const SignIn = () => (
 <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
  <motion.div
   initial={{ scale: 0.95, opacity: 0 }}
   animate={{ scale: 1, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="w-full max-w-lg"
  >
   <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="bg-zinc-800/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-zinc-700/50"
   >
    <Header />
    <SocialButtons />
    <Divider />
    <Form />
   </motion.div>
   <Footer />
  </motion.div>
 </div>
);

export default SignIn;
```

## src/app/page.tsx
```
export default function Home() {
 return (
  <div className="flex flex-col items-center min-h-screen justify-center p-8 gap-8">
   <h1 className="text-5xl min-h-screen">Home</h1>
  </div>
 );
}
```

## src/data/resume.ts
```
import type { ResumeDataType } from "./resume.types";

export const resumeData: ResumeDataType = {
 "pt-br": {
  title: "Currículo - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Desenvolvedor Web | Técnico em Desenvolvimento de Sistemas | Estudante de Ciência da Computação",
   contacts: [
    {
     icon: "fa-solid fa-envelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "fa-solid fa-phone",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "fab fa-linkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "fab fa-github",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Perfil",
    icon: "fa-user",
    content:
     "Estudante de Ciência da Computação e Desenvolvedor Web comprometido com a criação de sistemas bem estruturados, escaláveis e com foco em qualidade. Movido por propósito, aprendizado contínuo e a entrega de soluções que fazem a diferença.",
   },
   languages: {
    title: "Idiomas",
    icon: "fa-globe",
    items: ["Inglês: Intermediário/Avançado (B2)", "Português: Nativo/Fluente"],
   },
   education: {
    title: "Formação Acadêmica",
    icon: "fa-graduation-cap",
    items: [
     {
      title: "Bacharelado em Ciência da Computação – USCS",
      period: "Jan 2025 – Dez 2028",
     },
     {
      title: "Técnico em Desenvolvimento de Sistemas – SENAI",
      period: "Jan 2023 – Dez 2024",
     },
    ],
   },
   experience: {
    title: "Experiência",
    icon: "fa-briefcase",
    items: [
     {
      title: "Assistente Técnico & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dez 2024",
      details: [
       "Colaborei no desenvolvimento e aprimoramento de exercícios em sala de aula, garantindo a qualidade e funcionalidade dos sistemas como beta tester.",
       "Prestei suporte técnico para mais de 30 alunos, auxiliando em questões de desenvolvimento de software e compreensão conceitual.",
       "Liderei atividades de suporte e substituí o professor em 3 aulas, treinando mais de 30 alunos — fortalecendo habilidades de comunicação e ensino técnico.",
      ],
     },
    ],
   },
   projects: {
    title: "Projetos",
    icon: "fa-code",
    items: [
     {
      title: "Sistema de Cadastro — SENAI São Caetano do Sul",
      description:
       "Desenvolvido com o Professor William Reis utilizando React.js, Node.js e MySQL. Adotado por mais de 30 alunos para estudos práticos.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Tempo CEP (Integração com API)",
      description:
       "Criei um sistema que busca dados de endereço via API de CEP brasileiro e dados meteorológicos via API do Yahoo Weather. Construído com React.js, TailwindCSS e Axios.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "Bartira",
      description:
       "Sistema de gestão com autenticação JWT, CRUD de usuários, controle de produtos/fornecedores/vendas e módulo financeiro. Integrado com API de CEP.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Certificações",
    icon: "fa-certificate",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Habilidades",
    icon: "fa-cogs",
    categories: [
     {
      title: "Técnicas",
      items: [
       "JavaScript",
       "TypeScript",
       "Python",
       "Bash",
       "HTML5",
       "CSS3",
       "SASS",
       "React.js",
       "Next.js",
       "Node.js",
       "API RESTful",
       "JWT",
       "Django",
       "MySQL",
       "PostgreSQL",
       "Firebase",
       "MongoDB",
       "Linux",
       "Git",
       "Postman",
       "Scrum",
       "Kanban",
       "Jest",
       "React Testing Library",
       "Vitest",
      ],
     },
     {
      title: "Profissionais",
      items: [
       "Resolução de problemas",
       "Trabalho em equipe",
       "Aprendizado rápido",
       "Proatividade",
       "Criatividade",
       "Liderança",
      ],
     },
    ],
   },
   interests: {
    title: "Interesses",
    icon: "fa-lightbulb",
    categories: [
     {
      title: "Foco Técnico",
      items: [
       "Otimização de Performance",
       "Soluções Cloud-Native",
       "UI/UX para Devs",
       "Acessibilidade",
      ],
     },
     {
      title: "Valores & Comunidade",
      items: [
       "Arquitetura Escalável",
       "Impacto Social",
       "Open-Source",
       "Mentoria",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recomendações",
    icon: "fa-quote-left",
    items: [
     {
      title: "Rodrigo R. Alvarez",
      period: "Jan 2023 – Dez 2024",
      description: `Professor de TI, Desenvolvedor Fullstack`,
      details: [
       `"Tive o privilégio de ter Enzo como aluno e devo destacar seu desempenho excepcional. <br /><br />Ele se destacou por seu aprendizado rápido, dedicação consistente e grande interesse em aprofundar seus conhecimentos. Desde o início, ficou claro que ele buscava ir além do básico, aplicando as lições de maneiras práticas e criativas..."`,
      ],
     },
    ],
   },
   awards: {
    title: "Prêmios",
    icon: "fa-trophy",
    items: [
     {
      title: "Honra ao Mérito – SENAI São Caetano do Sul",
      description:
       "Premiação como melhor aluno do curso de Desenvolvimento de Sistemas.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Gerar PDF",
  },
 },
 en: {
  title: "Resume - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Web Developer | Software Development Technician | Computer Science Student",
   contacts: [
    {
     icon: "fa-solid fa-envelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "fa-solid fa-phone",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "fab fa-linkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "fab fa-github",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Profile",
    icon: "fa-user",
    content:
     "Computer Science student and Web Developer committed to creating well-structured, scalable systems with a focus on quality. Driven by purpose, continuous learning, and delivering solutions that make a difference.",
   },
   languages: {
    title: "Languages",
    icon: "fa-globe",
    items: ["English: Intermediate/Advanced (B2)", "Portuguese: Native/Fluent"],
   },
   education: {
    title: "Education",
    icon: "fa-graduation-cap",
    items: [
     {
      title: "Bachelor's Degree in Computer Science – USCS",
      period: "Jan 2025 – Dec 2028",
     },
     {
      title: "Associate Degree in Systems Development – SENAI",
      period: "Jan 2023 – Dec 2024",
     },
    ],
   },
   experience: {
    title: "Experience",
    icon: "fa-briefcase",
    items: [
     {
      title: "Technical Assistant & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dec 2024",
      details: [
       "Collaborated in the development and improvement of classroom exercises, ensuring system quality and functionality as a beta tester.",
       "Provided technical support for over 30 students, assisting with software development issues and conceptual understanding.",
       "Led support activities and substituted the teacher in 3 classes, training more than 30 students—strengthening communication and technical teaching skills.",
      ],
     },
    ],
   },
   projects: {
    title: "Projects",
    icon: "fa-code",
    items: [
     {
      title: "Registration System — SENAI São Caetano do Sul",
      description:
       "Developed with Professor William Reis using React.js, Node.js and MySQL. Adopted by more than 30 students for practical studies.",
      link: {
       text: "View Repository",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Weather by ZIP Code (API Integration)",
      description:
       "Created a system that fetches address data via Brazilian ZIP code API and weather data via Yahoo Weather API. Built with React.js, TailwindCSS and Axios.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "Bartira",
      description:
       "Management system with JWT authentication, CRUD for users, product/supplier/sales control and financial module. Integrated with ZIP code API.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Certifications",
    icon: "fa-certificate",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Skills",
    icon: "fa-cogs",
    categories: [
     {
      title: "Technical",
      items: [
       "JavaScript",
       "TypeScript",
       "Python",
       "Bash",
       "HTML5",
       "CSS3",
       "SASS",
       "React.js",
       "Next.js",
       "Node.js",
       "RESTful API",
       "JWT",
       "Django",
       "MySQL",
       "PostgreSQL",
       "Firebase",
       "MongoDB",
       "Linux",
       "Git",
       "Postman",
       "Scrum",
       "Kanban",
       "Jest",
       "React Testing Library",
       "Vitest",
      ],
     },
     {
      title: "Professional",
      items: [
       "Problem solving",
       "Teamwork",
       "Fast learner",
       "Proactivity",
       "Creativity",
       "Leadership",
      ],
     },
    ],
   },
   interests: {
    title: "Interests",
    icon: "fa-lightbulb",
    categories: [
     {
      title: "Technical Focus",
      items: [
       "Performance Optimization",
       "Cloud-Native Solutions",
       "UI/UX for Devs",
       "Accessibility",
      ],
     },
     {
      title: "Values & Community",
      items: [
       "Scalable Architecture",
       "Social Impact",
       "Open-Source",
       "Mentoring",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recommendations",
    icon: "fa-quote-left",
    items: [
     {
      title: "Rodrigo R. Alvarez",
      period: "Jan 2023 – Dec 2024",
      description: `IT Professor, Fullstack Developer`,
      details: [
       `"I had the privilege of having Enzo as a student and must highlight his exceptional performance. <br /><br />He stood out for his quick learning, consistent dedication, and great interest in deepening his knowledge. From the beginning, it was clear that he sought to go beyond the basics, applying lessons in practical and creative ways..."`,
      ],
     },
    ],
   },
   awards: {
    title: "Awards",
    icon: "fa-trophy",
    items: [
     {
      title: "Honor of Merit – SENAI São Caetano do Sul",
      description:
       "Awarded as the best student in the Systems Development course.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Generate PDF",
  },
 },
};
```

## src/data/resume.types.ts
```
// Tipos para resumeData

export interface ResumeContact {
 icon: string;
 text: string;
 href: string;
}

export interface ResumeHeader {
 name: string;
 title: string;
 contacts: ResumeContact[];
}

export interface ResumeSectionItem {
 title: string;
 period?: string;
 description?: string;
 details?: string[];
 link?: { text: string; href: string };
 examCode?: string;
 linkCredly?: string;
}

export interface ResumeSectionCategory {
 title: string;
 items: string[];
}

export interface ResumeSection {
 title: string;
 icon: string;
 content?: string;
 items?: (ResumeSectionItem | string)[];
 categories?: ResumeSectionCategory[];
}

export interface ResumeRecommendation {
 name: string;
 position: string;
 period: string;
 text: string;
}

export interface ResumeAward {
 icon: string;
 title: string;
 description: string;
}

export interface ResumeSections {
 profile: ResumeSection;
 languages: ResumeSection;
 education: ResumeSection;
 experience: ResumeSection;
 projects: ResumeSection;
 certifications: ResumeSection;
 skills: ResumeSection;
 interests: ResumeSection;
 recommendations: ResumeSection;
 awards: ResumeSection;
}

export interface ResumeDataLocale {
 title: string;
 header: ResumeHeader;
 sections: ResumeSections;
 buttons: {
  generatePDF: string;
 };
}

export interface ResumeDataType {
 [locale: string]: ResumeDataLocale;
}
```

## src/data/resumeData.ts
```
import { ResumeDataset } from "@/types/resume";

const resumeData: ResumeDataset = {
 "pt-br": {
  title: "Currículo - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Desenvolvedor Web | Técnico em Desenvolvimento de Sistemas | Estudante de Ciência da Computação",
   contacts: [
    {
     icon: "FaEnvelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "FaPhoneAlt",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "FaLinkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "FaGithub",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Perfila",
    content:
     "Estudante de Ciência da Computação e Desenvolvedor Web comprometido com a criação de sistemas bem estruturados, escaláveis e com foco em qualidade. Movido por propósito, aprendizado contínuo e a entrega de soluções que fazem a diferençaA.",
   },
   languages: {
    title: "Idiomadas",
    items: [
     "Inglês: Intermediário/Avançado (B2)",
     "Português: Nativo/FluentePinto",
    ],
   },
   education: {
    title: "Formação Acadêmica",
    items: [
     {
      title: "Bacharelado em Ciência da Computação – USCS",
      period: "Jan 2025 – Dez 2028",
     },
     {
      title: "Técnico em Desenvolvimento de Sistemas – SENAI",
      period: "Jan 2023 – Dez 2024",
     },
    ],
   },
   experience: {
    title: "Experiência",
    items: [
     {
      title: "Assistente Técnico & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dez 2024",
      details: [
       "Colaborei no desenvolvimento e aprimoramento de exercícios em sala de aula, garantindo a qualidade e funcionalidade dos sistemas como beta tester.",
       "Prestei suporte técnico para mais de 30 alunos, auxiliando em questões de desenvolvimento de software e compreensão conceitual.",
       "Liderei atividades de suporte e substituí o professor em 3 aulas, treinando mais de 30 alunos — fortalecendo habilidades de comunicação e ensino técnico.",
      ],
     },
    ],
   },
   projects: {
    title: "Pintos",
    items: [
     {
      title: "Sistema de Cadastro — SENAI São Caetano do Sul",
      description:
       "Desenvolvido com o Professor William Reis utilizando React.js, Node.js e MySQL. Adotado por mais de 30 alunos para estudos práticos.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Tempo CEP (Integração com API)",
      description:
       "Criei um sistema que busca dados de endereço via API de CEP brasileiro e dados meteorológicos via API do Yahoo Weather. Construído com React.js, TailwindCSS e Axios.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "Bartira",
      description:
       "Sistema de gestão com autenticação JWT, CRUD de usuários, controle de produtos/fornecedores/vendas e módulo financeiro. Integrado com API de CEP.",
      link: {
       text: "Ver Repositório",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Pintos@2",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Habilidades",
    categories: [
     {
      title: "Técnicas",
      items: [
       "Linguagens: JavaScript, TypeScript, Python, Bash",
       "Frontend: HTML5, CSS3, SASS, Vite.js, React.js, Next.js, Remix, Redux, Context API, React Hook Form, TailwindCSS, Chakra UI, Shadcn UI, Styled Components, Web Components",
       "Backend: Node.js, Desenvolvimento de API RESTful, Autenticação JWT, Django",
       "Bancos de Dados: MySQL, PostgreSQL, Firebase, MongoDB",
       "Ferramentas & DevOps: Linux, Bash, Git, Microsoft Office, Google Workspace, Postman, Insomnia",
       "Metodologias Ágeis: Scrum, Kanban",
       "Testes: Testes Unitários e de Integração (Jest, React Testing Library, Vitest)",
      ],
     },
     {
      title: "Profissionais",
      items: [
       "Resolução de problemas",
       "Trabalho em equipe",
       "Proativo na adoção e aprendizado de novas tecnologias",
       "Aprendizado rápido",
       "Criatividade",
       "Curiosidade",
       "Liderança",
      ],
     },
    ],
   },
   interests: {
    title: "InteressesPinto",
    categories: [
     {
      title: "Foco TécnicoPinto",
      items: [
       "Pinto",
       "Otimização de Performance (React/Node)",
       "Soluções Cloud-Native",
       "UI/UX para Desenvolvedores",
       "Desenvolvimento Orientado a Acessibilidade",
      ],
     },
     {
      title: "Valores & Comunidade",
      items: [
       "Construção de Arquitetura Escalável",
       "Tecnologia para Impacto Social",
       "Comunidades Open-Source",
       "Mentoria para Desenvolvedores Júniores",
      ],
     },
    ],
   },
   recommendations: {
    title: "PintosV4",
    items: [
     {
      name: "Jonas",
      position: "Professor de TI, Desenvolvedor Fullstack",
      period: "Jan 2023 – Dez 2024",
      text: `"Tive o privilégio de ter Enzo como aluno e devo destacar seu desempenho excepcional. <br /><br />Ele se destacou por seu aprendizado rápido, dedicação consistente e grande interesse em aprofundar seus conhecimentos. Desde o início, ficou claro que ele buscava ir além do básico, aplicando as lições de maneiras práticas e criativas..."`,
     },
    ],
   },
   awards: {
    title: "Pintosv3",
    items: [
     {
      icon: "fa-solid fa-award",
      title: "Honra ao Mérito – SENAI São Caetano do Sul Pinto",
      description:
       "Premiação como melhor aluno do curso de Desenvolvimento de SistemasPinto.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Gerar PDF",
  },
 },
 en: {
  title: "Resume - Enzo Ferracini Patti",
  header: {
   name: "Enzo Ferracini Patti",
   title:
    "Web Developer | Software Development Technician | Computer Science Student",
   contacts: [
    {
     icon: "FaEnvelope",
     text: "efpatti.dev@gmail.com",
     href: "mailto:efpatti.dev@gmail.com",
    },
    {
     icon: "FaPhoneAlt",
     text: "+55 (11) 97883-3101",
     href: "tel:+5511978833101",
    },
    {
     icon: "FaLinkedin",
     text: "linkedin.com/in/efpatti",
     href: "https://linkedin.com/in/efpatti",
    },
    {
     icon: "FaGithub",
     text: "github.com/efpatti",
     href: "https://github.com/efpatti",
    },
   ],
  },
  sections: {
   profile: {
    title: "Profile",
    content:
     "Computer Science student and Web Developer committed to creating well-structured, scalable systems with a focus on quality. Driven by purpose, continuous learning, and delivering solutions that make a difference.",
   },
   languages: {
    title: "LanguagesPinto",
    items: [
     "English: Intermediate/Advanced (B2)",
     "Portuguese: Native/FluentPinto",
    ],
   },
   education: {
    title: "Education",
    items: [
     {
      title: "Bachelor's Degree in Computer Science – USCS",
      period: "Jan 2025 – Dec 2028",
     },
     {
      title: "Associate Degree in Systems Development – SENAI",
      period: "Jan 2023 – Dec 2024",
     },
    ],
   },
   experience: {
    title: "Experience",
    items: [
     {
      title: "Technical Assistant & Beta Tester – SENAI, São Caetano do Sul",
      period: "Jan 2023 – Dec 2024",
      details: [
       "Collaborated in the development and improvement of classroom exercises, ensuring system quality and functionality as a beta tester.",
       "Provided technical support for over 30 students, assisting with software development issues and conceptual understanding.",
       "Led support activities and substituted the teacher in 3 classes, training more than 30 students—strengthening communication and technical teaching skills.",
      ],
     },
    ],
   },
   projects: {
    title: "Pintos",
    items: [
     {
      title: "Registration System — SENAI São Caetano do Sul",
      description:
       "Developed with Professor William Reis using React.js, Node.js and MySQL. Adopted by more than 30 students for practical studies.",
      link: {
       text: "View Repository",
       href: "https://github.com/willreis/sistemaCadastro",
      },
     },
     {
      title: "Weather by ZIP Code (API Integration)",
      description:
       "Created a system that fetches address data via Brazilian ZIP code API and weather data via Yahoo Weather API. Built with React.js, TailwindCSS and Axios.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/tempo-cep",
      },
     },
     {
      title: "BartiPinto",
      description:
       "Management system with JWT authentication, CRUD for users, product/supplier/sales control and financial module. Integrated with ZIP code API.",
      link: {
       text: "View Repository",
       href: "https://github.com/efpatti/bartira",
      },
     },
    ],
   },
   certifications: {
    title: "Certifications",
    items: [
     {
      title: "GitHub Foundations",
      examCode: "GH-900",
      linkCredly:
       "https://www.credly.com/badges/e0b9da58-6869-44f7-8a17-c2e6c7ca2e22",
     },
    ],
   },
   skills: {
    title: "Skills",
    categories: [
     {
      title: "Technical",
      items: [
       "Languages: JavaScript, TypeScript, Python, Bash",
       "Frontend: HTML5, CSS3, SASS, Vite.js, React.js, Next.js, Remix, Redux, Context API, React Hook Form, TailwindCSS, Chakra UI, Shadcn UI, Styled Components, Web Components",
       "Backend: Node.js, RESTful API Development, JWT Authentication, Django",
       "Databases: MySQL, PostgreSQL, Firebase, MongoDB",
       "Tools & DevOps: Linux, Bash, Git, Microsoft Office, Google Workspace, Postman, Insomnia",
       "Agile Methodologies: Scrum, Kanban",
       "Testing: Unit and Integration Tests (Jest, React Testing Library, Vitest)",
      ],
     },
     {
      title: "Professional",
      items: [
       "Problem solving",
       "Teamwork",
       "Proactive in adopting and learning new technologies",
       "Fast learner",
       "Creativity",
       "Curiosity",
       "Leadership",
      ],
     },
    ],
   },
   interests: {
    title: "InterestsPinto",
    categories: [
     {
      title: "Technical FocusPinto",
      items: [
       "Performance Optimization (React/Node)",
       "Cloud-Native SolutionsPinto",
       "UI/UX for Developers",
       "Accessibility-Oriented Development",
      ],
     },
     {
      title: "Values & Community",
      items: [
       "Building Scalable Architecture",
       "Technology for Social Impact",
       "Open-Source Communities",
       "Mentoring Junior Developers",
      ],
     },
    ],
   },
   recommendations: {
    title: "Recommendations",
    items: [
     {
      name: "Rodrigo R. Alvarez",
      position: "IT Professor, Fullstack Developer",
      period: "Jan 2023 – Dec 2024",
      text: `"I had the privilege of having Enzo as a student and must highlight his exceptional performance. <br /><br />He stood out for his quick learning, consistent dedication, and great interest in deepening his knowledge. From the beginning, it was clear that he sought to go beyond the basics, applying lessons in practical and creative ways..."`,
     },
    ],
   },
   awards: {
    title: "Awards",
    items: [
     {
      icon: "fa-solid fa-award",
      title: "Honor of Merit – SENAI São Caetano do Sul",
      description:
       "Awarded as the best student in the Systems Development course.",
     },
    ],
   },
  },
  buttons: {
   generatePDF: "Generate PDF",
  },
 },
};

export { resumeData };
```

## src/types/resume.ts
```
export interface Contact {
 icon: string;
 text: string;
 href: string;
}

export interface SkillCategory {
 title: string;
 items: string[];
}

export interface InterestCategory {
 title: string;
 items: string[];
}

export interface RecommendationItem {
 name: string;
 position: string;
 period: string;
 text: string;
}

export interface AwardItem {
 icon: string;
 title: string;
 description: string;
}

export interface ResumeHeader {
 name: string;
 title: string;
 contacts: Contact[];
}

export interface ResumeButtons {
 generatePDF: string;
}

export interface ResumeData {
 title: string;
 header: ResumeHeader;
 buttons: ResumeButtons;
}

export interface ResumeDataset {
 "pt-br": ResumeData;
 en: ResumeData;
}
```

## src/utils/color.ts
```
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
```

## src/styles/sharedStyleConstants.ts
```
export const colorPalettes = {
 // Vermelhos (1)
 fireRed: {
  colors: [
   { accent: "#ef4444" },
   { key: "#fef2f2" },
   { highlightBg: "rgba(239, 68, 68, 0.1)" },
   { accent30: "rgba(239, 68, 68, 0.3)" },
   { btn: ["bg-red-500", "hover:bg-red-600"] },
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
   { btn: ["bg-orange-500", "hover:bg-orange-600"] },
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
   { btn: ["bg-yellow-500", "hover:bg-yellow-600"] },
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
   { btn: ["bg-green-600", "hover:bg-green-700"] },
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
   { btn: ["bg-teal-500", "hover:bg-teal-600"] },
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
   { btn: ["bg-emerald-500", "hover:bg-emerald-600"] },
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
   { btn: ["bg-blue-500", "hover:bg-blue-600"] },
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
   { btn: ["bg-cyan-500", "hover:bg-cyan-600"] },
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
   { btn: ["bg-indigo-500", "hover:bg-indigo-600"] },
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
   { btn: ["bg-purple-500", "hover:bg-purple-600"] },
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
   { btn: ["bg-violet-500", "hover:bg-violet-600"] },
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
   { btn: ["bg-pink-500", "hover:bg-pink-600"] },
   { secondary: "#f472b6" },
   { secondarySoft: "#fce7f3" },
  ],
  colorName: [{ "pt-br": "Rosa Quente", en: "Hot Pink" }],
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
```

## src/styles/PaletteProvider.tsx
```
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
 colorPalettes,
 type PaletteName as SharedPaletteName,
 bgBannerColor,
} from "./sharedStyleConstants";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Adaptando os tipos para manter compatibilidade
export type PaletteName = SharedPaletteName;
export type BannerColorName = keyof typeof bgBannerColor;

interface PaletteContextProps {
 palette: PaletteName;
 setPalette: (p: PaletteName) => void;
 bannerColor: BannerColorName;
 setBannerColor: (b: BannerColorName) => void;
 paletteTokens: typeof colorPalettes;
}

const PaletteContext = createContext<PaletteContextProps | undefined>(
 undefined
);

export const paletteActiveState = {
 value: "darkGreen" as PaletteName,
 set(newPalette: PaletteName) {
  this.value = newPalette;
 },
};

export const bannerColorActiveState = {
 value: "pureWhite" as BannerColorName,
 set(newBannerColor: BannerColorName) {
  this.value = newBannerColor;
 },
};

// Exporta os tokens para uso fora do contexto React
export const paletteTokens = colorPalettes;

export const usePalette = () => {
 const ctx = useContext(PaletteContext);
 if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
 return ctx;
};

export const PaletteProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const { user } = useAuth();
 const [palette, setPalette] = useState<PaletteName | undefined>(undefined);
 const [bannerColor, setBannerColor] = useState<BannerColorName | undefined>(
  undefined
 );
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!user) {
   setPalette("darkGreen");
   setBannerColor("pureWhite");
   setLoading(false);
   return;
  }
  let ignore = false;
  const fetchPalette = async () => {
   const userDoc = await getDoc(doc(db, "users", user.uid));
   if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.palette && !ignore) setPalette(data.palette as PaletteName);
    else if (!ignore) setPalette("darkGreen");
    if (data.bannerColor && !ignore)
     setBannerColor(data.bannerColor as BannerColorName);
    else if (!ignore) setBannerColor("pureWhite");
   } else {
    if (!ignore) setPalette("darkGreen");
    if (!ignore) setBannerColor("pureWhite");
   }
   setLoading(false);
  };
  fetchPalette();
  return () => {
   ignore = true;
  };
 }, [user]);

 useEffect(() => {
  console.log("[PaletteProvider] useEffect palette", { palette });
  if (!palette) return;
  paletteActiveState.value = palette;
  const tokensArr = colorPalettes[palette].colors;
  // Utilitário para pegar valor pelo nome (corrigido para tipagem)
  function getColor<T extends string>(name: T): string | undefined {
   const found = tokensArr.find((c) =>
    Object.prototype.hasOwnProperty.call(c, name)
   );
   return found ? (found as Record<T, string>)[name] : undefined;
  }

  // Aplicando as cores como variáveis CSS
  const accent = getColor("accent") ?? null;
  document.documentElement.style.setProperty("--accent", accent);
  const key = getColor("key") ?? null;
  document.documentElement.style.setProperty("--key", key);
  const secondary = getColor("secondary") ?? null;
  document.documentElement.style.setProperty("--secondary", secondary);
  const secondarySoft = getColor("secondarySoft") ?? null;
  document.documentElement.style.setProperty("--secondary-soft", secondarySoft);

  // Para cores com opacidade (convertendo para rgba)
  const highlightBg = getColor("highlightBg")?.match(/rgba?\(([^)]+)\)/)?.[1];
  if (highlightBg) {
   document.documentElement.style.setProperty("--highlight-bg", highlightBg);
  }

  const accent30 = getColor("accent30")?.match(/rgba?\(([^)]+)\)/)?.[1];
  if (accent30) {
   document.documentElement.style.setProperty("--accent-30", accent30);
  }
 }, [palette]);

 useEffect(() => {
  console.log("[PaletteProvider] useEffect bannerColor", { bannerColor });
  if (!bannerColor) return;
  bannerColorActiveState.value = bannerColor;
 }, [bannerColor]);

 if (loading || !palette || !bannerColor) return null;

 console.log("[PaletteProvider] render", { loading, palette, bannerColor });

 return (
  <PaletteContext.Provider
   value={{
    palette,
    setPalette,
    bannerColor,
    setBannerColor,
    paletteTokens: colorPalettes,
   }}
  >
   {children}
  </PaletteContext.Provider>
 );
};
```

## src/components/LanguagesEditor.tsx
```
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ lang }) => {
 const { user } = useAuth();
 const [items, setItems] = useState<string[]>([]);
 const [title, setTitle] = useState("Idiomas");
 const [isLoading, setIsLoading] = useState(true);
 const [editing, setEditing] = useState(false);
 const [newItem, setNewItem] = useState("");
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   const docRef = doc(db, "users", user.uid, "languages", lang);
   getDoc(docRef)
    .then((docSnap) => {
     if (docSnap.exists()) {
      const data = docSnap.data();
      setItems(data.items || []);
      setTitle(data.title || "Idiomas");
     }
     setIsLoading(false);
    })
    .catch((error) => {
     console.error("Error fetching languages:", error);
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleAddItem = () => {
  if (newItem.trim() !== "") {
   setItems([...items, newItem.trim()]);
   setNewItem("");
  }
 };

 const handleRemoveItem = (indexToRemove: number) => {
  setItems(items.filter((_, index) => index !== indexToRemove));
 };

 const handleUpdateItem = (indexToUpdate: number, value: string) => {
  const updatedItems = [...items];
  updatedItems[indexToUpdate] = value;
  setItems(updatedItems);
 };

 const handleSave = async () => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid, "languages", lang);
  try {
   await setDoc(docRef, { title, items, language: lang }, { merge: true });
   setEditing(false);
   alert("Idiomas salvos com sucesso!");
  } catch (error) {
   console.error("Erro ao salvar idiomas:", error);
   alert("Ocorreu um erro ao salvar os idiomas.");
  }
 };

 if (isLoading) return <div className="text-white">Carregando idiomas...</div>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Idiomas" : "Languages"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing ? "Visualizar" : "Editar"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="space-y-4"
     >
      {items.map((item, index) => (
       <Reorder.Item
        key={index}
        value={item}
        as="div"
        dragListener={false}
        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
       >
        <motion.div
         className="cursor-grab p-2 text-gray-400 hover:text-white"
         drag="x"
         dragControls={controls}
         onPointerDown={(e) => controls.start(e)}
         whileDrag={{ opacity: 0.7 }}
        >
         <FaGripVertical />
        </motion.div>

        <input
         type="text"
         value={item}
         onChange={(e) => handleUpdateItem(index, e.target.value)}
         className="bg-gray-600 text-white p-2 rounded flex-grow"
        />

        <button
         onClick={() => handleRemoveItem(index)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-4">
      <input
       type="text"
       value={newItem}
       onChange={(e) => setNewItem(e.target.value)}
       className="bg-gray-600 text-white p-2 rounded flex-grow"
       placeholder="Novo idioma"
      />
      <button
       onClick={handleAddItem}
       className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
      >
       <FaPlus />
      </button>
     </div>

     <div className="mt-6">
      <button
       onClick={handleSave}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded ml-auto"
      >
       <FaSave /> Salvar Idiomas
      </button>
     </div>
    </div>
   ) : (
    <div className="flex flex-wrap gap-2">
     {items.map((item, index) => (
      <div
       key={index}
       className="bg-gray-700 text-white px-4 py-2 rounded-full"
      >
       {item}
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

export default LanguagesEditor;
```

## src/components/ColorSelector.tsx
```
"use client";

// components/ColorSelector.tsx
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import {
 Listbox,
 ListboxButton,
 ListboxOption,
 ListboxOptions,
} from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

interface ColorOption<T extends string> {
 value: T;
 color: string;
 label?: string;
}

interface ColorSelectorProps<T extends string> {
 options: ColorOption<T>[];
 selected: T;
 onSelect: (value: T) => void;
 className?: string;
 selectedBg: BgBannerColorName;
}

export const ColorSelector = <T extends string>({
 options,
 selected,
 onSelect,
 className = "",
}: ColorSelectorProps<T>) => {
 const selectedOption =
  options.find((option) => option.value === selected) || options[0];

 // Exibe o valor da cor selecionada (útil para debug ou UX)
 // Exemplo: Verde Floresta (darkGreen)
 // Você pode customizar o estilo abaixo conforme o design desejado

 return (
  <div className={className}>
   {/* Removido o bloco 'Selecionado:' e info extra */}
   <Listbox value={selected} onChange={onSelect}>
    {({ open }) => (
     <div className="relative">
      <ListboxButton
       className={`relative w-full rounded-lg py-2 pl-3 pr-10 text-left transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 text-white
       shadow-sm border border-gray-700`}
      >
       <span className="flex items-center gap-3">
        <span
         className="block h-5 w-5 rounded-full border border-white/30"
         style={{ backgroundColor: selectedOption.color }}
        />
        {selectedOption.label && (
         <span className="block truncate">
          {selectedOption.label}{" "}
          <span className="text-xs text-gray-500">
           ({selectedOption.value})
          </span>
         </span>
        )}
       </span>
       <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <FiChevronDown
         className={`h-5 w-5 transition-transform ${
          open ? "rotate-180" : ""
         } text-gray-300`}
        />
       </span>
      </ListboxButton>

      <ListboxOptions
       className={`absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg py-1 shadow-lg ring-1 bg-gray-800 focus:outline-none ring-gray-700 custom-organic-scroll
       `}
      >
       {options.map((option) => (
        <ListboxOption
         key={option.value}
         value={option.value}
         className={({ active }) =>
          `relative cursor-default select-none py-2 pl-10 pr-4
           text-gray-100
          ${active ? "bg-gray-700" : ""}`
         }
        >
         {({ selected }) => (
          <div className="flex items-center gap-3">
           <span
            className="block h-5 w-5 rounded-full border border-white/30"
            style={{ backgroundColor: option.color }}
           />
           {option.label && (
            <span
             className={`block truncate ${
              selected ? "font-medium" : "font-normal"
             }`}
            >
             {option.label}
            </span>
           )}
           {selected ? (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
               fillRule="evenodd"
               d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
               clipRule="evenodd"
              />
             </svg>
            </span>
           ) : null}
          </div>
         )}
        </ListboxOption>
       ))}
      </ListboxOptions>
     </div>
    )}
   </Listbox>
  </div>
 );
};
```

## src/components/BgBannerSelector.tsx
```
// components/BgBannerSelector.tsx
"use client";

import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { ColorSelector } from "./ColorSelector";

export const BgBannerSelector = ({
 selected,
 onSelect,
}: {
 selected: BgBannerColorName;
 onSelect: (color: BgBannerColorName) => void;
}) => {
 const colorOptions = Object.entries(bgBannerColor).map(([name, colorObj]) => {
  const colorsArr = colorObj.colors;
  const bgObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "bg")
  );
  const bg = bgObj ? (bgObj as { bg: string }).bg : "#fff";
  const colorName = colorObj.colorName[0]["pt-br"] ?? name;
  return {
   value: name as BgBannerColorName,
   color: bg,
   label: colorName,
  };
 });

 return (
  <ColorSelector
   options={colorOptions}
   selected={selected}
   onSelect={onSelect}
   selectedBg={selected}
  />
 );
};
```

## src/components/CodeBlock.tsx
```
import React, { useEffect, useRef } from "react";
import { HtmlFormatter } from "@/core/formatters/HtmlFormatter";
import { Developer } from "@/core/models/Developer";
import { usePalette } from "@/styles/PaletteProvider";

interface CodeBlockProps {
 dev: Developer;
 bgColor: { bg: string; text: string };
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ dev, bgColor }) => {
 const codeRef = useRef<HTMLPreElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  const formatter = new HtmlFormatter();
  if (codeRef.current) {
   codeRef.current.innerHTML = formatter.format(
    dev.toJSON(),
    palette,
    bgColor.text
   );
  }
 }, [dev, palette, bgColor.text]);

 return (
  <pre
   id="code"
   ref={codeRef}
   className="p-6 shadow-md shadow-[color:var(--secondary)] rounded-lg text-sm font-mono mb-4 w-full max-w-2xl mx-auto overflow-x-auto"
   style={{
    borderColor: "var(--accent)",
    color: bgColor.text,
    backgroundColor: bgColor.bg,
   }}
  />
 );
};
```

## src/components/Navbar.tsx
```
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogoSVG from "@/components/LogoSVG";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaTimes } from "react-icons/fa";
import { useAuth } from "@/core/services/AuthProvider";
import {
 mainPublicRoutes,
 bannerAndResumeRoutes,
 contactRoute,
 profileRoute,
 authRoutes,
} from "@/constants/routes";
import type { UserWithProfile } from "@/core/services/AuthProvider";
import Image from "next/image";
import { handleSignOut } from "@/core/services/signOut";
import { colorPalettes, PaletteName } from "@/styles/sharedStyleConstants";
import { usePalette } from "@/styles/PaletteProvider";

// Mobile Menu component
interface MobileMenuProps {
 isOpen: boolean;
 onClose: () => void;
 children: React.ReactNode;
}

const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => (
 <AnimatePresence>
  {isOpen && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-sm pt-16"
   >
    <motion.div
     initial={{ y: -20 }}
     animate={{ y: 0 }}
     exit={{ y: -20 }}
     className="container mx-auto p-6 overflow-y-auto h-full"
    >
     {children}
     <div className="mt-8 flex justify-center">
      <button
       onClick={onClose}
       className="px-6 py-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg flex items-center gap-2"
      >
       <FaTimes /> Close
      </button>
     </div>
    </motion.div>
   </motion.div>
  )}
 </AnimatePresence>
);

// Hamburger Menu Button component
interface MenuButtonProps {
 onClick: () => void;
 isOpen: boolean;
}

const MenuButton = ({ onClick, isOpen }: MenuButtonProps) => (
 <button
  onClick={onClick}
  className="md:hidden p-2 text-gray-400 hover:text-white"
  aria-label="Menu"
 >
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
   <path
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth={2}
    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
   />
  </svg>
 </button>
);

const MainLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
 <div
  className={`${
   isMobile ? "flex flex-col space-y-4" : "hidden md:flex"
  } bg-gradient-to-r from-zinc-900/30 via-zinc-700/30 to-zinc-900/30 backdrop-blur-sm rounded-xl px-6 py-4 ${
   isMobile ? "space-y-4" : "space-x-8"
  } border border-white/10 shadow-lg`}
 >
  {[...mainPublicRoutes, ...bannerAndResumeRoutes]
   .filter(Boolean)
   .map((route) => (
    <Link
     key={route.href}
     href={route.href}
     className="text-white/90 text-sm hover:text-white transition-all flex items-center group"
    >
     {route.title.en}
    </Link>
   ))}
  {contactRoute && (
   <Link
    key={contactRoute.href}
    href={contactRoute.href}
    className="text-white/90 text-sm hover:text-white transition-all flex items-center group"
   >
    {contactRoute.title.en}
   </Link>
  )}
 </div>
);

const AuthLinks = () => (
 <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
  {authRoutes.map((route) => (
   <Link
    key={route.href}
    href={route.href}
    className={
     route.href.includes("sign-in")
      ? "text-sm font-medium text-white border border-blue-400/50 px-4 py-1.5 rounded-md hover:bg-blue-500/20 hover:border-blue-400 transition-all text-center"
      : "text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-1.5 rounded-md transition-all shadow-md hover:shadow-blue-500/20 text-center"
    }
   >
    {route.title.en}
   </Link>
  ))}
 </div>
);

const AuthActions = ({
 isLogged,
 isMobile = false,
}: {
 isLogged: boolean;
 isMobile?: boolean;
}) => (
 <div
  className={`flex ${
   isMobile ? "flex-col space-y-4 items-stretch" : "items-center space-x-4"
  }`}
 >
  <a
   href="https://github.com/seurepo"
   target="_blank"
   rel="noopener noreferrer"
   className={`text-white/80 hover:text-white transition-all p-2 hover:bg-white/10 rounded-full ${
    isMobile ? "self-center" : ""
   }`}
  >
   <FaGithub size={18} />
  </a>
  {!isLogged && <AuthLinks />}
 </div>
);

const getPaletteInfo = (palette: string | undefined) => {
 if (!palette || !(palette in colorPalettes)) return null;
 const info = colorPalettes[palette as PaletteName];
 return {
  label: info.colorName?.[0]?.["pt-br"] || palette,
  color: info.colors?.[0]?.accent || "#888",
 };
};

const ProfileMenu = ({ user }: { user: UserWithProfile | null }) => {
 const [open, setOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);
 const { palette } = usePalette();

 useEffect(() => {
  if (!open) return;
  function handleClick(e: MouseEvent) {
   if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    setOpen(false);
   }
  }
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
 }, [open]);

 const avatar = user?.photoURL || undefined;
 const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
 const email = user?.email || "";
 const paletteInfo = getPaletteInfo(palette);

 return (
  <div className="relative ml-4" ref={menuRef}>
   <button
    onClick={() => setOpen((v) => !v)}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
    aria-label="Open user menu"
   >
    {avatar ? (
     <Image
      src={avatar}
      alt="avatar"
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover"
      unoptimized
     />
    ) : (
     <span className="flex flex-col items-center justify-center w-full">
      <span className="font-bold text-lg">{displayName[0]?.toUpperCase()}</span>
      {paletteInfo && (
       <span className="flex items-center gap-2 mt-1 text-xs font-semibold">
        <span
         className="inline-block w-3 h-3 rounded-full border border-white/40"
         style={{ backgroundColor: paletteInfo.color }}
        />
        <span>Paleta: {paletteInfo.label}</span>
       </span>
      )}
     </span>
    )}
   </button>
   {open && (
    <motion.div
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.2 }}
     className="absolute right-0 mt-2 w-64 bg-zinc-800/95 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-xl py-4 z-50 flex flex-col items-center"
    >
     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-3 shadow-lg">
      {avatar ? (
       <Image
        src={avatar}
        alt="avatar"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover"
        unoptimized
       />
      ) : (
       <span className="font-bold text-3xl">
        {displayName[0]?.toUpperCase()}
       </span>
      )}
     </div>
     <div className="text-white font-semibold text-base mb-1 text-center px-4">
      {displayName}
     </div>
     <div className="text-zinc-400 text-xs mb-4 text-center px-4 truncate w-full">
      {email}
     </div>
     {paletteInfo && (
      <div className="flex items-center gap-2 mb-4">
       <span
        className="inline-block w-4 h-4 rounded-full border border-white/40"
        style={{ backgroundColor: paletteInfo.color }}
       />
       <span className="text-xs text-white/80 font-semibold">
        Paleta ativa: {paletteInfo.label}
       </span>
      </div>
     )}
     <Link
      href={profileRoute?.href || "/profile"}
      className="w-11/12 text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition mb-2 shadow-md"
      onClick={() => setOpen(false)}
     >
      My Profile
     </Link>
     <button
      className="w-11/12 text-center px-4 py-2 text-white/80 hover:text-white text-sm mt-1"
      onClick={handleSignOut}
     >
      Sign Out
     </button>
    </motion.div>
   )}
  </div>
 );
};

const Navbar = () => {
 const [isScrolled, setIsScrolled] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const { isLogged, user } = useAuth();

 useEffect(() => {
  const handleScroll = () => {
   setIsScrolled(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);

 return (
  <>
   <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`fixed top-0 w-full z-50 transition-all duration-300 ${
     isScrolled
      ? "backdrop-blur-md bg-zinc-900/80 border-b border-zinc-800/50"
      : "bg-transparent"
    }`}
   >
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
     {/* Logo */}
     <Link
      href="/"
      className="flex items-center"
      onClick={() => setMenuOpen(false)}
     >
      <LogoSVG className="w-36 h-36 hover:opacity-90 transition" />
     </Link>

     <MainLinks />

     <div className="flex items-center space-x-4">
      {isLogged && <ProfileMenu user={user} />}
      <AuthActions isLogged={isLogged} />
      <MenuButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
     </div>
    </div>
   </motion.nav>

   <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
    <div className="w-full space-y-6">
     <MainLinks isMobile />
     {isLogged && (
      <Link
       href={profileRoute?.href || "/profile"}
       className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition shadow-md"
       onClick={() => setMenuOpen(false)}
      >
       My Profile
      </Link>
     )}
     <AuthActions isLogged={isLogged} isMobile />
    </div>
   </MobileMenu>
  </>
 );
};

export default Navbar;
```

## src/components/DownloadButton.tsx
```
// components/DownloadButton.tsx
"use client";

import { useState } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoDownload as DownloadIcon } from "react-icons/go";

export const DownloadButton = ({
 logoUrl,
 selectedBg,
 type = "banner",
 lang,
}: {
 logoUrl?: string;
 selectedBg: BgBannerColorName;
 type?: "banner" | "resume";
 lang?: string;
}) => {
 const { palette } = usePalette();
 const [loading, setLoading] = useState(false);

 if (!palette) return null;

 const handleDownload = async () => {
  setLoading(true);
  console.log("[DownloadButton] palette enviado para download:", palette);
  const params = new URLSearchParams({ palette });
  if (logoUrl) params.append("logo", logoUrl);
  if (type === "resume" && lang) params.append("lang", lang);
  if (type === "resume" && selectedBg) params.append("bannerColor", selectedBg);
  const endpoint =
   type === "resume" ? "/api/download-resume" : "/api/download-banner";
  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok) {
   setLoading(false);
   alert("Download failed: " + (await res.text()));
   return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = type === "resume" ? "resume.pdf" : "linkedin-banner.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  setLoading(false);
 };

 return (
  <FloatingActionButton
   icon={<DownloadIcon />}
   selectedBg={selectedBg}
   onClick={handleDownload}
   tooltipText="Download"
   className={loading ? "opacity-50 cursor-not-allowed" : ""}
  />
 );
};
```

## src/components/LogoSVG.tsx
```
const colors = [
 "#ef4444", // 0 - vermelho
 "#f97316", // 1 - laranja
 "#eab308", // 2 - amarelo
 "#22c55e", // 3 - verde
 "#14b8a6", // 4 - ciano
 "#10b981", // 5 - verde-água
 "#3b82f6", // 6 - azul
 "#06b6d4", // 7 - azul claro
 "#6366f1", // 8 - roxo claro
 "#a855f7", // 9 - roxo
 "#8b5cf6", // 10 - roxo escuro
 "#ec4899", // 11 - rosa
] as const;

const LogoSVG = ({ className }: { className?: string }) => (
 <svg
  version="1.0"
  xmlns="http://www.w3.org/2000/svg"
  width="1024pt"
  height="1024pt"
  viewBox="0 0 1024 1024"
  preserveAspectRatio="xMidYMid meet"
  className={className}
 >
  <defs>
   {/* Gradiente para o triângulo com 5 cores */}
   <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor={colors[0]} /> {/* Vermelho */}
    <stop offset="25%" stopColor={colors[3]} /> {/* Verde */}
    <stop offset="50%" stopColor={colors[6]} /> {/* Azul */}
    <stop offset="75%" stopColor={colors[9]} /> {/* Roxo */}
    <stop offset="100%" stopColor={colors[2]} /> {/* Amarelo */}
   </linearGradient>
  </defs>
  <g
   transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
   stroke="none"
  >
   {/* Triângulo com gradiente de 5 cores */}
   <path
    d="M2012 6523 c-21 -8 -59 -71 -399 -653 -182 -311 -391 -668 -465 -795
-74 -126 -142 -244 -152 -262 -21 -41 -20 -86 2 -111 15 -18 193 -131 975
-616 143 -89 161 -98 195 -93 22 3 146 66 312 160 151 85 345 193 430 241 85
48 161 94 168 103 9 13 12 131 12 510 l0 494 -119 127 c-66 70 -294 301 -508
515 -394 393 -403 400 -451 380z m917 -1510 l1 -432 -107 -59 c-60 -33 -219
-123 -355 -200 l-248 -140 0 174 0 174 279 0 c260 0 280 1 302 19 l24 19 3
392 3 392 -218 219 -217 219 -243 0 -244 0 -24 -26 -25 -27 0 -574 0 -575 29
-29 c27 -27 35 -29 105 -29 l76 0 0 -161 c0 -88 -3 -159 -7 -157 -5 2 -35 20
-68 41 -33 21 -233 146 -444 277 -210 131 -385 241 -388 243 -4 5 101 187 394
682 88 149 233 396 323 550 90 154 168 288 174 297 9 15 73 -46 443 -420 l432
-437 0 -432z m-719 432 c0 -268 -23 -245 251 -245 l207 0 -1 -265 -2 -265
-322 0 -323 0 0 490 0 490 95 0 95 0 0 -205z m409 -101 c2 -2 -55 -4 -127 -4
l-132 0 0 134 0 134 128 -130 c70 -71 129 -131 131 -134z"
    fill="url(#triangleGradient)"
   />
   <path
    d="M2185 4995 c-14 -13 -25 -36 -25 -50 0 -14 11 -37 25 -50 23 -24 28
-25 170 -25 142 0 147 1 170 25 14 13 25 36 25 50 0 14 -11 37 -25 50 -23 24
-28 25 -170 25 -142 0 -147 -1 -170 -25z"
    fill="#f8fbff"
   />

   {/* Bolinha do i - agora branca */}
   <path
    d="M7368 5804 c-15 -8 -35 -28 -43 -44 -44 -84 13 -170 113 -170 34 0
49 6 79 34 31 28 38 41 38 74 0 22 -6 51 -14 64 -28 53 -114 74 -173 42z"
    fill="#f8fbff"
   />

   {/* Letra P */}
   <path
    d="M3660 5185 l0 -595 90 0 90 0 0 219 0 219 173 4 c216 5 260 19 354
113 75 76 98 135 98 265 0 152 -59 259 -175 318 -88 44 -148 52 -407 52 l-223
0 0 -595z m505 406 c120 -54 151 -229 59 -331 -47 -52 -116 -70 -267 -70
l-117 0 0 210 0 210 143 0 c116 0 149 -4 182 -19z"
    fill="#f8fbff"
   />

   {/* Letra F - agora branca */}
   <path
    d="M6280 5185 l0 -595 90 0 90 0 0 250 0 250 235 0 235 0 0 80 0 80
-235 0 -235 0 0 180 0 180 265 0 265 0 0 85 0 85 -355 0 -355 0 0 -595z"
    fill="#f8fbff"
   />

   {/* Letra l - agora branca */}
   <path
    d="M7880 5700 l0 -80 120 0 120 0 0 -435 0 -435 -110 0 -110 0 0 -80 0
-80 300 0 300 0 0 80 0 80 -100 0 -100 0 0 515 0 515 -210 0 -210 0 0 -80z"
    fill="#f8fbff"
   />

   {/* Letra r */}
   <path
    d="M5020 5471 c-64 -13 -129 -52 -173 -101 l-42 -49 3 74 4 75 -96 0
-96 0 0 -440 0 -440 93 0 92 0 0 258 c0 291 3 301 84 375 62 56 154 73 294 54
l57 -7 0 89 c0 68 -4 92 -16 101 -18 15 -152 23 -204 11z"
    fill="#f8fbff"
   />

   {/* Letra o */}
   <path
    d="M5609 5467 c-98 -28 -201 -114 -240 -201 -65 -149 -65 -357 2 -488
34 -67 113 -142 182 -174 57 -27 71 -29 177 -29 103 0 121 3 170 26 149 70
227 200 237 394 9 173 -33 293 -134 385 -72 66 -144 93 -258 97 -52 1 -109 -3
-136 -10z m206 -166 c86 -39 126 -119 133 -262 6 -121 -12 -182 -72 -244 -77
-80 -192 -86 -279 -14 -19 16 -45 50 -58 76 -21 42 -24 63 -24 168 0 111 2
124 27 170 14 28 37 60 50 72 56 53 151 67 223 34z"
    fill="#f8fbff"
   />

   {/* Letra E - agora branca */}
   <path
    d="M8822 5459 c-116 -41 -207 -147 -242 -286 -47 -183 -5 -378 105 -488
81 -81 176 -115 325 -115 100 0 141 8 228 42 l53 21 -7 86 c-4 47 -8 88 -10
90 -2 2 -12 -3 -21 -12 -32 -28 -127 -59 -200 -64 -82 -7 -152 8 -203 41 -37
24 -83 99 -95 154 l-7 32 301 0 301 0 0 83 c0 98 -19 179 -62 259 -62 116
-155 169 -307 175 -79 3 -107 0 -159 -18z m238 -161 c35 -18 51 -35 73 -77 15
-30 27 -66 27 -80 l0 -26 -202 3 c-200 2 -203 2 -200 23 11 68 68 146 122 168
46 18 132 13 180 -11z"
    fill="#f8fbff"
   />

   {/* Letra i - agora branca */}
   <path
    d="M7142 5389 l3 -82 108 2 107 2 0 -280 0 -281 -120 0 -120 0 0 -64 c0
-35 -3 -71 -6 -80 -6 -14 27 -16 325 -16 l331 0 0 80 0 80 -115 0 -115 0 0
360 0 360 -200 0 -201 0 3 -81z"
    fill="#f8fbff"
   />
  </g>
 </svg>
);

export default LogoSVG;
```

## src/components/GenericEditor.tsx
```
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import { motion, Reorder, useDragControls } from "framer-motion";

export interface BaseItem {
 id: string;
 order: number;
 language: string;
}

interface GenericEditorProps<T extends BaseItem> {
 lang: string;
 fetchItems: (userId: string, lang: string) => Promise<T[]>;
 saveItems: (
  userId: string,
  itemsToSave: T[],
  itemsToDelete: string[]
 ) => Promise<void>;
 createNewItem: (lang: string, currentLength: number) => T;
 renderItem: (
  item: T,
  handleInputChange: (id: string, field: keyof T, value: any) => void
 ) => React.ReactNode;
 title: string;
 addItemButtonText: string;
 errorMessages: {
  load: string;
  save: string;
  precondition: string;
 };
}

export function GenericEditor<T extends BaseItem>({
 lang,
 fetchItems,
 saveItems,
 createNewItem,
 renderItem,
 title,
 addItemButtonText,
 errorMessages,
}: GenericEditorProps<T>) {
 const { user } = useAuth();
 const [items, setItems] = useState<T[]>([]);
 const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchItems(user.uid, lang)
    .then((fetchedItems) => {
     setItems(fetchedItems);
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     if (err.code === "failed-precondition") {
      setError(errorMessages.precondition);
     } else {
      setError(errorMessages.load);
     }
     setIsLoading(false);
    });
  }
 }, [user, lang, fetchItems, errorMessages.load, errorMessages.precondition]);

 const handleAddItem = () => {
  const newItem = createNewItem(lang, items.length);
  setItems([...items, newItem]);
 };

 const handleDeleteItem = (id: string) => {
  const itemExistsInDb = !items
   .find((item) => item.id === id)
   ?.id.includes("-");
  if (itemExistsInDb) {
   setItemsToDelete([...itemsToDelete, id]);
  }
  setItems(items.filter((item) => item.id !== id));
 };

 const handleSave = async () => {
  if (!user) return;
  try {
   await saveItems(user.uid, items, itemsToDelete);
   setItemsToDelete([]);
   alert(`${title} salvos com sucesso!`);
  } catch (error) {
   console.error(`Erro ao salvar ${title}:`, error);
   alert(errorMessages.save);
  }
 };

 const handleInputChange = (id: string, field: keyof T, value: any) => {
  setItems(
   items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 if (isLoading) return <div>Carregando editor de {title.toLowerCase()}...</div>;
 if (error) return <div className="text-red-500">{error}</div>;

 return (
  <div className="p-4 bg-gray-800 rounded-lg">
   <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>

   <Reorder.Group
    axis="y"
    values={items}
    onReorder={setItems}
    className="space-y-4"
   >
    {items.map((item) => (
     <Reorder.Item
      key={item.id}
      value={item}
      as="div"
      dragListener={false}
      className="flex items-center mb-4 group"
     >
      <motion.div
       className="cursor-grab p-2 text-gray-400 hover:text-white active:text-white active:cursor-grabbing"
       drag="x"
       dragControls={controls}
       onPointerDown={(e) => controls.start(e)}
       whileDrag={{ scale: 0.98, opacity: 0.8 }}
      >
       <FaGripVertical />
      </motion.div>

      <motion.div
       className="bg-gray-700 p-4 rounded-md w-full flex items-center gap-4 flex-grow"
       layout
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, x: -100 }}
       transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
       <div className="flex-grow">{renderItem(item, handleInputChange)}</div>
       <motion.button
        onClick={() => handleDeleteItem(item.id)}
        className="text-red-500 hover:text-red-400 p-2 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        <FaTrash />
       </motion.button>
      </motion.div>
     </Reorder.Item>
    ))}
   </Reorder.Group>

   <div className="mt-4 flex gap-4">
    <motion.button
     onClick={handleAddItem}
     className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     {addItemButtonText}
    </motion.button>
    <motion.button
     onClick={handleSave}
     className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     Salvar Alterações
    </motion.button>
   </div>
  </div>
 );
}
```

## src/components/BannerColorSyncWrapper.tsx
```
// src/components/BannerColorSyncWrapper.tsx
"use client";
import { useUserBannerColorSync } from "@/core/services/useUserBannerColorSync";
import { useBannerColorFirestoreSync } from "@/core/services/useBannerColorFirestoreSync";

export function BannerColorSyncWrapper() {
 useUserBannerColorSync();
 useBannerColorFirestoreSync();
 return null;
}
```

## src/components/SettingsBanner.tsx
```
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/core/services/LanguageProvider";
import {
 Dialog,
 DialogTitle,
 Tab,
 TabGroup,
 TabList,
 TabPanel,
 TabPanels,
} from "@headlessui/react";
import { FloatingActionButton } from "./FloatingActionButton";
import { GoGear as SettingsIcon } from "react-icons/go";
import clsx from "clsx";
import { FiImage as ImageIcon, FiEdit3 as EditIcon } from "react-icons/fi";
import { FaPaintRoller as PaintIcon } from "react-icons/fa";
import { usePalette } from "@/styles/PaletteProvider";
import { useAuth } from "@/core/services/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { PaletteSelector } from "./PaletteSelector";
import { BgBannerSelector } from "./BgBannerSelector";
import { LogoSearch } from "./LogoSearch";
import { FiX as CloseIcon, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";

interface SettingsBannerProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect: (url: string) => void;
}

export const SettingsBanner: React.FC<SettingsBannerProps> = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
}) => {
 const [isOpen, setIsOpen] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
 const [showError, setShowError] = useState(false);
 const { palette, setPalette } = usePalette();
 const { user } = useAuth();
 const { language } = useLanguage();

 const handleApplyChanges = async () => {
  if (!user) {
   setIsOpen(false);
   return;
  }

  setIsSaving(true);
  try {
   await updateDoc(doc(db, "users", user.uid), {
    palette,
    bannerColor: selectedBg,
    updatedAt: new Date().toISOString(),
   });

   setShowSuccess(true);
   setTimeout(() => {
    setShowSuccess(false);
    setIsOpen(false);
   }, 1500);
  } catch (error) {
   console.error("[SettingsBanner] handleApplyChanges error", error);
   setShowError(true);
   setTimeout(() => setShowError(false), 3000);
  } finally {
   setIsSaving(false);
  }
 };

 return (
  <>
   <FloatingActionButton
    icon={<SettingsIcon />}
    selectedBg={selectedBg}
    onClick={() => setIsOpen(true)}
    tooltipText="Configurações"
   />

   <Dialog
    open={isOpen}
    onClose={() => setIsOpen(false)}
    className="relative z-50"
   >
    <AnimatePresence>
     {isOpen && (
      <>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
       />

       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-0 flex items-center justify-center p-4"
       >
        <Dialog.Panel className="relative bg-zinc-950 rounded-xl max-w-3xl w-full mx-4 p-6 shadow-2xl h-[600px] border border-zinc-800">
         <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-1 rounded-full text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Fechar configurações"
         >
          <CloseIcon size={20} />
         </button>

         <DialogTitle className="text-2xl font-bold text-gray-100 mb-6">
          Configurações
         </DialogTitle>

         <TabGroup>
          <TabList className="flex space-x-1 mb-6">
           {[
            { label: "Appearance", icon: <PaintIcon /> },
            { label: "Company Logo", icon: <ImageIcon /> },
            { label: "Edit Content", icon: <EditIcon /> },
           ].map(({ label, icon }) => (
            <Tab
             key={label}
             className={({ selected }) =>
              clsx(
               "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg outline-none transition-all duration-200",
               selected
                ? "bg-zinc-800 text-white"
                : "text-gray-300 hover:bg-zinc-800/50"
              )
             }
            >
             {icon}
             {label}
            </Tab>
           ))}
          </TabList>

          <TabPanels className="h-[410px] overflow-y-auto pr-2">
           {/* Appearance Panel */}
           <TabPanel className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Banner Color</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Choose your header background
              </p>
              <BgBannerSelector selected={selectedBg} onSelect={onSelectBg} />
             </div>

             <div className="bg-white/5 p-4 rounded-xl border border-gray-800/10">
              <DialogItemTitle>Color Palette</DialogItemTitle>
              <p className="text-sm text-gray-400 mb-3">
               Select application theme
              </p>
              <PaletteSelector
               bgName={selectedBg}
               selected={palette}
               onSelect={setPalette}
              />
             </div>
            </div>
           </TabPanel>

           {/* Logo Panel */}
           <TabPanel>
            <div>
             <DialogItemTitle>Company</DialogItemTitle>
             <LogoSearch onLogoSelect={onLogoSelect} />
            </div>
           </TabPanel>

           {/* Editors Panel */}
           <TabPanel className="space-y-8">
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Skills
             </h3>
             {user && <SkillsEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Education
             </h3>
             {user && <EducationEditor lang={language} />}
            </div>
            <div>
             <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
              Languages
             </h3>
             {user && <LanguagesEditor lang={language} />}
            </div>
           </TabPanel>
          </TabPanels>
         </TabGroup>

         <div className="mt-6 flex justify-end">
          <button
           onClick={handleApplyChanges}
           disabled={isSaving}
           className={`px-4 py-2 rounded-lg transition-colors 
                        bg-blue-600 hover:bg-blue-700 text-white cursor-pointer
                        ${isSaving ? "opacity-70 cursor-not-allowed" : ""}
                        flex items-center gap-2`}
          >
           {isSaving ? (
            <>
             <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
             >
              <circle
               className="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
              ></circle>
              <path
               className="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
             </svg>
             Salvando...
            </>
           ) : (
            "Aplicar Alterações"
           )}
          </button>
         </div>
        </Dialog.Panel>
       </motion.div>
      </>
     )}
    </AnimatePresence>
   </Dialog>

   {/* Diálogo de Sucesso */}
   <Dialog
    open={showSuccess}
    onClose={() => setShowSuccess(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-green-600/90 backdrop-blur-md p-6 text-white border border-green-500/30">
      <div className="flex items-center gap-3">
       <FiCheck className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Configurações salvas com sucesso!
       </Dialog.Title>
      </div>
     </Dialog.Panel>
    </motion.div>
   </Dialog>

   {/* Diálogo de Erro */}
   <Dialog
    open={showError}
    onClose={() => setShowError(false)}
    className="relative z-50"
   >
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     className="fixed inset-0 bg-black/30 backdrop-blur-sm"
     aria-hidden="true"
    />

    <motion.div
     initial={{ opacity: 0, scale: 0.9 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.9 }}
     className="fixed inset-0 flex items-center justify-center p-4"
    >
     <Dialog.Panel className="w-full max-w-sm rounded-xl bg-red-600/90 backdrop-blur-md p-6 text-white border border-red-500/30">
      <div className="flex items-center gap-3">
       <FiAlertTriangle className="h-6 w-6" />
       <Dialog.Title className="text-lg font-semibold">
        Erro ao salvar configurações
       </Dialog.Title>
      </div>
     </Dialog.Panel>
    </motion.div>
   </Dialog>
  </>
 );
};

interface DialogItemTitleProps {
 children: React.ReactNode;
}

const DialogItemTitle: React.FC<DialogItemTitleProps> = ({ children }) => {
 return (
  <h3 className={`text-lg font-semibold mb-1 text-gray-100`}>{children}</h3>
 );
};
```

## src/components/SettingsPanel.tsx
```
// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { SettingsBanner } from "./SettingsBanner";
import { DownloadButton } from "@/components/DownloadButton";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { FaCog, FaTimes } from "react-icons/fa";
import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import LanguagesEditor from "./LanguagesEditor";
import { useLanguage } from "@/core/services/LanguageProvider";

interface SettingsPanelProps {
 selectedBg: BgBannerColorName;
 onSelectBg: (color: BgBannerColorName) => void;
 onLogoSelect?: (url: string) => void;
 showDownloadButton?: boolean;
 logoUrl?: string;
 position?: "left" | "right";
 downloadType?: "banner" | "resume";
}

export const SettingsPanel = ({
 selectedBg,
 onSelectBg,
 onLogoSelect,
 showDownloadButton = true,
 logoUrl,
 position = "left",
 downloadType = "banner",
}: SettingsPanelProps) => {
 const [isOpen, setIsOpen] = useState(false);
 const { language } = useLanguage();

 const handleLogoSelect = (url: string) => {
  onLogoSelect?.(url);
 };

 return (
  <>
   <div
    className={`${
     position === "right" ? "absolute top-4 right-4" : "absolute top-4 left-4"
    } z-50 flex flex-row gap-2 items-center`}
   >
    <SettingsBanner
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={handleLogoSelect}
    />
    {showDownloadButton && (
     <DownloadButton
      logoUrl={logoUrl}
      selectedBg={selectedBg}
      type={downloadType}
      lang={language}
     />
    )}
   </div>

   {/* Sidebar Panel */}
   <div
    className={`fixed top-0 ${
     position === "right" ? "right-0" : "left-0"
    } h-full w-96 bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
     isOpen
      ? "translate-x-0"
      : position === "right"
      ? "translate-x-full"
      : "-translate-x-full"
    } overflow-y-auto p-6`}
   >
    <div className="flex justify-between items-center mb-8">
     <h2 className="text-2xl font-bold">Edit Content</h2>
     <button
      onClick={() => setIsOpen(false)}
      className="p-2 hover:bg-gray-700 rounded-full"
      aria-label="Close settings"
     >
      <FaTimes />
     </button>
    </div>

    <div className="space-y-8">
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Skills
      </h3>
      <SkillsEditor lang={language} />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Education
      </h3>
      <EducationEditor lang={language} />
     </div>
     <div>
      <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-700 pb-2">
       Languages
      </h3>
      <LanguagesEditor lang={language} />
     </div>
    </div>
   </div>

   {/* Overlay */}
   {isOpen && (
    <div
     className="fixed inset-0 bg-black/50 z-30"
     onClick={() => setIsOpen(false)}
    ></div>
   )}
  </>
 );
};
```

## src/components/PaletteSyncWrapper.tsx
```
"use client";
import { useUserPaletteSync } from "@/core/services/useUserPaletteSync";
import { usePaletteFirestoreSync } from "@/core/services/usePaletteFirestoreSync";

export function PaletteSyncWrapper() {
 useUserPaletteSync();
 usePaletteFirestoreSync();
 return null;
}
```

## src/components/EducationEditor.tsx
```
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchEducationForUser,
 saveEducation,
 type EducationItem,
} from "@/core/services/EducationService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

// Componente de textarea auto-ajustável (opcional, pode manter inputs se preferir)
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder: string;
 className?: string;
}) => {
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = "auto";
   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={textareaRef}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};

const EducationEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchEducationForUser(user.uid, lang)
    .then((fetchedItems) => {
     setEducationItems(fetchedItems.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     setError("Falha ao carregar os dados de educação.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleUpdateItem = (
  id: string,
  field: keyof EducationItem,
  value: string
 ) => {
  setEducationItems((prev) =>
   prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 const handleRemoveItem = (id: string) => {
  setEducationItems((prev) => prev.filter((item) => item.id !== id));
 };

 const handleAddItem = () => {
  const newItem: EducationItem = {
   id: uuidv4(),
   title: "Nova Formação",
   period: "Ano de Início - Ano de Fim",
   language: lang,
   order: educationItems.length,
  };
  setEducationItems((prev) => [...prev, newItem]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveEducation(user.uid, educationItems, []);
   setEditing(false);
   alert("Dados de educação salvos com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar os dados de educação.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando educação...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Formação Acadêmica" : "Education"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing ? "Visualizar" : "Editar"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={educationItems}
      onReorder={setEducationItems}
      className="space-y-4"
     >
      {educationItems.map((item) => (
       <Reorder.Item
        key={item.id}
        value={item}
        as="div"
        dragListener={false}
        className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
       >
        <motion.div
         className="cursor-grab p-2 text-gray-400 hover:text-white"
         drag="x"
         dragControls={controls}
         onPointerDown={(e) => controls.start(e)}
         whileDrag={{ opacity: 0.7 }}
        >
         <FaGripVertical />
        </motion.div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
         <input
          type="text"
          value={item.title}
          onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Curso ou Formação"
         />
         <input
          type="text"
          value={item.period}
          onChange={(e) => handleUpdateItem(item.id, "period", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Período"
         />
        </div>

        <button
         onClick={() => handleRemoveItem(item.id)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-6">
      <button
       onClick={handleAddItem}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Formação
      </button>
      <button
       onClick={handleSaveChanges}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaSave /> Salvar
      </button>
     </div>
    </div>
   ) : (
    <div className="space-y-4">
     {educationItems.map((item) => (
      <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
       <h3 className="font-bold text-lg text-white">{item.title}</h3>
       <p className="text-gray-300">{item.period}</p>
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

function uuidv4() {
 return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
  const r = (Math.random() * 16) | 0,
   v = c == "x" ? r : (r & 0x3) | 0x8;
  return v.toString(16);
 });
}

export default EducationEditor;
```

## src/components/SkillsEditor.tsx
```
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchSkillsForUser,
 saveSkills,
 type Skill,
} from "@/core/services/SkillsService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

// Componente de textarea auto-ajustável
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder: string;
 className?: string;
}) => {
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = "auto";
   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={textareaRef}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};

const SkillsEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [skills, setSkills] = useState<Skill[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editingTechnical, setEditingTechnical] = useState(false);
 const [editingProfessional, setEditingProfessional] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchSkillsForUser(user.uid, lang)
    .then((fetchedSkills) => {
     setSkills(fetchedSkills.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch(() => {
     setError("Falha ao carregar as skills.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 // Separa skills em técnicas e profissionais
 const technicalSkills = skills.filter(
  (skill) => skill.category !== "Profissionais"
 );
 const professionalSkills = skills.filter(
  (skill) => skill.category === "Profissionais"
 );

 const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
  if (!acc[skill.category]) {
   acc[skill.category] = [];
  }
  acc[skill.category].push(skill.item);
  return acc;
 }, {} as Record<string, string[]>);

 const handleUpdateSkill = (id: string, item: string, category: string) => {
  setSkills((prev) =>
   prev.map((skill) => (skill.id === id ? { ...skill, item, category } : skill))
  );
 };

 const handleRemoveSkill = (id: string) => {
  setSkills((prev) => prev.filter((skill) => skill.id !== id));
 };

 const handleAddSkill = (categoryType: "technical" | "professional") => {
  const newSkill: Skill = {
   category: categoryType === "technical" ? "Nova Categoria" : "Profissionais",
   item: "Nova Habilidade",
   language: lang,
   order: skills.length,
  };
  setSkills((prev) => [...prev, newSkill]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveSkills(user.uid, lang, skills);
   setEditingTechnical(false);
   setEditingProfessional(false);
   alert("Habilidades salvas com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar as habilidades.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando habilidades...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Habilidades" : "Skills"}
    </h2>
   </div>

   {/* Seção Técnicas */}
   <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Técnicas</h3>
     <button
      onClick={() => setEditingTechnical(!editingTechnical)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingTechnical ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingTechnical ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={technicalSkills}
       onReorder={(newItems) => {
        const professionalItems = skills.filter(
         (s) => s.category === "Profissionais"
        );
        setSkills([...newItems, ...professionalItems]);
       }}
       className="space-y-4"
      >
       {technicalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1 grid grid-cols-1 gap-3">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, skill.category)
           }
           placeholder="Habilidade"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("technical")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Técnica
      </button>
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedTechnicalSkills).map(([category, items]) => (
       <div key={category} className="bg-gray-700 p-4 rounded-lg">
        <h4 className="font-bold text-white mb-2">{category}</h4>
        <ul className="flex flex-wrap gap-2">
         {items.map((item, index) => (
          <li
           key={index}
           className="bg-gray-600 text-white px-3 py-1 rounded-xl text-sm whitespace-normal break-words max-w-full"
          >
           {item}
          </li>
         ))}
        </ul>
       </div>
      ))}
     </div>
    )}
   </div>

   {/* Seção Profissionais */}
   <div>
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Profissionais</h3>
     <button
      onClick={() => setEditingProfessional(!editingProfessional)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingProfessional ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingProfessional ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={professionalSkills}
       onReorder={(newItems) => {
        const technicalItems = skills.filter(
         (s) => s.category !== "Profissionais"
        );
        setSkills([...technicalItems, ...newItems]);
       }}
       className="space-y-4"
      >
       {professionalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, "Profissionais")
           }
           placeholder="Habilidade Profissional"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("professional")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Profissional
      </button>
     </div>
    ) : (
     <div className="bg-gray-700 p-4 rounded-lg">
      <ul className="flex flex-wrap gap-2">
       {professionalSkills.map((skill, index) => (
        <li
         key={index}
         className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm whitespace-normal break-words max-w-full"
        >
         {skill.item}
        </li>
       ))}
      </ul>
     </div>
    )}
   </div>

   {/* Botão de salvar quando em modo de edição */}
   {(editingTechnical || editingProfessional) && (
    <div className="mt-6">
     <button
      onClick={handleSaveChanges}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded"
     >
      <FaSave /> Salvar Todas as Alterações
     </button>
    </div>
   )}
  </div>
 );
};

export default SkillsEditor;
```

## src/components/Banner.tsx
```
"use client";
import React from "react";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";
import { Developer } from "@/core/models/Developer";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaGithub } from "react-icons/fa";
import { FaAward as AwardIcon } from "react-icons/fa";
import {
 bgBannerColor,
 BgBannerColorName,
} from "@/styles/sharedStyleConstants";
import { SettingsPanel } from "@/components/SettingsPanel";
import type { User } from "firebase/auth";
import { usePalette } from "@/styles/PaletteProvider";

interface BannerProps {
 logoUrl?: string;
 bgColor?: { bg: string; text: string };
 selectedBg?: BgBannerColorName;
 onSelectBg?: (color: BgBannerColorName) => void;
 user?: User | null;
}

export function getBgColorObj(bgName: BgBannerColorName) {
 const bgObj = bgBannerColor[bgName];
 const colorsArr = bgObj.colors;
 const bg = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "bg")) as {
   bg: string;
  }
 ).bg;
 const text = (
  colorsArr.find((c) => Object.prototype.hasOwnProperty.call(c, "text")) as {
   text: string;
  }
 ).text;
 return { bg, text };
}

export const Banner: React.FC<BannerProps> = ({
 logoUrl,
 bgColor,
 selectedBg,
 onSelectBg,
 user,
}) => {
 const { bannerColor } = usePalette();
 const [currentLogoUrl, setCurrentLogoUrl] = React.useState(logoUrl);

 const dev = new Developer({
  name: user?.displayName || "Your Name",
  role: "Fullstack Developer",
  stack: ["React", "Node.js", "TypeScript"],
  company: "Mottu",
  position: "Development Intern",
 });

 // Prioriza o valor do contexto global (bannerColor)
 const effectiveBgColor = bannerColor
  ? getBgColorObj(bannerColor)
  : selectedBg
  ? getBgColorObj(selectedBg)
  : bgColor || getBgColorObj("midnightSlate");

 return (
  <section
   id="banner"
   style={{
    background: effectiveBgColor.bg,
    color: effectiveBgColor.text,
    borderColor: "var(--accent)",
    width: "1584px",
    height: "396px",
    paddingLeft: "500px", // Safe area for profile picture
   }}
   className="shadow-sm shadow-[color:var(--secondary)] flex flex-row gap-0 w-full relative"
  >
   {/* Settings Banner no canto superior esquerdo */}
   {selectedBg && onSelectBg && (
    <SettingsPanel
     selectedBg={selectedBg}
     onSelectBg={onSelectBg}
     onLogoSelect={setCurrentLogoUrl}
     logoUrl={currentLogoUrl}
     showDownloadButton={true}
     position="left"
     downloadType="banner"
    />
   )}

   {/* Left content - shifted right */}
   <div className="w-[900px] flex flex-col justify-center">
    <div className="flex justify-start items-center space-x-4">
     <h1
      className="text-4xl font-bold mb-2 font-inter"
      style={{ color: effectiveBgColor.text }}
     >
      {dev.name}
     </h1>
     <Image
      id="company-logo"
      src={currentLogoUrl || "/wood1.jpg"}
      alt="Logo"
      width={40}
      height={40}
      className="h-10 w-10 rounded-full bg-white shadow"
     />
    </div>
    <p className="italic mb-3 text-lg" style={{ color: effectiveBgColor.text }}>
     Driven by curiosity and continuous learning
    </p>
    <div className="flex items-center flex-wrap gap-2 mb-4 text-slate-200">
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Intern at <span className="font-bold text-[var(--accent)]">Mottu</span>
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Computer Science Student
     </span>
     <span className="px-3 py-1 rounded-full border text-sm border-gray-700 bg-gray-900">
      Systems Development Technician
     </span>
    </div>
    <div
     className="highlight-bg p-3 rounded-lg border-l-4 mb-4 flex items-center gap-2 text-lg bg-opacity-80"
     style={{
      borderColor: "var(--accent)",
      background: "var(--highlightBg)",
      maxWidth: "93%",
     }}
    >
     <span className="text-slate-200 mr-2">
      <AwardIcon color={effectiveBgColor.text} />
     </span>
     <span
      className="truncate whitespace-normal"
      style={{ color: effectiveBgColor.text }}
     >
      Recognized as the top graduate in Systems Development at SENAI
     </span>
     <span className="ml-2 px-2 py-0.5 rounded-full text-slate-200 bg-[var(--secondary)] text-xs text-shadow-lg/30 font-bold">
      2024
     </span>
    </div>
    <div className="flex flex-wrap gap-8 text-lg items-center">
     <span className="flex items-center gap-3">
      <MdEmail className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>
       efpatti.dev@gmail.com
      </span>
     </span>
     <span className="flex items-center gap-3">
      <FaPhoneAlt className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>+55 (11) 97883-3101</span>
     </span>
     <span className="flex items-center gap-3">
      <FaGithub className="mr-1" style={{ color: "var(--accent)" }} />
      <span style={{ color: effectiveBgColor.text }}>github.com/efpatti</span>
     </span>
    </div>
   </div>

   {/* Right content */}
   <div className="flex-1 flex items-center justify-end pr-10">
    <div className="flex flex-col items-center justify-center gap-3">
     <div style={{ transform: "scale(0.9)" }}>
      <div className="font-jetbrains">
       <CodeBlock dev={dev} bgColor={effectiveBgColor} />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};
```

## src/components/PaletteSelector.tsx
```
"use client";

import { paletteTokens } from "@/styles/PaletteProvider";
import { ColorSelector } from "./ColorSelector";
import type { PaletteName } from "@/styles/PaletteProvider";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { useEffect, useCallback } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/core/services/AuthProvider";

const PALETTE_OPTIONS = (Object.keys(paletteTokens) as PaletteName[]).map(
 (key) => {
  const palette = paletteTokens[key];
  const colorsArr = palette.colors;
  const accentObj = colorsArr.find((c) =>
   Object.prototype.hasOwnProperty.call(c, "accent")
  );
  const accent = accentObj ? (accentObj as { accent: string }).accent : "#000";
  const colorName = palette.colorName[0]["pt-br"] ?? key;
  return {
   value: key,
   label: colorName,
   color: accent,
  };
 }
) as { value: PaletteName; label: string; color: string }[];

interface PaletteSelectorProps {
 bgName: BgBannerColorName;
 selected: PaletteName;
 onSelect: (p: PaletteName) => void;
}

export const PaletteSelector = ({
 bgName,
 selected,
 onSelect,
}: PaletteSelectorProps) => {
 const { user } = useAuth();

 // Atualiza Firestore ao mudar a cor
 const handleSelect = useCallback(
  async (palette: PaletteName) => {
   onSelect(palette);
   if (user) {
    await updateDoc(doc(db, "users", user.uid), { palette });
   }
  },
  [user, onSelect]
 );

 useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
   if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.palette && data.palette !== selected) {
     onSelect(data.palette);
    }
   }
  });

  return () => unsubscribe();
 }, [user, selected, onSelect]);

 return (
  <ColorSelector
   options={PALETTE_OPTIONS}
   selected={selected}
   onSelect={handleSelect}
   selectedBg={bgName}
  />
 );
};
```

## src/components/Section.tsx
```
import React from "react";

interface SectionProps {
 title: string;
 children: React.ReactNode;
 accent?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, accent }) => (
 <section className="p-4">
  <h3
   className="text-xl font-semibold pb-2 mb-4 flex items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:shadow-[0_1px_2px_0_var(--accent)] p-1 text-[var(--accent)]"
   style={accent ? { boxShadow: `0 1px 0 0 ${accent}` } : {}}
  >
   {title}
  </h3>
  {children}
 </section>
);

export default Section;
```

## src/components/SkillCategory.tsx
```
import React from "react";
import { SkillCategory } from "@/types/resume";

interface SkillCategoryProps {
 category: SkillCategory;
 textClass?: string;
}

const SkillCategoryComponent: React.FC<SkillCategoryProps> = ({
 category,
 textClass = "text-gray-700",
}) => {
 return (
  <div className="mb-4">
   <h4 className={`font-semibold mb-2 ${textClass}`}>{category.title}</h4>
   <ul className={`list-disc pl-5 space-y-1 ${textClass}`}>
    {category.items.map((item, index) => (
     <li key={index}>{item}</li>
    ))}
   </ul>
  </div>
 );
};

export default SkillCategoryComponent;
```

## src/components/LogoSearch.tsx
```
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface LogoSearchProps {
 onLogoSelect: (logoUrl: string) => void;
}

interface LogoResult {
 domain: string;
 logo_url: string;
 name?: string;
}

export const LogoSearch: React.FC<LogoSearchProps> = ({ onLogoSelect }) => {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<LogoResult[]>([]);
 const [loading, setLoading] = useState(false);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);
 const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

 // Busca automática com debounce
 useEffect(() => {
  console.log("[LogoSearch] useEffect", { query });
  if (query.length < 2) {
   setResults([]);
   setShowSuggestions(false);
   return;
  }
  setLoading(true);
  if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  debounceTimeout.current = setTimeout(async () => {
   const res = await fetch(`/api/brand-search?q=${encodeURIComponent(query)}`);
   const data = await res.json();
   setResults(data.results || []);
   setShowSuggestions(true);
   setLoading(false);
  }, 400);
  return () => {
   if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
  };
 }, [query]);

 const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);

 const handleSelect = (logo: LogoResult) => {
  onLogoSelect(logo.logo_url);
  setShowSuggestions(false);
  setQuery(logo.domain);
 };

 const handleRemove = () => {
  onLogoSelect("/img/mottu.jpg");
  setQuery("");
  setShowSuggestions(false);
 };

 // Variantes de animação
 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
   opacity: 1,
   transition: {
    staggerChildren: 0.1,
   },
  },
 };

 const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
   y: 0,
   opacity: 1,
   transition: {
    type: "spring" as const,
    stiffness: 300,
   },
  },
  pulse: {
   scale: [1, 1.1, 1],
   transition: {
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut" as const,
   },
  },
 };

 console.log("[LogoSearch] render", { query, results, loading });

 return (
  <div className="mt-6 flex items-center gap-3 w-full max-w-2xl">
   <div className="relative flex-1">
    {/* Input com veias luminosas */}
    <motion.div
     initial={false}
     animate={{
      boxShadow:
       query.length > 0
        ? "0 0 10px rgb(255, 255, 255)"
        : "0 0 5px rgba(74, 222, 128, 0.2)",
     }}
     className="relative"
    >
     <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => query.length >= 2 && setShowSuggestions(true)}
      onBlur={handleBlur}
      placeholder=" "
      autoComplete="off"
      className="peer px-4 py-3 w-full bg-zinc-900 border-2 border-zinc-800/30 rounded-lg text-gray-200 focus:border-zinc-500 focus:ring-0 transition-all duration-300"
     />

     {/* Efeito de veias luminosas */}
     <motion.div
      initial={{ opacity: 0 }}
      animate={{
       opacity: query.length > 0 ? 0.7 : 0.3,
       backgroundImage:
        query.length > 0
         ? "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
         : "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
      }}
      className="absolute inset-0 rounded-6xl pointer-events-none"
     />

     <label
      htmlFor="company-domain"
      className="absolute left-3 top-3 px-1 text-zinc-300 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400/60 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-zinc-400 peer-focus:bg-zinc-900/90 z-10"
     >
      Digite o nome ou domínio (ex: Google ou google.com)
     </label>

     {/* Micélio animado (fungo) */}
     <motion.div
      initial={{ width: 0 }}
      animate={{
       width: query.length > 0 ? "100%" : "0%",
      }}
      className="absolute bottom-0 left-0 h-0.5 bg-zinc-400 origin-left"
     />
    </motion.div>

    {/* Sugestões com efeito orgânico e scroll personalizado */}
    <AnimatePresence>
     {showSuggestions && (
      <motion.div
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.2 }}
       className="absolute z-10 w-full mt-1 overflow-hidden"
      >
       <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-zinc-950/95 backdrop-blur-sm border-2 border-zinc-800/30 rounded-lg shadow-xl overflow-y-auto max-h-56 custom-organic-scroll"
       >
        <div className="pr-2">
         {" "}
         {/* Espaço para a barra de scroll */}
         {loading ? (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300 flex items-center gap-2"
          >
           <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full"
           />
           Carregando redes orgânicas...
          </motion.div>
         ) : results.length > 0 ? (
          results.map((brand) => (
           <motion.div
            key={brand.domain}
            variants={itemVariants}
            whileHover={{ backgroundColor: "rgb(54, 65, 83)" }}
            className="flex items-center px-4 py-3 cursor-pointer border-b border-zinc-900/30 last:border-b-0 bg-gray-700/50 transition-colors duration-200"
            onClick={() => handleSelect(brand)}
           >
            <motion.div
             variants={itemVariants}
             animate="pulse"
             className="relative w-8 h-8 rounded-full bg-white/10 p-1 mr-3"
            >
             <Image
              src={brand.logo_url}
              alt={brand.name || brand.domain}
              width={32}
              height={32}
              className="rounded-full"
             />
            </motion.div>
            <div>
             <div className="font-medium text-zinc-100">
              {brand.name || brand.domain}
             </div>
             <div className="text-xs text-zinc-300/70">{brand.domain}</div>
            </div>
           </motion.div>
          ))
         ) : (
          <motion.div
           variants={itemVariants}
           className="px-4 py-3 text-zinc-300/70"
          >
           Nenhum organismo encontrado
          </motion.div>
         )}
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>

   {/* Botão de remover com efeito orgânico */}
   <motion.button
    onClick={handleRemove}
    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className="rounded-lg p-3 bg-red-900/30 text-red-400 ml-1 border-2 border-red-800/30"
    title="Remover logo"
   >
    <FaTrash />
   </motion.button>
  </div>
 );
};
```

## src/components/FloatingActionButton.tsx
```
// components/FloatingActionButton.tsx
"use client";

import { motion } from "framer-motion";
import { BgBannerColorName } from "@/styles/sharedStyleConstants";
import { ReactNode } from "react";
import { isDarkBackground } from "@/utils/color"; // Import the utility function

interface FloatingActionButtonProps {
 icon: ReactNode;
 hoverIcon?: ReactNode;
 selectedBg: BgBannerColorName;
 onClick: () => void;
 tooltipText: string;
 className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
 icon,
 hoverIcon = icon,
 selectedBg,
 onClick,
 tooltipText,
 className = "",
}) => {
 return (
  <motion.button
   onClick={onClick}
   className={`relative inline-flex justify-center items-center 
        aspect-square rounded-full outline-none overflow-hidden 
        cursor-pointer group ${className}`}
   whileTap={{ scale: 0.95 }}
   initial={{ opacity: 0.7 }}
   animate={{ opacity: 1 }}
   transition={{ type: "spring", stiffness: 300 }}
   data-tooltip={tooltipText}
  >
   {/* Inner container - ajustado para centralização perfeita */}
   <span className="relative z-10 flex items-center justify-center w-full h-full p-2 overflow-hidden rounded-full">
    {/* Icons container - agora com flex e centralização */}
    <span className="relative flex items-center justify-center w-6 h-6 overflow-hidden">
     {/* Default icon */}
     <span
      className={`absolute flex items-center justify-center w-full h-full 
              transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
              group-hover:translate-y-full
              ${
               isDarkBackground(selectedBg) ? "text-black" : "text-white"
              } text-2xl`}
     >
      {icon}
     </span>
     {/* Hover icon */}
     <span
      className={`absolute flex items-center justify-center w-full h-full 
              transition-transform duration-600 ease-[cubic-bezier(1,-0.6,0,1.6)] 
              group-hover:translate-y-0 -translate-y-full
              ${
               isDarkBackground(selectedBg) ? "text-white" : "text-black"
              } text-2xl`}
     >
      {hoverIcon}
     </span>
    </span>
   </span>

   {/* Background elements (mantido igual) */}
   <span
    className={`absolute top-0 left-0 z-0 w-full h-full rounded-full 
          before:absolute before:inset-0 before:block before:rounded-full 
          before:transition-colors before:duration-300 before:ease-linear 
          ${
           isDarkBackground(selectedBg)
            ? "before:bg-white group-hover:before:bg-[#101419]"
            : "before:bg-[#101419] group-hover:before:bg-white"
          }
          after:absolute after:inset-0 after:block after:rounded-full 
          after:blur-[5px] after:transition-opacity after:duration-400 
          after:ease-[cubic-bezier(0.55,0.085,0.68,0.53)] 
          ${
           isDarkBackground(selectedBg)
            ? "after:bg-[#101419] group-hover:after:opacity-100"
            : "after:bg-white group-hover:after:opacity-100"
          } 
          after:opacity-0`}
   ></span>

   {/* Tooltip (mantido igual) */}
   <span
    className="absolute left-1/2 -top-11 -translate-x-1/2 z-[-1] 
          px-3 py-1 text-sm text-white bg-[#070707] rounded opacity-0 
          invisible pointer-events-none transition-all duration-400 
          ease-[cubic-bezier(0.47,2,0.41,1.5)] group-hover:top-0 
          group-hover:opacity-100 group-hover:visible"
   >
    {tooltipText}
   </span>
  </motion.button>
 );
};
```

## src/lib/firebase.ts
```
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
 authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
 projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
 storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
 messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
 appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
 measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

## src/constants/routes.ts
```
export const HOME_PATH = "/";
export const AUTH_PATH = "/auth";
export const LOGIN_PATH = `${AUTH_PATH}/sign-in`;
export const REGISTER_PATH = `${AUTH_PATH}/sign-up`;
export const PROTECTED_PATH = "/protected";
export const PROFILE_PATH = `${PROTECTED_PATH}/profile`;
export const BANNER_PATH = `${PROTECTED_PATH}/banner`;
export const RESUME_PATH = `${PROTECTED_PATH}/resume`;
export const CONTACT_PATH = "/contact";

export const routes = [
 {
  title: {
   en: "Home",
   ptBr: "Início",
  },
  href: HOME_PATH,
  protected: false,
  auth: false,
 },
 {
  title: {
   en: "Profile",
   ptBr: "Perfil",
  },
  href: PROFILE_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Banner",
   ptBr: "Banner",
  },
  href: BANNER_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Resume",
   ptBr: "Currículo",
  },
  href: RESUME_PATH,
  protected: true,
  auth: false,
 },
 {
  title: {
   en: "Log in",
   ptBr: "Entrar",
  },
  href: LOGIN_PATH,
  protected: false,
  auth: true,
 },
 {
  title: {
   en: "Sign up",
   ptBr: "Cadastrar",
  },
  href: REGISTER_PATH,
  protected: false,
  auth: true,
 },
 {
  title: {
   en: "Contact",
   ptBr: "Fale Conosco",
  },
  href: CONTACT_PATH,
  protected: false,
  auth: false,
 },
];

export const publicRoutes = routes.filter(
 (route) => !route.protected && !route.auth
);
export const protectedRoutes = routes.filter((route) => route.protected);
export const authRoutes = routes.filter((route) => route.auth);
export const bannerAndResumeRoutes = routes.filter((route) =>
 [BANNER_PATH, RESUME_PATH].includes(route.href)
);
export const profileRoute = routes.find((route) => route.href === PROFILE_PATH);
export const mainPublicRoutes = routes.filter(
 (route) =>
  !route.protected && !route.auth && ![CONTACT_PATH].includes(route.href)
);
export const contactRoute = routes.find((route) => route.href === CONTACT_PATH);
```

