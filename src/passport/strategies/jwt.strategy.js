import { ExtractJwt, Strategy } from 'passport-jwt';
import UserModel from '../../models/user.model';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: 'secretkey',
};

export default new Strategy(options, function(jwtPayload, done) {

  UserModel.findOne({ 'facebook.profileId': jwtPayload.id }, function(error, user) {

    if (error) {

      return done(error, false);

    }
    if (user) {

      // User if found
      return done(null, user);

    }

    // User is not found
    return done(null, false);

  });

});
