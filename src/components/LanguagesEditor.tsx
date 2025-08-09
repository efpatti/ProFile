"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
} from "react-icons/fa";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ lang }) => {
 const { user } = useAuth();
 const [items, setItems] = useState<string[]>([]);
 const [title, setTitle] = useState("Idiomas");
 const [isLoading, setIsLoading] = useState(true);
 const [editing, setEditing] = useState(false);
 const [newItem, setNewItem] = useState("");
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   const docRef = doc(db, "users", user.uid, "languages", lang);
   getDoc(docRef)
    .then((docSnap) => {
     if (docSnap.exists()) {
      const data = docSnap.data();
      setItems(data.items || []);
      setTitle(data.title || "Idiomas");
     }
     setIsLoading(false);
    })
    .catch((error) => {
     console.error("Error fetching languages:", error);
     setIsLoading(false);
    });
  }
 }, [user, lang]);

 const handleAddItem = () => {
  if (newItem.trim() !== "") {
   setItems([...items, newItem.trim()]);
   setNewItem("");
  }
 };

 const handleRemoveItem = (indexToRemove: number) => {
  setItems(items.filter((_, index) => index !== indexToRemove));
 };

 const handleUpdateItem = (indexToUpdate: number, value: string) => {
  const updatedItems = [...items];
  updatedItems[indexToUpdate] = value;
  setItems(updatedItems);
 };

 const handleSave = async () => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid, "languages", lang);
  try {
   await setDoc(docRef, { title, items, language: lang }, { merge: true });
   setEditing(false);
   alert("Idiomas salvos com sucesso!");
  } catch (error) {
   console.error("Erro ao salvar idiomas:", error);
   alert("Ocorreu um erro ao salvar os idiomas.");
  }
 };

 if (isLoading) return <div className="text-white">Carregando idiomas...</div>;

 return (
  <div className="bg-gray-800 rounded-lg p-6">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">
     {lang === "pt-br" ? "Idiomas" : "Languages"}
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
      values={items}
      onReorder={setItems}
      className="space-y-4"
     >
      {items.map((item, index) => (
       <Reorder.Item
        key={index}
        value={item}
        as="div"
        dragListener={false}
        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
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

        <input
         type="text"
         value={item}
         onChange={(e) => handleUpdateItem(index, e.target.value)}
         className="bg-gray-600 text-white p-2 rounded flex-grow"
        />

        <button
         onClick={() => handleRemoveItem(index)}
         className="text-red-500 hover:text-red-400 p-2"
        >
         <FaTrash />
        </button>
       </Reorder.Item>
      ))}
     </Reorder.Group>

     <div className="flex gap-4 mt-4">
      <input
       type="text"
       value={newItem}
       onChange={(e) => setNewItem(e.target.value)}
       className="bg-gray-600 text-white p-2 rounded flex-grow"
       placeholder="Novo idioma"
      />
      <button
       onClick={handleAddItem}
       className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
      >
       <FaPlus />
      </button>
     </div>

     <div className="mt-6">
      <button
       onClick={handleSave}
       className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded ml-auto"
      >
       <FaSave /> Salvar Idiomas
      </button>
     </div>
    </div>
   ) : (
    <div className="flex flex-wrap gap-2">
     {items.map((item, index) => (
      <div
       key={index}
       className="bg-gray-700 text-white px-4 py-2 rounded-full"
      >
       {item}
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

export default LanguagesEditor;
