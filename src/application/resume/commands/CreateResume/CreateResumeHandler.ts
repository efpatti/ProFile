import { Resume } from "@/domain/resume/entities";
import {
 ResumeId,
 JobTitle,
 CompanyName,
 DateRange,
} from "@/domain/resume/value-objects";
import { Experience } from "@/domain/resume/entities";
import type { IResumeRepository } from "@/domain/resume/repositories";
import { Result, success, failure } from "@/domain/shared/types";

export interface CreateResumeCommand {
 userId: string;
 title: string;
 template: "professional" | "creative" | "minimal";
}

export class CreateResumeHandler {
 constructor(private readonly repository: IResumeRepository) {}

 async execute(command: CreateResumeCommand): Promise<Result<Resume, Error>> {
  const resume = Resume.create({
   userId: command.userId,
   title: command.title,
   template: command.template,
   experiences: [],
   isPublic: false,
  });

  return this.repository.save(resume);
 }
}

export interface AddExperienceCommand {
 resumeId: string;
 company: string;
 position: string;
 startDate: Date;
 endDate: Date | null;
 location?: string;
 description?: string;
 skills: string[];
}

export class AddExperienceHandler {
 constructor(private readonly repository: IResumeRepository) {}

 async execute(command: AddExperienceCommand): Promise<Result<Resume, Error>> {
  const resumeIdResult = await this.getResumeId(command.resumeId);
  if (resumeIdResult.isFailure) {
   return resumeIdResult;
  }

  const resumeResult = await this.repository.findById(resumeIdResult.value);
  if (resumeResult.isFailure) {
   return resumeResult;
  }

  if (!resumeResult.value) {
   return failure(new Error("Resume not found"));
  }

  const experienceResult = await this.createExperience(command);
  if (experienceResult.isFailure) {
   return failure(experienceResult.error);
  }

  const updatedResumeResult = resumeResult.value.addExperience(
   experienceResult.value
  );
  if (updatedResumeResult.isFailure) {
   return failure(updatedResumeResult.error);
  }

  return this.repository.save(updatedResumeResult.value);
 }

 private async getResumeId(id: string): Promise<Result<ResumeId, Error>> {
  return ResumeId.create(id);
 }

 private async createExperience(
  command: AddExperienceCommand
 ): Promise<Result<Experience, Error>> {
  const companyResult = CompanyName.create(command.company);
  if (companyResult.isFailure) {
   return failure(companyResult.error);
  }

  const positionResult = JobTitle.create(command.position);
  if (positionResult.isFailure) {
   return failure(positionResult.error);
  }

  const dateRangeResult = DateRange.create(command.startDate, command.endDate);
  if (dateRangeResult.isFailure) {
   return failure(dateRangeResult.error);
  }

  return Experience.create({
   resumeId: ResumeId.generate(),
   companyName: companyResult.value,
   jobTitle: positionResult.value,
   dateRange: dateRangeResult.value,
   location: command.location,
   description: command.description,
   skills: command.skills,
   order: 0,
  });
 }
}
