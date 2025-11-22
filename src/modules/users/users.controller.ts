import { Request, Response, NextFunction } from 'express';
import * as service from './users.service';

export async function listUsers(req: any, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 20);
    const data = await service.listUsers(page, perPage);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function uploadProfilePictures(req: any, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files' });
    }
    const results = await service.saveProfileImages(userId, files);
    res.status(201).json(results);
  } catch (err) {
    next(err);
  }
}

export async function setDefaultPicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    const pictureId = Number(req.params.pictureId);
    await service.setDefault(userId, pictureId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function deletePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    const pictureId = Number(req.params.pictureId);
    await service.deletePicture(userId, pictureId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
