import passport from 'passport';
import Google from 'passport-google-oauth20';

import env from './env';

import { User } from '../database/entity/user.entity';

passport.serializeUser((user: User, done) => {

  done(null, user.id);

});

passport.deserializeUser((id: number, done) => {

  User.findOne(id).then((user: User) => {

    done(null, user);

  });

});

passport.use(
  new Google.Strategy({
    callbackURL: env.google_redirect_url,
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret
  }, (_accessToken, _refreshToken, profile, done) => {

    User.findOne({googleId: profile.id }).then((user: User) => {

      if (user) {

        console.log(profile);
        console.log('user is:' + user);
        done(null, user);

      } else {

        /** @todo add user statistics and settings */
        const newUser = new User();
        newUser.googleId = profile.id;
        newUser.username = profile.displayName;
        newUser.firstname = profile.name.givenName;
        newUser.profileImg = (profile.photos[0].value !== undefined ? profile.photos[0].value : 'default_image.jpg');
        newUser.email = (profile.emails[0].value !== undefined ? profile.emails[0].value : null);

        newUser.save().then((userRecord: User) => {

          console.log(profile);
          console.log('new user is:' + userRecord);
          done(null, user);

        });

      }

    });

  })
);
