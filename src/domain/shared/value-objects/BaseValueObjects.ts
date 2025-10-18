import { ValidationError } from "../errors";
import { Result, success, failure } from "../types/Result";

export abstract class ValueObject<T> {
 protected constructor(protected readonly _value: T) {
  Object.freeze(this);
 }

 get value(): T {
  return this._value;
 }

 equals(other: ValueObject<T>): boolean {
  return this._value === other._value;
 }

 toString(): string {
  return String(this._value);
 }
}

export class Id extends ValueObject<string> {
 protected constructor(value: string) {
  super(value);
 }

 static create(value: string): Result<Id, ValidationError> {
  if (!value || value.trim().length === 0) {
   return failure(ValidationError.required("id"));
  }

  if (value.length > 100) {
   return failure(ValidationError.tooLong("id", 100));
  }

  return success(new Id(value));
 }

 static generate(): Id {
  return new Id(crypto.randomUUID());
 }
}

export class Email extends ValueObject<string> {
 private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 private constructor(value: string) {
  super(value.toLowerCase());
 }

 static create(value: string): Result<Email, ValidationError> {
  if (!value || value.trim().length === 0) {
   return failure(ValidationError.required("email"));
  }

  if (!this.EMAIL_REGEX.test(value)) {
   return failure(ValidationError.invalidFormat("email", value));
  }

  return success(new Email(value));
 }

 get domain(): string {
  return this._value.split("@")[1];
 }

 get username(): string {
  return this._value.split("@")[0];
 }
}

export class Url extends ValueObject<string> {
 private constructor(value: string) {
  super(value);
 }

 static create(value: string): Result<Url, ValidationError> {
  if (!value || value.trim().length === 0) {
   return failure(ValidationError.required("url"));
  }

  try {
   new URL(value);
   return success(new Url(value));
  } catch {
   return failure(ValidationError.invalidFormat("url", value));
  }
 }

 get protocol(): string {
  return new URL(this._value).protocol;
 }

 get hostname(): string {
  return new URL(this._value).hostname;
 }
}
