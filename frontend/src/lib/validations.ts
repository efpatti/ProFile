/**
 * Zod Validation Schemas
 * Centralized input validation for APIs (SOLID - Input Validation)
 */

import { z } from "zod";
import { STRING_LENGTH, REGEX, DATE } from "@/constants/validation";

// ==================== COMMON SCHEMAS ====================

export const emailSchema = z
 .string()
 .email("Email inválido")
 .max(
  STRING_LENGTH.MAX.EMAIL,
  `Email deve ter no máximo ${STRING_LENGTH.MAX.EMAIL} caracteres`
 );

export const urlSchema = z
 .string()
 .url("URL inválida")
 .max(
  STRING_LENGTH.MAX.URL,
  `URL deve ter no máximo ${STRING_LENGTH.MAX.URL} caracteres`
 )
 .optional()
 .or(z.literal(""));

export const usernameSchema = z
 .string()
 .min(
  STRING_LENGTH.MIN.USERNAME,
  `Username deve ter no mínimo ${STRING_LENGTH.MIN.USERNAME} caracteres`
 )
 .max(
  STRING_LENGTH.MAX.USERNAME,
  `Username deve ter no máximo ${STRING_LENGTH.MAX.USERNAME} caracteres`
 )
 .regex(REGEX.USERNAME, "Username deve conter apenas letras, números, _ e -");

export const nameSchema = z
 .string()
 .min(
  STRING_LENGTH.MIN.NAME,
  `Nome deve ter no mínimo ${STRING_LENGTH.MIN.NAME} caracteres`
 )
 .max(
  STRING_LENGTH.MAX.NAME,
  `Nome deve ter no máximo ${STRING_LENGTH.MAX.NAME} caracteres`
 );

export const phoneSchema = z
 .string()
 .regex(REGEX.PHONE, "Telefone inválido")
 .optional()
 .or(z.literal(""));

export const dateSchema = z
 .string()
 .refine(
  (date) => {
   const year = new Date(date).getFullYear();
   return year >= DATE.MIN_YEAR && year <= DATE.MAX_YEAR;
  },
  {
   message: `Data deve estar entre ${DATE.MIN_YEAR} e ${DATE.MAX_YEAR}`,
  }
 )
 .optional();

// ==================== USER SCHEMAS ====================

export const userPreferencesSchema = z.object({
 palette: z.string().optional().nullable(),
 bannerColor: z.string().optional().nullable(),
 displayName: z.string().max(STRING_LENGTH.MAX.NAME).optional().nullable(),
 photoURL: urlSchema.nullable(),
});

export const updateUserSchema = z.object({
 email: emailSchema.optional(),
 displayName: nameSchema.optional(),
 photoURL: urlSchema.nullable(),
});

// ==================== PROFILE SCHEMAS ====================

export const profileSchema = z.object({
 bio: z
  .string()
  .max(
   STRING_LENGTH.MAX.BIO,
   `Bio deve ter no máximo ${STRING_LENGTH.MAX.BIO} caracteres`
  )
  .optional()
  .nullable(),
 location: z.string().max(STRING_LENGTH.MAX.NAME).optional().nullable(),
 phone: phoneSchema.nullable(),
 website: urlSchema.nullable(),
 linkedin: urlSchema.nullable(),
 github: urlSchema.nullable(),
});

// ==================== HEADER SCHEMAS ====================

export const headerSchema = z.object({
 title: z
  .string()
  .max(
   STRING_LENGTH.MAX.TITLE,
   `Título deve ter no máximo ${STRING_LENGTH.MAX.TITLE} caracteres`
  )
  .optional()
  .nullable(),
 email: emailSchema.optional().nullable(),
});

// ==================== EXPERIENCE SCHEMAS ====================

export const experienceSchema = z.object({
 company: z
  .string()
  .max(
   STRING_LENGTH.MAX.NAME,
   `Empresa deve ter no máximo ${STRING_LENGTH.MAX.NAME} caracteres`
  ),
 role: z
  .string()
  .max(
   STRING_LENGTH.MAX.TITLE,
   `Cargo deve ter no máximo ${STRING_LENGTH.MAX.TITLE} caracteres`
  ),
 description: z
  .string()
  .max(
   STRING_LENGTH.MAX.DESCRIPTION,
   `Descrição deve ter no máximo ${STRING_LENGTH.MAX.DESCRIPTION} caracteres`
  )
  .optional()
  .nullable(),
 startDate: dateSchema,
 endDate: dateSchema.nullable(),
 isCurrentJob: z.boolean().default(false),
 technologies: z.array(z.string()).default([]),
});

export const updateExperienceSchema = experienceSchema.partial();

// ==================== EDUCATION SCHEMAS ====================

export const educationSchema = z.object({
 institution: z.string().max(STRING_LENGTH.MAX.NAME),
 degree: z.string().max(STRING_LENGTH.MAX.TITLE),
 field: z.string().max(STRING_LENGTH.MAX.TITLE),
 startDate: dateSchema,
 endDate: dateSchema.nullable(),
 description: z
  .string()
  .max(STRING_LENGTH.MAX.DESCRIPTION)
  .optional()
  .nullable(),
});

export const updateEducationSchema = educationSchema.partial();

// ==================== PROJECT SCHEMAS ====================

export const projectSchema = z.object({
 name: z.string().max(STRING_LENGTH.MAX.TITLE),
 description: z.string().max(STRING_LENGTH.MAX.DESCRIPTION),
 url: urlSchema.nullable(),
 technologies: z.array(z.string()).default([]),
});

export const updateProjectSchema = projectSchema.partial();

// ==================== CERTIFICATION SCHEMAS ====================

export const certificationSchema = z.object({
 name: z.string().max(STRING_LENGTH.MAX.TITLE),
 issuer: z.string().max(STRING_LENGTH.MAX.NAME),
 date: z.string().optional().nullable(),
 url: urlSchema.nullable(),
});

export const updateCertificationSchema = certificationSchema.partial();

// ==================== AWARD SCHEMAS ====================

export const awardSchema = z.object({
 title: z.string().max(STRING_LENGTH.MAX.TITLE),
 issuer: z.string().max(STRING_LENGTH.MAX.NAME),
 date: z.string().optional().nullable(),
 description: z
  .string()
  .max(STRING_LENGTH.MAX.DESCRIPTION)
  .optional()
  .nullable(),
});

export const updateAwardSchema = awardSchema.partial();

// ==================== RECOMMENDATION SCHEMAS ====================

export const recommendationSchema = z.object({
 recommenderName: z.string().max(STRING_LENGTH.MAX.NAME),
 relationship: z.string().max(STRING_LENGTH.MAX.TITLE),
 text: z.string().max(STRING_LENGTH.MAX.DESCRIPTION),
 date: z.string().optional().nullable(),
});

export const updateRecommendationSchema = recommendationSchema.partial();

// ==================== RESUME SCHEMAS ====================

export const resumeSchema = z.object({
 userId: z.string().uuid("ID de usuário inválido"),
 header: headerSchema.optional(),
 profile: profileSchema.optional(),
 experiences: z.array(experienceSchema).optional(),
 education: z.array(educationSchema).optional(),
 projects: z.array(projectSchema).optional(),
 certifications: z.array(certificationSchema).optional(),
 awards: z.array(awardSchema).optional(),
 recommendations: z.array(recommendationSchema).optional(),
});

export const updateResumeSchema = resumeSchema.partial();

// ==================== EXPORT SCHEMAS ====================

export const exportBannerSchema = z.object({
 palette: z.string().optional(),
 logoUrl: urlSchema,
});

export const exportResumeSchema = z.object({
 palette: z.string().optional(),
 lang: z.enum(["pt-br", "en"]).optional(),
 bannerColor: z.string().optional(),
 userId: z.string().uuid().optional(),
});

// ==================== ID PARAMS ====================

export const idParamSchema = z.object({
 id: z.string().uuid("ID inválido"),
});

export const usernameParamSchema = z.object({
 username: usernameSchema,
});
