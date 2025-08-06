"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

interface LanguagesEditorProps {
 lang: "pt-br" | "en";
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ lang }) => {
 const { user } = useAuth();
 const [items, setItems] = useState<string[]>([]);
 const [title, setTitle] = useState("");
 const [isLoading, setIsLoading] = useState(true);
 const [newItem, setNewItem] = useState("");

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
     } else {
      setItems([]);
      setTitle("Idiomas");
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
   alert("Idiomas salvos com sucesso!");
  } catch (error) {
   console.error("Erro ao salvar idiomas:", error);
   alert("Ocorreu um erro ao salvar os idiomas.");
  }
 };

 if (isLoading) {
  return <div>Carregando editor de idiomas...</div>;
 }

 return (
  <>
   <h3 className="text-xl font-bold mb-4 text-white">Editor de Idiomas</h3>
   <div className="space-y-2">
    {items.map((item, index) => (
     <div key={index} className="flex items-center gap-2">
      <input
       type="text"
       value={item}
       onChange={(e) => handleUpdateItem(index, e.target.value)}
       className="bg-gray-700 text-white p-2 rounded w-full"
      />
      <button
       onClick={() => handleRemoveItem(index)}
       className="text-red-500 hover:text-red-400 p-2"
      >
       <FaTrash />
      </button>
     </div>
    ))}
   </div>
   <div className="mt-4 flex items-center gap-2">
    <input
     type="text"
     value={newItem}
     onChange={(e) => setNewItem(e.target.value)}
     className="bg-gray-700 text-white p-2 rounded w-full"
     placeholder="Novo idioma"
    />
    <button
     onClick={handleAddItem}
     className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded"
    >
     <FaPlus />
    </button>
   </div>
   <div className="mt-6 text-right">
    <button
     onClick={handleSave}
     className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2 ml-auto"
    >
     <FaSave />
     Salvar Idiomas
    </button>
   </div>
  </>
 );
};

export default LanguagesEditor;
