export class DevDataFormatter {
 constructor() {
  if (this.constructor === DevDataFormatter) {
   throw new Error("Abstract class cannot be instantiated");
  }
 }

 format(dev) {
  throw new Error("Method 'format()' must be implemented");
 }
}
