/**
 * Awards Store - Domain-specific state management
 * Gerencia prêmios do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Award {
 id?: string;
 title: string;
 issuer: string;
 date?: string;
 description?: string;
}

interface AwardsState {
 awards: Award[];
 updateAwards: (awards: Award[]) => void;
 addAward: (award: Award) => void;
 removeAward: (id: string) => void;
 resetAwards: () => void;
}

export const useAwardsStore = create<AwardsState>()(
 devtools(
  (set) => ({
   awards: [],

   updateAwards: (awards) => set({ awards }),

   addAward: (award) =>
    set((state) => ({
     awards: [...state.awards, award],
    })),

   removeAward: (id) =>
    set((state) => ({
     awards: state.awards.filter((a) => a.id !== id),
    })),

   resetAwards: () => set({ awards: [] }),
  }),
  { name: "AwardsStore" }
 )
);
