"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
 fetchSkillsForUser,
 saveSkills,
 type Skill,
} from "@/core/services/SkillsService";
import {
 fetchExperienceForUser,
 saveExperience,
 type Experience,
} from "@/core/services/ExperienceService";
import {
 fetchEducationForUser,
 saveEducation,
 type EducationItem,
} from "@/core/services/EducationService";
import {
 fetchProjectsForUser,
 type ProjectItem,
} from "@/core/services/ProjectsService";
import {
 fetchCertificationsForUser,
 type CertificationItem,
} from "@/core/services/CertificationsService";
import {
 fetchInterestsForUser,
 saveInterests,
 type Interests,
} from "@/core/services/InterestsService";
import {
 fetchRecommendationsForUser,
 type RecommendationItem,
} from "@/core/services/RecommendationsService";
import {
 fetchAwardsForUser,
 type AwardItem,
} from "@/core/services/AwardsService";
import { fetchProfile, saveProfile } from "@/core/services/ProfileService";
import {
 fetchHeader,
 saveHeader,
 saveContacts,
} from "@/core/services/HeaderService";

export interface LanguagesData {
 // changed to export
 title: string;
 items: string[];
}

interface ResumeStoreState {
 userId?: string;
 language: "pt-br" | "en";
 loading: boolean;
 error?: string;
 skills: Skill[];
 experience: Experience[];
 education: EducationItem[];
 languages?: LanguagesData;
 projects: ProjectItem[];
 certifications: CertificationItem[];
 interests: Interests[];
 recommendations: RecommendationItem[];
 awards: AwardItem[];
 profile: any | null;
 header: { subtitle: string; contacts: any[] } | null;
 lastLoadedAt?: number;
 // actions
 loadResume: (userId: string, language: "pt-br" | "en") => Promise<void>;
 setSkillsLocal: (skills: Skill[]) => void;
 setExperienceLocal: (items: Experience[]) => void;
 setEducationLocal: (items: EducationItem[]) => void;
 setLanguagesLocal: (data: LanguagesData) => void;
 setProjectsLocal: (items: ProjectItem[]) => void;
 setCertificationsLocal: (items: CertificationItem[]) => void;
 setInterestsLocal: (items: Interests[]) => void;
 setRecommendationsLocal: (items: RecommendationItem[]) => void;
 setAwardsLocal: (items: AwardItem[]) => void;
 setProfileLocal: (data: any | null) => void;
 setHeaderLocal: (data: { subtitle: string; contacts: any[] } | null) => void;
 saveSkillsRemote: (skills: Skill[]) => Promise<void>;
 saveExperienceRemote: (items: Experience[]) => Promise<void>;
 saveEducationRemote: (items: EducationItem[]) => Promise<void>;
 saveLanguagesRemote: (data: LanguagesData) => Promise<void>;
 saveInterestsRemote: (items: Interests[]) => Promise<void>;
 saveProfileRemote?: (data: any) => Promise<void>;
 saveHeaderRemote?: (data: {
  subtitle: string;
  contacts: any[];
 }) => Promise<void>;
}

export const useResumeStore = create<ResumeStoreState>()(
 devtools((set, get) => ({
  userId: undefined,
  language: "pt-br",
  loading: false,
  skills: [],
  experience: [],
  education: [],
  languages: undefined,
  projects: [],
  certifications: [],
  interests: [],
  recommendations: [],
  awards: [],
  profile: null,
  header: null,
  async loadResume(userId, language) {
   const current = get();
   if (current.loading) return; // avoid duplicate
   set({ loading: true, error: undefined, userId, language });
   try {
    const [
     skills,
     experience,
     education,
     languagesDoc,
     projects,
     certifications,
     interests,
     recommendations,
     awards,
     profile,
     header,
    ] = await Promise.all([
     fetchSkillsForUser(userId, language, 200),
     fetchExperienceForUser(userId, language, 200),
     fetchEducationForUser(userId, language),
     (async () => {
      const ref = doc(db, "users", userId, "languages", language);
      const snap = await getDoc(ref);
      if (snap.exists()) {
       const d = snap.data() as any;
       return {
        title: d.title || (language === "pt-br" ? "Idiomas" : "Languages"),
        items: d.items || [],
       } as LanguagesData;
      }
      return {
       title: language === "pt-br" ? "Idiomas" : "Languages",
       items: [],
      } as LanguagesData;
     })(),
     fetchProjectsForUser(userId, language, 100),
     fetchCertificationsForUser(userId, language, 100),
     fetchInterestsForUser(userId, language, 200),
     fetchRecommendationsForUser(userId, language, 100),
     fetchAwardsForUser(userId, language, 100),
     fetchProfile(userId, language),
     fetchHeader(userId, language),
    ]);
    set({
     skills,
     experience,
     education,
     languages: languagesDoc,
     projects,
     certifications,
     interests,
     recommendations,
     awards,
     profile,
     header,
     loading: false,
     lastLoadedAt: Date.now(),
    });
   } catch (e: any) {
    console.error("[useResumeStore] loadResume error", e);
    set({ error: e?.message || "Failed to load resume", loading: false });
   }
  },
  setSkillsLocal(skills) {
   set({ skills });
  },
  setExperienceLocal(experience) {
   set({ experience });
  },
  setEducationLocal(education) {
   set({ education });
  },
  setLanguagesLocal(languages) {
   set({ languages });
  },
  setProjectsLocal(projects) {
   set({ projects });
  },
  setCertificationsLocal(certifications) {
   set({ certifications });
  },
  setInterestsLocal(interests) {
   set({ interests });
  },
  setRecommendationsLocal(recommendations) {
   set({ recommendations });
  },
  setAwardsLocal(awards) {
   set({ awards });
  },
  setProfileLocal(profile) {
   set({ profile });
  },
  setHeaderLocal(header) {
   set({ header });
  },
  async saveSkillsRemote(newSkills) {
   const { userId, language, skills } = get();
   if (!userId) return;
   await saveSkills(userId, language, newSkills, skills);
   set({ skills: newSkills });
  },
  async saveExperienceRemote(newItems) {
   const { userId, language, experience } = get();
   if (!userId) return;
   await saveExperience(userId, language, newItems, experience);
   set({ experience: newItems });
  },
  async saveEducationRemote(newItems) {
   const { userId, education } = get();
   if (!userId) return;
   // compute deletions
   const prevIds = new Set(education.map((e) => e.id));
   const newIds = new Set(newItems.map((e) => e.id));
   const deletions: string[] = [];
   prevIds.forEach((id) => {
    if (!newIds.has(id)) deletions.push(id);
   });
   await saveEducation(userId, newItems, deletions);
   set({ education: newItems });
  },
  async saveLanguagesRemote(data) {
   const { userId, language } = get();
   if (!userId) return;
   const ref = doc(db, "users", userId, "languages", language);
   // dynamic import to reduce initial bundle if desired
   const { setDoc } = await import("firebase/firestore");
   await setDoc(
    ref,
    { title: data.title, items: data.items, language },
    { merge: true }
   );
   set({ languages: data });
  },
  async saveInterestsRemote(newItems) {
   const { userId, language, interests } = get();
   if (!userId) return;
   await saveInterests(userId, language, newItems, interests);
   set({ interests: newItems });
  },
  async saveProfileRemote(data) {
   const { userId, language } = get();
   if (!userId) return;
   await saveProfile(userId, language, data);
   set({ profile: data });
  },
  async saveHeaderRemote(data) {
   const { userId, language } = get();
   if (!userId) return;
   await saveHeader(userId, language, { subtitle: data.subtitle });
   await saveContacts(userId, language, data.contacts);
   set({ header: data });
  },
 }))
);
