import { IsObject, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PersonalInfoDto {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
}

class ProfessionalProfileDto {
  jobTitle: string;
  summary: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

class ExperienceDto {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

class ExperiencesStepDto {
  experiences?: ExperienceDto[];
  noExperience: boolean;
}

class EducationDto {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

class EducationStepDto {
  education?: EducationDto[];
  noEducation: boolean;
}

class SkillDto {
  name: string;
  category: string;
  level?: number;
}

class SkillsStepDto {
  skills?: SkillDto[];
  noSkills: boolean;
}

class LanguageDto {
  name: string;
  level: string;
}

class ProjectDto {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  technologies?: string[];
}

class CertificationDto {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

class AwardDto {
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

class InterestDto {
  name: string;
  description?: string;
}

class TemplateSelectionDto {
  template: string;
  palette: string;
}

export class OnboardingDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ProfessionalProfileDto)
  professionalProfile: ProfessionalProfileDto;

  @IsObject()
  @ValidateNested()
  @Type(() => SkillsStepDto)
  skillsStep: SkillsStepDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExperiencesStepDto)
  experiencesStep?: ExperiencesStepDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EducationStepDto)
  educationStep?: EducationStepDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages?: LanguageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AwardDto)
  awards?: AwardDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterestDto)
  interests?: InterestDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => TemplateSelectionDto)
  templateSelection: TemplateSelectionDto;
}
