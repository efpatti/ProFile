import { Resume } from "../entities/Resume";

export interface IExportService {
 toPDF(resume: Resume): Promise<Blob>;

 toDOCX(resume: Resume): Promise<Blob>;
}

export interface IBannerService {
 generate(resume: Resume): Promise<Blob>;

 upload(blob: Blob, userId: string): Promise<string>;
}
