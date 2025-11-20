/**
 * Sign Up API Route
 * Uncle Bob: "Functions should do one thing"
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
 email: z.string().email("Invalid email format"),
 password: z.string().min(8, "Password must be at least 8 characters"),
 name: z.string().optional(),
});

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  console.log("[SIGNUP] Received request:", { email: body.email });

  // Validate input with Zod
  const validation = signupSchema.safeParse(body);
  if (!validation.success) {
   console.error("[SIGNUP] Validation error:", validation.error.errors);
   return NextResponse.json(
    { error: validation.error.errors[0].message },
    { status: 400 }
   );
  }

  const { email, password, name } = validation.data;

  // Check if user already exists
  console.log("[SIGNUP] Checking if user exists:", email);
  const existingUser = await prisma.user.findUnique({
   where: { email },
  });

  if (existingUser) {
   console.log("[SIGNUP] User already exists:", email);
   return NextResponse.json(
    { error: "User with this email already exists" },
    { status: 409 }
   );
  }

  // Hash password
  console.log("[SIGNUP] Hashing password...");
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  console.log("[SIGNUP] Creating user:", email);
  const user = await prisma.user.create({
   data: {
    email,
    name: name || email.split("@")[0],
    password: hashedPassword,
    hasCompletedOnboarding: false,
   },
  });

  console.log("[SIGNUP] User created successfully:", user.id);

  return NextResponse.json(
   {
    success: true,
    user: {
     id: user.id,
     email: user.email,
     name: user.name,
    },
   },
   { status: 201 }
  );
 } catch (error) {
  console.error("[SIGNUP] Error:", error);

  // Check for specific Prisma errors
  if (error instanceof Error) {
   if (error.message.includes("Unique constraint")) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
   }
  }

  return NextResponse.json(
   {
    error: "Internal server error",
    details: error instanceof Error ? error.message : "Unknown error",
   },
   { status: 500 }
  );
 }
}
