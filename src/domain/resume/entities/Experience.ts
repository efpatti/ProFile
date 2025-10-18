import {
 ResumeId,
 JobTitle,
 CompanyName,
 DateRange,
} from "../value-objects/ResumeValueObjects";
import { ValidationError } from "../../shared/errors";
import { Result, success, failure } from "../../shared/types/Result";

interface ExperienceProps {
 id: ResumeId;
 resumeId: ResumeId;
 companyName: CompanyName;
 jobTitle: JobTitle;
 dateRange: DateRange;
 location?: string;
 description?: string;
 skills: string[];
 order: number;
}

export class Experience {
 private constructor(private readonly props: ExperienceProps) {
  Object.freeze(this);
 }

 static create(
  props: Omit<ExperienceProps, "id">
 ): Result<Experience, ValidationError> {
  if (props.skills.length > 50) {
   return failure(
    new ValidationError("skills", props.skills, "Too many skills (max 50)")
   );
  }

  return success(
   new Experience({
    ...props,
    id: ResumeId.generate(),
   })
  );
 }

 static reconstitute(props: ExperienceProps): Experience {
  return new Experience(props);
 }

 get id(): ResumeId {
  return this.props.id;
 }

 get companyName(): CompanyName {
  return this.props.companyName;
 }

 get jobTitle(): JobTitle {
  return this.props.jobTitle;
 }

 get dateRange(): DateRange {
  return this.props.dateRange;
 }

 get isCurrent(): boolean {
  return this.dateRange.isCurrent;
 }

 get durationInYears(): number {
  return this.dateRange.durationInYears();
 }

 get description(): string | undefined {
  return this.props.description;
 }

 get skills(): readonly string[] {
  return this.props.skills;
 }

 hasSkill(skill: string): boolean {
  return this.props.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
 }

 addSkill(skill: string): Result<Experience, ValidationError> {
  if (this.hasSkill(skill)) {
   return failure(new ValidationError("skill", skill, "Skill already exists"));
  }

  if (this.props.skills.length >= 50) {
   return failure(
    new ValidationError("skills", skill, "Maximum skills reached")
   );
  }

  return success(
   new Experience({
    ...this.props,
    skills: [...this.props.skills, skill],
   })
  );
 }

 removeSkill(skill: string): Experience {
  return new Experience({
   ...this.props,
   skills: this.props.skills.filter(
    (s) => s.toLowerCase() !== skill.toLowerCase()
   ),
  });
 }

 changeOrder(newOrder: number): Experience {
  return new Experience({
   ...this.props,
   order: newOrder,
  });
 }

 overlaps(other: Experience): boolean {
  return this.dateRange.overlaps(other.dateRange);
 }
}
