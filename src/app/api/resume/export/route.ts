import { NextResponse } from "next/server";
// TODO: Migrate to new SOLID structure
// import { FirebaseResumeRepository } from "@/infrastructure/repositories/FirebaseResumeRepository";
// import { ExportResumeUseCase } from "@/core/use-cases/ExportResume";
// import { PDFExportService, DOCXExportService } from "@/infrastructure/services";

// const resumeRepository = new FirebaseResumeRepository();
// const pdfService = new PDFExportService();
// const docxService = new DOCXExportService();

/**
 * API Route: Exportar Currículo
 * POST /api/resume/export
 *
 * Body: { resumeId: string, format: 'pdf' | 'docx' }
 */
export async function POST(request: Request) {
 try {
  const { resumeId, format } = await request.json();

  // Validações básicas
  if (!resumeId || !format) {
   return NextResponse.json(
    { error: "resumeId e format são obrigatórios" },
    { status: 400 }
   );
  }

  if (format !== "pdf" && format !== "docx") {
   return NextResponse.json(
    { error: 'format deve ser "pdf" ou "docx"' },
    { status: 400 }
   );
  }

  // TODO: Pegar userId do contexto de autenticação (Firebase Auth)
  const userId = "mock-user-id"; // Substituir por auth real

  // Executar use case com serviço apropriado
  // TODO: Implement with new SOLID architecture
  return NextResponse.json(
   { error: "Export feature not yet migrated to new architecture" },
   { status: 501 }
  );

  // let blob: Blob;

  // if (format === "pdf") {
  //  const useCase = new ExportResumeUseCase(resumeRepository, pdfService);
  //  blob = await useCase.execute({ resumeId, userId, format });
  // } else {
  //  const useCase = new ExportResumeUseCase(resumeRepository, docxService);
  //  blob = await useCase.execute({ resumeId, userId, format });
  // }

  // // Retornar arquivo
  // const buffer = Buffer.from(await blob.arrayBuffer());
  // const headers = new Headers();
  // headers.set(
  //  "Content-Type",
  //  format === "pdf"
  //   ? "application/pdf"
  //   : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  // );
  // headers.set("Content-Disposition", `attachment; filename="resume.${format}"`);

  // return new NextResponse(buffer, { headers });
 } catch (error) {
  console.error("Erro ao exportar currículo:", error);
  return NextResponse.json(
   { error: error instanceof Error ? error.message : "Erro ao exportar" },
   { status: 500 }
  );
 }
}
