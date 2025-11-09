import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const resume = await prisma.resume.create({
   data: {
    userId: session.user.id,
    ...data,
   },
  });

  return NextResponse.json(resume, { status: 201 });
 } catch (error) {
  console.error("Erro ao criar currículo:", error);
  return NextResponse.json(
   {
    error: error instanceof Error ? error.message : "Erro ao criar currículo",
   },
   { status: 400 }
  );
 }
}
export async function GET() {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
   where: { userId: session.user.id },
   orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resumes);
 } catch (error) {
  console.error("Erro ao listar currículos:", error);
  return NextResponse.json(
   { error: "Erro ao listar currículos" },
   { status: 500 }
  );
 }
}
