import { create } from "zustand";
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

// TEMPORÁRIO: Removido persist para debugar erro de localStorage
// TODO: Reimplementar persist com SSR-safe approach
export const useResumeStore = create<ResumeStore>((set) => ({
 currentResumeId: null,
 setCurrentResumeId: (id) => set({ currentResumeId: id }),

 draft: null,
 setDraft: (draft) => set({ draft }),
 updateDraft: (updates) =>
  set((state) => ({
   draft: state.draft ? { ...state.draft, ...updates } : updates,
  })),
 clearDraft: () => set({ draft: null }),
}));
