/**
 * Settings Types & Validation Schemas
 * Comprehensive type definitions for user settings and preferences
 */

import { z } from "zod";

// ============================================================================
// Profile Settings
// ============================================================================

export const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be less than 100 characters")
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .nullable(),
  website: z
    .string()
    .url("Must be a valid URL")
    .max(2048, "URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Must be a valid URL")
    .max(2048, "URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  github: z
    .string()
    .url("Must be a valid URL")
    .max(2048, "URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),
  photoURL: z
    .string()
    .url("Must be a valid URL")
    .max(2048, "URL too long")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;

// ============================================================================
// Appearance Preferences
// ============================================================================

export const themeSchema = z.enum(["light", "dark", "auto"]);
export const paletteSchema = z.enum([
  "ocean",
  "forest",
  "sunset",
  "lavender",
  "slate",
  "emerald",
]);

export const appearancePreferencesSchema = z.object({
  theme: themeSchema.default("dark"),
  palette: paletteSchema.default("ocean"),
  bannerColor: z.string().optional().nullable(),
});

export type Theme = z.infer<typeof themeSchema>;
export type Palette = z.infer<typeof paletteSchema>;
export type AppearancePreferences = z.infer<typeof appearancePreferencesSchema>;

// ============================================================================
// Localization Preferences
// ============================================================================

export const languageSchema = z.enum(["en", "pt-br", "es"]);
export const dateFormatSchema = z.enum([
  "MM/DD/YYYY",
  "DD/MM/YYYY",
  "YYYY-MM-DD",
]);

export const localizationPreferencesSchema = z.object({
  language: languageSchema.default("en"),
  dateFormat: dateFormatSchema.default("MM/DD/YYYY"),
  timezone: z.string().default("UTC"),
});

export type Language = z.infer<typeof languageSchema>;
export type DateFormat = z.infer<typeof dateFormatSchema>;
export type LocalizationPreferences = z.infer<
  typeof localizationPreferencesSchema
>;

// ============================================================================
// Notification Preferences
// ============================================================================

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  resumeExpiryAlerts: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
});

export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSchema
>;

// ============================================================================
// Privacy Preferences
// ============================================================================

export const profileVisibilitySchema = z.enum(["public", "private", "unlisted"]);

export const privacyPreferencesSchema = z.object({
  profileVisibility: profileVisibilitySchema.default("private"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowSearchEngineIndex: z.boolean().default(false),
});

export type ProfileVisibility = z.infer<typeof profileVisibilitySchema>;
export type PrivacyPreferences = z.infer<typeof privacyPreferencesSchema>;

// ============================================================================
// Export Preferences
// ============================================================================

export const exportFormatSchema = z.enum(["pdf", "docx", "json"]);

export const exportPreferencesSchema = z.object({
  defaultExportFormat: exportFormatSchema.default("pdf"),
  includePhotoInExport: z.boolean().default(true),
});

export type ExportFormat = z.infer<typeof exportFormatSchema>;
export type ExportPreferences = z.infer<typeof exportPreferencesSchema>;

// ============================================================================
// Combined User Preferences
// ============================================================================

export const userPreferencesSchema = z.object({
  // Appearance
  theme: themeSchema.default("dark"),
  palette: paletteSchema.default("ocean"),
  bannerColor: z.string().optional().nullable(),

  // Localization
  language: languageSchema.default("en"),
  dateFormat: dateFormatSchema.default("MM/DD/YYYY"),
  timezone: z.string().default("UTC"),

  // Notifications
  emailNotifications: z.boolean().default(true),
  resumeExpiryAlerts: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),

  // Privacy
  profileVisibility: profileVisibilitySchema.default("private"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowSearchEngineIndex: z.boolean().default(false),

  // Export
  defaultExportFormat: exportFormatSchema.default("pdf"),
  includePhotoInExport: z.boolean().default(true),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// ============================================================================
// Account Settings
// ============================================================================

export const accountSettingsSchema = z.object({
  email: z.string().email("Must be a valid email").optional(),
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    // If newPassword is provided, confirmPassword must match
    if (data.newPassword) {
      return data.newPassword === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type AccountSettings = z.infer<typeof accountSettingsSchema>;

// ============================================================================
// Constants
// ============================================================================

export const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "auto", label: "Auto", icon: "💻" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "pt-br", label: "Português (BR)", flag: "🇧🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
] as const;

export const DATE_FORMAT_OPTIONS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)", example: "12/31/2024" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)", example: "31/12/2024" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)", example: "2024-12-31" },
] as const;

export const EXPORT_FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "docx", label: "Word Document", icon: "📝" },
  { value: "json", label: "JSON", icon: "📋" },
] as const;

export const PROFILE_VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can view your profile",
    icon: "🌍",
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can view your profile",
    icon: "🔒",
  },
  {
    value: "unlisted",
    label: "Unlisted",
    description: "Only people with the link can view",
    icon: "🔗",
  },
] as const;

export const PALETTE_OPTIONS = [
  { id: "ocean", name: "Ocean Blue", colors: ["#0891B2", "#06B6D4", "#22D3EE"] },
  {
    id: "forest",
    name: "Forest Green",
    colors: ["#059669", "#10B981", "#34D399"],
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    colors: ["#DC2626", "#F59E0B", "#FBBF24"],
  },
  {
    id: "lavender",
    name: "Lavender Purple",
    colors: ["#7C3AED", "#A78BFA", "#C4B5FD"],
  },
  {
    id: "slate",
    name: "Professional Slate",
    colors: ["#475569", "#64748B", "#94A3B8"],
  },
  {
    id: "emerald",
    name: "Emerald Mint",
    colors: ["#047857", "#059669", "#10B981"],
  },
] as const;
