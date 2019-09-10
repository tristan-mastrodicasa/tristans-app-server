import { Router } from 'express';
import googleRoute from 'routers/auth/routes/google.route';
import testRoute from 'routers/auth/routes/test.route';

const router = Router();

router.use('/google', googleRoute);
router.use('/test', testRoute);

export default router;
