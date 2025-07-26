// src/app/users/page.tsx
import React from "react";

interface User {
 bannerColor?: string;
 createdAt?: number;
 email?: string;
 name?: string;
 pallete?: string;
 uid?: string;
 updatedAt?: number;
}

async function getUsers(): Promise<Record<string, User>> {
 // Use a REST API do Firebase Realtime Database
 const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
 if (!databaseUrl)
  throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL não definida");
 const res = await fetch(`${databaseUrl}/users.json`, { cache: "no-store" });
 if (!res.ok) throw new Error("Erro ao buscar usuários do Realtime Database");
 return res.json();
}

export default async function UsersPage() {
 let users: Record<string, User> = {};
 try {
  users = await getUsers();
 } catch (e) {
  return (
   <div className="p-8 text-red-500">Erro ao buscar usuários: {String(e)}</div>
  );
 }

 if (!users || Object.keys(users).length === 0) {
  return <div className="p-8">Nenhum usuário encontrado.</div>;
 }

 return (
  <div className="p-8 max-w-2xl mx-auto">
   <h1 className="text-2xl font-bold mb-6">Usuários do Realtime Database</h1>
   <ul className="space-y-4">
    {Object.entries(users).map(([uid, user]) => (
     <li key={uid} className="border rounded p-4 bg-zinc-800 text-white">
      <div>
       <b>UID:</b> {uid}
      </div>
      <div>
       <b>Nome:</b> {user.name || "-"}
      </div>
      <div>
       <b>Email:</b> {user.email || "-"}
      </div>
      <div>
       <b>Criado em:</b>{" "}
       {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}
