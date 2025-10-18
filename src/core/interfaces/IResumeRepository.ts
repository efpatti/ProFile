import { Resume } from "../entities/Resume";

/**
 * Repository Pattern para Currículos
 * Abstração da camada de dados (SOLID - Dependency Inversion Principle)
 */
export interface IResumeRepository {
 /**
  * Busca currículo por ID
  */
 findById(id: string): Promise<Resume | null>;

 /**
  * Busca currículo por username (para perfis públicos)
  */
 findByUsername(username: string): Promise<Resume | null>;

 /**
  * Lista todos os currículos de um usuário
  */
 findByUserId(userId: string): Promise<Resume[]>;

 /**
  * Cria novo currículo
  */
 create(resume: Resume): Promise<Resume>;

 /**
  * Atualiza currículo existente
  */
 update(id: string, resume: Partial<Resume>): Promise<Resume>;

 /**
  * Deleta currículo
  */
 delete(id: string): Promise<void>;

 /**
  * Verifica se username está disponível
  */
 isUsernameAvailable(
  username: string,
  excludeResumeId?: string
 ): Promise<boolean>;
}
