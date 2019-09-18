import { Router } from 'express';
import uploadController from './canvas/routes/upload.controller';
import canvasDocument from './canvas/routes/canvas.document';

const router = Router();

router.use('/canvas/upload', uploadController);
router.use('/canvas', canvasDocument);

export default router;
