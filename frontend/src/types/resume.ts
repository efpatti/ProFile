export interface Contact {
 icon: string;
 text: string;
 href: string;
}

export interface SkillCategory {
 title: string;
 items: string[];
}

export interface InterestCategory {
 title: string;
 items: string[];
}

export interface RecommendationItem {
 name: string;
 position: string;
 period: string;
 text: string;
}

export interface AwardItem {
 icon: string;
 title: string;
 description: string;
}

export interface ResumeHeader {
 name: string;
 title: string;
 contacts: Contact[];
}

export interface ResumeButtons {
 generatePDF: string;
}

export interface ResumeData {
 title: string;
 header: ResumeHeader;
 buttons: ResumeButtons;
}

export interface ResumeDataset {
 "pt-br": ResumeData;
 en: ResumeData;
}
