import prisma from '../../prismaClient';
import { UserProfileImage } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { HttpError } from '../../utils/HttpError';

export async function listUsers(page = 1, perPage = 20) {
  const skip = (page - 1) * perPage;
  const users = await prisma.user.findMany({
    skip,
    take: perPage,
    select: { id: true, email: true, name: true }
  });
  const total = await prisma.user.count();
  return { data: users, page, perPage, total };
}

export async function saveProfileImages(userId: number, files: Express.Multer.File[]) {
  const records: UserProfileImage[] = [];
  for (const file of files) {
    const url = `/uploads/${file.filename}`;
    const rec = await prisma.userProfileImage.create({ data: { userId, url, isDefault: false } });
    records.push(rec);
  }
  return records;
}

export async function setDefault(userId: number, pictureId: number) {
  const picture = await prisma.userProfileImage.findUnique({ where: { id: pictureId } });
  if (!picture || picture.userId !== userId) {
    throw new HttpError(403, 'Cannot set default: picture does not belong to user');
  }

  await prisma.$transaction([
    prisma.userProfileImage.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.userProfileImage.update({ where: { id: pictureId }, data: { isDefault: true } })
  ]);
}

export async function deletePicture(userId: number, pictureId: number) {
  const pic = await prisma.userProfileImage.findUnique({ where: { id: pictureId } });
  if (!pic || pic.userId !== userId) throw new HttpError(404, 'Not found');

  try {
    await fs.unlink(path.join(process.cwd(), pic.url));
  } catch (e) {
    console.warn('Failed to delete file:', pic.url, e);
  }

  await prisma.userProfileImage.delete({ where: { id: pictureId } });
}
