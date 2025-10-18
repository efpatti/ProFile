// src/infrastructure/persistence/prisma/repositories/PrismaUserRepository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserPreferences {
 palette?: string | null;
 bannerColor?: string | null;
 displayName?: string | null;
 photoURL?: string | null;
}

export class PrismaUserRepository {
 async getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const user = await prisma.user.findUnique({
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
  await prisma.user.update({
   where: { id: userId },
   data: preferences,
  });
 }

 async updatePalette(userId: string, palette: string): Promise<void> {
  await prisma.user.update({
   where: { id: userId },
   data: { palette },
  });
 }

 async updateBannerColor(userId: string, bannerColor: string): Promise<void> {
  await prisma.user.update({
   where: { id: userId },
   data: { bannerColor },
  });
 }

 async getUser(userId: string) {
  return await prisma.user.findUnique({
   where: { id: userId },
  });
 }
}

export const userRepository = new PrismaUserRepository();
