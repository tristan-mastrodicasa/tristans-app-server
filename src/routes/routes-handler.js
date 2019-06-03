import { Router } from 'express';
import AuthenticationRouter from './api/authentication/authentication.router';

const router = new Router();

router.use('/api/authentication', AuthenticationRouter);

export default router;
