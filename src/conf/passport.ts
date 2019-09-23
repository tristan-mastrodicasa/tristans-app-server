import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';
import passportGoogleAuthcode from 'passport-google-authcode';
import passportJwt from 'passport-jwt';

import env from './env';

import googleSignInFunction from 'shared/helpers/google-sign-in.function';

passport.use(
  new passportJwt.Strategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_key,
    },
    (jwtPayload, done) => {

      console.log(jwtPayload);
      done(null, { id: 2 });

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
    googleSignInFunction,
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
    googleSignInFunction,
  ),
);
