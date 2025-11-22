// import jwt from 'jsonwebtoken';
// import { randomBytes } from 'crypto';
// import config from '../config';

// export function signAccess(payload: object) {
//   return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
// }

// export function verifyAccess(token: string) {
//   return jwt.verify(token, config.jwt.accessSecret);
// }

// export function makeRefresh() {
//   return randomBytes(64).toString('hex');
// }

import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import config from '../config';

export interface AccessPayload {
  sub: number; // user id
  role: 'USER' | 'ADMIN';
}

// Sign an access token
export function signAccess(payload: AccessPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret as jwt.Secret, {
    // explicitly mark options as SignOptions
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

// Verify an access token
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
    sub: Number(payload.sub), // FIX — Cast safely
    role: payload.role as 'USER' | 'ADMIN',
  };
}


// Generate a random refresh token
export function makeRefresh(): string {
  return randomBytes(64).toString('hex');
}
