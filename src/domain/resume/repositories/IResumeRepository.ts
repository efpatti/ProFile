import { Resume } from "../entities/Resume";
import { ResumeId } from "../value-objects/ResumeValueObjects";
import { Result } from "../../shared/types/Result";

export interface IResumeRepository {
 findById(id: ResumeId): Promise<Result<Resume | null, Error>>;
 findByUserId(userId: string): Promise<Result<Resume[], Error>>;
 save(resume: Resume): Promise<Result<Resume, Error>>;
 delete(id: ResumeId): Promise<Result<void, Error>>;
 exists(id: ResumeId): Promise<Result<boolean, Error>>;
}
