import { Router } from 'express';
import canvasRoute from 'routers/api/upload/routes/canvas.route';

const router = Router();

router.use('/upload/canvas', canvasRoute);

export default router;
