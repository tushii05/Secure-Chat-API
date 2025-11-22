import { Router } from 'express';
import { ensureAuth } from '../../middleware/auth';
import { upload } from '../../utils/multer';
import * as controller from './users.controller';


const router = Router();

router.get('/', ensureAuth, controller.listUsers);
router.post('/:id/profile-pictures', ensureAuth, upload.array('images', 5), controller.uploadProfilePictures);
router.patch('/:id/profile-pictures/:pictureId/default', ensureAuth, controller.setDefaultPicture);
router.delete('/:id/profile-pictures/:pictureId', ensureAuth, controller.deletePicture);

export default router;
