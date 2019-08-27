import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/redirect', passport.authenticate('google'), (_req, res) => {

  res.redirect('/auth/test');

});

export default router;
