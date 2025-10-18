import { ResumeId } from "../value-objects/ResumeValueObjects";
import { Experience } from "./Experience";
import { ValidationError } from "../../shared/errors";
import { Result, success, failure } from "../../shared/types/Result";

interface ResumeProps {
 id: ResumeId;
 userId: string;
 title: string;
 template: "professional" | "creative" | "minimal";
 experiences: Experience[];
 isPublic: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export class Resume {
 private constructor(private readonly props: ResumeProps) {}

 static create(
  props: Omit<ResumeProps, "id" | "createdAt" | "updatedAt">
 ): Resume {
  const now = new Date();
  return new Resume({
   ...props,
   id: ResumeId.generate(),
   createdAt: now,
   updatedAt: now,
  });
 }

 static reconstitute(props: ResumeProps): Resume {
  return new Resume(props);
 }

 get id(): ResumeId {
  return this.props.id;
 }

 get title(): string {
  return this.props.title;
 }

 get experiences(): ReadonlyArray<Experience> {
  return this.props.experiences;
 }

 get totalYearsOfExperience(): number {
  return this.props.experiences.reduce(
   (total, exp) => total + exp.durationInYears,
   0
  );
 }

 get isPublic(): boolean {
  return this.props.isPublic;
 }

 get userId(): string {
  return this.props.userId;
 }

 addExperience(experience: Experience): Result<Resume, ValidationError> {
  if (this.props.experiences.length >= 20) {
   return failure(
    new ValidationError(
     "experiences",
     experience,
     "Maximum experiences reached (20)"
    )
   );
  }

  return success(
   new Resume({
    ...this.props,
    experiences: [...this.props.experiences, experience],
    updatedAt: new Date(),
   })
  );
 }

 removeExperience(experienceId: ResumeId): Resume {
  return new Resume({
   ...this.props,
   experiences: this.props.experiences.filter(
    (exp) => !exp.id.equals(experienceId)
   ),
   updatedAt: new Date(),
  });
 }

 publish(): Resume {
  return new Resume({
   ...this.props,
   isPublic: true,
   updatedAt: new Date(),
  });
 }

 unpublish(): Resume {
  return new Resume({
   ...this.props,
   isPublic: false,
   updatedAt: new Date(),
  });
 }

 changeTitle(newTitle: string): Result<Resume, ValidationError> {
  if (!newTitle || newTitle.trim().length === 0) {
   return failure(ValidationError.required("title"));
  }

  if (newTitle.length > 200) {
   return failure(ValidationError.tooLong("title", 200));
  }

  return success(
   new Resume({
    ...this.props,
    title: newTitle.trim(),
    updatedAt: new Date(),
   })
  );
 }
}
