// src/app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userRepository } from "@/infrastructure/persistence/prisma/repositories/PrismaUserRepository";

export async function GET(request: NextRequest) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await userRepository.getUserPreferences(session.user.id);

  return NextResponse.json(preferences || {});
 } catch (error) {
  console.error("Error fetching user preferences:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}

export async function PATCH(request: NextRequest) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  await userRepository.updateUserPreferences(session.user.id, body);

  return NextResponse.json({ success: true });
 } catch (error) {
  console.error("Error updating user preferences:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}
