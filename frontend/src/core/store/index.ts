/**
 * Store Index - Centralized exports
 * Uncle Bob: Keep exports organized
 */

// Domain Stores
export { useHeaderStore } from "./useHeaderStore";
export type { Header } from "./useHeaderStore";

export { useProfileStore } from "./useProfileStore";
export type { Profile } from "./useProfileStore";

export { useSkillsStore } from "./useSkillsStore";
export type { Skill } from "./useSkillsStore";

export { useExperiencesStore } from "./useExperiencesStore";
export type { Experience } from "./useExperiencesStore";

export { useEducationStore } from "./useEducationStore";
export type { EducationItem } from "./useEducationStore";

export { useProjectsStore } from "./useProjectsStore";
export type { Project } from "./useProjectsStore";

export { useCertificationsStore } from "./useCertificationsStore";
export type { Certification } from "./useCertificationsStore";

export { useAwardsStore } from "./useAwardsStore";
export type { Award } from "./useAwardsStore";

export { useRecommendationsStore } from "./useRecommendationsStore";
export type { Recommendation } from "./useRecommendationsStore";

export { useInterestsStore } from "./useInterestsStore";
export type { Interest } from "./useInterestsStore";

export { useLanguagesStore } from "./useLanguagesStore";
export type { Language } from "./useLanguagesStore";

// Facade - Primary interface for components
export { useResumeFacade, useResumeData } from "./useResumeFacade";
