"use client";

import React, {
 useState,
 useEffect,
 useRef,
 useCallback,
 useMemo,
} from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchEducationForUser,
 saveEducation,
 type EducationItem,
} from "@/core/services/EducationService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
 FaUndo,
} from "react-icons/fa";

// Componente de textarea auto-ajustável (opcional, pode manter inputs se preferir)
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder: string;
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

const EducationEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const [snapshot, setSnapshot] = useState<EducationItem[]>([]);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchEducationForUser(user.uid, lang)
    .then((fetchedItems) => {
     const ordered = fetchedItems.sort((a, b) => a.order - b.order);
     setEducationItems(ordered);
     setSnapshot(ordered);
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     setError(
      lang === "pt-br"
       ? "Falha ao carregar educação."
       : "Failed to load education."
     );
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const hasChanges = useMemo(() => {
  if (snapshot.length !== educationItems.length) return true;
  return educationItems.some((it, i) => {
   const s = snapshot[i];
   if (!s) return true;
   return (
    it.title !== s.title || it.period !== s.period || it.order !== s.order
   );
  });
 }, [educationItems, snapshot]);

 const handleUpdateItem = useCallback(
  (id: string, field: keyof EducationItem, value: string) => {
   setEducationItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
   );
  },
  []
 );

 const handleRemoveItem = useCallback(
  (id: string) => {
   if (
    !confirm(lang === "pt-br" ? "Remover formação?" : "Remove education item?")
   )
    return;
   setEducationItems((prev) => prev.filter((item) => item.id !== id));
  },
  [lang]
 );

 const handleAddItem = useCallback(() => {
  const newItem: EducationItem = {
   id: uuidv4(),
   title: lang === "pt-br" ? "Nova Formação" : "New Education",
   period: lang === "pt-br" ? "Início - Fim" : "Start - End",
   language: lang,
   order: educationItems.length,
  };
  setEducationItems((prev) => [...prev, newItem]);
 }, [educationItems.length, lang]);

 const handleSaveChanges = useCallback(async () => {
  if (!user) return;
  setIsSaving(true);
  try {
   await saveEducation(user.uid, educationItems, []);
   setSnapshot([...educationItems]);
   setEditing(false);
  } catch (e) {
   console.error(e);
  } finally {
   setIsSaving(false);
  }
 }, [educationItems, user]);

 const handleRevert = () => {
  setEducationItems(snapshot);
 };

 if (isLoading)
  return (
   <div className="text-xs text-gray-400">
    {lang === "pt-br" ? "Carregando..." : "Loading..."}
   </div>
  );
 if (error) return <p className="text-red-500 text-sm">{error}</p>;

 return (
  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 shadow-inner">
   <div className="flex items-center justify-between mb-4">
    <div className="flex gap-2">
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
     values={educationItems}
     onReorder={setEducationItems}
     className="space-y-3"
    >
     {educationItems.map((item) => (
      <Reorder.Item
       key={item.id}
       value={item}
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
       <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pl-4">
        <input
         value={item.title}
         onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
         placeholder={lang === "pt-br" ? "Curso / Formação" : "Course / Degree"}
         className="md:col-span-3 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
         value={item.period}
         onChange={(e) => handleUpdateItem(item.id, "period", e.target.value)}
         placeholder={lang === "pt-br" ? "Início - Fim" : "Start - End"}
         className="md:col-span-2 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
        />
       </div>
       <button
        onClick={() => handleRemoveItem(item.id)}
        className="absolute -right-2 -top-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 shadow"
       >
        <FaTrash className="text-[10px]" />
       </button>
      </Reorder.Item>
     ))}
     <div className="flex flex-wrap gap-2 pt-2">
      <button
       onClick={handleAddItem}
       className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600/80 hover:bg-green-600 text-white"
      >
       <FaPlus className="text-[10px]" />{" "}
       {lang === "pt-br" ? "Adicionar" : "Add"}
      </button>
      <button
       onClick={handleSaveChanges}
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
     {educationItems.map((item) => (
      <li
       key={item.id}
       className="p-3 rounded-md bg-zinc-800/60 border border-zinc-700/30"
      >
       <p className="text-sm text-gray-100 font-medium">{item.title}</p>
       <p className="text-[11px] text-gray-400 mt-0.5">{item.period}</p>
      </li>
     ))}
    </ul>
   )}
  </div>
 );
};

function uuidv4() {
 return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
  const r = (Math.random() * 16) | 0,
   v = c == "x" ? r : (r & 0x3) | 0x8;
  return v.toString(16);
 });
}

export default EducationEditor;
