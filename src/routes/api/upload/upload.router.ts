import { Router } from 'express';
import canvasRoute from './routes/canvas.route';

const router = Router();

router.use('/canvas', canvasRoute);

export default router;
