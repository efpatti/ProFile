// src/components/BannerColorSyncWrapper.tsx
"use client";
import { useUserBannerColorSync } from "@/core/services/useUserBannerColorSync";
import { useBannerColorFirestoreSync } from "@/core/services/useBannerColorFirestoreSync";

export function BannerColorSyncWrapper() {
 useUserBannerColorSync();
 useBannerColorFirestoreSync();
 return null;
}
