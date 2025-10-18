import { Resume } from "../entities/Resume";

/**
 * Interface para serviços de exportação
 * Permite trocar implementação sem afetar casos de uso (SOLID - OCP)
 */
export interface IExportService {
 /**
  * Exporta currículo para PDF
  */
 toPDF(resume: Resume): Promise<Blob>;

 /**
  * Exporta currículo para DOCX (Word)
  */
 toDOCX(resume: Resume): Promise<Blob>;
}

/**
 * Interface para geração de banners LinkedIn
 */
export interface IBannerService {
 /**
  * Gera banner personalizado do LinkedIn
  */
 generate(resume: Resume): Promise<Blob>;

 /**
  * Upload do banner para storage
  */
 upload(blob: Blob, userId: string): Promise<string>;
}
