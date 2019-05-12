import {Router} from 'express';
import axios from 'axios';

// Middlewares
import {isAuthenticated} from '../passport/middleware/index';
import passport from 'passport';

// Controllers
import {getLoginFacebook, getFacebookTest, getLogout} from '../controllers/authentication_controller';

const router = Router();

router.get('/facebook', getLoginFacebook);
router.get('/facebook/test', passport.authenticate('facebook'), isAuthenticated, getFacebookTest);
router.get('/logout', getLogout);

export default router;
