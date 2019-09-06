import { Router } from 'express';
import authRouter from './auth/auth.router';
import apiRouter from './api/api.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;
