// src/core/services/useBannerColorFirestoreSync.ts
"use client";
import { useEffect } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { BannerColorName } from "@/styles/PaletteProvider";

// Sincroniza bannerColor global do Firestore em tempo real (caso use um valor global)
export function useBannerColorFirestoreSync() {
 const { setBannerColor } = usePalette();

 useEffect(() => {
  const bannerDoc = doc(db, "config", "bannerColor");
  const unsubscribe = onSnapshot(bannerDoc, (snapshot) => {
   const data = snapshot.data();
   if (data && data.value) {
    setBannerColor(data.value as BannerColorName);
   }
  });
  return () => unsubscribe();
 }, [setBannerColor]);
}
