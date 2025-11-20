import { IResumeRepository } from "../interfaces/IResumeRepository";
import { IExportService } from "../interfaces/IExportService";
import { ResumeEntity } from "../entities/Resume";

/**
 * Use Case: Exportar Currículo
 *
 * Regras de negócio:
 * - Currículo deve estar completo
 * - Usuário deve ser o dono do currículo
 */

type ExportFormat = "pdf" | "docx";

interface ExportResumeInput {
 resumeId: string;
 userId: string;
 format: ExportFormat;
}

export class ExportResumeUseCase {
 constructor(
  private readonly resumeRepository: IResumeRepository,
  private readonly exportService: IExportService
 ) {}

 async execute(input: ExportResumeInput): Promise<Blob> {
  // 1. Buscar currículo
  const resume = await this.resumeRepository.findById(input.resumeId);

  if (!resume) {
   throw new Error("Currículo não encontrado");
  }

  // 2. Verificar ownership
  if (resume.userId !== input.userId) {
   throw new Error("Você não tem permissão para exportar este currículo");
  }

  // 3. Validar completude
  const resumeEntity = ResumeEntity.fromData(resume);

  if (!resumeEntity.isComplete()) {
   throw new Error("Complete todas as seções obrigatórias antes de exportar");
  }

  // 4. Exportar no formato solicitado
  const blob =
   input.format === "pdf"
    ? await this.exportService.toPDF(resume)
    : await this.exportService.toDOCX(resume);

  return blob;
 }
}
