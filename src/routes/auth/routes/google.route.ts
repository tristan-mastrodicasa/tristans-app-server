import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/redirect', passport.authenticate('google'));

export default router;
