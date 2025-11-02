"use client";

import React, { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
 FaTrash,
 FaGripVertical,
 FaPlus,
 FaSave,
 FaEdit,
 FaUndo,
} from "react-icons/fa";

export interface GenericEditorProps<T> {
 items: T[];
 onSave: (items: T[]) => Promise<void>;
 renderItem: (
  item: T,
  index: number,
  onChange: (updated: T) => void,
  editing: boolean
 ) => ReactNode;
 createEmptyItem: () => T;
 getItemKey: (item: T, index: number) => string;
 isLoading?: boolean;
 lang: "pt-br" | "en";
 addButtonLabel?: string;
 saveButtonLabel?: string;
 editButtonLabel?: string;
 cancelButtonLabel?: string;
}

export function GenericEditor<T>({
 items: initialItems,
 onSave,
 renderItem,
 createEmptyItem,
 getItemKey,
 isLoading = false,
 lang,
 addButtonLabel,
 saveButtonLabel,
 editButtonLabel,
 cancelButtonLabel,
}: GenericEditorProps<T>) {
 const [items, setItems] = useState<T[]>(initialItems);
 const [snapshot, setSnapshot] = useState<T[]>(initialItems);
 const [editing, setEditing] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
 const controls = useDragControls();

 useEffect(() => {
  setItems(initialItems);
  setSnapshot(initialItems);
 }, [initialItems]);

 const hasChanges = useMemo(() => {
  return JSON.stringify(items) !== JSON.stringify(snapshot);
 }, [items, snapshot]);

 const handleAdd = () => {
  setItems([...items, createEmptyItem()]);
  if (!editing) setEditing(true);
 };

 const handleDelete = (index: number) => {
  setItems(items.filter((_, i) => i !== index));
 };

 const handleUpdate = (index: number, updated: T) => {
  setItems(items.map((item, i) => (i === index ? updated : item)));
 };

 const handleSave = async () => {
  setIsSaving(true);
  try {
   await onSave(items);
   setSnapshot(items);
   setEditing(false);
  } catch (error) {
   console.error("Save error:", error);
  } finally {
   setIsSaving(false);
  }
 };

 const handleCancel = () => {
  setItems(snapshot);
  setEditing(false);
 };

 const labels = {
  add: addButtonLabel || (lang === "pt-br" ? "Adicionar" : "Add"),
  save: saveButtonLabel || (lang === "pt-br" ? "Salvar" : "Save"),
  edit: editButtonLabel || (lang === "pt-br" ? "Editar" : "Edit"),
  cancel: cancelButtonLabel || (lang === "pt-br" ? "Cancelar" : "Cancel"),
 };

 if (isLoading) {
  return <div className="text-gray-500">Carregando...</div>;
 }

 return (
  <div className="space-y-4">
   <div className="flex gap-2 mb-4">
    {!editing ? (
     <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
     >
      <FaEdit /> {labels.edit}
     </button>
    ) : (
     <>
      <button
       onClick={handleSave}
       disabled={!hasChanges || isSaving}
       className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
       <FaSave /> {isSaving ? "..." : labels.save}
      </button>
      <button
       onClick={handleCancel}
       disabled={isSaving}
       className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
       <FaUndo /> {labels.cancel}
      </button>
      <button
       onClick={handleAdd}
       className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
       <FaPlus /> {labels.add}
      </button>
     </>
    )}
   </div>

   {editing ? (
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
     {items.map((item, index) => (
      <Reorder.Item
       key={getItemKey(item, index)}
       value={item}
       dragListener={false}
       dragControls={controls}
      >
       <motion.div className="flex gap-2 mb-3 p-4 bg-white rounded shadow">
        <div
         onPointerDown={(e) => controls.start(e)}
         className="cursor-grab active:cursor-grabbing"
        >
         <FaGripVertical className="text-gray-400" />
        </div>
        <div className="flex-1">
         {renderItem(
          item,
          index,
          (updated) => handleUpdate(index, updated),
          editing
         )}
        </div>
        <button
         onClick={() => handleDelete(index)}
         className="text-red-500 hover:text-red-700"
        >
         <FaTrash />
        </button>
       </motion.div>
      </Reorder.Item>
     ))}
    </Reorder.Group>
   ) : (
    <div className="space-y-2">
     {items.map((item, index) => (
      <div key={getItemKey(item, index)} className="p-4 bg-gray-50 rounded">
       {renderItem(item, index, () => {}, editing)}
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

export const AutoResizeTextarea = ({
 value,
 onChange,
 placeholder,
 className,
 disabled = false,
}: {
 value: string;
 onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
 placeholder?: string;
 className?: string;
 disabled?: boolean;
}) => {
 const ref = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
  if (ref.current) {
   ref.current.style.height = "auto";
   ref.current.style.height = `${ref.current.scrollHeight}px`;
  }
 }, [value]);

 return (
  <textarea
   ref={ref}
   value={value}
   onChange={onChange}
   placeholder={placeholder}
   disabled={disabled}
   className={`resize-none overflow-hidden ${className}`}
   rows={1}
  />
 );
};
