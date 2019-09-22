import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Start the web authentication process //
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

export default router;
