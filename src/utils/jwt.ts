import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import config from '../config';

export interface AccessPayload {
  sub: number;
  role: 'USER' | 'ADMIN';
}

export function signAccess(payload: AccessPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret as jwt.Secret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccess(token: string): AccessPayload {
  const decoded = jwt.verify(token, config.jwt.accessSecret as jwt.Secret);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  const payload = decoded as jwt.JwtPayload;

  if (!payload.sub || !payload.role) {
    throw new Error('Invalid token payload structure');
  }

  return {
    sub: Number(payload.sub),
    role: payload.role as 'USER' | 'ADMIN',
  };
}

export function makeRefresh(): string {
  return randomBytes(64).toString('hex');
}
