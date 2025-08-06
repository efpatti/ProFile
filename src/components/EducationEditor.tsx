"use client";

import React from "react";
import { GenericEditor, BaseItem } from "./GenericEditor";
import {
 fetchEducationForUser,
 saveEducation,
} from "@/core/services/EducationService";
import { v4 as uuidv4 } from "uuid";

// Definindo o tipo específico para Educação
export interface EducationItem extends BaseItem {
 title: string;
 period: string;
}

// Props para o componente EducationEditor
interface EducationEditorProps {
 lang: string;
}

const EducationEditor: React.FC<EducationEditorProps> = ({ lang }) => {
 // Função para criar um novo item de educação
 const createNewEducationItem = (
  lang: string,
  currentLength: number
 ): EducationItem => ({
  id: uuidv4(),
  title: "Nova Formação",
  period: "Ano de Início - Ano de Fim",
  order: currentLength,
  language: lang,
 });

 // Função para renderizar os campos de um item de educação
 const renderEducationItem = (
  item: EducationItem,
  handleInputChange: (
   id: string,
   field: keyof EducationItem,
   value: any
  ) => void
 ) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   <input
    type="text"
    value={item.title}
    onChange={(e) => handleInputChange(item.id, "title", e.target.value)}
    className="bg-gray-600 text-white p-2 rounded-md w-full"
    placeholder="Curso ou Formação"
   />
   <input
    type="text"
    value={item.period}
    onChange={(e) => handleInputChange(item.id, "period", e.target.value)}
    className="bg-gray-600 text-white p-2 rounded-md w-full"
    placeholder="Período"
   />
  </div>
 );

 return (
  <GenericEditor<EducationItem>
   lang={lang}
   fetchItems={fetchEducationForUser}
   saveItems={saveEducation}
   createNewItem={createNewEducationItem}
   renderItem={renderEducationItem}
   title="Editar Educação"
   addItemButtonText="Adicionar Formação"
   errorMessages={{
    load: "Falha ao carregar os dados de educação.",
    save: "Ocorreu um erro ao salvar os dados de educação.",
    precondition:
     "A consulta requer um índice no Firebase. Verifique o console do navegador para o link de criação.",
   }}
  />
 );
};

export default EducationEditor;
