import { Router } from 'express';
import passport from 'passport';
import { postLogin } from './controllers/login.controller';
import { postSignup } from './controllers/sign-up.controller';

const router = Router();

// Get Routes //
router.get('/test', passport.authenticate('jwt'), (req, res) => {

  return res.send('authenticated');

});

// Post routes
router.post('/login', postLogin);
router.post('/signup', postSignup);

export default router;
