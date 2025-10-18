import { PrismaClient } from "@prisma/client";
import type { IResumeRepository } from "@/domain/resume/repositories";
import { Resume } from "@/domain/resume/entities";
import { ResumeId } from "@/domain/resume/value-objects";
import type { Result } from "@/domain/shared/types";
import { success, failure } from "@/domain/shared/types";
import { ResumeMapper } from "../mappers/ResumeMapper";

export class PrismaResumeRepository implements IResumeRepository {
 constructor(private readonly prisma: PrismaClient) {}

 async findById(id: ResumeId): Promise<Result<Resume | null, Error>> {
  try {
   const raw = await this.prisma.resume.findUnique({
    where: { id: id.value },
    include: { experiences: true },
   });

   if (!raw) return success(null);

   const result = ResumeMapper.toDomain(raw);
   return result;
  } catch (error) {
   return failure(error as Error);
  }
 }

 async findByUserId(userId: string): Promise<Result<Resume[], Error>> {
  try {
   const rawResumes = await this.prisma.resume.findMany({
    where: { userId },
    include: { experiences: true },
   });

   const resumes: Resume[] = [];
   for (const raw of rawResumes) {
    const result = ResumeMapper.toDomain(raw);
    if (result.isFailure) return failure(result.error);
    resumes.push(result.value);
   }

   return success(resumes);
  } catch (error) {
   return failure(error as Error);
  }
 }

 async save(resume: Resume): Promise<Result<Resume, Error>> {
  try {
   const data = ResumeMapper.toPersistence(resume);

   const raw = await this.prisma.resume.upsert({
    where: { id: resume.id.value },
    create: data,
    update: data,
    include: { experiences: true },
   });

   const result = ResumeMapper.toDomain(raw);
   return result;
  } catch (error) {
   return failure(error as Error);
  }
 }

 async delete(id: ResumeId): Promise<Result<void, Error>> {
  try {
   await this.prisma.resume.delete({
    where: { id: id.value },
   });
   return success(undefined);
  } catch (error) {
   return failure(error as Error);
  }
 }

 async exists(id: ResumeId): Promise<Result<boolean, Error>> {
  try {
   const count = await this.prisma.resume.count({
    where: { id: id.value },
   });
   return success(count > 0);
  } catch (error) {
   return failure(error as Error);
  }
 }
}
