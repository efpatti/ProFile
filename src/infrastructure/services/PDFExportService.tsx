import { pdf } from "@react-pdf/renderer";
import { IExportService } from "@/core/interfaces/IExportService";
import { Resume } from "@/core/entities/Resume";
import { ClassicResumePDF } from "@/presentation/templates/pdf/classic_resume_pdf";
import { ModernResumePDF } from "@/presentation/templates/pdf/modern_resume_pdf";
import { CreativeResumePDF } from "@/presentation/templates/pdf/creative_resume_pdf";

/**
 * Serviço de exportação usando @react-pdf/renderer
 * Melhor qualidade que html2canvas + jspdf
 */
export class PDFExportService implements IExportService {
 async toPDF(resume: Resume): Promise<Blob> {
  // Seleciona template baseado na escolha do usuário
  const Template = this.getTemplate(resume.template);

  // Gera PDF usando React components
  const blob = await pdf(<Template data={resume} />).toBlob();

  return blob;
 }

 async toDOCX(resume: Resume): Promise<Blob> {
  throw new Error(
   "PDFExportService não suporta exportação DOCX. Use DOCXExportService."
  );
 }

 private getTemplate(template: Resume["template"]) {
  switch (template) {
   case "classic":
    return ClassicResumePDF;
   case "modern":
    return ModernResumePDF;
   case "creative":
    return CreativeResumePDF;
   default:
    return ModernResumePDF;
  }
 }

 // Método auxiliar para download direto
 async downloadPDF(resume: Resume, filename?: string): Promise<void> {
  const blob = await this.toPDF(resume);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${resume.fullName.replace(/\s+/g, "_")}_CV.pdf`;
  link.click();
  URL.revokeObjectURL(url);
 }
}
