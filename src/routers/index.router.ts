import { Router } from 'express';
import apiRouter from './api/api.router';

const router = Router();

router.use('/api', apiRouter);

export default router;
