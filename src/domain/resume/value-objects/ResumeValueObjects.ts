import { Id, ValueObject } from "../../shared/value-objects/BaseValueObjects";
import { ValidationError } from "../../shared/errors";
import { Result, success, failure } from "../../shared/types/Result";

export class ResumeId extends Id {}

export class JobTitle extends ValueObject<string> {
 private static readonly MAX_LENGTH = 100;
 private static readonly MIN_LENGTH = 2;

 private constructor(value: string) {
  super(value.trim());
 }

 static create(value: string): Result<JobTitle, ValidationError> {
  const trimmed = value?.trim();

  if (!trimmed) {
   return failure(ValidationError.required("jobTitle"));
  }

  if (trimmed.length < this.MIN_LENGTH) {
   return failure(ValidationError.tooShort("jobTitle", this.MIN_LENGTH));
  }

  if (trimmed.length > this.MAX_LENGTH) {
   return failure(ValidationError.tooLong("jobTitle", this.MAX_LENGTH));
  }

  return success(new JobTitle(trimmed));
 }
}

export class CompanyName extends ValueObject<string> {
 private static readonly MAX_LENGTH = 200;
 private static readonly MIN_LENGTH = 1;

 private constructor(value: string) {
  super(value.trim());
 }

 static create(value: string): Result<CompanyName, ValidationError> {
  const trimmed = value?.trim();

  if (!trimmed) {
   return failure(ValidationError.required("companyName"));
  }

  if (trimmed.length < this.MIN_LENGTH) {
   return failure(ValidationError.tooShort("companyName", this.MIN_LENGTH));
  }

  if (trimmed.length > this.MAX_LENGTH) {
   return failure(ValidationError.tooLong("companyName", this.MAX_LENGTH));
  }

  return success(new CompanyName(trimmed));
 }
}

export class DateRange {
 private constructor(
  private readonly _startDate: Date,
  private readonly _endDate: Date | null
 ) {
  Object.freeze(this);
 }

 static create(
  startDate: Date,
  endDate: Date | null = null
 ): Result<DateRange, ValidationError> {
  if (endDate && endDate < startDate) {
   return failure(
    new ValidationError(
     "dateRange",
     { startDate, endDate },
     "End date must be after start date"
    )
   );
  }

  return success(new DateRange(startDate, endDate));
 }

 get startDate(): Date {
  return this._startDate;
 }

 get endDate(): Date | null {
  return this._endDate;
 }

 get isCurrent(): boolean {
  return this._endDate === null;
 }

 durationInMonths(): number {
  const end = this._endDate || new Date();
  const diff = end.getTime() - this._startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
 }

 durationInYears(): number {
  return Math.floor(this.durationInMonths() / 12);
 }

 overlaps(other: DateRange): boolean {
  const thisEnd = this._endDate || new Date();
  const otherEnd = other._endDate || new Date();

  return this._startDate <= otherEnd && other._startDate <= thisEnd;
 }
}
