"use client";

import React from "react";
import { GenericEditor } from "@/components/shared/GenericEditor";
import useResumeStore from "@/core/store/useResumeStore";
import { useAuth } from "@/core/services/AuthProvider";

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
 const { user } = useAuth();
 const {
  languages: storeLanguages,
  updateLanguages,
  saveResume,
  isLoading,
 } = useResumeStore();
 const items = initialData?.items || storeLanguages || [];

 const handleSave = async (updatedItems: string[]) => {
  if (!user?.id) return;
  updateLanguages(updatedItems);
  await saveResume(user.id);
  onSaved?.({
   title: lang === "pt-br" ? "Idiomas" : "Languages",
   items: updatedItems,
  });
 };

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
