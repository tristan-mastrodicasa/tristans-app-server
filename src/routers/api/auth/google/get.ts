import { Router } from 'express';
import passport from 'passport';

const router = Router();

/** @test By trying to log into google using the web */

/**
 * @api {get} /auth/google/ Start google authentication process
 * @apiName Google Oauth2
 * @apiGroup Google Authentication
 *
 * @apiDescription http://www.passportjs.org/packages/passport-google-oauth20/
 */
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

export default router;
