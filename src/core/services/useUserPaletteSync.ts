// src/core/services/useUserPaletteSync.ts
"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { PaletteName } from "@/styles/PaletteProvider";

export function useUserPaletteSync() {
 const { user } = useAuth();
 const { setPalette } = usePalette();

 useEffect(() => {
  if (!user) return;
  let ignore = false;
  const fetchPalette = async () => {
   const userDoc = await getDoc(doc(db, "users", user.uid));
   if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.palette && !ignore) setPalette(data.palette as PaletteName);
   }
  };
  fetchPalette();
  return () => {
   ignore = true;
  };
 }, [user, setPalette]);
}
