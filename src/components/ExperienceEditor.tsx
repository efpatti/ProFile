"use client";

import React, {
 useEffect,
 useRef,
 useState,
 useCallback,
 useMemo,
} from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { useResumeStore } from "@/core/store/useResumeStore";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaEdit,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaTrash,
 FaUndo,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import type { Experience } from "@/core/services/ExperienceService";

// Auto-resize textarea like other editors
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder?: string;
 className?: string;
}) => {
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = "auto";
   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={textareaRef}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};

const ExperienceEditor = ({
 lang,
 initialItems,
 onSaved,
}: {
 lang: "pt-br" | "en";
 initialItems?: Experience[];
 onSaved?: (items: Experience[]) => void;
}) => {
 const { user } = useAuth();
 const {
  experience: storeExperience,
  saveExperienceRemote,
  setExperienceLocal,
  loading: storeLoading,
 } = useResumeStore();
 const [items, setItems] = useState<Experience[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const [snapshot, setSnapshot] = useState<Experience[]>([]);
 const controls = useDragControls();

 useEffect(() => {
  if (initialItems) {
   const ordered = [...initialItems].sort((a, b) => a.order - b.order);
   setItems(ordered);
   setSnapshot(ordered);
   setIsLoading(false);
  } else if (storeExperience && storeExperience.length > 0) {
   const ordered = [...storeExperience].sort((a, b) => a.order - b.order);
   setItems(ordered);
   setSnapshot(ordered);
   setIsLoading(false);
  } else if (storeLoading) {
   setIsLoading(true);
  } else {
   setIsLoading(false);
  }
 }, [initialItems, storeExperience, storeLoading]);

 const hasChanges = useMemo(() => {
  if (snapshot.length !== items.length) return true;
  return items.some((it, i) => {
   const s = snapshot[i];
   if (!s) return true;
   return (
    it.title !== s.title ||
    it.company !== s.company ||
    it.locate !== s.locate ||
    it.period !== s.period ||
    it.description !== s.description ||
    JSON.stringify(it.details) !== JSON.stringify(s.details) ||
    it.order !== s.order
   );
  });
 }, [items, snapshot]);

 const handleUpdate = useCallback(
  (
   id: string | undefined,
   field: keyof Omit<Experience, "id" | "language" | "order">,
   value: string
  ) => {
   setItems((prev) =>
    prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
   );
  },
  []
 );

 const updateDetail = useCallback(
  (id: string | undefined, index: number, value: string) => {
   setItems((prev) =>
    prev.map((it) => {
     if (it.id !== id) return it;
     const details = Array.isArray(it.details) ? [...it.details] : [];
     details[index] = value;
     return { ...it, details } as Experience;
    })
   );
  },
  []
 );

 const addDetail = useCallback((id: string | undefined) => {
  setItems((prev) =>
   prev.map((it) => {
    if (it.id !== id) return it;
    const details = Array.isArray(it.details) ? [...it.details] : [];
    details.push("");
    return { ...it, details } as Experience;
   })
  );
 }, []);

 const removeDetail = useCallback((id: string | undefined, index: number) => {
  setItems((prev) =>
   prev.map((it) => {
    if (it.id !== id) return it;
    const details = Array.isArray(it.details) ? [...it.details] : [];
    details.splice(index, 1);
    return { ...it, details } as Experience;
   })
  );
 }, []);

 const handleRemove = useCallback(
  (id?: string) => {
   if (
    !confirm(lang === "pt-br" ? "Remover experiência?" : "Remove experience?")
   )
    return;
   setItems((prev) => prev.filter((it) => it.id !== id));
  },
  [lang]
 );

 const handleAdd = useCallback(() => {
  const defaultDetailsPt = ["Atividade 1", "Atividade 2", "Atividade 3"];
  const defaultDetailsEn = ["Activity 1", "Activity 2", "Activity 3"];
  const newItem: Experience = {
   id: uuidv4(),
   title: lang === "pt-br" ? "Novo Cargo" : "New Role",
   company: lang === "pt-br" ? "Empresa" : "Company",
   locate: lang === "pt-br" ? "Cidade, País" : "City, Country",
   period: lang === "pt-br" ? "Início - Fim" : "Start - End",
   description: lang === "pt-br" ? "Descrição" : "Description",
   language: lang,
   order: items.length,
   details: lang === "pt-br" ? defaultDetailsPt : defaultDetailsEn,
  };
  setItems((prev) => [...prev, newItem]);
 }, [items.length, lang]);

 const handleSave = useCallback(async () => {
  if (!user) return;
  setIsSaving(true);
  try {
   await saveExperienceRemote(items);
   setSnapshot([...items]);
   setEditing(false);
   setExperienceLocal(items);
   onSaved?.(items.map((it, idx) => ({ ...it, order: idx })));
  } catch (e) {
   console.error(e);
  } finally {
   setIsSaving(false);
  }
 }, [items, user, saveExperienceRemote, setExperienceLocal, onSaved]);

 const handleRevert = () => setItems(snapshot);

 if (isLoading)
  return (
   <p className="text-xs text-gray-400">
    {lang === "pt-br" ? "Carregando..." : "Loading..."}
   </p>
  );
 if (error) return <p className="text-red-500 text-sm">{error}</p>;

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
    <Reorder.Group
     axis="y"
     values={items}
     onReorder={setItems}
     className="space-y-3"
    >
     {items.map((it) => (
      <Reorder.Item
       key={it.id}
       value={it}
       as="div"
       dragListener={false}
       className="group relative flex flex-col gap-2 p-3 rounded-lg bg-zinc-800/70 border border-zinc-700/40"
      >
       <motion.div
        className="absolute -left-2 top-1.5 cursor-grab p-1.5 text-zinc-500 hover:text-white"
        drag="x"
        dragControls={controls}
        onPointerDown={(e) => controls.start(e)}
        whileDrag={{ opacity: 0.6 }}
       >
        <FaGripVertical />
       </motion.div>
       <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pl-4">
        <input
         value={it.title}
         onChange={(e) => handleUpdate(it.id, "title", e.target.value)}
         placeholder={lang === "pt-br" ? "Cargo" : "Role"}
         className="md:col-span-2 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
         value={it.company}
         onChange={(e) => handleUpdate(it.id, "company", e.target.value)}
         placeholder={lang === "pt-br" ? "Empresa" : "Company"}
         className="md:col-span-2 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
         value={it.locate || ""}
         onChange={(e) => handleUpdate(it.id, "locate", e.target.value as any)}
         placeholder={lang === "pt-br" ? "Local" : "Location"}
         className="md:col-span-1 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
         value={it.period}
         onChange={(e) => handleUpdate(it.id, "period", e.target.value)}
         placeholder={lang === "pt-br" ? "Período" : "Period"}
         className="md:col-span-1 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <AutoResizeTextarea
         value={it.description}
         onChange={(e) => handleUpdate(it.id, "description", e.target.value)}
         placeholder={lang === "pt-br" ? "Descrição" : "Description"}
         className="md:col-span-6 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-wrap"
        />
        <div className="md:col-span-6 pl-1">
         <p className="text-[11px] font-medium text-gray-300 mb-1">
          {lang === "pt-br" ? "Detalhes" : "Details"}
         </p>
         <div className="space-y-2">
          {(it.details ?? []).map((d, idx) => (
           <div key={idx} className="flex gap-2 items-start">
            <AutoResizeTextarea
             value={d}
             onChange={(e) => updateDetail(it.id, idx, e.target.value)}
             placeholder={lang === "pt-br" ? "Detalhe" : "Detail"}
             className="bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 flex-1"
            />
            <button
             onClick={() => removeDetail(it.id, idx)}
             className="text-red-400 hover:text-red-300 p-1"
             aria-label="Remove detail"
            >
             <FaTrash className="text-[10px]" />
            </button>
           </div>
          ))}
          <button
           onClick={() => addDetail(it.id)}
           className="mt-1 inline-flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium py-1 px-2 rounded"
          >
           <FaPlus className="text-[10px]" />{" "}
           {lang === "pt-br" ? "Adicionar detalhe" : "Add detail"}
          </button>
         </div>
        </div>
       </div>
       <button
        onClick={() => handleRemove(it.id)}
        className="absolute -right-2 -top-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 shadow"
       >
        <FaTrash className="text-[10px]" />
       </button>
      </Reorder.Item>
     ))}
     <div className="flex flex-wrap gap-2 pt-2">
      <button
       onClick={handleAdd}
       className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600/80 hover:bg-green-600 text-white"
      >
       <FaPlus className="text-[10px]" />{" "}
       {lang === "pt-br" ? "Adicionar" : "Add"}
      </button>
      <button
       onClick={handleSave}
       disabled={!hasChanges || isSaving}
       className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
        !hasChanges || isSaving
         ? "bg-blue-900/40 text-blue-300 cursor-not-allowed"
         : "bg-blue-600/80 hover:bg-blue-600 text-white"
       }`}
      >
       <FaSave className="text-[10px]" />{" "}
       {isSaving
        ? lang === "pt-br"
          ? "Salvando..."
          : "Saving..."
        : lang === "pt-br"
        ? "Salvar"
        : "Save"}
      </button>
     </div>
    </Reorder.Group>
   ) : (
    <ul className="space-y-2">
     {items.map((it) => (
      <li
       key={it.id}
       className="p-3 rounded-md bg-zinc-800/60 border border-zinc-700/30"
      >
       <p className="text-sm text-gray-100 font-medium">
        {it.title} <span className="text-gray-400">- {it.company}</span>
        {it.locate ? (
         <span className="text-gray-500"> • {it.locate}</span>
        ) : null}
       </p>
       <p className="text-[11px] text-gray-400 mt-0.5">{it.period}</p>
       {it.description && (
        <p className="text-[12px] text-gray-300 mt-1 whitespace-pre-wrap">
         {it.description}
        </p>
       )}
       {Array.isArray(it.details) && it.details.length > 0 && (
        <ul className="list-disc pl-4 mt-2 space-y-0.5 text-[11px] text-gray-400">
         {it.details.map((d, i) => (
          <li key={i}>{d}</li>
         ))}
        </ul>
       )}
      </li>
     ))}
    </ul>
   )}
  </div>
 );
};

export default ExperienceEditor;
