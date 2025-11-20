"use client";

import React from "react";
import { GenericEditor } from "@/components/shared/GenericEditor";
import useResumeStore from "@/core/store/useResumeStore";
import { useResumeEditor } from "@/presentation/hooks/useResumeEditor";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
 initialData?: { title: string; items: string[] };
 onSaved?: (data: { title: string; items: string[] }) => void;
}

export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({
 lang,
 initialData,
 onSaved,
}) => {
 const { items, handleSave, isLoading } = useResumeEditor({
  storeSelector: (s) => s.languages || [],
  updateFn: (items) => useResumeStore.getState().updateLanguages(items),
  initialItems: initialData?.items,
  onSaved: (items) => onSaved?.({ title: initialData?.title || "", items }),
 });

 return (
  <GenericEditor
   items={items}
   onSave={handleSave}
   renderItem={(item, index, onChange, editing) =>
    editing ? (
     <input
      type="text"
      value={item}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded"
      placeholder={lang === "pt-br" ? "Idioma" : "Language"}
     />
    ) : (
     <span>{item}</span>
    )
   }
   createEmptyItem={() => ""}
   getItemKey={(item, index) => `lang-${index}`}
   isLoading={isLoading}
   lang={lang}
  />
 );
};

export default LanguagesEditor;
