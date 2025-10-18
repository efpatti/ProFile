"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUnsavedChangesStore } from "@/core/store/useUnsavedChangesStore";
import { useAuth } from "@/core/services/AuthProvider";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
 FaUndo,
} from "react-icons/fa";
import { useResumeStore } from "@/core/store/useResumeStore";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
 initialData?: { title: string; items: string[] };
 onSaved?: (data: { title: string; items: string[] }) => void;
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({
 lang,
 initialData,
 onSaved,
}) => {
 const { setUnsavedChanges } = useUnsavedChangesStore();
 const { user } = useAuth();
 const {
  languages: storeLanguages,
  saveLanguagesRemote,
  setLanguagesLocal,
  loading: storeLoading,
 } = useResumeStore();
 const [items, setItems] = useState<string[]>([]);
 const [title, setTitle] = useState(lang === "pt-br" ? "Idiomas" : "Languages");
 const [isLoading, setIsLoading] = useState(true);
 const [editing, setEditing] = useState(false);
 const [newItem, setNewItem] = useState("");
 const [isSaving, setIsSaving] = useState(false);
 const [snapshot, setSnapshot] = useState<string[]>([]);
 const [titleSnapshot, setTitleSnapshot] = useState(
  lang === "pt-br" ? "Idiomas" : "Languages"
 );
 const controls = useDragControls();

 useEffect(() => {
  if (initialData) {
   setItems(initialData.items || []);
   setTitle(initialData.title || (lang === "pt-br" ? "Idiomas" : "Languages"));
   setSnapshot(initialData.items || []);
   setTitleSnapshot(
    initialData.title || (lang === "pt-br" ? "Idiomas" : "Languages")
   );
   setIsLoading(false);
  } else if (storeLanguages) {
   setItems(storeLanguages.items || []);
   setTitle(
    storeLanguages.title || (lang === "pt-br" ? "Idiomas" : "Languages")
   );
   setSnapshot(storeLanguages.items || []);
   setTitleSnapshot(
    storeLanguages.title || (lang === "pt-br" ? "Idiomas" : "Languages")
   );
   setIsLoading(false);
  } else if (storeLoading) {
   setIsLoading(true);
  } else {
   setIsLoading(false);
  }
 }, [initialData, storeLanguages, storeLoading, lang]);

 const hasChanges = useMemo(() => {
  return (
   title !== titleSnapshot ||
   items.length !== snapshot.length ||
   items.some((v, i) => v !== snapshot[i])
  );
 }, [items, snapshot, title, titleSnapshot]);

 const handleAddItem = useCallback(() => {
  if (newItem.trim() !== "") {
   setItems((prev) => [...prev, newItem.trim()]);
   setNewItem("");
   setUnsavedChanges(true);
  }
 }, [newItem, setUnsavedChanges]);

 const handleRemoveItem = useCallback(
  (indexToRemove: number) => {
   setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
   setUnsavedChanges(true);
  },
  [setUnsavedChanges]
 );

 const handleUpdateItem = useCallback(
  (indexToUpdate: number, value: string) => {
   setItems((prev) => prev.map((v, i) => (i === indexToUpdate ? value : v)));
   setUnsavedChanges(true);
  },
  [setUnsavedChanges]
 );

 const handleSave = useCallback(async () => {
  if (!user) return;
  setIsSaving(true);
  try {
   await saveLanguagesRemote({ title, items });
   setSnapshot([...items]);
   setTitleSnapshot(title);
   setEditing(false);
   setLanguagesLocal({ title, items });
   onSaved?.({ title, items });
  } catch (e) {
   console.error(e);
  } finally {
   setIsSaving(false);
  }
 }, [user, title, items, saveLanguagesRemote, setLanguagesLocal, onSaved]);

 const handleRevert = () => {
  setItems(snapshot);
  setTitle(titleSnapshot);
 };

 if (isLoading)
  return (
   <div className="text-xs text-gray-400">
    {lang === "pt-br" ? "Carregando..." : "Loading..."}
   </div>
  );

 return (
  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 shadow-inner">
   <div className="flex items-center justify-between mb-4">
    <div className="flex gap-2 items-center">
     {editing && hasChanges && (
      <button
       onClick={handleRevert}
       className="text-xs flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300"
       title={lang === "pt-br" ? "Reverter mudanças" : "Revert changes"}
      >
       <FaUndo className="text-[10px]" />{" "}
       {lang === "pt-br" ? "Reverter" : "Revert"}
      </button>
     )}
     <button
      onClick={() => setEditing((v) => !v)}
      className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
       editing
        ? "bg-blue-600/80 hover:bg-blue-600 text-white"
        : "bg-zinc-800 hover:bg-zinc-700 text-blue-300"
      }`}
     >
      <FaEdit className="text-[10px]" />{" "}
      {editing
       ? lang === "pt-br"
         ? "Fechar"
         : "Close"
       : lang === "pt-br"
       ? "Editar"
       : "Edit"}
     </button>
    </div>
   </div>

   {editing ? (
    <div className="space-y-3">
     <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder={lang === "pt-br" ? "Título" : "Title"}
      className="w-full bg-zinc-800/70 focus:bg-zinc-800 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
     />
     <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="space-y-2"
     >
      {items.map((item, index) => (
       <Reorder.Item
        key={index}
        value={item}
        as="div"
        dragListener={false}
        className="group relative flex items-center gap-2 p-2 rounded bg-zinc-800/70 border border-zinc-700/40"
       >
        <motion.div
         className="cursor-grab p-1 text-zinc-500 hover:text-white"
         drag="x"
         dragControls={controls}
         onPointerDown={(e) => controls.start(e)}
         whileDrag={{ opacity: 0.6 }}
        >
         <FaGripVertical className="text-[12px]" />
        </motion.div>
        <input
         value={item}
         onChange={(e) => handleUpdateItem(index, e.target.value)}
         className="flex-1 bg-transparent text-gray-100 text-xs outline-none"
        />
        <button
         onClick={() => handleRemoveItem(index)}
         className="text-red-400 hover:text-red-300 p-1"
         aria-label="Remove"
        >
         <FaTrash className="text-[11px]" />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>
     <div className="flex gap-2">
      <input
       value={newItem}
       onChange={(e) => setNewItem(e.target.value)}
       placeholder={lang === "pt-br" ? "Novo idioma" : "New language"}
       className="flex-1 bg-zinc-800/70 focus:bg-zinc-800 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
       onClick={handleAddItem}
       className="inline-flex items-center justify-center bg-green-600/80 hover:bg-green-600 text-white rounded px-2"
      >
       <FaPlus className="text-[11px]" />
      </button>
     </div>
     {/* Botão de salvar removido. Salvamento centralizado no SettingsBanner. */}
    </div>
   ) : (
    <div className="flex flex-wrap gap-1.5">
     {items.map((item, index) => (
      <span
       key={index}
       className="px-2 py-1 rounded-full bg-zinc-800/70 text-[11px] text-gray-200 border border-zinc-700/50"
      >
       {item}
      </span>
     ))}
    </div>
   )}
  </div>
 );
};

export default LanguagesEditor;
