import passport from 'passport';
import passportGoogleOauth20 from 'passport-google-oauth20';
import passportGoogleAuthcode from 'passport-google-authcode';
import passportJwt from 'passport-jwt';

import env from 'conf/env';

import { User } from 'database/entities/user.entity';

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

passport.use(
  new passportGoogleOauth20.Strategy(
    {
      callbackURL: env.google_redirect_url,
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
    },
    (_accessToken, _refreshToken, profile, done) => {

      User.findOne({ googleId: profile.id }).then((user: User) => {

        if (user) {

          console.log(profile);
          console.log(`user is: ${user}`);
          done(null, user);

        }

        /** @todo add user statistics and settings */
        const newUser = new User();
        newUser.googleId = profile.id;
        newUser.username = profile.displayName;
        newUser.firstname = profile.name.givenName;
        newUser.profileImg = (profile.photos[0].value !== undefined ? profile.photos[0].value : 'default_image.jpg');
        newUser.email = (profile.emails[0].value !== undefined ? profile.emails[0].value : null);

        newUser.save().then((userRecord: User) => {

          console.log(profile);
          console.log(`new user is: ${userRecord}`);
          done(null, user);

        });

      });

    },
  ),
);

passport.use(
  new passportGoogleAuthcode.Strategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: '',
    },
    (_accessToken, _refreshToken, profile, done) => {

      console.log('made it to authcode strategy');

      User.findOne({ googleId: profile.id }).then((user: User) => {

        if (user) {

          console.log(`user is: ${user.id}`);
          return done(null, user);

        }

        /** @todo add user statistics and settings */
        const newUser = new User();
        newUser.googleId = profile.id;
        newUser.username = profile.displayName;
        newUser.firstname = profile.name.givenName;
        newUser.profileImg = (profile.photos[0].value !== undefined ? profile.photos[0].value : 'default_image.jpg');
        newUser.email = (profile.emails[0].value !== undefined ? profile.emails[0].value : null);

        newUser.save().then((userRecord: User) => {

          console.log(`new user is: ${userRecord}`);
          return done(null, user.id);

        });

      });

    },
  ),
);
