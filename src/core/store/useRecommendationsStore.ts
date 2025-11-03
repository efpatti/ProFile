/**
 * Recommendations Store - Domain-specific state management
 * Gerencia recomendações do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Recommendation {
 id?: string;
 author: string;
 position?: string;
 company?: string;
 content: string;
 date?: string;
}

interface RecommendationsState {
 recommendations: Recommendation[];
 updateRecommendations: (recommendations: Recommendation[]) => void;
 addRecommendation: (recommendation: Recommendation) => void;
 removeRecommendation: (id: string) => void;
 resetRecommendations: () => void;
}

export const useRecommendationsStore = create<RecommendationsState>()(
 devtools(
  (set) => ({
   recommendations: [],

   updateRecommendations: (recommendations) => set({ recommendations }),

   addRecommendation: (recommendation) =>
    set((state) => ({
     recommendations: [...state.recommendations, recommendation],
    })),

   removeRecommendation: (id) =>
    set((state) => ({
     recommendations: state.recommendations.filter((r) => r.id !== id),
    })),

   resetRecommendations: () => set({ recommendations: [] }),
  }),
  { name: "RecommendationsStore" }
 )
);
