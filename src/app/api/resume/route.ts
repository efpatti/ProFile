import { NextResponse } from "next/server";
import { FirebaseResumeRepository } from "@/infrastructure/repositories/FirebaseResumeRepository";
import { CreateResumeUseCase } from "@/core/use-cases/CreateResume";

const repository = new FirebaseResumeRepository();

/**
 * API Route: Criar Currículo
 * POST /api/resume
 */
export async function POST(request: Request) {
 try {
  const data = await request.json();

  // TODO: Pegar userId do contexto de autenticação
  const userId = "mock-user-id"; // Substituir por auth real

  const useCase = new CreateResumeUseCase(repository);
  const resume = await useCase.execute({
   ...data,
   userId,
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

/**
 * API Route: Listar Currículos do Usuário
 * GET /api/resume
 */
export async function GET() {
 try {
  // TODO: Pegar userId do contexto de autenticação
  const userId = "mock-user-id";

  const resumes = await repository.findByUserId(userId);

  return NextResponse.json(resumes);
 } catch (error) {
  console.error("Erro ao listar currículos:", error);
  return NextResponse.json(
   { error: "Erro ao listar currículos" },
   { status: 500 }
  );
 }
}
