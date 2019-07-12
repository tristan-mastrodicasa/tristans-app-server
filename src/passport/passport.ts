import passport from 'passport';
import JWTStrategy from './strategies/jwt.strategy';
import { User } from '../database/entity/user/user.entity';

passport.use(JWTStrategy);

passport.serializeUser((user, callback) => {

  return callback(null, user);

});

passport.deserializeUser(async (UserId, callback) => {

  /*const user = await User.findById(UserId);
  callback(null, user);*/

});
