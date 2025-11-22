import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';

export interface AuthRequest extends Request { user?: any }

export function ensureAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = verifyAccess(token) as any;
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(role: 'ADMIN' | 'USER') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}
