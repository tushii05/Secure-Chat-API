import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';

const uploadDir = path.join(process.cwd(), config.uploadsDir || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
  else cb(new Error('Only JPEG or PNG allowed'), false);
}

export const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter
});
