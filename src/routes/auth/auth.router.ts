import { Router } from 'express';
import googleRoute from './routes/google.route';
import testRoute from './routes/test.route';
import logoutRoute from './routes/logout.route';

const router = Router();

router.use('/google', googleRoute);
router.use('/test', testRoute);
router.use('/logout', logoutRoute);

export default router;
