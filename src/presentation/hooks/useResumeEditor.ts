/**
 * Custom Hook - useResumeEditor
 * Elimina duplicação massiva entre editores (G5 - DRY Principle)
 *
 * Este hook encapsula a lógica comum de:
 * - Autenticação do usuário
 * - Leitura do estado do store
 * - Atualização do estado local
 * - Persistência no backend
 * - Loading states
 */

import { useAuth } from "@/core/services/AuthProvider";
import useResumeStore from "@/core/store/useResumeStore";
import { useCallback } from "react";

interface UseResumeEditorOptions<T> {
 /**
  * Selector para extrair os items do store
  * Ex: (store) => store.skills
  */
 storeSelector: (store: ReturnType<typeof useResumeStore.getState>) => T[];

 /**
  * Função para atualizar os items no store
  * Ex: (items) => useResumeStore.getState().updateSkills(items)
  */
 updateFn: (items: T[]) => void;

 /**
  * Items iniciais (opcional - usado para override)
  */
 initialItems?: T[];

 /**
  * Callback após save bem-sucedido
  */
 onSaved?: (items: T[]) => void;
}

interface UseResumeEditorReturn<T> {
 /**
  * Items atuais (do store ou iniciais)
  */
 items: T[];

 /**
  * Função para salvar mudanças
  */
 handleSave: (updatedItems: T[]) => Promise<void>;

 /**
  * Estado de loading do save
  */
 isLoading: boolean;

 /**
  * ID do usuário autenticado
  */
 userId: string | undefined;
}

/**
 * Hook genérico para editores de currículo
 *
 * @example
 * ```tsx
 * const { items, handleSave, isLoading } = useResumeEditor({
 *   storeSelector: (s) => s.skills,
 *   updateFn: (items) => useResumeStore.getState().updateSkills(items),
 *   onSaved: (skills) => console.log('Saved!', skills)
 * });
 * ```
 */
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
    // 1. Atualiza store local
    updateFn(updatedItems);

    // 2. Persiste no backend
    await saveResume(user.id);

    // 3. Callback de sucesso
    onSaved?.(updatedItems);
   } catch (error) {
    console.error("[useResumeEditor] Error saving:", error);
    // Aqui você pode adicionar um toast de erro se tiver
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
