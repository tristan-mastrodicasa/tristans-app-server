import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('google'), (_req, res) => {

  res.redirect('/auth/test');

});

export default router;
