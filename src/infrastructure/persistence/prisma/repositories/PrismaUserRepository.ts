// src/infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
import type {
 IUserRepository,
 UserPreferences,
} from "@/core/interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
 constructor(private readonly db = prisma) {}

 async getUser(userId: string): Promise<User | null> {
  return await this.db.user.findUnique({
   where: { id: userId },
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

 async updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
 ): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: preferences,
  });
 }

 async updatePalette(userId: string, palette: string): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: { palette },
  });
 }

 async updateBannerColor(userId: string, bannerColor: string): Promise<void> {
  await this.db.user.update({
   where: { id: userId },
   data: { bannerColor },
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
