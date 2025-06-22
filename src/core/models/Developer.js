export class Developer {
 constructor({ name, role, stack, company, position }) {
  this.name = name;
  this.role = role;
  this.stack = stack;
  this.company = company;
  this.position = position;
 }

 validate() {
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
