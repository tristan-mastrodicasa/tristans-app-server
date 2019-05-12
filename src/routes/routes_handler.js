import {Router} from 'express';
import AuthenticationRouter from './authentication_router';

const router = Router();

router.use('/authentication', AuthenticationRouter);

export default router;
