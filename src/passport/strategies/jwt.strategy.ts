import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../database/entity/user/user.entity';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: 'secretkey',
};

export default new Strategy(options, (jwtPayload, done) => {

  /*User.findOne({ 'facebook.profileId': jwtPayload.id }, (error, user) => {

    if (error) {

      return done(error, false);

    }

    if (user) {

      // User if found
      return done(null, user);

    }

    // User is not found
    return done(null, false);

  });*/

});
