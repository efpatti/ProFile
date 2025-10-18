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

export interface Interests {
 id?: string;
 category: string;
 item: string;
 language: "pt-br" | "en";
 order: number;
}

export const fetchInterestsForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 100
): Promise<Interests[]> => {
 const ref = collection(db, "users", userId, "interests");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<Interests, "id">),
 }));
};

export const saveInterests = async (
 userId: string,
 language: "pt-br" | "en",
 items: Interests[],
 existingSnapshot?: Interests[]
) => {
 const batch = writeBatch(db);

 const existing =
  existingSnapshot ?? (await fetchInterestsForUser(userId, language));
 const existingIds = new Set(existing.map((e) => e.id));
 const newIds = new Set(items.map((e) => e.id).filter(Boolean));

 // Deletions
 for (const e of existing) {
  if (!newIds.has(e.id)) {
   const ref = doc(db, "users", userId, "interests", e.id!);
   batch.delete(ref);
  }
 }

 const s = (v?: string) => (typeof v === "string" ? v : "");

 // Upserts according to array order
 items.forEach((e, index) => {
  const data = {
   category: s(e.category) || (language === "pt-br" ? "Categoria" : "Category"),
   item: s(e.item),
   language,
   order: index,
  };

  if (e.id && existingIds.has(e.id)) {
   const ref = doc(db, "users", userId, "interests", e.id);
   batch.set(ref, data);
  } else {
   const ref = doc(collection(db, "users", userId, "interests"));
   batch.set(ref, data);
  }
 });

 await batch.commit();
};
