import { IResumeRepository } from "../interfaces/IResumeRepository";
import { ResumeEntity, Resume } from "../entities/Resume";

/**
 * Use Case: Criar Currículo
 *
 * Regras de negócio:
 * - Username deve ser único
 * - Dados devem ser válidos (Zod valida automaticamente na Entity)
 */

type CreateResumeInput = Omit<Resume, "id" | "createdAt" | "updatedAt">;

export class CreateResumeUseCase {
 constructor(private readonly resumeRepository: IResumeRepository) {}

 async execute(input: CreateResumeInput): Promise<Resume> {
  // 1. Validar username único
  const isAvailable = await this.resumeRepository.isUsernameAvailable(
   input.username
  );

  if (!isAvailable) {
   throw new Error("Username já está em uso");
  }

  // 2. Criar entidade (valida dados automaticamente)
  const resumeEntity = ResumeEntity.create(input);

  // 3. Persistir
  const resume = await this.resumeRepository.create(resumeEntity.toJSON());

  return resume;
 }
}
