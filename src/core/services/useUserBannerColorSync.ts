// src/core/services/useUserBannerColorSync.ts
"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { BannerColorName } from "@/styles/PaletteProvider";

export function useUserBannerColorSync() {
 const { user } = useAuth();
 const { setBannerColor } = usePalette();

 useEffect(() => {
  if (!user) return;
  const userDoc = doc(db, "users", user.uid);
  const unsubscribe = onSnapshot(userDoc, (snapshot) => {
   const data = snapshot.data();
   if (data && data.bannerColor) {
    setBannerColor(data.bannerColor as BannerColorName);
   }
  });
  return () => unsubscribe();
 }, [user, setBannerColor]);
}
