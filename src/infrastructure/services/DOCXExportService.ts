import {
 Document,
 Packer,
 Paragraph,
 TextRun,
 HeadingLevel,
 AlignmentType,
 BorderStyle,
} from "docx";
import { IExportService } from "@/core/interfaces/IExportService";
import { Resume } from "@/core/entities/Resume";

/**
 * Serviço de exportação para DOCX
 * Permite edição posterior pelo usuário
 */
export class DOCXExportService implements IExportService {
 async toPDF(resume: Resume): Promise<Blob> {
  throw new Error(
   "DOCXExportService não suporta exportação PDF. Use PDFExportService."
  );
 }

 async toDOCX(resume: Resume): Promise<Blob> {
  const doc = new Document({
   sections: [
    {
     properties: {},
     children: [
      // Header - Nome
      new Paragraph({
       text: resume.fullName,
       heading: HeadingLevel.TITLE,
       alignment: AlignmentType.CENTER,
       spacing: { after: 200 },
      }),

      // Headline
      new Paragraph({
       text: resume.headline,
       alignment: AlignmentType.CENTER,
       spacing: { after: 400 },
      }),

      // Contato
      new Paragraph({
       children: [
        new TextRun({ text: "Email: ", bold: true }),
        new TextRun(resume.email),
        new TextRun({ text: " | ", bold: true }),
        new TextRun({ text: "Tel: ", bold: true }),
        new TextRun(resume.phone || "N/A"),
       ],
       alignment: AlignmentType.CENTER,
       spacing: { after: 400 },
      }),

      // Resumo
      new Paragraph({
       text: "RESUMO PROFISSIONAL",
       heading: HeadingLevel.HEADING_1,
       spacing: { before: 400, after: 200 },
       border: {
        bottom: {
         color: resume.colorScheme.primary.replace("#", ""),
         space: 1,
         style: BorderStyle.SINGLE,
         size: 6,
        },
       },
      }),

      new Paragraph({
       text: resume.summary,
       spacing: { after: 400 },
      }),

      // Experiências
      new Paragraph({
       text: "EXPERIÊNCIA PROFISSIONAL",
       heading: HeadingLevel.HEADING_1,
       spacing: { before: 400, after: 200 },
       border: {
        bottom: {
         color: resume.colorScheme.primary.replace("#", ""),
         space: 1,
         style: BorderStyle.SINGLE,
         size: 6,
        },
       },
      }),

      ...resume.experiences.flatMap((exp) => [
       new Paragraph({
        children: [
         new TextRun({ text: exp.role, bold: true, size: 24 }),
         new TextRun({ text: ` - ${exp.company}`, size: 24 }),
        ],
        spacing: { after: 100 },
       }),
       new Paragraph({
        children: [
         new TextRun({
          text: `${exp.startDate} - ${exp.endDate || "Atual"}`,
          italics: true,
         }),
        ],
        spacing: { after: 200 },
       }),
       ...(exp.description
        ? [
           new Paragraph({
            text: exp.description,
            spacing: { after: 300 },
           }),
          ]
        : []),
      ]),

      // Formação
      new Paragraph({
       text: "FORMAÇÃO ACADÊMICA",
       heading: HeadingLevel.HEADING_1,
       spacing: { before: 400, after: 200 },
       border: {
        bottom: {
         color: resume.colorScheme.primary.replace("#", ""),
         space: 1,
         style: BorderStyle.SINGLE,
         size: 6,
        },
       },
      }),

      ...resume.education.flatMap((edu) => [
       new Paragraph({
        children: [
         new TextRun({ text: `${edu.degree} em ${edu.field}`, bold: true }),
        ],
        spacing: { after: 100 },
       }),
       new Paragraph({
        text: `${edu.institution} | ${edu.startDate} - ${
         edu.endDate || "Atual"
        }`,
        spacing: { after: 300 },
       }),
      ]),

      // Habilidades
      ...(resume.skills.length > 0
       ? [
          new Paragraph({
           text: "HABILIDADES",
           heading: HeadingLevel.HEADING_1,
           spacing: { before: 400, after: 200 },
           border: {
            bottom: {
             color: resume.colorScheme.primary.replace("#", ""),
             space: 1,
             style: BorderStyle.SINGLE,
             size: 6,
            },
           },
          }),
          ...resume.skills.flatMap((category) => [
           new Paragraph({
            children: [new TextRun({ text: category.name, bold: true })],
            spacing: { after: 100 },
           }),
           new Paragraph({
            text: category.skills.join(" • "),
            spacing: { after: 200 },
           }),
          ]),
         ]
       : []),

      // Idiomas
      ...(resume.languages.length > 0
       ? [
          new Paragraph({
           text: "IDIOMAS",
           heading: HeadingLevel.HEADING_1,
           spacing: { before: 400, after: 200 },
           border: {
            bottom: {
             color: resume.colorScheme.primary.replace("#", ""),
             space: 1,
             style: BorderStyle.SINGLE,
             size: 6,
            },
           },
          }),
          new Paragraph({
           text: resume.languages
            .map((lang) => `${lang.language}: ${lang.proficiency}`)
            .join(" • "),
           spacing: { after: 200 },
          }),
         ]
       : []),
     ],
    },
   ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
 }

 // Método auxiliar para download direto
 async downloadDOCX(resume: Resume, filename?: string): Promise<void> {
  const blob = await this.toDOCX(resume);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${resume.fullName.replace(/\s+/g, "_")}_CV.docx`;
  link.click();
  URL.revokeObjectURL(url);
 }
}
