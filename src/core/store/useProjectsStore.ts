/**
 * Projects Store - Domain-specific state management
 * Gerencia projetos do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Project {
 id?: string;
 name: string;
 description?: string;
 technologies?: string[];
 url?: string;
 startDate?: string;
 endDate?: string;
}

interface ProjectsState {
 projects: Project[];
 updateProjects: (projects: Project[]) => void;
 addProject: (project: Project) => void;
 removeProject: (id: string) => void;
 resetProjects: () => void;
}

export const useProjectsStore = create<ProjectsState>()(
 devtools(
  (set) => ({
   projects: [],

   updateProjects: (projects) => set({ projects }),

   addProject: (project) =>
    set((state) => ({
     projects: [...state.projects, project],
    })),

   removeProject: (id) =>
    set((state) => ({
     projects: state.projects.filter((p) => p.id !== id),
    })),

   resetProjects: () => set({ projects: [] }),
  }),
  { name: "ProjectsStore" }
 )
);
