import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Resume } from "@/core/entities/Resume";

interface ResumeStore {
 currentResumeId: string | null;
 setCurrentResumeId: (id: string | null) => void;

 // Draft state (para edição antes de salvar)
 draft: Partial<Resume> | null;
 setDraft: (draft: Partial<Resume> | null) => void;
 updateDraft: (updates: Partial<Resume>) => void;
 clearDraft: () => void;
}

export const useResumeStore = create<ResumeStore>()(
 persist(
  (set) => ({
   currentResumeId: null,
   setCurrentResumeId: (id) => set({ currentResumeId: id }),

   draft: null,
   setDraft: (draft) => set({ draft }),
   updateDraft: (updates) =>
    set((state) => ({
     draft: state.draft ? { ...state.draft, ...updates } : updates,
    })),
   clearDraft: () => set({ draft: null }),
  }),
  {
   name: "resume-storage",
  }
 )
);
