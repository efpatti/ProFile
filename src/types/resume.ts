export interface Contact {
 icon: string;
 text: string;
 href: string;
}

export interface EducationItem {
 title: string;
 period: string;
}

export interface ExperienceItem {
 title: string;
 period: string;
 details: string[];
}

export interface ProjectItem {
 title: string;
 description: string;
 link: {
  text: string;
  href: string;
 };
}

export interface CertificationItem {
 title: string;
 examCode?: string;
 linkCredly: string;
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

export interface ResumeSections {
 profile: {
  title: string;
  content: string;
 };
 languages: {
  title: string;
  items: string[];
 };
 education: {
  title: string;
  items: EducationItem[];
 };
 experience: {
  title: string;
  items: ExperienceItem[];
 };
 projects: {
  title: string;
  items: ProjectItem[];
 };
 certifications: {
  title: string;
  items: CertificationItem[];
 };
 skills: {
  title: string;
  categories: SkillCategory[];
 };
 interests: {
  title: string;
  categories: InterestCategory[];
 };
 recommendations: {
  title: string;
  items: RecommendationItem[];
 };
 awards: {
  title: string;
  items: AwardItem[];
 };
}

export interface ResumeButtons {
 generatePDF: string;
}

export interface ResumeData {
 title: string;
 header: ResumeHeader;
 sections: ResumeSections;
 buttons: ResumeButtons;
}

export interface ResumeDataset {
 "pt-br": ResumeData;
 en: ResumeData;
}
