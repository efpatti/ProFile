import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
 try {
  // Check database connection
  await prisma.$queryRaw`SELECT 1`;

  return NextResponse.json({
   status: "ok",
   timestamp: new Date().toISOString(),
   services: {
    database: "healthy",
    app: "healthy",
   },
  });
 } catch (error) {
  return NextResponse.json(
   {
    status: "error",
    timestamp: new Date().toISOString(),
    services: {
     database: "unhealthy",
     app: "degraded",
    },
    error: error instanceof Error ? error.message : "Unknown error",
   },
   { status: 503 }
  );
 } finally {
  await prisma.$disconnect();
 }
}
