export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
 readonly isSuccess = true;
 readonly isFailure = false;

 constructor(readonly value: T) {}

 map<U>(fn: (value: T) => U): Result<U, never> {
  return new Success(fn(this.value));
 }

 flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
  return fn(this.value);
 }

 mapError<F>(_fn: (error: never) => F): Result<T, F> {
  return this as any;
 }

 getOrThrow(): T {
  return this.value;
 }

 getOrElse(_defaultValue: T): T {
  return this.value;
 }
}

export class Failure<E> {
 readonly isSuccess = false;
 readonly isFailure = true;

 constructor(readonly error: E) {}

 map<U>(_fn: (value: never) => U): Result<U, E> {
  return this as any;
 }

 flatMap<U, F>(_fn: (value: never) => Result<U, F>): Result<U, E | F> {
  return this as any;
 }

 mapError<F>(fn: (error: E) => F): Result<never, F> {
  return new Failure(fn(this.error));
 }

 getOrThrow(): never {
  throw this.error;
 }

 getOrElse<T>(defaultValue: T): T {
  return defaultValue;
 }
}

export const success = <T>(value: T): Result<T, never> => new Success(value);

export const failure = <E>(error: E): Result<never, E> => new Failure(error);

export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
 try {
  return success(fn());
 } catch (error) {
  return failure(error instanceof Error ? error : new Error(String(error)));
 }
};

export const tryCatchAsync = async <T>(
 fn: () => Promise<T>
): Promise<Result<T, Error>> => {
 try {
  return success(await fn());
 } catch (error) {
  return failure(error instanceof Error ? error : new Error(String(error)));
 }
};
