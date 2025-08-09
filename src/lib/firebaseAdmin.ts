import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

// Initialize Firebase Admin once per process
if (!admin.apps.length) {
 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
 });
}

export const getAdminDb = () => admin.firestore();

export type FirestoreAdmin = ReturnType<typeof getAdminDb>;
