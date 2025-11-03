/**
 * Resume Facade - Facade Pattern
 * Coordena múltiplos stores e centraliza operações de API
 *
 * Benefícios:
 * - Interface unificada para operações de resume
 * - Coordenação entre stores
 * - Loading/error states centralizados
 * - Simplifica uso nos componentes
 */

"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useHeaderStore } from "./useHeaderStore";
import { useProfileStore } from "./useProfileStore";
import { useSkillsStore } from "./useSkillsStore";
import { useExperiencesStore } from "./useExperiencesStore";
import { useEducationStore } from "./useEducationStore";
import { useProjectsStore } from "./useProjectsStore";
import { useCertificationsStore } from "./useCertificationsStore";
import { useAwardsStore } from "./useAwardsStore";
import { useRecommendationsStore } from "./useRecommendationsStore";
import { useInterestsStore } from "./useInterestsStore";
import { useLanguagesStore } from "./useLanguagesStore";

interface ResumeFacadeState {
 isLoading: boolean;
 error: string | null;
 loadResume: (userId: string) => Promise<void>;
 saveResume: (userId: string) => Promise<void>;
 resetAllStores: () => void;
}

export const useResumeFacade = create<ResumeFacadeState>()(
 devtools(
  (set) => ({
   isLoading: false,
   error: null,

   /**
    * Carrega resume da API e distribui para stores individuais
    */
   loadResume: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
     const response = await fetch(`/api/resume?userId=${userId}`);
     if (!response.ok) throw new Error("Failed to load resume");

     const data = await response.json();
     const resume = data.resumes?.[0];

     if (resume) {
      // Distribui dados para stores específicos
      useHeaderStore.getState().updateHeader(resume.header || null);
      useProfileStore.getState().updateProfile(resume.profile || null);

      useSkillsStore.getState().updateSkills(
       (resume.skills || []).map((s: any) => ({
        ...s,
        item: s?.item ?? s?.name ?? "",
        name: s?.name ?? s?.item ?? "",
       }))
      );

      useExperiencesStore
       .getState()
       .updateExperiences(resume.experiences || []);
      useEducationStore.getState().updateEducation(resume.education || []);
      useProjectsStore.getState().updateProjects(resume.projects || []);
      useCertificationsStore
       .getState()
       .updateCertifications(resume.certifications || []);
      useAwardsStore.getState().updateAwards(resume.awards || []);
      useRecommendationsStore
       .getState()
       .updateRecommendations(resume.recommendations || []);
      useInterestsStore.getState().updateInterests(resume.interests || []);
      useLanguagesStore.getState().updateLanguages(resume.languages || []);
     }

     set({ isLoading: false });
    } catch (error) {
     set({ error: (error as Error).message, isLoading: false });
    }
   },

   /**
    * Coleta dados de todos os stores e salva na API
    */
   saveResume: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
     // Coleta dados de todos os stores
     const header = useHeaderStore.getState().header;
     const profile = useProfileStore.getState().profile;
     const skills = useSkillsStore.getState().skills;
     const experiences = useExperiencesStore.getState().experiences;
     const education = useEducationStore.getState().education;
     const projects = useProjectsStore.getState().projects;
     const certifications = useCertificationsStore.getState().certifications;
     const awards = useAwardsStore.getState().awards;
     const recommendations = useRecommendationsStore.getState().recommendations;
     const interests = useInterestsStore.getState().interests;
     const languages = useLanguagesStore.getState().languages;

     const response = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
       userId,
       header,
       profile,
       skills,
       experiences,
       education,
       projects,
       certifications,
       awards,
       recommendations,
       interests,
       languages,
      }),
     });

     if (!response.ok) throw new Error("Failed to save resume");
     set({ isLoading: false });
    } catch (error) {
     set({ error: (error as Error).message, isLoading: false });
    }
   },

   /**
    * Reseta todos os stores para estado inicial
    */
   resetAllStores: () => {
    useHeaderStore.getState().resetHeader();
    useProfileStore.getState().resetProfile();
    useSkillsStore.getState().resetSkills();
    useExperiencesStore.getState().resetExperiences();
    useEducationStore.getState().resetEducation();
    useProjectsStore.getState().resetProjects();
    useCertificationsStore.getState().resetCertifications();
    useAwardsStore.getState().resetAwards();
    useRecommendationsStore.getState().resetRecommendations();
    useInterestsStore.getState().resetInterests();
    useLanguagesStore.getState().resetLanguages();
    set({ isLoading: false, error: null });
   },
  }),
  { name: "ResumeFacade" }
 )
);

/**
 * Hook composto que retorna dados de todos os stores
 * Útil para componentes que precisam de múltiplos domínios
 */
export function useResumeData() {
 const { isLoading, error, loadResume, saveResume } = useResumeFacade();
 const { header } = useHeaderStore();
 const { profile } = useProfileStore();
 const { skills } = useSkillsStore();
 const { experiences } = useExperiencesStore();
 const { education } = useEducationStore();
 const { projects } = useProjectsStore();
 const { certifications } = useCertificationsStore();
 const { awards } = useAwardsStore();
 const { recommendations } = useRecommendationsStore();
 const { interests } = useInterestsStore();
 const { languages } = useLanguagesStore();

 return {
  header,
  profile,
  skills,
  experiences,
  education,
  projects,
  certifications,
  awards,
  recommendations,
  interests,
  languages,
  isLoading,
  error,
  loadResume,
  saveResume,
 };
}
