import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient instance
 * Prevents multiple database connections in serverless environments
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
const globalForPrisma = globalThis as unknown as {
 prisma: PrismaClient | undefined;
};

export const prisma =
 globalForPrisma.prisma ??
 new PrismaClient({
  log:
   process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"],
  errorFormat: "pretty",
 });

if (process.env.NODE_ENV !== "production") {
 globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === "undefined") {
 process.on("beforeExit", async () => {
  await prisma.$disconnect();
 });
}
