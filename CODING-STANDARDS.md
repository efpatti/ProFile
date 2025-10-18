# 🎯 ProFile - Coding Standards

> "Clean code always looks like it was written by someone who cares." - Robert C. Martin

## Core Principles

### 1. Functions

#### ✅ DO

```typescript
// Small, one thing, descriptive name
function calculateTotalExperienceYears(experiences: Experience[]): number {
 return experiences.reduce((total, exp) => total + getYears(exp), 0);
}

function getYears(experience: Experience): number {
 const end = experience.endDate || new Date();
 const start = new Date(experience.startDate);
 return (end.getTime() - start.getTime()) / MILLISECONDS_PER_YEAR;
}
```

#### ❌ DON'T

```typescript
// Too long, multiple responsibilities, unclear
function processData(data: any) {
 // Get the experiences
 const experiences = data.experiences;
 let total = 0;
 for (let i = 0; i < experiences.length; i++) {
  const exp = experiences[i];
  const start = new Date(exp.startDate);
  // Calculate end date
  const end = exp.endDate ? new Date(exp.endDate) : new Date();
  // Convert to years
  const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
  total += years;
 }
 return total;
}
```

### 2. Names

#### ✅ DO

```typescript
const MAXIMUM_UPLOAD_SIZE_IN_BYTES = 5 * 1024 * 1024;
const DEFAULT_SESSION_TIMEOUT_IN_SECONDS = 3600;

class EmailNotificationService { ... }
function sendWelcomeEmailToNewUser(user: User): Promise<void> { ... }
```

#### ❌ DON'T

```typescript
const MAX = 5242880;  // What is this?
const timeout = 3600; // Seconds? Minutes?

class ENS { ... } // Abbreviation!
function send(u: any) { ... } // Unclear!
```

### 3. Comments

#### ✅ DO (Almost Never)

```typescript
// Only use comments for:
// 1. Legal/copyright notices
// 2. TODO with ticket number
// 3. Warning of consequences

// TODO(TICKET-123): Refactor after API v2 release
// WARNING: Changing this will break OAuth flow
```

#### ❌ DON'T

```typescript
// ❌ Get user from database
const user = await db.getUser(id);

// ❌ Loop through experiences
for (const exp of experiences) {
  // ❌ Calculate years
  const years = ...
}

// ❌ Return result
return result;
```

**Why?** If your code needs comments to explain what it does, the code is not clean enough. **Refactor the code instead!**

### 4. Classes & Single Responsibility

#### ✅ DO

```typescript
class FileKeyGenerator {
 static forResumePDF(userId: string, resumeId: string): string {
  return `resumes/${userId}/${resumeId}.pdf`;
 }
}

class ContentTypeResolver {
 static forImageFormat(format: "png" | "jpg"): string {
  return format === "png" ? "image/png" : "image/jpeg";
 }
}

class StorageService {
 async uploadPDF(userId: string, resumeId: string, buffer: Buffer) {
  const key = FileKeyGenerator.forResumePDF(userId, resumeId);
  return this.upload(key, buffer, "application/pdf");
 }
}
```

#### ❌ DON'T

```typescript
// Too many responsibilities!
class StorageService {
  generateKey(type: string, userId: string, id: string): string { ... }
  getContentType(format: string): string { ... }
  validateBuffer(buffer: Buffer): boolean { ... }
  compressImage(buffer: Buffer): Buffer { ... }
  async uploadFile(...) { ... }
  async downloadFile(...) { ... }
  async deleteFile(...) { ... }
  buildUrl(...) { ... }
  parseUrl(...) { ... }
}
```

### 5. Value Objects

#### ✅ DO

```typescript
class EmailAddress {
 private constructor(private readonly value: string) {}

 static create(email: string): EmailAddress {
  if (!this.isValid(email)) throw new Error("Invalid email");
  return new EmailAddress(email.toLowerCase().trim());
 }

 private static isValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 }

 getDomain(): string {
  return this.value.split("@")[1];
 }
}

// Usage
const email = EmailAddress.create("user@example.com");
const domain = email.getDomain(); // "example.com"
```

#### ❌ DON'T

```typescript
// Primitive obsession
function processEmail(email: string) {
  // Validation scattered everywhere
  if (!email.includes("@")) throw new Error("Invalid");
  const parts = email.split("@");
  const domain = parts[1];
  ...
}
```

### 6. Command Query Separation

#### ✅ DO

```typescript
// Commands: mutate, return void/new state
function publish(): ResumeEntity {
 return this.update({ isPublic: true });
}

function unpublish(): ResumeEntity {
 return this.update({ isPublic: false });
}

// Queries: return data, no mutations
function canBePublished(): boolean {
 return this.isComplete() && this.isOnboardingComplete;
}

function getTotalYears(): number {
 return this.calculateTotal();
}
```

#### ❌ DON'T

```typescript
// Ambiguous: mutation or query?
function setPublic(value: boolean): boolean {
 this.isPublic = value;
 return this.canPublish(); // ❌ Doing too much!
}
```

### 7. Error Handling

#### ✅ DO

```typescript
class InvalidEmailError extends Error {
 constructor(email: string) {
  super(`Invalid email address: ${email}`);
  this.name = "InvalidEmailError";
 }
}

class EmailAddress {
 static create(email: string): EmailAddress {
  if (!this.isValid(email)) {
   throw new InvalidEmailError(email);
  }
  return new EmailAddress(email);
 }
}

// Usage with proper handling
try {
 const email = EmailAddress.create(userInput);
 await sendEmail(email);
} catch (error) {
 if (error instanceof InvalidEmailError) {
  console.error("User provided invalid email");
 }
 throw error;
}
```

#### ❌ DON'T

```typescript
function processEmail(email: string) {
 try {
  if (email) {
   if (email.includes("@")) {
    // ... logic
   } else {
    return null; // ❌ Returning null for error
   }
  }
 } catch (e) {
  console.log(e); // ❌ Swallowing error
  return null;
 }
}
```

### 8. Testing

#### ✅ DO

```typescript
describe("EmailAddress", () => {
 it("creates valid email address", () => {
  const email = EmailAddress.create("user@example.com");
  expect(email.toString()).toBe("user@example.com");
 });

 it("throws error for invalid email", () => {
  expect(() => EmailAddress.create("invalid")).toThrow(InvalidEmailError);
 });

 it("normalizes email to lowercase", () => {
  const email = EmailAddress.create("USER@EXAMPLE.COM");
  expect(email.toString()).toBe("user@example.com");
 });

 it("extracts domain correctly", () => {
  const email = EmailAddress.create("user@example.com");
  expect(email.getDomain()).toBe("example.com");
 });
});
```

## File Organization

```
src/
├── core/                          # Domain layer
│   ├── entities/                 # Business entities
│   │   ├── Resume.ts             # < 200 lines
│   │   └── User.ts
│   ├── value-objects/            # Immutable value objects
│   │   ├── EmailAddress.ts       # < 100 lines
│   │   ├── Username.ts
│   │   └── ColorScheme.ts
│   ├── interfaces/               # Contracts
│   │   ├── IResumeRepository.ts
│   │   └── IExportService.ts
│   └── use-cases/                # Business logic
│       ├── CreateResume.ts       # < 100 lines
│       └── ExportResume.ts
├── infrastructure/                # External concerns
│   ├── repositories/
│   │   └── PrismaResumeRepository.ts
│   └── services/
│       └── StorageService.ts     # < 200 lines
└── presentation/                  # UI layer
    ├── components/               # Each < 150 lines
    ├── hooks/                    # Each < 50 lines
    └── stores/
```

## Code Review Checklist

### Before Submitting PR

- [ ] All functions < 20 lines (ideally < 10)
- [ ] No obvious comments (code is self-documenting)
- [ ] All magic numbers replaced with named constants
- [ ] Classes follow Single Responsibility Principle
- [ ] No primitive obsession (use Value Objects)
- [ ] Command Query Separation respected
- [ ] Meaningful, searchable names
- [ ] Error handling with custom errors
- [ ] Tests for all business logic
- [ ] No duplication

### During Review

Ask yourself:

1. Can I understand this without comments?
2. Does each function do ONE thing?
3. Are names revealing intent?
4. Is there any duplication?
5. Can this be simpler?

## Anti-Patterns to Avoid

### ❌ God Class

```typescript
class ResumeService {
  // 2000 lines of everything!
  createResume() { ... }
  updateResume() { ... }
  deleteResume() { ... }
  exportToPDF() { ... }
  exportToDOCX() { ... }
  sendEmail() { ... }
  uploadToS3() { ... }
  generateBanner() { ... }
  validateData() { ... }
  // ... 50 more methods
}
```

### ❌ Feature Envy

```typescript
// Bad: accessing other object's data too much
function calculateDiscount(order: Order) {
 if (
  order.customer.isPremium &&
  order.customer.loyaltyPoints > 100 &&
  order.customer.orders.length > 10
 ) {
  return order.total * 0.2;
 }
}

// Good: Tell, Don't Ask
function calculateDiscount(order: Order) {
 return order.getDiscount(); // Let Order decide!
}
```

### ❌ Shotgun Surgery

```typescript
// Changing one thing requires changes in 10 files
// Solution: Better abstractions and cohesion
```

## Mantras

1. **"Comments are a failure"** - Make code self-explanatory
2. **"Functions should do one thing"** - Extract until you drop
3. **"Tell, Don't Ask"** - Objects should do their own work
4. **"The Boy Scout Rule"** - Leave code cleaner than you found it
5. **"YAGNI"** - You Aren't Gonna Need It
6. **"DRY"** - Don't Repeat Yourself
7. **"KISS"** - Keep It Simple, Stupid

## Resources

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) - Robert C. Martin
- [The Clean Coder](https://www.amazon.com/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073) - Robert C. Martin
- [Refactoring](https://www.amazon.com/Refactoring-Improving-Existing-Addison-Wesley-Signature/dp/0134757599) - Martin Fowler
- [Test Driven Development](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck

---

**Remember:** Writing clean code is like painting a picture. Every line should have a purpose. Every function should tell a story. And the whole thing should be a work of art. 🎨
