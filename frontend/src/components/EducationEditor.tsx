"use client";

import React from "react";
import {
 GenericEditor,
 AutoResizeTextarea,
} from "@/components/shared/GenericEditor";
import useResumeStore, { EducationItem } from "@/core/store/useResumeStore";
import { useResumeEditor } from "@/presentation/hooks/useResumeEditor";
import { v4 as uuidv4 } from "uuid";

interface EducationEditorProps {
 lang: "pt-br" | "en";
 initialItems?: EducationItem[];
 onSaved?: (items: EducationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
 lang,
 initialItems,
 onSaved,
}) => {
 const { items, handleSave, isLoading } = useResumeEditor({
  storeSelector: (s) => s.education,
  updateFn: (items) => useResumeStore.getState().updateEducation(items),
  initialItems,
  onSaved,
 });

 return (
  <GenericEditor
   items={items}
   onSave={handleSave}
   renderItem={(item, index, onChange, editing) =>
    editing ? (
     <div className="space-y-2">
      <input
       type="text"
       value={item.institution}
       onChange={(e) => onChange({ ...item, institution: e.target.value })}
       placeholder={lang === "pt-br" ? "Instituição" : "Institution"}
       className="w-full px-3 py-2 border rounded"
      />
      <input
       type="text"
       value={item.degree}
       onChange={(e) => onChange({ ...item, degree: e.target.value })}
       placeholder={lang === "pt-br" ? "Grau" : "Degree"}
       className="w-full px-3 py-2 border rounded"
      />
      <input
       type="text"
       value={item.field}
       onChange={(e) => onChange({ ...item, field: e.target.value })}
       placeholder={lang === "pt-br" ? "Campo de Estudo" : "Field of Study"}
       className="w-full px-3 py-2 border rounded"
      />
      <div className="grid grid-cols-2 gap-2">
       <input
        type="date"
        value={item.startDate}
        onChange={(e) => onChange({ ...item, startDate: e.target.value })}
        className="px-3 py-2 border rounded"
       />
       <input
        type="date"
        value={item.endDate || ""}
        onChange={(e) => onChange({ ...item, endDate: e.target.value || null })}
        className="px-3 py-2 border rounded"
       />
      </div>
      <AutoResizeTextarea
       value={item.description || ""}
       onChange={(e) => onChange({ ...item, description: e.target.value })}
       placeholder={lang === "pt-br" ? "Descrição" : "Description"}
       className="w-full px-3 py-2 border rounded"
      />
     </div>
    ) : (
     <div>
      <div className="font-semibold">{item.institution}</div>
      <div className="text-sm text-gray-600">
       {item.degree} - {item.field}
      </div>
      <div className="text-xs text-gray-500">
       {item.startDate} - {item.endDate || "Presente"}
      </div>
      {item.description && (
       <div className="text-sm mt-2">{item.description}</div>
      )}
     </div>
    )
   }
   createEmptyItem={() => ({
    id: uuidv4(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: null,
    description: "",
   })}
   getItemKey={(item) => item.id}
   isLoading={isLoading}
   lang={lang}
  />
 );
};

export default EducationEditor;
