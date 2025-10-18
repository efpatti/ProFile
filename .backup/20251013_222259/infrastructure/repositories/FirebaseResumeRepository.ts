import {
 collection,
 doc,
 getDoc,
 getDocs,
 setDoc,
 updateDoc,
 deleteDoc,
 query,
 where,
 Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IResumeRepository } from "@/core/interfaces/IResumeRepository";
import { Resume } from "@/core/entities/Resume";

/**
 * Implementação Firebase do Repository Pattern
 * Isola detalhes de persistência da lógica de negócio
 */
export class FirebaseResumeRepository implements IResumeRepository {
 private readonly collectionName = "resumes";

 private toFirestore(resume: Resume): any {
  return {
   ...resume,
   createdAt: Timestamp.fromDate(resume.createdAt),
   updatedAt: Timestamp.fromDate(resume.updatedAt),
  };
 }

 private fromFirestore(data: any): Resume {
  return {
   ...data,
   createdAt: data.createdAt.toDate(),
   updatedAt: data.updatedAt.toDate(),
  };
 }

 async findById(id: string): Promise<Resume | null> {
  const docRef = doc(db, this.collectionName, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
   return null;
  }

  return this.fromFirestore(docSnap.data());
 }

 async findByUsername(username: string): Promise<Resume | null> {
  const q = query(
   collection(db, this.collectionName),
   where("username", "==", username),
   where("isPublic", "==", true)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
   return null;
  }

  return this.fromFirestore(querySnapshot.docs[0].data());
 }

 async findByUserId(userId: string): Promise<Resume[]> {
  const q = query(
   collection(db, this.collectionName),
   where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => this.fromFirestore(doc.data()));
 }

 async create(resume: Resume): Promise<Resume> {
  const docRef = doc(db, this.collectionName, resume.id);
  await setDoc(docRef, this.toFirestore(resume));
  return resume;
 }

 async update(id: string, updates: Partial<Resume>): Promise<Resume> {
  const docRef = doc(db, this.collectionName, id);

  const updateData = {
   ...updates,
   updatedAt: Timestamp.now(),
  };

  await updateDoc(docRef, updateData);

  const updated = await this.findById(id);

  if (!updated) {
   throw new Error("Falha ao atualizar currículo");
  }

  return updated;
 }

 async delete(id: string): Promise<void> {
  const docRef = doc(db, this.collectionName, id);
  await deleteDoc(docRef);
 }

 async isUsernameAvailable(
  username: string,
  excludeResumeId?: string
 ): Promise<boolean> {
  const q = query(
   collection(db, this.collectionName),
   where("username", "==", username)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
   return true;
  }

  // Se está excluindo um ID (caso de update), verifica se o único documento é o próprio
  if (excludeResumeId) {
   return querySnapshot.docs.every((doc) => doc.id === excludeResumeId);
  }

  return false;
 }
}
