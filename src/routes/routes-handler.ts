import { Router } from 'express';
import AuthenticationRouter from './auth/auth.router';

const router = Router();

router.use('/auth', AuthenticationRouter);

export default router;
