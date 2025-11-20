/**
 * Header Store - Domain-specific state management
 * Single Responsibility: Manage resume header data (name, title, email)
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Header {
 name: string;
 title: string;
 email: string;
}

interface HeaderState {
 header: Header | null;
 updateHeader: (header: Header) => void;
 resetHeader: () => void;
}

export const useHeaderStore = create<HeaderState>()(
 devtools(
  (set) => ({
   header: null,

   updateHeader: (header) => set({ header }),

   resetHeader: () => set({ header: null }),
  }),
  { name: "HeaderStore" }
 )
);
