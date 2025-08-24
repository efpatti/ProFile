import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface RecommendationItem {
 id?: string;
 language: "pt-br" | "en";
 name: string;
 order: number;
 period: string;
 position: string;
 text: string;
}

export const fetchRecommendationsForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 50
): Promise<RecommendationItem[]> => {
 const ref = collection(db, "users", userId, "recommendations");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<RecommendationItem, "id">),
 }));
};
