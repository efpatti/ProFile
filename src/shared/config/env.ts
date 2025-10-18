import { z } from "zod";

// Centralized runtime env validation (PostgreSQL + NextAuth only)
const envSchema = z.object({
 DATABASE_URL: z.string().url().optional(), // Server-side only
 NEXTAUTH_URL: z.string().url().optional(),
 NEXTAUTH_SECRET: z.string().min(1).optional(),
});

export const env = envSchema.parse({
 DATABASE_URL: process.env.DATABASE_URL,
 NEXTAUTH_URL: process.env.NEXTAUTH_URL,
 NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
});

export type AppEnv = typeof env;
