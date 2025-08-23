"use client";
import { useUserPaletteSync } from "@/features/palette/hooks/useUserPaletteSync";
import { usePaletteFirestoreSync } from "@/features/palette/hooks/usePaletteFirestoreSync";

export function PaletteSyncWrapper() {
 useUserPaletteSync();
 usePaletteFirestoreSync();
 return null;
}
