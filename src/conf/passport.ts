import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';
import passportGoogleAuthcode from 'passport-google-authcode';
import passportJwt from 'passport-jwt';
import passportFacebookToken from 'passport-facebook-token';

import env from './env';

import { googleSignIn, facebookSignIn } from 'shared/helpers';

passport.use(
  new passportJwt.Strategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_key,
    },
    (jwtPayload, done) => {
      done(null, { id: jwtPayload.id });
    },
));

// For web authentication //
passport.use(
  new passportGoogleOauth20.Strategy(
    {
      callbackURL: env.google_redirect_url,
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
    },
    googleSignIn,
  ),
);

// For mobile authentication //
passport.use(
  new passportGoogleAuthcode.Strategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: '',
    },
    googleSignIn,
  ),
);

// Facebook mobile authentication //
passport.use(
  new passportFacebookToken(
    {
      clientID: env.facebook_app_id,
      clientSecret: env.facebook_app_secret,
    },
    facebookSignIn,
  ),
);
