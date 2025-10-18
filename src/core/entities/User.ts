import { z } from "zod";

// ==================== SCHEMA ====================

export const UserSchema = z.object({
 id: z.string(),
 email: z.string().email(),
 displayName: z.string().min(3),
 photoURL: z.string().url().optional(),

 // Metadata
 createdAt: z.date(),
 lastLoginAt: z.date(),

 // Preferences
 defaultResumeId: z.string().uuid().optional(),
 preferences: z
  .object({
   emailNotifications: z.boolean().default(true),
   theme: z.enum(["light", "dark", "system"]).default("system"),
  })
  .default({
   emailNotifications: true,
   theme: "system",
  }),
});

export type User = z.infer<typeof UserSchema>;

// ==================== ENTITY CLASS ====================

export class UserEntity {
 private constructor(private readonly data: User) {}

 static create(
  id: string,
  email: string,
  displayName: string,
  photoURL?: string
 ): UserEntity {
  const now = new Date();
  const user = UserSchema.parse({
   id,
   email,
   displayName,
   photoURL,
   createdAt: now,
   lastLoginAt: now,
   preferences: {
    emailNotifications: true,
    theme: "system",
   },
  });
  return new UserEntity(user);
 }

 static fromData(data: User): UserEntity {
  const user = UserSchema.parse(data);
  return new UserEntity(user);
 }

 // ==================== GETTERS ====================

 get id(): string {
  return this.data.id;
 }

 get email(): string {
  return this.data.email;
 }

 get displayName(): string {
  return this.data.displayName;
 }

 toJSON(): User {
  return { ...this.data };
 }

 // ==================== MUTATIONS ====================

 updateLastLogin(): UserEntity {
  return new UserEntity({
   ...this.data,
   lastLoginAt: new Date(),
  });
 }

 setDefaultResume(resumeId: string): UserEntity {
  return new UserEntity({
   ...this.data,
   defaultResumeId: resumeId,
  });
 }
}
