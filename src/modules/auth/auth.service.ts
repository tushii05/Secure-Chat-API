import prisma from '../../prismaClient';
import { hash, compare } from '../../utils/hash';
import { signAccess, makeRefresh } from '../../utils/jwt';
import addDays from 'date-fns/addDays';
import { HttpError } from '../../utils/HttpError';

export async function register(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(400, 'Email already in use');

  const passwordHash = await hash(password);
  return prisma.user.create({ data: { email, passwordHash, name } });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(400, 'Invalid credentials');

  const ok = await compare(password, user.passwordHash);
  if (!ok) throw new HttpError(400, 'Invalid credentials');

  const access = signAccess({ sub: user.id, role: user.role });
  const refreshPlain = makeRefresh();
  const refreshHash = await hash(refreshPlain);
  const expiresAt = addDays(new Date(), 7);

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: refreshHash, expiresAt },
  });

  return {
    access,
    refresh: refreshPlain,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function refresh(refreshPlain: string) {
  const tokens = await prisma.refreshToken.findMany({ where: { revoked: false } });

  for (const t of tokens) {
    const match = await compare(refreshPlain, t.tokenHash);
    if (match) {
      if (t.expiresAt < new Date()) throw new HttpError(401, 'Refresh token expired');

      await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });

      const newPlain = makeRefresh();
      const newHash = await hash(newPlain);
      const expiresAt = addDays(new Date(), 7);

      await prisma.refreshToken.create({ data: { userId: t.userId, tokenHash: newHash, expiresAt } });

      const user = await prisma.user.findUnique({ where: { id: t.userId } });
      const access = signAccess({ sub: user!.id, role: user!.role });

      return { access, refresh: newPlain };
    }
  }

  throw new HttpError(401, 'Invalid refresh token');
}

export async function logout(refreshPlain: string) {
  const tokens = await prisma.refreshToken.findMany({ where: { revoked: false } });
  for (const t of tokens) {
    const match = await compare(refreshPlain, t.tokenHash);
    if (match) {
      await prisma.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
      return;
    }
  }
}
