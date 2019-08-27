import passport from 'passport';
import Google from 'passport-google-oauth20';

import env from './env';

import { User } from '../database/entity/user.entity';

passport.use(

  new Google.Strategy({
    callbackURL: env.google_redirect_url,
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret
  }, (_accessToken, _refreshToken, profile, done) => {

    User.findOne({googleId: profile.id }).then((user: User) => {

      if (user) {

        console.log('user is:' + user);

      } else {

        const newUser = new User();
        newUser.googleId = profile.id;
        newUser.username = profile.displayName;
        newUser.firstname = profile.name.givenName;
        newUser.profileImg = (profile.photos[0].value !== undefined ? profile.photos[0].value : 'default_image.jpg');
        // user.email -> request email in scope

        newUser.save().then((userRecord: User) => {

          console.log('new user is:' + userRecord);

        });

      }

    });

    console.log(profile);
    done();

  })

);
