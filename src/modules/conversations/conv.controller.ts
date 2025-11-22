import { Request, Response, NextFunction } from 'express';
import * as service from './conv.service';

export async function createConv(req: any, res: Response, next: NextFunction) {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;
    const conv = await service.createConversation(userId, Number(participantId));
    res.status(201).json(conv);
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ status, message });
  }
}

export async function listConv(req: any, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const convs = await service.listConversations(userId);
    res.json(convs);
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ status, message });
  }
}
