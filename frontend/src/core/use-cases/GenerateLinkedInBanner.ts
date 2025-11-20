import { IResumeRepository } from "../interfaces/IResumeRepository";
import { IBannerService } from "../interfaces/IExportService";
import { ResumeEntity } from "../entities/Resume";

/**
 * Use Case: Gerar Banner do LinkedIn
 *
 * Regras de negócio:
 * - Currículo deve ter dados mínimos (nome, headline)
 * - Banner é automaticamente salvo no storage
 * - URL do banner é salvo no currículo
 */

interface GenerateLinkedInBannerInput {
 resumeId: string;
 userId: string;
}

interface GenerateLinkedInBannerOutput {
 bannerUrl: string;
 blob: Blob;
}

export class GenerateLinkedInBannerUseCase {
 constructor(
  private readonly resumeRepository: IResumeRepository,
  private readonly bannerService: IBannerService
 ) {}

 async execute(
  input: GenerateLinkedInBannerInput
 ): Promise<GenerateLinkedInBannerOutput> {
  // 1. Buscar currículo
  const resume = await this.resumeRepository.findById(input.resumeId);

  if (!resume) {
   throw new Error("Currículo não encontrado");
  }

  // 2. Verificar ownership
  if (resume.userId !== input.userId) {
   throw new Error("Você não tem permissão para gerar banner deste currículo");
  }

  // 3. Validar dados mínimos
  if (!resume.fullName || !resume.headline) {
   throw new Error("Adicione nome e headline antes de gerar o banner");
  }

  // 4. Gerar banner
  const blob = await this.bannerService.generate(resume);

  // 5. Upload para storage
  const bannerUrl = await this.bannerService.upload(blob, input.userId);

  // 6. Atualizar currículo com URL do banner
  const resumeEntity = ResumeEntity.fromData(resume);
  const updatedResume = resumeEntity.setLinkedInBanner(bannerUrl);

  await this.resumeRepository.update(input.resumeId, updatedResume.toJSON());

  return {
   bannerUrl,
   blob,
  };
 }
}
