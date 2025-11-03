"use client";

import React from "react";
import { GenericEditor } from "@/components/shared/GenericEditor";
import useResumeStore, { Skill } from "@/core/store/useResumeStore";
import { useResumeEditor } from "@/presentation/hooks/useResumeEditor";
import { v4 as uuidv4 } from "uuid";

interface SkillsEditorProps {
 lang: "pt-br" | "en";
 initialSkills?: Skill[];
 onSaved?: (skills: Skill[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
 lang,
 initialSkills,
 onSaved,
}) => {
 const { items, handleSave, isLoading } = useResumeEditor({
  storeSelector: (s) => s.skills,
  updateFn: (items) => useResumeStore.getState().updateSkills(items),
  initialItems: initialSkills,
  onSaved,
 });

 return (
  <GenericEditor
   items={items}
   onSave={handleSave}
   renderItem={(skill, index, onChange, editing) =>
    editing ? (
     <div className="space-y-2">
      <input
       type="text"
       value={skill.category}
       onChange={(e) => onChange({ ...skill, category: e.target.value })}
       placeholder={lang === "pt-br" ? "Categoria" : "Category"}
       className="w-full px-3 py-2 border rounded font-semibold"
      />
      <input
       type="text"
       value={skill.item || skill.name || ""}
       onChange={(e) =>
        onChange({ ...skill, item: e.target.value, name: e.target.value })
       }
       placeholder={lang === "pt-br" ? "Habilidade" : "Skill"}
       className="w-full px-3 py-2 border rounded"
      />
     </div>
    ) : (
     <div>
      <div className="font-semibold">{skill.category}</div>
      <div className="text-sm text-gray-600">{skill.item || skill.name}</div>
     </div>
    )
   }
   createEmptyItem={() => ({
    id: uuidv4(),
    category: "",
    item: "",
    name: "",
   })}
   getItemKey={(skill) => skill.id || `skill-${Math.random()}`}
   isLoading={isLoading}
   lang={lang}
  />
 );
};

export default SkillsEditor;
