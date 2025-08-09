"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchSkillsForUser,
 saveSkills,
 type Skill,
} from "@/core/services/SkillsService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

// Componente de textarea auto-ajustável
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

const SkillsEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [skills, setSkills] = useState<Skill[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editingTechnical, setEditingTechnical] = useState(false);
 const [editingProfessional, setEditingProfessional] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchSkillsForUser(user.uid, lang)
    .then((fetchedSkills) => {
     setSkills(fetchedSkills.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch(() => {
     setError("Falha ao carregar as skills.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 // Separa skills em técnicas e profissionais
 const technicalSkills = skills.filter(
  (skill) => skill.category !== "Profissionais"
 );
 const professionalSkills = skills.filter(
  (skill) => skill.category === "Profissionais"
 );

 const groupedTechnicalSkills = technicalSkills.reduce((acc, skill) => {
  if (!acc[skill.category]) {
   acc[skill.category] = [];
  }
  acc[skill.category].push(skill.item);
  return acc;
 }, {} as Record<string, string[]>);

 const handleUpdateSkill = (id: string, item: string, category: string) => {
  setSkills((prev) =>
   prev.map((skill) => (skill.id === id ? { ...skill, item, category } : skill))
  );
 };

 const handleRemoveSkill = (id: string) => {
  setSkills((prev) => prev.filter((skill) => skill.id !== id));
 };

 const handleAddSkill = (categoryType: "technical" | "professional") => {
  const newSkill: Skill = {
   category: categoryType === "technical" ? "Nova Categoria" : "Profissionais",
   item: "Nova Habilidade",
   language: lang,
   order: skills.length,
  };
  setSkills((prev) => [...prev, newSkill]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveSkills(user.uid, lang, skills);
   setEditingTechnical(false);
   setEditingProfessional(false);
   alert("Habilidades salvas com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar as habilidades.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando habilidades...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Habilidades" : "Skills"}
    </h2>
   </div>

   {/* Seção Técnicas */}
   <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Técnicas</h3>
     <button
      onClick={() => setEditingTechnical(!editingTechnical)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingTechnical ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingTechnical ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={technicalSkills}
       onReorder={(newItems) => {
        const professionalItems = skills.filter(
         (s) => s.category === "Profissionais"
        );
        setSkills([...newItems, ...professionalItems]);
       }}
       className="space-y-4"
      >
       {technicalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1 grid grid-cols-1 gap-3">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, skill.category)
           }
           placeholder="Habilidade"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("technical")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Técnica
      </button>
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedTechnicalSkills).map(([category, items]) => (
       <div key={category} className="bg-gray-700 p-4 rounded-lg">
        <h4 className="font-bold text-white mb-2">{category}</h4>
        <ul className="flex flex-wrap gap-2">
         {items.map((item, index) => (
          <li
           key={index}
           className="bg-gray-600 text-white px-3 py-1 rounded-xl text-sm whitespace-normal break-words max-w-full"
          >
           {item}
          </li>
         ))}
        </ul>
       </div>
      ))}
     </div>
    )}
   </div>

   {/* Seção Profissionais */}
   <div>
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-xl font-semibold text-white">Profissionais</h3>
     <button
      onClick={() => setEditingProfessional(!editingProfessional)}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
     >
      <FaEdit /> {editingProfessional ? "Cancelar" : "Editar"}
     </button>
    </div>

    {editingProfessional ? (
     <div className="space-y-4 mb-6">
      <Reorder.Group
       axis="y"
       values={professionalSkills}
       onReorder={(newItems) => {
        const technicalItems = skills.filter(
         (s) => s.category !== "Profissionais"
        );
        setSkills([...technicalItems, ...newItems]);
       }}
       className="space-y-4"
      >
       {professionalSkills.map((skill) => (
        <Reorder.Item
         key={skill.id || `new-${Math.random()}`}
         value={skill}
         as="div"
         dragListener={false}
         className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg"
        >
         <motion.div
          className="cursor-grab p-2 text-gray-400 hover:text-white"
          drag="x"
          dragControls={controls}
          onPointerDown={(e) => controls.start(e)}
          whileDrag={{ opacity: 0.7 }}
         >
          <FaGripVertical />
         </motion.div>

         <div className="flex-1">
          <AutoResizeTextarea
           value={skill.item}
           onChange={(e) =>
            handleUpdateSkill(skill.id!, e.target.value, "Profissionais")
           }
           placeholder="Habilidade Profissional"
           className="bg-gray-600 text-white p-2 rounded w-full whitespace-normal break-words"
          />
         </div>

         <button
          onClick={() => handleRemoveSkill(skill.id!)}
          className="text-red-500 hover:text-red-400 p-2"
         >
          <FaTrash />
         </button>
        </Reorder.Item>
       ))}
      </Reorder.Group>

      <button
       onClick={() => handleAddSkill("professional")}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Habilidade Profissional
      </button>
     </div>
    ) : (
     <div className="bg-gray-700 p-4 rounded-lg">
      <ul className="flex flex-wrap gap-2">
       {professionalSkills.map((skill, index) => (
        <li
         key={index}
         className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm whitespace-normal break-words max-w-full"
        >
         {skill.item}
        </li>
       ))}
      </ul>
     </div>
    )}
   </div>

   {/* Botão de salvar quando em modo de edição */}
   {(editingTechnical || editingProfessional) && (
    <div className="mt-6">
     <button
      onClick={handleSaveChanges}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded"
     >
      <FaSave /> Salvar Todas as Alterações
     </button>
    </div>
   )}
  </div>
 );
};

export default SkillsEditor;
