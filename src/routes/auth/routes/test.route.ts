import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  console.log('test route accessed');
  res.json({ msg: 'You made it! ' + req.user.id });

});

router.get('/unprotected', (_req, res) => {

  console.log('unprotected route accessed');
  res.send('You have accessed an unprotected route');

});

export default router;
