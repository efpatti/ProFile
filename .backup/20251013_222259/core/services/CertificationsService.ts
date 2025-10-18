import {
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface CertificationItem {
 id?: string;
 title: string;
 examCode?: string;
 linkCredly?: string;
 language: "pt-br" | "en";
 order: number;
}

export const fetchCertificationsForUser = async (
 userId: string,
 language: "pt-br" | "en",
 pageSize = 50
): Promise<CertificationItem[]> => {
 const ref = collection(db, "users", userId, "certifications");
 const q = query(
  ref,
  where("language", "==", language),
  orderBy("order", "asc"),
  limit(pageSize)
 );
 const snap = await getDocs(q);
 return snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<CertificationItem, "id">),
 }));
};
