"use client";
import { useEffect } from "react";
import { usePalette } from "@/styles/PaletteProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { BannerColorName } from "@/styles/PaletteProvider";

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
