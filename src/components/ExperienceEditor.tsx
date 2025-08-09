"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import {
 fetchExperienceForUser,
 saveExperience,
 type Experience,
} from "../core/services/ExperienceService";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaEdit,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaTrash,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

// Auto-resize textarea like other editors
const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder?: string;
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

const ExperienceEditor = ({ lang }: { lang: "pt-br" | "en" }) => {
 const { user } = useAuth();
 const [items, setItems] = useState<Experience[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [editing, setEditing] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  if (!user) return;
  setIsLoading(true);
  fetchExperienceForUser(user.uid, lang)
   .then((fetched: Experience[]) => {
    setItems(fetched.sort((a: Experience, b: Experience) => a.order - b.order));
   })
   .catch((e: unknown) => {
    console.error(e);
    setError(
     lang === "pt-br"
      ? "Falha ao carregar experiências."
      : "Failed to load experience."
    );
   })
   .finally(() => setIsLoading(false));
 }, [user, lang]);

 const handleUpdate = (
  id: string | undefined,
  field: keyof Omit<Experience, "id" | "language" | "order">,
  value: string
 ) => {
  setItems((prev) =>
   prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
  );
 };

 const updateDetail = (
  id: string | undefined,
  index: number,
  value: string
 ) => {
  setItems((prev) =>
   prev.map((it) => {
    if (it.id !== id) return it;
    const details = Array.isArray(it.details) ? [...it.details] : [];
    details[index] = value;
    return { ...it, details } as Experience;
   })
  );
 };

 const addDetail = (id: string | undefined) => {
  setItems((prev) =>
   prev.map((it) => {
    if (it.id !== id) return it;
    const details = Array.isArray(it.details) ? [...it.details] : [];
    details.push("");
    return { ...it, details } as Experience;
   })
  );
 };

 const removeDetail = (id: string | undefined, index: number) => {
  setItems((prev) =>
   prev.map((it) => {
    if (it.id !== id) return it;
    const details = Array.isArray(it.details) ? [...it.details] : [];
    details.splice(index, 1);
    return { ...it, details } as Experience;
   })
  );
 };

 const handleRemove = (id?: string) => {
  setItems((prev) => prev.filter((it) => it.id !== id));
 };

 const handleAdd = () => {
  const defaultDetailsPt = [
   "Colaborei no desenvolvimento e aprimoramento de exercícios em sala de aula, garantindo a qualidade e funcionalidade dos sistemas como beta tester.",
   "Prestei suporte técnico para mais de 30 alunos, auxiliando em questões de desenvolvimento de software e compreensão conceitual.",
   "Liderei atividades de suporte e substituí o professor em 3 aulas, treinando mais de 30 alunos — fortalecendo habilidades de comunicação e ensino técnico.",
  ];
  const defaultDetailsEn = [
   "Collaborated on classroom exercises as a beta tester, ensuring quality and functionality.",
   "Provided technical support to 30+ students, helping with software issues and core concepts.",
   "Led support activities and substituted the teacher in 3 classes, strengthening communication and teaching skills.",
  ];

  const newItem: Experience = {
   id: uuidv4(),
   title: lang === "pt-br" ? "Novo Cargo" : "New Role",
   company: lang === "pt-br" ? "Empresa" : "Company",
   locate: lang === "pt-br" ? "Cidade, País" : "City, Country",
   period: lang === "pt-br" ? "Início - Fim" : "Start - End",
   description:
    lang === "pt-br" ? "Descrição das atividades" : "Role description",
   language: lang,
   order: items.length,
   details: lang === "pt-br" ? defaultDetailsPt : defaultDetailsEn,
  };
  setItems((prev) => [...prev, newItem]);
 };

 const handleSave = async () => {
  if (!user) return;
  try {
   await saveExperience(user.uid, lang, items);
   setEditing(false);
   alert(
    lang === "pt-br"
     ? "Experiências salvas com sucesso!"
     : "Experience saved successfully!"
   );
  } catch (e) {
   console.error(e);
   alert(
    lang === "pt-br"
     ? "Erro ao salvar experiências."
     : "Error saving experience."
   );
  }
 };

 if (isLoading)
  return (
   <p className="text-white">
    {lang === "pt-br" ? "Carregando experiências..." : "Loading experience..."}
   </p>
  );
 if (error) return <p className="text-red-500">{error}</p>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Experiência" : "Experience"}
    </h2>
    <button
     onClick={() => setEditing(!editing)}
     className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
    >
     {editing
      ? lang === "pt-br"
        ? "Visualizar"
        : "View"
      : lang === "pt-br"
      ? "Editar"
      : "Edit"}
    </button>
   </div>

   {editing ? (
    <div className="space-y-4">
     <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="space-y-4"
     >
      {items.map((it) => (
       <Reorder.Item
        key={it.id}
        value={it}
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
          value={it.title}
          onChange={(e) => handleUpdate(it.id, "title", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder={lang === "pt-br" ? "Cargo" : "Title"}
         />
         <input
          type="text"
          value={it.company}
          onChange={(e) => handleUpdate(it.id, "company", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder={lang === "pt-br" ? "Empresa" : "Company"}
         />
         <input
          type="text"
          value={it.locate || ""}
          onChange={(e) => handleUpdate(it.id, "locate", e.target.value as any)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder={lang === "pt-br" ? "Local" : "Location"}
         />
         <input
          type="text"
          value={it.period}
          onChange={(e) => handleUpdate(it.id, "period", e.target.value)}
          className="bg-gray-600 text-white p-2 rounded w-full"
          placeholder={lang === "pt-br" ? "Período" : "Period"}
         />
         <AutoResizeTextarea
          value={it.description}
          onChange={(e) => handleUpdate(it.id, "description", e.target.value)}
          placeholder={lang === "pt-br" ? "Descrição" : "Description"}
          className="bg-gray-600 text-white p-2 rounded w-full md:col-span-2 whitespace-normal break-words"
         />

         <div className="md:col-span-2">
          <h4 className="text-white font-semibold mb-2">
           {lang === "pt-br" ? "Detalhes" : "Details"}
          </h4>
          <div className="space-y-2">
           {(it.details ?? []).map((d, idx) => (
            <div key={idx} className="flex gap-2 items-start">
             <AutoResizeTextarea
              value={d}
              onChange={(e) => updateDetail(it.id, idx, e.target.value)}
              placeholder={
               lang === "pt-br" ? "Descrição do detalhe" : "Detail description"
              }
              className="bg-gray-600 text-white p-2 rounded w-full"
             />
             <button
              onClick={() => removeDetail(it.id, idx)}
              className="text-red-400 hover:text-red-300 p-2"
              aria-label="Remove detail"
             >
              <FaTrash />
             </button>
            </div>
           ))}
           <button
            onClick={() => addDetail(it.id)}
            className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-3 rounded"
           >
            <FaPlus /> {lang === "pt-br" ? "Adicionar detalhe" : "Add detail"}
           </button>
          </div>
         </div>
        </div>

        <button
         onClick={() => handleRemove(it.id)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-6">
      <button
       onClick={handleAdd}
       className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaPlus />{" "}
       {lang === "pt-br" ? "Adicionar Experiência" : "Add Experience"}
      </button>
      <button
       onClick={handleSave}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded"
      >
       <FaSave /> {lang === "pt-br" ? "Salvar" : "Save"}
      </button>
     </div>
    </div>
   ) : (
    <div className="space-y-4">
     {items.map((it, idx) => (
      <div key={it.id || idx} className="bg-gray-700 p-4 rounded-lg">
       <h3 className="font-bold text-lg text-white">
        {it.title} - {it.company}
        {it.locate ? `, ${it.locate}` : ""}
       </h3>
       <p className="text-gray-400 text-sm">{it.period}</p>
       {it.description && (
        <p className="text-gray-200 mt-2 whitespace-pre-wrap">
         {it.description}
        </p>
       )}
       {Array.isArray(it.details) && it.details.length > 0 && (
        <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-300">
         {it.details.map((d, i) => (
          <li key={i}>{d}</li>
         ))}
        </ul>
       )}
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

export default ExperienceEditor;
