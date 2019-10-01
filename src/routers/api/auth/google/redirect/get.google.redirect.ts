import { Router } from 'express';
import passport from 'passport';

const router = Router();

/** @test By trying to log into google using the web */

/**
 * @api {get} /auth/google/redirect Handle the data sent from google
 * @apiName Google Oauth2 Redirect
 * @apiGroup Google Authentication
 *
 * @apiDescription http://www.passportjs.org/packages/passport-google-oauth20/
 */
router.get('/', passport.authenticate('google'), (_req, res) => {

  res.redirect('/auth/test');

});

export { router as getGoogleRedirect };
