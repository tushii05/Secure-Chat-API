import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;
    const user = await authService.register(email, password, name);
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refresh } = req.body;
    const data = await authService.refresh(refresh);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refresh } = req.body;
    await authService.logout(refresh);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
