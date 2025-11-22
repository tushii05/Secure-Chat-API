import { Router } from 'express';
import { ensureAuth } from '../../middleware/auth';
import * as ctrl from './conv.controller';

const router = Router();
router.post('/', ensureAuth, ctrl.createConv);
router.get('/', ensureAuth, ctrl.listConv);
export default router;
