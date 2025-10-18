// src/core/services/signOut.ts
"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function handleSignOut() {
 await signOut(auth);
}
