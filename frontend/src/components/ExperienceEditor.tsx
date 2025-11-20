"use client";

import React from "react";
import {
 GenericEditor,
 AutoResizeTextarea,
} from "@/components/shared/GenericEditor";
import useResumeStore, { Experience } from "@/core/store/useResumeStore";
import { useResumeEditor } from "@/presentation/hooks/useResumeEditor";
import { v4 as uuidv4 } from "uuid";

interface ExperienceEditorProps {
 lang: "pt-br" | "en";
 initialItems?: Experience[];
 onSaved?: (items: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
 lang,
 initialItems,
 onSaved,
}) => {
 const { items, handleSave, isLoading } = useResumeEditor({
  storeSelector: (s) => s.experiences,
  updateFn: (items) => useResumeStore.getState().updateExperiences(items),
  initialItems,
  onSaved,
 });

 return (
  <GenericEditor
   items={items}
   onSave={handleSave}
   renderItem={(exp, index, onChange, editing) =>
    editing ? (
     <div className="space-y-2">
      <input
       type="text"
       value={exp.company}
       onChange={(e) => onChange({ ...exp, company: e.target.value })}
       placeholder={lang === "pt-br" ? "Empresa" : "Company"}
       className="w-full px-3 py-2 border rounded font-semibold"
      />
      <input
       type="text"
       value={exp.role}
       onChange={(e) => onChange({ ...exp, role: e.target.value })}
       placeholder={lang === "pt-br" ? "Cargo" : "Role"}
       className="w-full px-3 py-2 border rounded"
      />
      <div className="grid grid-cols-2 gap-2">
       <input
        type="date"
        value={exp.startDate}
        onChange={(e) => onChange({ ...exp, startDate: e.target.value })}
        className="px-3 py-2 border rounded"
       />
       <input
        type="date"
        value={exp.endDate || ""}
        onChange={(e) => onChange({ ...exp, endDate: e.target.value || null })}
        disabled={exp.isCurrentJob}
        className="px-3 py-2 border rounded disabled:bg-gray-100"
       />
      </div>
      <label className="flex items-center gap-2">
       <input
        type="checkbox"
        checked={exp.isCurrentJob}
        onChange={(e) =>
         onChange({
          ...exp,
          isCurrentJob: e.target.checked,
          endDate: e.target.checked ? null : exp.endDate,
         })
        }
       />
       <span>{lang === "pt-br" ? "Emprego atual" : "Current job"}</span>
      </label>
      <input
       type="text"
       value={exp.technologies.join(", ")}
       onChange={(e) =>
        onChange({
         ...exp,
         technologies: e.target.value.split(",").map((t) => t.trim()),
        })
       }
       placeholder={
        lang === "pt-br"
         ? "Tecnologias (separadas por vírgula)"
         : "Technologies (comma-separated)"
       }
       className="w-full px-3 py-2 border rounded"
      />
      <AutoResizeTextarea
       value={exp.description || ""}
       onChange={(e) => onChange({ ...exp, description: e.target.value })}
       placeholder={lang === "pt-br" ? "Descrição" : "Description"}
       className="w-full px-3 py-2 border rounded"
      />
     </div>
    ) : (
     <div>
      <div className="font-semibold">{exp.company}</div>
      <div className="text-sm text-gray-600">{exp.role}</div>
      <div className="text-xs text-gray-500">
       {exp.startDate} -{" "}
       {exp.isCurrentJob
        ? lang === "pt-br"
          ? "Presente"
          : "Present"
        : exp.endDate}
      </div>
      <div className="text-xs text-blue-600 mt-1">
       {exp.technologies.join(", ")}
      </div>
      {exp.description && <div className="text-sm mt-2">{exp.description}</div>}
     </div>
    )
   }
   createEmptyItem={() => ({
    id: uuidv4(),
    company: "",
    role: "",
    startDate: "",
    endDate: null,
    isCurrentJob: false,
    technologies: [],
    description: "",
   })}
   getItemKey={(exp) => exp.id}
   isLoading={isLoading}
   lang={lang}
  />
 );
};

export default ExperienceEditor;
