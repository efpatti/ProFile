import { create } from "zustand";

interface UnsavedChangesStore {
 hasUnsavedChanges: boolean;
 setUnsavedChanges: (value: boolean) => void;
}

export const useUnsavedChangesStore = create<UnsavedChangesStore>((set) => ({
 hasUnsavedChanges: false,
 setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}));
