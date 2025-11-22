import { Request, Response, NextFunction } from 'express';
import * as service from './messages.service';
import { HttpError } from '../../utils/HttpError';

export async function createMsg(req: any, res: Response, next: NextFunction) {
  try {
    const { conversationId, content, metadata } = req.body;
    const senderId = req.user.id;
    if (!content || content.trim().length === 0) {
      throw new HttpError(400, "Message content is required");
    }
    const message = await service.createMessage(
      Number(conversationId),
      senderId,
      content,
      metadata
    );

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req: any, res: Response, next: NextFunction) {
  try {
    const conversationId = Number(req.params.id);
    const limit = Number(req.query.limit || 20);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

    const messages = await service.listMessages(conversationId, limit, cursor);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}
