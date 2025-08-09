"use client";

import React, { useState, useEffect, useRef } from "react";
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
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchEducationForUser(user.uid, lang)
    .then((fetchedItems) => {
     setEducationItems(fetchedItems.sort((a, b) => a.order - b.order));
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     setError("Falha ao carregar os dados de educação.");
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleUpdateItem = (
  id: string,
  field: keyof EducationItem,
  value: string
 ) => {
  setEducationItems((prev) =>
   prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 const handleRemoveItem = (id: string) => {
  setEducationItems((prev) => prev.filter((item) => item.id !== id));
 };

 const handleAddItem = () => {
  const newItem: EducationItem = {
   id: uuidv4(),
   title: "Nova Formação",
   period: "Ano de Início - Ano de Fim",
   language: lang,
   order: educationItems.length,
  };
  setEducationItems((prev) => [...prev, newItem]);
 };

 const handleSaveChanges = async () => {
  if (!user) return;
  try {
   await saveEducation(user.uid, educationItems, []);
   setEditing(false);
   alert("Dados de educação salvos com sucesso!");
  } catch (e) {
   console.error(e);
   alert("Erro ao salvar os dados de educação.");
  }
 };

 if (isLoading) return <p className="text-white">Carregando educação...</p>;
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Formação Acadêmica" : "Education"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing ? "Visualizar" : "Editar"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={educationItems}
      onReorder={setEducationItems}
      className="space-y-4"
     >
      {educationItems.map((item) => (
       <Reorder.Item
        key={item.id}
        value={item}
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

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
         <input
          type="text"
          value={item.title}
          onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Curso ou Formação"
         />
         <input
          type="text"
          value={item.period}
          onChange={(e) => handleUpdateItem(item.id, "period", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder="Período"
         />
        </div>

        <button
         onClick={() => handleRemoveItem(item.id)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-6">
      <button
       onClick={handleAddItem}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaPlus /> Adicionar Formação
      </button>
      <button
       onClick={handleSaveChanges}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaSave /> Salvar
      </button>
     </div>
    </div>
   ) : (
    <div className="space-y-4">
     {educationItems.map((item) => (
      <div key={item.id} className="bg-gray-700 p-4 rounded-lg">
       <h3 className="font-bold text-lg text-white">{item.title}</h3>
       <p className="text-gray-300">{item.period}</p>
      </div>
     ))}
    </div>
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
