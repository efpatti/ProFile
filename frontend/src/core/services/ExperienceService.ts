// Stub for backward compatibility - migrated to Prisma
export interface Experience {
 id: string;
 company: string;
 role: string;
 startDate: string;
 endDate: string | null;
 isCurrentJob: boolean;
 isCurrent?: boolean;
 technologies: string[];
 description?: string;
 order?: number;
 language?: string;
 title?: string;
 locate?: string;
 details?: string[];
}

export type { Experience as default };
