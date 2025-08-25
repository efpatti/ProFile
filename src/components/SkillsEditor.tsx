"use client";

import React, {
 useState,
 useEffect,
 useRef,
 useCallback,
 useMemo,
} from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { useResumeStore } from "@/core/store/useResumeStore";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
 FaUndo,
} from "react-icons/fa";
import type { Skill } from "@/core/services/SkillsService";

// Auto-resize textarea
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



interface SkillsEditorProps {
  lang: "pt-br" | "en";
  initialSkills?: Skill[]; // optional externally provided skills (raw docs with id)
  onSaved?: (skills: Skill[]) => void; // callback after successful save
}

const SkillsEditor = ({ lang, initialSkills, onSaved }: SkillsEditorProps) => {
const PROFESSIONAL_KEY = lang === "pt-br" ? "Profissionais" : "Professional";
 const { user } = useAuth();
 const {
  skills: storeSkills,
  saveSkillsRemote,
  setSkillsLocal,
  loading: storeLoading,
 } = useResumeStore();
 const [skills, setSkills] = useState<Skill[]>([]);
 const [snapshot, setSnapshot] = useState<Skill[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const controls = useDragControls();

 // Hydrate from store or initialSkills
 useEffect(() => {
  if (initialSkills) {
   const ordered = [...initialSkills].sort((a, b) => a.order - b.order);
   setSkills(ordered);
   setSnapshot(ordered);
   setIsLoading(false);
  } else if (storeSkills && storeSkills.length > 0) {
   const ordered = [...storeSkills].sort((a, b) => a.order - b.order);
   setSkills(ordered);
   setSnapshot(ordered);
   setIsLoading(false);
  } else if (storeLoading) {
   setIsLoading(true);
  } else {
   setIsLoading(false);
  }
 }, [initialSkills, storeSkills, storeLoading]);

  const technicalSkills = skills.filter((s) => s.category !== PROFESSIONAL_KEY);
  const professionalSkills = skills.filter((s) => s.category === PROFESSIONAL_KEY);


 const groupedTechnical = useMemo(() => {
  return technicalSkills.reduce((acc, s) => {
   acc[s.category] = acc[s.category] || [];
   acc[s.category].push(s.item);
   return acc;
  }, {} as Record<string, string[]>);
 }, [technicalSkills]);

 const hasChanges = useMemo(() => {
  if (snapshot.length !== skills.length) return true;
  return skills.some((s, i) => {
   const o = snapshot[i];
   if (!o) return true;
   return s.category !== o.category || s.item !== o.item || s.order !== o.order;
  });
 }, [skills, snapshot]);

 const updateSkill = useCallback(
  (id: string, item: string, category: string) => {
   setSkills((prev) =>
    prev.map((sk) => (sk.id === id ? { ...sk, item, category } : sk))
   );
  },
  []
 );

 const removeSkill = useCallback(
  (id: string) => {
   if (!confirm(lang === "pt-br" ? "Remover habilidade?" : "Remove skill?"))
    return;
   setSkills((prev) => prev.filter((sk) => sk.id !== id));
  },
  [lang]
 );

 const generateTempId = () =>
  typeof crypto !== "undefined" && (crypto as any).randomUUID
   ? (crypto as any).randomUUID()
   : `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

 const addSkill = (type: "technical" | "professional") => {
  const newSkill: Skill = {
   id: generateTempId(),
  category: type === "technical"
    ? (lang === "pt-br" ? "Nova Categoria" : "New Category")
    : PROFESSIONAL_KEY,
   item: lang === "pt-br" ? "Nova Habilidade" : "New Skill",
   language: lang,
   order: skills.length,
  };
  setSkills((prev) => [...prev, newSkill]);
 };

 const reorderTechnical = (newItems: Skill[]) => {
  const prof = skills.filter((s) => s.category === PROFESSIONAL_KEY);
  setSkills([...newItems, ...prof]);
 };
 const reorderProfessional = (newItems: Skill[]) => {
  const tech = skills.filter((s) => s.category !== PROFESSIONAL_KEY);
  setSkills([...tech, ...newItems]);
 };

 const handleSave = async () => {
  if (!user) return;
  setIsSaving(true);
  try {
   await saveSkillsRemote(skills);
   setSnapshot([...skills]);
   setEditing(false);
   setSkillsLocal(skills);
   onSaved?.(skills.map((s, idx) => ({ ...s, order: idx })));
  } catch (e) {
   console.error(e);
  } finally {
   const PROFESSIONAL_KEY = lang === "pt-br" ? "Profissionais" : "Professional";
   setIsSaving(false);
  }
 };

 const handleRevert = () => setSkills(snapshot);

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
    <div className="space-y-6">
     {/* Technical Skills Editor */}
     <section>
      <p className="text-[11px] font-medium text-gray-400 mb-2">
       {lang === "pt-br" ? "Técnicas" : "Technical"}
      </p>
      <Reorder.Group
       axis="y"
       values={technicalSkills}
       onReorder={reorderTechnical}
       className="space-y-3"
      >
       {technicalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id}
         value={skill}
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
           value={skill.category}
           onChange={(e) =>
            updateSkill(
             skill.id!,
             skill.item,
             e.target.value.trim() ||
              (lang === "pt-br" ? "Categoria" : "Category")
            )
           }
           placeholder={lang === "pt-br" ? "Categoria" : "Category"}
           className="md:col-span-2 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
          />
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            updateSkill(skill.id!, e.target.value, skill.category)
           }
           placeholder={lang === "pt-br" ? "Habilidade" : "Skill"}
           className="md:col-span-3 bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 whitespace-normal break-words"
          />
         </div>
         <button
          onClick={() => removeSkill(skill.id!)}
          className="absolute -right-2 -top-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 shadow"
          aria-label="Remove"
         >
          <FaTrash className="text-[10px]" />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>
      <div className="flex flex-wrap gap-2 pt-2">
       <button
        onClick={() => addSkill("technical")}
        className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600/80 hover:bg-green-600 text-white"
       >
        <FaPlus className="text-[10px]" />{" "}
        {lang === "pt-br" ? "Adicionar" : "Add"}
       </button>
      </div>
     </section>

     {/* Professional Skills Editor */}
     <section>
      <p className="text-[11px] font-medium text-gray-400 mb-2">
       {lang === "pt-br" ? "Profissionais" : "Professional"}
      </p>
      <Reorder.Group
       axis="y"
       values={professionalSkills}
       onReorder={reorderProfessional}
       className="space-y-3"
      >
       {professionalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id}
         value={skill}
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
         <div className="pl-4">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            updateSkill(skill.id!, e.target.value, PROFESSIONAL_KEY)
           }
           placeholder={
            lang === "pt-br" ? "Habilidade Profissional" : "Professional Skill"
           }
           className="w-full bg-zinc-700/70 focus:bg-zinc-700 text-gray-100 text-xs rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 whitespace-normal break-words"
          />
         </div>
         <button
          onClick={() => removeSkill(skill.id!)}
          className="absolute -right-2 -top-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 shadow"
          aria-label="Remove"
         >
          <FaTrash className="text-[10px]" />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>
      <div className="flex flex-wrap gap-2 pt-2">
       <button
        onClick={() => addSkill("professional")}
        className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600/80 hover:bg-green-600 text-white"
       >
        <FaPlus className="text-[10px]" />{" "}
        {lang === "pt-br" ? "Adicionar" : "Add"}
       </button>
      </div>
     </section>

     <div className="flex flex-wrap gap-2 pt-2">
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
      {hasChanges && !isSaving && (
       <span className="text-[10px] text-amber-400 flex items-center">
        {lang === "pt-br" ? "Alterações não salvas" : "Unsaved changes"}
       </span>
      )}
     </div>
    </div>
   ) : (
    <div className="space-y-6">
     {/* Technical view */}
     <section>
      <p className="text-[11px] font-medium text-gray-400 mb-2">
       {lang === "pt-br" ? "Técnicas" : "Technical"}
      </p>
      <ul className="flex flex-wrap gap-1.5">
       {technicalSkills.map((sk) => (
        <li
         key={sk.id}
         className="px-2 py-1 rounded-full bg-zinc-800/60 text-[11px] text-gray-200 border border-zinc-700/40 max-w-full break-words"
        >
         {sk.item}
        </li>
       ))}
      </ul>
     </section>
     {/* Professional view */}
     <section>
      <p className="text-[11px] font-medium text-gray-400 mb-2">
       {lang === "pt-br" ? "Profissionais" : "Professional"}
      </p>
      <ul className="flex flex-wrap gap-1.5">
       {professionalSkills.map((sk) => (
        <li
         key={sk.id}
         className="px-2 py-1 rounded-full bg-zinc-800/60 text-[11px] text-gray-200 border border-zinc-700/40 max-w-full break-words"
        >
         {sk.item}
        </li>
       ))}
      </ul>
     </section>
    </div>
   )}
  </div>
 );
};

export default SkillsEditor;
