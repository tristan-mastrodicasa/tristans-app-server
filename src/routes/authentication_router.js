import {Router} from 'express';

// Middlewares
import passport from 'passport';

// Controllers
import {postLogin, postSignUp} from '../controllers/authentication_controller';

const router = Router();

// Get Roues
router.get('/test', passport.authenticate('jwt'), (req, res) => {
  return res.send('authenticated');
});

// Post routes
router.post('/login', postLogin);
router.post('/signup', postSignUp);

export default router;
