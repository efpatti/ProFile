"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Skill {
 id?: string;
 category: string;
 item?: string;
 name?: string;
 order?: number;
 language?: string;
}

export interface Experience {
 id: string;
 company: string;
 role: string;
 startDate: string;
 endDate: string | null;
 isCurrentJob: boolean;
 technologies: string[];
 description?: string;
}

export interface EducationItem {
 id: string;
 institution: string;
 degree: string;
 field: string;
 startDate: string;
 endDate: string | null;
 description?: string;
}

export interface ProjectItem {
 id: string;
 name: string;
 description: string;
 technologies: string[];
 url?: string;
 startDate: string;
 endDate?: string;
}

export interface CertificationItem {
 id: string;
 name: string;
 issuer: string;
 date: string;
 url?: string;
}

export interface AwardItem {
 id: string;
 title: string;
 issuer: string;
 date: string;
 description?: string;
}

export interface RecommendationItem {
 id: string;
 recommenderName: string;
 relationship: string;
 text: string;
 date?: string;
}

export interface Interests {
 items: string[];
}

export interface Profile {
 bio?: string;
 location?: string;
 phone?: string;
 website?: string;
 linkedin?: string;
 github?: string;
}

export interface Header {
 name: string;
 title: string;
 email: string;
}

interface ResumeState {
 header: Header | null;
 profile: Profile | null;
 skills: Skill[];
 experiences: Experience[];
 education: EducationItem[];
 projects: ProjectItem[];
 certifications: CertificationItem[];
 awards: AwardItem[];
 recommendations: RecommendationItem[];
 interests: Interests;
 languages: string[];
 isLoading: boolean;
 error: string | null;
 loadResume: (userId: string) => Promise<void>;
 saveResume: (userId: string) => Promise<void>;
 updateHeader: (header: Header) => void;
 updateProfile: (profile: Profile) => void;
 updateSkills: (skills: Skill[]) => void;
 updateExperiences: (experiences: Experience[]) => void;
 updateEducation: (education: EducationItem[]) => void;
 updateProjects: (projects: ProjectItem[]) => void;
 updateCertifications: (certifications: CertificationItem[]) => void;
 updateAwards: (awards: AwardItem[]) => void;
 updateRecommendations: (recommendations: RecommendationItem[]) => void;
 updateInterests: (interests: Interests) => void;
 updateLanguages: (languages: string[]) => void;
}

const useResumeStore = create<ResumeState>()(
 devtools((set, get) => ({
  header: null,
  profile: null,
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  certifications: [],
  awards: [],
  recommendations: [],
  interests: { items: [] },
  languages: [],
  isLoading: false,
  error: null,

  loadResume: async (userId: string) => {
   set({ isLoading: true, error: null });
   try {
    const response = await fetch(`/api/resume?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to load resume");
    const data = await response.json();
    const resume = data.resumes?.[0];
    if (resume) {
     set({
      header: resume.header || null,
      profile: resume.profile || null,
      skills: (resume.skills || []).map((s: any) => ({
       ...s,
       item: s?.item ?? s?.name ?? "",
       name: s?.name ?? s?.item ?? "",
      })),
      experiences: resume.experiences || [],
      education: resume.education || [],
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      awards: resume.awards || [],
      recommendations: resume.recommendations || [],
      interests: resume.interests || { items: [] },
      languages: resume.languages || [],
      isLoading: false,
     });
    } else {
     set({ isLoading: false });
    }
   } catch (error) {
    set({ error: (error as Error).message, isLoading: false });
   }
  },

  saveResume: async (userId: string) => {
   set({ isLoading: true, error: null });
   try {
    const state = get();
    const response = await fetch("/api/resume", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
      userId,
      header: state.header,
      profile: state.profile,
      skills: state.skills,
      experiences: state.experiences,
      education: state.education,
      projects: state.projects,
      certifications: state.certifications,
      awards: state.awards,
      recommendations: state.recommendations,
      interests: state.interests,
      languages: state.languages,
     }),
    });
    if (!response.ok) throw new Error("Failed to save resume");
    set({ isLoading: false });
   } catch (error) {
    set({ error: (error as Error).message, isLoading: false });
   }
  },

  updateHeader: (header) => set({ header }),
  updateProfile: (profile) => set({ profile }),
  updateSkills: (skills) => set({ skills }),
  updateExperiences: (experiences) => set({ experiences }),
  updateEducation: (education) => set({ education }),
  updateProjects: (projects) => set({ projects }),
  updateCertifications: (certifications) => set({ certifications }),
  updateAwards: (awards) => set({ awards }),
  updateRecommendations: (recommendations) => set({ recommendations }),
  updateInterests: (interests) => set({ interests }),
  updateLanguages: (languages) => set({ languages }),
 }))
);

export default useResumeStore;
