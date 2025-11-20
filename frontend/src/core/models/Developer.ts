// Versão TypeScript migrada do Developer.js
export interface DeveloperProps {
 name: string;
 role: string;
 stack: string[];
 company: string;
 position: string;
}

export class Developer {
 name: string;
 role: string;
 stack: string[];
 company: string;
 position: string;

 constructor({ name, role, stack, company, position }: DeveloperProps) {
  this.name = name;
  this.role = role;
  this.stack = stack;
  this.company = company;
  this.position = position;
 }

 validate(): boolean {
  if (!this.name || !this.role) {
   throw new Error("Name and role are required");
  }
  return true;
 }

 toJSON() {
  return {
   name: this.name,
   role: this.role,
   stack: this.stack,
   company: this.company,
   position: this.position,
  };
 }
}
