import { Router } from 'express';
import AuthenticationRouter from './api/authentication/authentication.router';
import MemeRouter from './api/meme/meme.router';

const router = new Router();

router.use('/api/memes', MemeRouter);
router.use('/api/authentication', AuthenticationRouter);

export default router;
