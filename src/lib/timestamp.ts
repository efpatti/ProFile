// src/lib/timestamp.ts
// Compatibilidade temporária para substituir Firebase Timestamp

export class Timestamp {
 private _date: Date;

 constructor(seconds: number, nanoseconds: number) {
  this._date = new Date(seconds * 1000 + nanoseconds / 1000000);
 }

 static now(): Timestamp {
  const now = new Date();
  return new Timestamp(Math.floor(now.getTime() / 1000), 0);
 }

 static fromDate(date: Date): Timestamp {
  return new Timestamp(Math.floor(date.getTime() / 1000), 0);
 }

 toDate(): Date {
  return this._date;
 }

 isEqual(other: Timestamp): boolean {
  return this._date.getTime() === other._date.getTime();
 }

 get seconds(): number {
  return Math.floor(this._date.getTime() / 1000);
 }

 get nanoseconds(): number {
  return 0;
 }
}
