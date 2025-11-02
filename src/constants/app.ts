/**
 * Application Constants - Centralized Configuration
 * Routes, Messages, and other app-wide constants
 */

// ==================== ROUTE PATHS (Legacy compatibility) ====================
export const HOME_PATH = "/";
export const AUTH_PATH = "/auth";
export const LOGIN_PATH = `${AUTH_PATH}/sign-in`;
export const REGISTER_PATH = `${AUTH_PATH}/sign-up`;
export const PROTECTED_PATH = "/protected";
export const PROFILE_PATH = `${PROTECTED_PATH}/profile`;
export const BANNER_PATH = `${PROTECTED_PATH}/banner`;
export const RESUME_PATH = `${PROTECTED_PATH}/resume`;
export const CONTACT_PATH = "/contact";

// ==================== ROUTES (New structure) ====================
export const ROUTES = {
 PUBLIC: {
  HOME: HOME_PATH,
  PROFILE: (username: string) => `/${username}`,
  SIGN_IN: LOGIN_PATH,
  SIGN_UP: REGISTER_PATH,
  CONTACT: CONTACT_PATH,
 },
 PROTECTED: {
  BANNER: BANNER_PATH,
  RESUME: RESUME_PATH,
  PROFILE: PROFILE_PATH,
  ONBOARDING: "/onboarding",
 },
 API: {
  HEALTH: "/api/health",
  RESUME: "/api/resume",
  RESUME_EXPORT: "/api/resume/export",
  USER_PREFERENCES: "/api/user/preferences",
  BRAND_SEARCH: "/api/brand-search",
  DOWNLOAD_BANNER: "/api/download-banner",
  DOWNLOAD_RESUME: "/api/download-resume",
  EXPORT_BANNER: "/api/export/banner",
  EXPORT_RESUME: "/api/export/resume",
 },
 EXPORT: {
  BANNER: "/export/banner",
 },
} as const;

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGE = {
 GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
 NETWORK: "Erro de conexão. Verifique sua internet.",
 UNAUTHORIZED: "Você precisa estar autenticado.",
 FORBIDDEN: "Você não tem permissão para esta ação.",
 NOT_FOUND: "Recurso não encontrado.",
 VALIDATION: "Dados inválidos. Verifique os campos.",
 RATE_LIMIT: "Muitas requisições. Aguarde alguns minutos.",
 FILE_TOO_LARGE: "Arquivo muito grande. Tamanho máximo: 5MB.",
 INVALID_FORMAT: "Formato de arquivo inválido.",
} as const;

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGE = {
 SAVED: "Salvo com sucesso!",
 UPDATED: "Atualizado com sucesso!",
 DELETED: "Deletado com sucesso!",
 CREATED: "Criado com sucesso!",
 EXPORTED: "Exportado com sucesso!",
} as const;

// ==================== FEATURE FLAGS ====================
export const FEATURE_FLAG = {
 ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
 ENABLE_DEBUG: process.env.NODE_ENV === "development",
 ENABLE_RATE_LIMIT: process.env.ENABLE_RATE_LIMIT !== "false",
 ENABLE_CACHE: process.env.ENABLE_CACHE !== "false",
} as const;

// ==================== ENVIRONMENT ====================
export const ENV = {
 IS_PRODUCTION: process.env.NODE_ENV === "production",
 IS_DEVELOPMENT: process.env.NODE_ENV === "development",
 IS_TEST: process.env.NODE_ENV === "test",
} as const;

// ==================== LOCAL STORAGE KEYS ====================
export const STORAGE_KEY = {
 AUTH_TOKEN: "auth_token",
 USER_PREFERENCES: "user_preferences",
 THEME: "theme",
 LANGUAGE: "language",
 PALETTE: "palette",
 BANNER_COLOR: "banner_color",
} as const;

// ==================== COOKIE NAMES ====================
export const COOKIE_NAME = {
 SESSION: "session",
 CSRF_TOKEN: "csrf_token",
} as const;
