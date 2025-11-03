/**
 * Education Store - Domain-specific state management
 * Single Responsibility: Manage education history
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface EducationItem {
 id: string;
 institution: string;
 degree: string;
 field: string;
 startDate: string;
 endDate: string | null;
 description?: string;
}

interface EducationState {
 education: EducationItem[];
 updateEducation: (education: EducationItem[]) => void;
 addEducation: (item: EducationItem) => void;
 removeEducation: (id: string) => void;
 resetEducation: () => void;
}

export const useEducationStore = create<EducationState>()(
 devtools(
  (set) => ({
   education: [],

   updateEducation: (education) => set({ education }),

   addEducation: (item) =>
    set((state) => ({
     education: [...state.education, item],
    })),

   removeEducation: (id) =>
    set((state) => ({
     education: state.education.filter((e) => e.id !== id),
    })),

   resetEducation: () => set({ education: [] }),
  }),
  { name: "EducationStore" }
 )
);
