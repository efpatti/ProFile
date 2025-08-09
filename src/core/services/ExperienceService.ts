import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
 writeBatch,
 doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Experience {
 id?: string;
 title: string;
 company: string;
 period: string;
 description: string;
 language: "pt-br" | "en";
 order: number;
 locate?: string;
 details?: string[];
}

export const fetchExperienceForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 100
): Promise<Experience[]> => {
 const ref = collection(db, "users", userId, "experience");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<Experience, "id">),
 }));
};

export const saveExperience = async (
 userId: string,
 language: "pt-br" | "en",
 items: Experience[]
) => {
 const batch = writeBatch(db);

 // Fetch existing to handle deletions
 const existing = await fetchExperienceForUser(userId, language);
 const existingIds = new Set(existing.map((e) => e.id));
 const newIds = new Set(items.map((e) => e.id).filter(Boolean));

 // Deletions
 for (const e of existing) {
  if (!newIds.has(e.id)) {
   const ref = doc(db, "users", userId, "experience", e.id!);
   batch.delete(ref);
  }
 }

 const s = (v?: string) => (typeof v === "string" ? v : "");
 const sanitizeDetails = (arr?: string[]) =>
  Array.isArray(arr) ? arr.map((d) => (typeof d === "string" ? d : "")) : [];

 // Upserts according to array order
 items.forEach((e, index) => {
  const data = {
   title: s(e.title),
   company: s(e.company),
   period: s(e.period),
   description: s(e.description),
   language,
   order: index,
   locate: s(e.locate),
   details: sanitizeDetails(e.details),
  };

  if (e.id && existingIds.has(e.id)) {
   const ref = doc(db, "users", userId, "experience", e.id);
   batch.set(ref, data);
  } else {
   const ref = doc(collection(db, "users", userId, "experience"));
   batch.set(ref, data);
  }
 });

 await batch.commit();
};
