// Stub for backward compatibility - migrated to Prisma
export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description?: string;
  title?: string;
  period?: string;
  order?: number;
  language?: string;
}

export type { EducationItem as default };
