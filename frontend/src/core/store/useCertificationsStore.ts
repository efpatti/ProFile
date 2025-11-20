/**
 * Certifications Store - Domain-specific state management
 * Gerencia certificações do resume
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Certification {
 id?: string;
 name: string;
 issuer: string;
 date?: string;
 url?: string;
}

interface CertificationsState {
 certifications: Certification[];
 updateCertifications: (certifications: Certification[]) => void;
 addCertification: (certification: Certification) => void;
 removeCertification: (id: string) => void;
 resetCertifications: () => void;
}

export const useCertificationsStore = create<CertificationsState>()(
 devtools(
  (set) => ({
   certifications: [],

   updateCertifications: (certifications) => set({ certifications }),

   addCertification: (certification) =>
    set((state) => ({
     certifications: [...state.certifications, certification],
    })),

   removeCertification: (id) =>
    set((state) => ({
     certifications: state.certifications.filter((c) => c.id !== id),
    })),

   resetCertifications: () => set({ certifications: [] }),
  }),
  { name: "CertificationsStore" }
 )
);
