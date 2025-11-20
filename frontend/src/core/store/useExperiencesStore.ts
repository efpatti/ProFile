/**
 * Experiences Store - Domain-specific state management
 * Single Responsibility: Manage work experience history
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Experience {
 id: string;
 company: string;
 role: string;
 startDate: string;
 endDate: string | null;
 isCurrentJob: boolean;
 technologies: string[];
 description?: string;
}

interface ExperiencesState {
 experiences: Experience[];
 updateExperiences: (experiences: Experience[]) => void;
 addExperience: (experience: Experience) => void;
 removeExperience: (id: string) => void;
 resetExperiences: () => void;
}

export const useExperiencesStore = create<ExperiencesState>()(
 devtools(
  (set) => ({
   experiences: [],

   updateExperiences: (experiences) => set({ experiences }),

   addExperience: (experience) =>
    set((state) => ({
     experiences: [...state.experiences, experience],
    })),

   removeExperience: (id) =>
    set((state) => ({
     experiences: state.experiences.filter((e) => e.id !== id),
    })),

   resetExperiences: () => set({ experiences: [] }),
  }),
  { name: "ExperiencesStore" }
 )
);
