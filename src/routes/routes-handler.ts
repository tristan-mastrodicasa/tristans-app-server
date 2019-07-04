import { Router } from 'express';
import CanvasRouter from './api/canvas/canvas.router';
import UserRouter from './api/user/user.router';
import AuthenticationRouter from './api/authentication/authentication.router';
import MemeRouter from './api/meme/meme.router';

const router = Router();

router.use('/api/canvas', CanvasRouter);
router.use('/api/users', UserRouter);
router.use('/api/memes', MemeRouter);
router.use('/api/authentication', AuthenticationRouter);

export default router;
