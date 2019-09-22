import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  console.log('test route accessed');
  res.json({ msg: `You made it! ${req.user.id}` });

});

export default router;
