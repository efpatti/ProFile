/**
 * Skills Store - Domain-specific state management
 * Single Responsibility: Manage skills and categories
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Skill {
 id?: string;
 category: string;
 item?: string;
 name?: string;
 order?: number;
 language?: string;
}

interface SkillsState {
 skills: Skill[];
 updateSkills: (skills: Skill[]) => void;
 addSkill: (skill: Skill) => void;
 removeSkill: (id: string) => void;
 resetSkills: () => void;
}

export const useSkillsStore = create<SkillsState>()(
 devtools(
  (set) => ({
   skills: [],

   updateSkills: (skills) => set({ skills }),

   addSkill: (skill) =>
    set((state) => ({
     skills: [...state.skills, skill],
    })),

   removeSkill: (id) =>
    set((state) => ({
     skills: state.skills.filter((s) => s.id !== id),
    })),

   resetSkills: () => set({ skills: [] }),
  }),
  { name: "SkillsStore" }
 )
);
