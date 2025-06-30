"use client";
import { useUserPaletteSync } from "@/core/services/useUserPaletteSync";
import { usePaletteFirestoreSync } from "@/core/services/usePaletteFirestoreSync";

export function PaletteSyncWrapper() {
 useUserPaletteSync();
 usePaletteFirestoreSync();
 return null;
}
