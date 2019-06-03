import { Router } from 'express';
import passport from 'passport';
import { login } from './controllers/login.controller';
import { signup } from './controllers/sign-up.controller';

const router = new Router();

// Get Routes
router.get('/test', passport.authenticate('jwt'), (req, res) => {

  return res.send('authenticated');

});

// Post routes
router.post('/login', login);
router.post('/signup', signup);

export default router;
