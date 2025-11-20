import { z } from "zod";

const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
const MINIMUM_NAME_LENGTH = 3;
const MINIMUM_HEADLINE_LENGTH = 10;
const MINIMUM_SUMMARY_LENGTH = 50;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;

const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;
const USERNAME_PATTERN = /^[a-z0-9_-]+$/i;

type ProficiencyLevel =
 | "básico"
 | "intermediário"
 | "avançado"
 | "fluente"
 | "nativo";
type ResumeTemplateType = "classic" | "modern" | "creative";

export const ExperienceSchema = z.object({
 id: z.string().uuid(),
 company: z.string().min(1),
 role: z.string().min(1),
 startDate: z.string(),
 endDate: z.string().nullable(),
 isCurrentJob: z.boolean().default(false),
 description: z.string().optional(),
 technologies: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
 id: z.string().uuid(),
 institution: z.string().min(1),
 degree: z.string().min(1),
 field: z.string().min(1),
 startDate: z.string(),
 endDate: z.string().nullable(),
 isOngoing: z.boolean().default(false),
});

export const SkillCategorySchema = z.object({
 id: z.string().uuid(),
 name: z.string(),
 skills: z.array(z.string()),
});

export const LanguageSchema = z.object({
 id: z.string().uuid(),
 language: z.string(),
 proficiency: z.enum([
  "básico",
  "intermediário",
  "avançado",
  "fluente",
  "nativo",
 ]),
});

export const ResumeTemplateSchema = z.enum(["classic", "modern", "creative"]);

const ColorSchemeSchema = z
 .object({
  primary: z.string().regex(HEX_COLOR_PATTERN),
  secondary: z.string().regex(HEX_COLOR_PATTERN),
  accent: z.string().regex(HEX_COLOR_PATTERN),
 })
 .default({
  primary: "#1E40AF",
  secondary: "#475569",
  accent: "#3B82F6",
 });

export const ResumeSchema = z.object({
 id: z.string().uuid(),
 userId: z.string(),
 username: z
  .string()
  .min(USERNAME_MIN_LENGTH)
  .max(USERNAME_MAX_LENGTH)
  .regex(USERNAME_PATTERN),
 fullName: z.string().min(MINIMUM_NAME_LENGTH),
 email: z.string().email(),
 phone: z.string().optional(),
 location: z.string().optional(),
 website: z.string().url().optional().or(z.literal("")),
 linkedIn: z.string().url().optional().or(z.literal("")),
 github: z.string().url().optional().or(z.literal("")),
 headline: z.string().min(MINIMUM_HEADLINE_LENGTH),
 summary: z.string().min(MINIMUM_SUMMARY_LENGTH),
 experiences: z.array(ExperienceSchema).min(1),
 education: z.array(EducationSchema).min(1),
 skills: z.array(SkillCategorySchema).default([]),
 languages: z.array(LanguageSchema).default([]),
 template: ResumeTemplateSchema.default("modern"),
 colorScheme: ColorSchemeSchema,
 linkedInBannerUrl: z.string().url().optional(),
 isPublic: z.boolean().default(false),
 isOnboardingComplete: z.boolean().default(false),
 createdAt: z.date(),
 updatedAt: z.date(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ResumeTemplate = z.infer<typeof ResumeTemplateSchema>;
export type Resume = z.infer<typeof ResumeSchema>;

export class ResumeEntity {
 private constructor(private readonly data: Resume) {}

 static create(
  data: Omit<Resume, "id" | "createdAt" | "updatedAt">
 ): ResumeEntity {
  const now = new Date();
  const resume = ResumeSchema.parse({
   ...data,
   id: crypto.randomUUID(),
   createdAt: now,
   updatedAt: now,
  });
  return new ResumeEntity(resume);
 }

 static fromData(data: Resume): ResumeEntity {
  return new ResumeEntity(ResumeSchema.parse(data));
 }

 private hasMinimumExperience(): boolean {
  return this.data.experiences.length > 0;
 }

 private hasMinimumEducation(): boolean {
  return this.data.education.length > 0;
 }

 private hasSufficientSummary(): boolean {
  return this.data.summary.length >= MINIMUM_SUMMARY_LENGTH;
 }

 private hasSufficientHeadline(): boolean {
  return this.data.headline.length >= MINIMUM_HEADLINE_LENGTH;
 }

 isComplete(): boolean {
  return (
   this.hasMinimumExperience() &&
   this.hasMinimumEducation() &&
   this.hasSufficientSummary() &&
   this.hasSufficientHeadline()
  );
 }

 canBePublished(): boolean {
  return this.isComplete() && this.data.isOnboardingComplete;
 }

 hasLinkedInBanner(): boolean {
  return !!this.data.linkedInBannerUrl;
 }

 getPublicUrl(baseUrl: string): string {
  return `${baseUrl}/${this.data.username}`;
 }

 private calculateExperienceDurationInYears(experience: Experience): number {
  const endDate = experience.endDate
   ? new Date(experience.endDate)
   : new Date();
  const startDate = new Date(experience.startDate);
  return (endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_YEAR;
 }

 getTotalExperienceYears(): number {
  return this.data.experiences.reduce(
   (total, exp) => total + this.calculateExperienceDurationInYears(exp),
   0
  );
 }

 get id(): string {
  return this.data.id;
 }

 get userId(): string {
  return this.data.userId;
 }

 get username(): string {
  return this.data.username;
 }

 get fullName(): string {
  return this.data.fullName;
 }

 get template(): ResumeTemplate {
  return this.data.template;
 }

 toJSON(): Resume {
  return { ...this.data };
 }

 update(
  updates: Partial<Omit<Resume, "id" | "userId" | "createdAt">>
 ): ResumeEntity {
  const updatedData = ResumeSchema.parse({
   ...this.data,
   ...updates,
   updatedAt: new Date(),
  });
  return new ResumeEntity(updatedData);
 }

 publish(): ResumeEntity {
  return this.update({ isPublic: true });
 }

 unpublish(): ResumeEntity {
  return this.update({ isPublic: false });
 }

 completeOnboarding(): ResumeEntity {
  return this.update({ isOnboardingComplete: true });
 }

 setLinkedInBanner(url: string): ResumeEntity {
  return this.update({ linkedInBannerUrl: url });
 }
}
