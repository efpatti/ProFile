/**
 * Profile Store - Domain-specific state management
 * Single Responsibility: Manage user profile data (bio, contact info)
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Profile {
 bio?: string;
 location?: string;
 phone?: string;
 website?: string;
 linkedin?: string;
 github?: string;
}

interface ProfileState {
 profile: Profile | null;
 updateProfile: (profile: Profile) => void;
 resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
 devtools(
  (set) => ({
   profile: null,

   updateProfile: (profile) => set({ profile }),

   resetProfile: () => set({ profile: null }),
  }),
  { name: "ProfileStore" }
 )
);
