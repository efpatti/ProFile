import admin from "firebase-admin";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateUsers() {
 let nextPageToken;
 do {
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  for (const userRecord of listUsersResult.users) {
   const { uid, email, displayName } = userRecord;
   await db
    .collection("users")
    .doc(uid)
    .set({
     uid,
     email,
     name: displayName || "",
     migratedAt: new Date().toISOString(),
    });
   console.log(`Migrated user: ${email}`);
  }
  nextPageToken = listUsersResult.pageToken;
 } while (nextPageToken);
 console.log("Migration complete!");
}

migrateUsers().catch(console.error);
