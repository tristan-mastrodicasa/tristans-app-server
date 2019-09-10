import { Router } from 'express';
import authRouter from 'routers/auth/auth.router';
import apiRouter from 'routers/api/api.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;
