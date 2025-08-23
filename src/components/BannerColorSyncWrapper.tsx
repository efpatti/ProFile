// src/components/BannerColorSyncWrapper.tsx
"use client";
import { useUserBannerColorSync } from "@/features/palette/hooks/useUserBannerColorSync";
import { useBannerColorFirestoreSync } from "@/features/palette/hooks/useBannerColorFirestoreSync";

export function BannerColorSyncWrapper() {
 useUserBannerColorSync();
 useBannerColorFirestoreSync();
 return null;
}
