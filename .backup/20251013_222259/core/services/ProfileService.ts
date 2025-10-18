import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchProfile = async (
 userId: string,
 language: "pt-br" | "en"
) => {
 const ref = doc(db, "users", userId, "profile", language);
 const snap = await getDoc(ref);
 return snap.exists() ? snap.data() : null;
};

export const saveProfile = async (
 userId: string,
 language: "pt-br" | "en",
 data: any
) => {
 const ref = doc(db, "users", userId, "profile", language);
 await setDoc(ref, data, { merge: true });
};
