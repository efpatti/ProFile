/**
 * Sign Up API Route
 * Uncle Bob: "Functions should do one thing"
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
 try {
  const { email, password } = await request.json();

  // Validate input
  if (!email || !password) {
   return NextResponse.json(
    { error: "Email and password are required" },
    { status: 400 }
   );
  }

  if (password.length < 8) {
   return NextResponse.json(
    { error: "Password must be at least 8 characters" },
    { status: 400 }
   );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
   where: { email },
  });

  if (existingUser) {
   return NextResponse.json(
    { error: "User with this email already exists" },
    { status: 409 }
   );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
   data: {
    email,
    name: email.split("@")[0], // Use email prefix as initial name
    password: hashedPassword,
   },
  });

  return NextResponse.json(
   {
    success: true,
    user: {
     id: user.id,
     email: user.email,
    },
   },
   { status: 201 }
  );
 } catch (error) {
  console.error("Signup error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 }
}
