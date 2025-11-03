/**
 * Interests Store - Domain-specific state management
 * Gerencia interesses do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Interest {
 id?: string;
 name: string;
 description?: string;
}

interface InterestsState {
 interests: Interest[];
 updateInterests: (interests: Interest[]) => void;
 addInterest: (interest: Interest) => void;
 removeInterest: (id: string) => void;
 resetInterests: () => void;
}

export const useInterestsStore = create<InterestsState>()(
 devtools(
  (set) => ({
   interests: [],

   updateInterests: (interests) => set({ interests }),

   addInterest: (interest) =>
    set((state) => ({
     interests: [...state.interests, interest],
    })),

   removeInterest: (id) =>
    set((state) => ({
     interests: state.interests.filter((i) => i.id !== id),
    })),

   resetInterests: () => set({ interests: [] }),
  }),
  { name: "InterestsStore" }
 )
);
