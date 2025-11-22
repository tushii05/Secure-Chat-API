import { Router } from 'express';
import { ensureAuth } from '../../middleware/auth';
import * as ctrl from './messages.controller';

const router = Router();
router.post('/', ensureAuth, ctrl.createMsg);
router.get('/conversations/:id/messages', ensureAuth, ctrl.getMessages);

export default router;
