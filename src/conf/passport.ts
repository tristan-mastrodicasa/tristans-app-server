import passport from 'passport';
import Google from 'passport-google-oauth20';

import env from './env';

// import { User } from '../database/entity/user.entity';

passport.use(

  new Google.Strategy({
    callbackURL: env.google_redirect_url,
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret
  }, (_accessToken, _refreshToken, profile, done) => {

    console.log(profile);
    done();

  })

);
