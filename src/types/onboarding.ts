/**
 * Onboarding Types & Validation
 * Uncle Bob: "Clean code is simple and direct"
 */

import { z } from "zod";
import { STRING_LENGTH } from "@/constants/validation";

// Step 1: Personal Info (REQUIRED)
export const personalInfoSchema = z.object({
 fullName: z
  .string()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(STRING_LENGTH.MAX.NAME, "Nome muito longo"),
 email: z.string().email("Email inválido"),
 phone: z.string().optional(),
 location: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// Step 2: Professional Profile (REQUIRED)
export const professionalProfileSchema = z.object({
 jobTitle: z
  .string()
  .min(2, "Cargo deve ter pelo menos 2 caracteres")
  .max(STRING_LENGTH.MAX.TITLE, "Cargo muito longo"),
 summary: z
  .string()
  .min(50, "Resumo deve ter pelo menos 50 caracteres")
  .max(STRING_LENGTH.MAX.DESCRIPTION, "Resumo muito longo"),
 linkedin: z.string().url("LinkedIn inválido").optional().or(z.literal("")),
 github: z.string().url("GitHub inválido").optional().or(z.literal("")),
 website: z.string().url("Website inválido").optional().or(z.literal("")),
});

export type ProfessionalProfile = z.infer<typeof professionalProfileSchema>;

// Step 3: Experience (OPTIONAL - min 1 recomendado)
export const experienceSchema = z.object({
 company: z.string().min(1, "Empresa é obrigatória"),
 position: z.string().min(1, "Cargo é obrigatório"),
 startDate: z.string(), // ISO date
 endDate: z.string().optional(),
 isCurrent: z.boolean().default(false),
 description: z.string().optional(),
 location: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

// Step 4: Education (OPTIONAL - min 1 recomendado)
export const educationSchema = z.object({
 institution: z.string().min(1, "Instituição é obrigatória"),
 degree: z.string().min(1, "Grau é obrigatório"),
 field: z.string().min(1, "Área de estudo é obrigatória"),
 startDate: z.string(), // ISO date
 endDate: z.string().optional(),
 isCurrent: z.boolean().default(false),
});

export type Education = z.infer<typeof educationSchema>;

// Step 5: Template Selection (REQUIRED)
export const templateSelectionSchema = z.object({
 template: z.enum(["professional", "modern", "creative", "minimal"]),
 palette: z.string().min(1, "Selecione uma paleta de cores"),
});

export type TemplateSelection = z.infer<typeof templateSelectionSchema>;

// Complete Onboarding Data
export const onboardingDataSchema = z.object({
 personalInfo: personalInfoSchema,
 professionalProfile: professionalProfileSchema,
 experiences: z.array(experienceSchema).optional(),
 education: z.array(educationSchema).optional(),
 templateSelection: templateSelectionSchema,
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;

// Step Configuration
export interface StepConfig {
 id: string;
 title: string;
 description: string;
 required: boolean;
 minItems?: number; // Para arrays (experiences, education)
}

export const ONBOARDING_STEPS: StepConfig[] = [
 {
  id: "personal",
  title: "Informações Pessoais",
  description: "Vamos começar com o básico",
  required: true,
 },
 {
  id: "professional",
  title: "Perfil Profissional",
  description: "Conte sua história",
  required: true,
 },
 {
  id: "experience",
  title: "Experiência",
  description: "Suas conquistas anteriores (opcional)",
  required: false,
  minItems: 1, // Recomendado ter pelo menos 1
 },
 {
  id: "education",
  title: "Formação",
  description: "Sua jornada acadêmica (opcional)",
  required: false,
  minItems: 1, // Recomendado ter pelo menos 1
 },
 {
  id: "template",
  title: "Escolha seu Estilo",
  description: "Qual design combina com você?",
  required: true,
 },
];

// Validation helpers
export function isStepRequired(stepId: string): boolean {
 return ONBOARDING_STEPS.find((s) => s.id === stepId)?.required ?? false;
}

export function canSkipStep(stepId: string): boolean {
 return !isStepRequired(stepId);
}
