/**
 * Languages Store - Domain-specific state management
 * Gerencia idiomas do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Language {
 id?: string;
 name: string;
 proficiency?: string;
}

interface LanguagesState {
 languages: Language[];
 updateLanguages: (languages: Language[]) => void;
 addLanguage: (language: Language) => void;
 removeLanguage: (id: string) => void;
 resetLanguages: () => void;
}

export const useLanguagesStore = create<LanguagesState>()(
 devtools(
  (set) => ({
   languages: [],

   updateLanguages: (languages) => set({ languages }),

   addLanguage: (language) =>
    set((state) => ({
     languages: [...state.languages, language],
    })),

   removeLanguage: (id) =>
    set((state) => ({
     languages: state.languages.filter((l) => l.id !== id),
    })),

   resetLanguages: () => set({ languages: [] }),
  }),
  { name: "LanguagesStore" }
 )
);
