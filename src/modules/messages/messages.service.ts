import prisma from '../../prismaClient';
import { getIO } from '../../sockets';
import { HttpError } from '../../utils/HttpError';

export async function createMessage(
  conversationId: number,
  senderId: number,
  content: string,
  metadata?: any
) {
  try {
    const message = await prisma.message.create({
      data: { conversationId, senderId, content, metadata },
    });

    try {
      const io = getIO();
      io.to(`conversation_${conversationId}`).emit('message:new', message);
    } catch (e) {
      console.warn('Socket emit failed:', e);
    }

    return message;
  } catch (err: any) {
    throw new HttpError(500, 'Failed to create message');
  }
}

export async function listMessages(conversationId: number, limit = 20, cursor?: number) {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  } catch (err: any) {
    throw new HttpError(500, 'Failed to fetch messages');
  }
}
