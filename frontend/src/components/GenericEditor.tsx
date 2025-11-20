"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import { motion, Reorder, useDragControls } from "framer-motion";

export interface BaseItem {
 id: string;
 order: number;
 language: string;
}

interface GenericEditorProps<T extends BaseItem> {
 lang: string;
 fetchItems: (userId: string, lang: string) => Promise<T[]>;
 saveItems: (
  userId: string,
  itemsToSave: T[],
  itemsToDelete: string[]
 ) => Promise<void>;
 createNewItem: (lang: string, currentLength: number) => T;
 renderItem: (
  item: T,
  handleInputChange: (id: string, field: keyof T, value: any) => void
 ) => React.ReactNode;
 title: string;
 addItemButtonText: string;
 errorMessages: {
  load: string;
  save: string;
  precondition: string;
 };
}

export function GenericEditor<T extends BaseItem>({
 lang,
 fetchItems,
 saveItems,
 createNewItem,
 renderItem,
 title,
 addItemButtonText,
 errorMessages,
}: GenericEditorProps<T>) {
 const { user } = useAuth();
 const [items, setItems] = useState<T[]>([]);
 const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const controls = useDragControls();

 useEffect(() => {
  if (user) {
   setIsLoading(true);
   fetchItems(user.uid, lang)
    .then((fetchedItems) => {
     setItems(fetchedItems);
     setIsLoading(false);
    })
    .catch((err) => {
     console.error(err);
     if (err.code === "failed-precondition") {
      setError(errorMessages.precondition);
     } else {
      setError(errorMessages.load);
     }
     setIsLoading(false);
    });
  }
 }, [user, lang, fetchItems, errorMessages.load, errorMessages.precondition]);

 const handleAddItem = () => {
  const newItem = createNewItem(lang, items.length);
  setItems([...items, newItem]);
 };

 const handleDeleteItem = (id: string) => {
  const itemExistsInDb = !items
   .find((item) => item.id === id)
   ?.id.includes("-");
  if (itemExistsInDb) {
   setItemsToDelete([...itemsToDelete, id]);
  }
  setItems(items.filter((item) => item.id !== id));
 };

 const handleSave = async () => {
  if (!user) return;
  try {
   await saveItems(user.uid, items, itemsToDelete);
   setItemsToDelete([]);
   alert(`${title} salvos com sucesso!`);
  } catch (error) {
   console.error(`Erro ao salvar ${title}:`, error);
   alert(errorMessages.save);
  }
 };

 const handleInputChange = (id: string, field: keyof T, value: any) => {
  setItems(
   items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  );
 };

 if (isLoading) return <div>Carregando editor de {title.toLowerCase()}...</div>;
 if (error) return <div className="text-red-500">{error}</div>;

 return (
  <div className="p-4 bg-gray-800 rounded-lg">
   <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>

   <Reorder.Group
    axis="y"
    values={items}
    onReorder={setItems}
    className="space-y-4"
   >
    {items.map((item) => (
     <Reorder.Item
      key={item.id}
      value={item}
      as="div"
      dragListener={false}
      className="flex items-center mb-4 group"
     >
      <motion.div
       className="cursor-grab p-2 text-gray-400 hover:text-white active:text-white active:cursor-grabbing"
       drag="x"
       dragControls={controls}
       onPointerDown={(e) => controls.start(e)}
       whileDrag={{ scale: 0.98, opacity: 0.8 }}
      >
       <FaGripVertical />
      </motion.div>

      <motion.div
       className="bg-gray-700 p-4 rounded-md w-full flex items-center gap-4 flex-grow"
       layout
       initial={{ opacity: 0, y: -10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, x: -100 }}
       transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
       <div className="flex-grow">{renderItem(item, handleInputChange)}</div>
       <motion.button
        onClick={() => handleDeleteItem(item.id)}
        className="text-red-500 hover:text-red-400 p-2 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
       >
        <FaTrash />
       </motion.button>
      </motion.div>
     </Reorder.Item>
    ))}
   </Reorder.Group>

   <div className="mt-4 flex gap-4">
    <motion.button
     onClick={handleAddItem}
     className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     {addItemButtonText}
    </motion.button>
    <motion.button
     onClick={handleSave}
     className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
    >
     Salvar Alterações
    </motion.button>
   </div>
  </div>
 );
}
