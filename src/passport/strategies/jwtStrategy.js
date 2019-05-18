import {ExtractJwt, Strategy} from 'passport-jwt';
import UserModel from '../../models/UserModel';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secretkey',
};

export default new Strategy(options, function(jwt_payload, done) {
  UserModel.findOne({'facebook.profileId': jwt_payload.id}, function(error, user) {
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
