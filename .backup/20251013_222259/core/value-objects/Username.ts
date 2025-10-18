const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const VALID_PATTERN = /^[a-z0-9_-]+$/i;

export class Username {
 private constructor(private readonly value: string) {}

 static create(username: string): Username {
  const normalized = username.trim().toLowerCase();

  if (normalized.length < MIN_LENGTH) {
   throw new Error(`Username must be at least ${MIN_LENGTH} characters`);
  }

  if (normalized.length > MAX_LENGTH) {
   throw new Error(`Username must not exceed ${MAX_LENGTH} characters`);
  }

  if (!VALID_PATTERN.test(normalized)) {
   throw new Error(
    "Username can only contain letters, numbers, underscores and hyphens"
   );
  }

  return new Username(normalized);
 }

 toString(): string {
  return this.value;
 }

 equals(other: Username): boolean {
  return this.value === other.value;
 }
}
