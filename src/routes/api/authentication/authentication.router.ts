import { Router } from 'express';
import passport from 'passport';
import LoginRoute from './routes/login.route';
import SignUpRoute from './routes/sign-up.route';

const router = Router();

// Get Routes //
router.get('/test', passport.authenticate('jwt'), (req, res) => {

  return res.send('authenticated');

});

router.use('/login', LoginRoute);
router.use('/signup', SignUpRoute);

export default router;
