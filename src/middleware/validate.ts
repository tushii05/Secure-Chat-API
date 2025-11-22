import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e:any) {
      return res.status(400).json({ message: e.errors || e.message });
    }
  };
}
