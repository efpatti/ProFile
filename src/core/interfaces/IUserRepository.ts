import type { User } from "@prisma/client";

/**
 * Repository Pattern para Usuários
 * Abstração da camada de dados (SOLID - Dependency Inversion Principle)
 */

export interface UserPreferences {
 palette?: string | null;
 bannerColor?: string | null;
 displayName?: string | null;
 photoURL?: string | null;
}

export interface IUserRepository {
 /**
  * Busca usuário por ID
  */
 getUser(userId: string): Promise<User | null>;

 /**
  * Busca preferências do usuário
  */
 getUserPreferences(userId: string): Promise<UserPreferences | null>;

 /**
  * Atualiza preferências do usuário
  */
 updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
 ): Promise<void>;

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
