import {
 collection,
 writeBatch,
 doc,
 getDocs,
 query,
 where,
 deleteDoc,
 addDoc,
 updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Skill {
 id?: string; // Firestore document ID
 category: string;
 item: string;
 language: "pt-br" | "en";
 order: number;
}

// Busca todas as skills para um usuário e idioma
export const fetchSkillsForUser = async (
 userId: string,
 language: "pt-br" | "en"
): Promise<Skill[]> => {
 const skillsRef = collection(db, "users", userId, "skills");
 const q = query(skillsRef, where("language", "==", language));
 const querySnapshot = await getDocs(q);
 return querySnapshot.docs.map((doc) => ({
  id: doc.id,
  ...(doc.data() as Omit<Skill, "id">),
 }));
};

// Salva todas as alterações (adições, atualizações, remoções)
export const saveSkills = async (
 userId: string,
 language: "pt-br" | "en",
 skills: Skill[]
) => {
 const batch = writeBatch(db);
 const skillsRef = collection(db, "users", userId, "skills");

 // Pega as skills existentes para comparar
 const existingSkills = await fetchSkillsForUser(userId, language);
 const existingSkillIds = new Set(existingSkills.map((s) => s.id));
 const newSkillIds = new Set(skills.map((s) => s.id).filter(Boolean));

 // 1. Deletar skills que foram removidas
 for (const skill of existingSkills) {
  if (!newSkillIds.has(skill.id)) {
   const docRef = doc(db, "users", userId, "skills", skill.id!);
   batch.delete(docRef);
  }
 }

 // 2. Adicionar ou atualizar skills
 skills.forEach((skill, index) => {
  const skillData = {
   category: skill.category,
   item: skill.item,
   language: language,
   order: index, // A ordem é definida pela posição no array
  };

  if (skill.id && existingSkillIds.has(skill.id)) {
   // Atualiza skill existente
   const docRef = doc(db, "users", userId, "skills", skill.id);
   batch.update(docRef, skillData);
  } else {
   // Adiciona nova skill
   const newDocRef = doc(collection(db, "users", userId, "skills"));
   batch.set(newDocRef, skillData);
  }
 });

 await batch.commit();
};
