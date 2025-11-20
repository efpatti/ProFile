// src/infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts
import { prisma } from "@/lib/db";
import type { User, UserPreferences as PrismaUserPreferences } from "@prisma/client";
import type {
 IUserRepository,
 UserPreferences,
 UserProfile,
} from "@/core/interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
 constructor(private readonly db = prisma) {}

 async getUser(userId: string): Promise<User | null> {
  return await this.db.user.findUnique({
   where: { id: userId },
  });
 }

 async getUserWithPreferences(userId: string): Promise<(User & { preferences: PrismaUserPreferences | null }) | null> {
  return await this.db.user.findUnique({
   where: { id: userId },
   include: {
    preferences: true,
   },
  });
 }

 async getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await this.db.user.findUnique({
   where: { id: userId },
   select: {
    displayName: true,
    photoURL: true,
    bio: true,
    location: true,
    phone: true,
    website: true,
    linkedin: true,
    github: true,
   },
  });

  return user;
 }

 async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<User> {
  return await this.db.user.update({
   where: { id: userId },
   data: profile,
  });
 }

 async getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const user = await this.db.user.findUnique({
   where: { id: userId },
   select: {
    palette: true,
    bannerColor: true,
    displayName: true,
    photoURL: true,
   },
  });

  return user;
 }

 async getFullUserPreferences(userId: string): Promise<PrismaUserPreferences | null> {
  return await this.db.userPreferences.findUnique({
   where: { userId },
  });
 }

 async updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
 ): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: preferences,
  });
 }

 async upsertFullUserPreferences(
  userId: string,
  preferences: Partial<Omit<PrismaUserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
 ): Promise<PrismaUserPreferences> {
  return await this.db.userPreferences.upsert({
   where: { userId },
   create: {
    userId,
    ...preferences,
   },
   update: preferences,
  });
 }

 async updatePalette(userId: string, palette: string): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: { palette },
  });

  // Also update in preferences table
  await this.db.userPreferences.upsert({
   where: { userId },
   create: { userId, palette },
   update: { palette },
  });
 }

 async updateBannerColor(userId: string, bannerColor: string): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: { bannerColor },
  });

  // Also update in preferences table
  await this.db.userPreferences.upsert({
   where: { userId },
   create: { userId, bannerColor },
   update: { bannerColor },
  });
 }

 async createUser(userData: {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
 }): Promise<User> {
  return await this.db.user.create({
   data: userData,
  });
 }

 async updateUser(userId: string, userData: Partial<User>): Promise<User> {
  return await this.db.user.update({
   where: { id: userId },
   data: userData,
  });
 }

 async deleteUser(userId: string): Promise<void> {
  await this.db.user.delete({
   where: { id: userId },
  });
 }
}

// Singleton instance para uso direto (pode ser substituído por DI)
export const userRepository = new PrismaUserRepository();
