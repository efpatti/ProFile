const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailAddress {
 private constructor(private readonly value: string) {}

 static create(email: string): EmailAddress {
  if (!EMAIL_REGEX.test(email)) {
   throw new Error("Invalid email address");
  }
  return new EmailAddress(email.toLowerCase().trim());
 }

 toString(): string {
  return this.value;
 }

 getDomain(): string {
  return this.value.split("@")[1];
 }

 getUsername(): string {
  return this.value.split("@")[0];
 }

 equals(other: EmailAddress): boolean {
  return this.value === other.value;
 }
}
