import type { Prisma } from "@prisma/client";
import { Resume, Experience } from "@/domain/resume/entities";
import {
 ResumeId,
 JobTitle,
 CompanyName,
 DateRange,
} from "@/domain/resume/value-objects";
import type { Result } from "@/domain/shared/types";
import { success, failure } from "@/domain/shared/types";

type PrismaResumeRaw = {
 id: string;
 slug: string | null;
 userId: string;
 title: string | null;
 template: string;
 language: string;
 isPublic: boolean;
 fullName: string | null;
 jobTitle: string | null;
 phone: string | null;
 emailContact: string | null;
 location: string | null;
 linkedin: string | null;
 github: string | null;
 website: string | null;
 summary: string | null;
 currentCompanyLogo: string | null;
 createdAt: Date;
 updatedAt: Date;
 publishedAt: Date | null;
 experiences: PrismaExperienceRaw[];
};

type PrismaExperienceRaw = {
 id: string;
 resumeId: string;
 company: string;
 position: string;
 startDate: Date;
 endDate: Date | null;
 description: string | null;
 skills: string[];
 order: number;
};

export class ResumeMapper {
 static toDomain(raw: PrismaResumeRaw): Result<Resume, Error> {
  const experiencesResult = this.mapExperiences(raw.experiences);
  if (experiencesResult.isFailure) return failure(experiencesResult.error);

  const resumeIdResult = ResumeId.create(raw.id);
  if (resumeIdResult.isFailure) return failure(resumeIdResult.error);

  const resume = Resume.reconstitute({
   id: resumeIdResult.value,
   userId: raw.userId,
   title: raw.title ?? "Untitled Resume",
   template: raw.template as "professional" | "creative" | "minimal",
   experiences: experiencesResult.value,
   isPublic: raw.isPublic,
   createdAt: raw.createdAt,
   updatedAt: raw.updatedAt,
  });

  return success(resume);
 }

 static toPersistence(resume: Resume): Prisma.ResumeCreateInput {
  return {
   id: resume.id.value,
   title: resume.title,
   isPublic: resume.isPublic,
   template: "professional", // TODO: get from resume entity
   user: {
    connect: { id: resume.userId },
   },
   experiences: {
    create: resume.experiences.map((exp, index) => ({
     id: exp.id.value,
     company: exp.companyName.value,
     position: exp.jobTitle.value,
     startDate: exp.dateRange.startDate,
     endDate: exp.dateRange.endDate ?? null,
     description: exp.description ?? null,
     skills: Array.from(exp.skills),
     order: index,
    })),
   },
  };
 }

 private static mapExperiences(
  raw: PrismaExperienceRaw[]
 ): Result<Experience[], Error> {
  const experiences: Experience[] = [];

  for (const exp of raw) {
   const expResult = this.mapExperience(exp);
   if (expResult.isFailure) return failure(expResult.error);
   experiences.push(expResult.value);
  }

  return success(experiences);
 }

 private static mapExperience(
  raw: PrismaExperienceRaw
 ): Result<Experience, Error> {
  const idResult = ResumeId.create(raw.id);
  if (idResult.isFailure) return failure(idResult.error);

  const jobTitleResult = JobTitle.create(raw.position);
  if (jobTitleResult.isFailure) return failure(jobTitleResult.error);

  const companyResult = CompanyName.create(raw.company);
  if (companyResult.isFailure) return failure(companyResult.error);

  const dateRangeResult = DateRange.create(
   raw.startDate,
   raw.endDate ?? undefined
  );
  if (dateRangeResult.isFailure) return failure(dateRangeResult.error);

  const resumeIdResult = ResumeId.create(raw.resumeId);
  if (resumeIdResult.isFailure) return failure(resumeIdResult.error);

  const experience = Experience.reconstitute({
   id: idResult.value,
   resumeId: resumeIdResult.value,
   jobTitle: jobTitleResult.value,
   companyName: companyResult.value,
   dateRange: dateRangeResult.value,
   description: raw.description ?? undefined,
   skills: raw.skills,
   order: raw.order,
  });

  return success(experience);
 }
}
