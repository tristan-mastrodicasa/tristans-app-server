import { Router } from 'express';
import googleRoute from './routes/google.route';
import testRoute from './routes/test.route';

const router = Router();

router.use('/google', googleRoute);
router.use('/test', testRoute);

export default router;
