import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProjectItem {
 id?: string;
 title: string;
 description: string;
 link: { text: string; href: string };
 language: "pt-br" | "en";
 order: number;
}

export const fetchProjectsForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 50
): Promise<ProjectItem[]> => {
 const ref = collection(db, "users", userId, "projects");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<ProjectItem, "id">),
 }));
};
