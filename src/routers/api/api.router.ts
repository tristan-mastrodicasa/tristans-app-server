import express from 'express';
import uploadController from './canvas/routes/upload.controller';
import canvasDocument from './canvas/routes/canvas.document';

const router = express.Router();

router.use('/canvas/upload', uploadController);
router.use('/canvas', canvasDocument);
router.use('/canvas/image', express.static('uploads/canvas_images')); /** @todo improve image storage when we reach production */

export default router;
