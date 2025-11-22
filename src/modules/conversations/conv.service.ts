import prisma from '../../prismaClient';
import { HttpError } from '../../utils/HttpError';

export async function createConversation(userAId: number, userBId: number) {
  const [a, b] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];

  if (a === b) {
    throw new HttpError(400, 'Cannot create conversation with self');
  }

  try {
    const conv = await prisma.conversation.upsert({
      where: { userAId_userBId: { userAId: a, userBId: b } } as any,
      update: {},
      create: { userAId: a, userBId: b }
    } as any);

    return conv;
  } catch (err: any) {
    throw new HttpError(500, 'Failed to create conversation');
  }
}

export async function listConversations(userId: number) {
  try {
    const convs = await prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
    return convs;
  } catch (err: any) {
    throw new HttpError(500, 'Failed to fetch conversations');
  }
}
