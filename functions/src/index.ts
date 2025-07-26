// functions/src/index.ts ou functions/index.js

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Inicialize o SDK do Admin para interagir com o Realtime Database
// Se você já tem o admin.initializeApp() em outro lugar, pode ignorar
admin.initializeApp();

// Esta função é acionada sempre que um novo usuário é criado no Firebase Authentication (v1)
export const criarPerfilUsuarioRealtimeDB = functions.auth
 .user()
 .onCreate(async (user: admin.auth.UserRecord) => {
  const uid = user.uid;
  const email = user.email;
  const displayName = user.displayName;
  const photoURL = user.photoURL;

  const userData = {
   email: email,
   displayName: displayName || "Usuário Novo", // Fallback se não tiver display name
   photoURL: photoURL,
   createdAt: admin.database.ServerValue.TIMESTAMP, // Salva o timestamp da criação
  };

  // Salve esses dados no Realtime Database, por exemplo, em `/users/{uid}`
  try {
   await admin.database().ref(`users/${uid}`).set(userData);
   console.log(`Dados do usuário ${uid} gravados no Realtime Database.`);
   return null;
  } catch (error) {
   console.error(
    `Erro ao gravar dados do usuário ${uid} no Realtime Database:`,
    error
   );
   return null;
  }
 });

// Função HTTP para migrar todos os usuários do Firestore para o Realtime Database (v1)
export const migrarUsuariosFirestoreParaRealtimeDB = functions.https.onRequest(
 async (req, res) => {
  try {
   // Coleção de usuários no Firestore
   const snapshot = await admin.firestore().collection("users").get();
   const updates: Record<string, unknown> = {};
   snapshot.forEach((doc) => {
    updates[`users/${doc.id}`] = doc.data();
   });
   // Atualiza todos os usuários de uma vez no Realtime Database
   await admin.database().ref().update(updates);
   res.status(200).send("Migração concluída com sucesso!");
  } catch (error) {
   console.error("Erro na migração:", error);
   res.status(500).send("Erro na migração: " + error);
  }
 }
);
