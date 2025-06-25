// Tipos para resumeData

export interface ResumeContact {
 icon: string;
 text: string;
 href: string;
}

export interface ResumeHeader {
 name: string;
 title: string;
 contacts: ResumeContact[];
}

export interface ResumeSectionItem {
 title: string;
 period?: string;
 description?: string;
 details?: string[];
 link?: { text: string; href: string };
 examCode?: string;
 linkCredly?: string;
}

export interface ResumeSectionCategory {
 title: string;
 items: string[];
}

export interface ResumeSection {
 title: string;
 icon: string;
 content?: string;
 items?: (ResumeSectionItem | string)[];
 categories?: ResumeSectionCategory[];
}

export interface ResumeRecommendation {
 name: string;
 position: string;
 period: string;
 text: string;
}

export interface ResumeAward {
 icon: string;
 title: string;
 description: string;
}

export interface ResumeSections {
 profile: ResumeSection;
 languages: ResumeSection;
 education: ResumeSection;
 experience: ResumeSection;
 projects: ResumeSection;
 certifications: ResumeSection;
 skills: ResumeSection;
 interests: ResumeSection;
 recommendations: ResumeSection;
 awards: ResumeSection;
}

export interface ResumeDataLocale {
 title: string;
 header: ResumeHeader;
 sections: ResumeSections;
 buttons: {
  generatePDF: string;
 };
}

export interface ResumeDataType {
 [locale: string]: ResumeDataLocale;
}
