import { Router } from 'express';
import uploadController from 'routers/api/canvas/routes/upload.controller';
import canvasDocument from 'routers/api/canvas/routes/canvas.document';

const router = Router();

router.use('/canvas/upload', uploadController);
router.use('/canvas', canvasDocument);

export default router;
