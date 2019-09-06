import { Router } from 'express';
import uploadRouter from './upload/upload.router';

const router = Router();

router.use('/upload', uploadRouter);

export default router;
