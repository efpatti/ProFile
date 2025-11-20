import type { User, UserPreferences as PrismaUserPreferences } from "@prisma/client";

/**
 * Repository Pattern para Usuários
 * Abstração da camada de dados (SOLID - Dependency Inversion Principle)
 */

// Legacy interface - kept for backward compatibility
export interface UserPreferences {
 palette?: string | null;
 bannerColor?: string | null;
 displayName?: string | null;
 photoURL?: string | null;
}

// Profile data interface
export interface UserProfile {
 displayName?: string | null;
 photoURL?: string | null;
 bio?: string | null;
 location?: string | null;
 phone?: string | null;
 website?: string | null;
 linkedin?: string | null;
 github?: string | null;
}

export interface IUserRepository {
 /**
  * Busca usuário por ID
  */
 getUser(userId: string): Promise<User | null>;

 /**
  * Busca usuário com suas preferências
  */
 getUserWithPreferences(userId: string): Promise<(User & { preferences: PrismaUserPreferences | null }) | null>;

 /**
  * Busca perfil do usuário
  */
 getUserProfile(userId: string): Promise<UserProfile | null>;

 /**
  * Atualiza perfil do usuário
  */
 updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<User>;

 /**
  * Busca preferências do usuário (legacy)
  */
 getUserPreferences(userId: string): Promise<UserPreferences | null>;

 /**
  * Busca todas as preferências do usuário
  */
 getFullUserPreferences(userId: string): Promise<PrismaUserPreferences | null>;

 /**
  * Atualiza preferências do usuário (legacy)
  */
 updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
 ): Promise<void>;

 /**
  * Atualiza ou cria preferências completas do usuário
  */
 upsertFullUserPreferences(
  userId: string,
  preferences: Partial<Omit<PrismaUserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
 ): Promise<PrismaUserPreferences>;

 /**
  * Atualiza paleta de cores
  */
 updatePalette(userId: string, palette: string): Promise<void>;

 /**
  * Atualiza cor do banner
  */
 updateBannerColor(userId: string, bannerColor: string): Promise<void>;

 /**
  * Cria novo usuário
  */
 createUser(userData: {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
 }): Promise<User>;

 /**
  * Atualiza dados do usuário
  */
 updateUser(userId: string, userData: Partial<User>): Promise<User>;

 /**
  * Deleta usuário
  */
 deleteUser(userId: string): Promise<void>;
}
