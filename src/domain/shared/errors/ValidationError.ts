import { DomainError } from "./DomainError";

export class ValidationError extends DomainError {
 constructor(
  public readonly field: string,
  public readonly value: unknown,
  message: string
 ) {
  super(message);
 }

 static invalidFormat(field: string, value: unknown): ValidationError {
  return new ValidationError(field, value, `Invalid format for ${field}`);
 }

 static required(field: string): ValidationError {
  return new ValidationError(field, null, `${field} is required`);
 }

 static tooLong(field: string, maxLength: number): ValidationError {
  return new ValidationError(
   field,
   null,
   `${field} must be at most ${maxLength} characters`
  );
 }

 static tooShort(field: string, minLength: number): ValidationError {
  return new ValidationError(
   field,
   null,
   `${field} must be at least ${minLength} characters`
  );
 }
}
