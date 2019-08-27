import { Router } from 'express';
import googleRoute from './routes/google.route';

const router = Router();

router.use('/google', googleRoute);

export default router;
