import bcrypt from 'bcrypt';
export async function hash(value: string) { return bcrypt.hash(value, 10); }
export async function compare(value: string, hashValue: string) { return bcrypt.compare(value, hashValue); }
