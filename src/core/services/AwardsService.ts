import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AwardItem {
 id?: string;
 description: string;
 icon: string;
 language: "pt-br" | "en";
 order: number;
 title: string;
}

export const fetchAwardsForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 50
): Promise<AwardItem[]> => {
 const ref = collection(db, "users", userId, "awards");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<AwardItem, "id">),
 }));
};
