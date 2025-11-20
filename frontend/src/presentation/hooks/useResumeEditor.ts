import { useAuth } from "@/core/services/AuthProvider";
import useResumeStore from "@/core/store/useResumeStore";
import { useCallback } from "react";

interface UseResumeEditorOptions<T> {
 storeSelector: (store: ReturnType<typeof useResumeStore.getState>) => T[];

 updateFn: (items: T[]) => void;

 initialItems?: T[];

 onSaved?: (items: T[]) => void;
}

interface UseResumeEditorReturn<T> {
 items: T[];

 handleSave: (updatedItems: T[]) => Promise<void>;

 isLoading: boolean;

 userId: string | undefined;
}

export function useResumeEditor<T>({
 storeSelector,
 updateFn,
 initialItems,
 onSaved,
}: UseResumeEditorOptions<T>): UseResumeEditorReturn<T> {
 const { user } = useAuth();
 const storeItems = useResumeStore(storeSelector);
 const { saveResume, isLoading } = useResumeStore();

 const items = initialItems ?? storeItems;

 const handleSave = useCallback(
  async (updatedItems: T[]) => {
   if (!user?.id) {
    console.warn("[useResumeEditor] Cannot save: user not authenticated");
    return;
   }

   try {
    updateFn(updatedItems);

    await saveResume(user.id);

    onSaved?.(updatedItems);
   } catch (error) {
    console.error("[useResumeEditor] Error saving:", error);
   }
  },
  [user?.id, updateFn, saveResume, onSaved]
 );

 return {
  items,
  handleSave,
  isLoading,
  userId: user?.id,
 };
}
