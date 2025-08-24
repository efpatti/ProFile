import {
 doc,
 getDoc,
 setDoc,
 collection,
 getDocs,
 writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchHeader = async (userId: string, language: "pt-br" | "en") => {
 const headerRef = doc(db, "users", userId, "header", language);
 const headerSnap = await getDoc(headerRef);
 let subtitle = "";
 if (headerSnap.exists()) {
  subtitle = (headerSnap.data() as any).subtitle || "";
 }
 const contactsColRef = collection(
  db,
  "users",
  userId,
  "header",
  language,
  "contacts"
 );
 const contactsSnap = await getDocs(contactsColRef);
 const contacts = contactsSnap.docs.map((d) => d.data());
 return { subtitle, contacts } as { subtitle: string; contacts: any[] };
};

export const saveHeader = async (
 userId: string,
 language: "pt-br" | "en",
 data: { subtitle: string }
) => {
 const ref = doc(db, "users", userId, "header", language);
 await setDoc(ref, { subtitle: data.subtitle, language }, { merge: true });
};

export const saveContacts = async (
 userId: string,
 language: "pt-br" | "en",
 contacts: any[]
) => {
 const colRef = collection(db, "users", userId, "header", language, "contacts");
 const batch = writeBatch(db);
 // Remove all then re-add (simple, not optimal for huge lists)
 const existing = await getDocs(colRef);
 existing.forEach((docSnap) => batch.delete(docSnap.ref));
 contacts.forEach((c) => {
  const ref = doc(colRef);
  batch.set(ref, c);
 });
 await batch.commit();
};
