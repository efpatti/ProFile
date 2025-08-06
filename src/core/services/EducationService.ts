import {
 collection,
 query,
 where,
 getDocs,
 writeBatch,
 doc,
 orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface EducationItem {
 id: string;
 title: string;
 period: string;
 order: number;
 language: string;
}

export const fetchEducationForUser = async (
 userId: string,
 lang: string
): Promise<EducationItem[]> => {
 const educationRef = collection(db, "users", userId, "education");
 const q = query(
  educationRef,
  where("language", "==", lang),
  orderBy("order", "asc")
 );
 const querySnapshot = await getDocs(q);
 return querySnapshot.docs.map(
  (doc) => ({ id: doc.id, ...doc.data() } as EducationItem)
 );
};

export const saveEducation = async (
 userId: string,
 itemsToSave: EducationItem[],
 itemsToDelete: string[]
): Promise<void> => {
 const batch = writeBatch(db);

 itemsToSave.forEach((item) => {
  const itemRef = doc(db, "users", userId, "education", item.id);
  batch.set(itemRef, {
   title: item.title,
   period: item.period,
   order: item.order,
   language: item.language,
  });
 });

 itemsToDelete.forEach((itemId) => {
  const itemRef = doc(db, "users", userId, "education", itemId);
  batch.delete(itemRef);
 });

 await batch.commit();
};
