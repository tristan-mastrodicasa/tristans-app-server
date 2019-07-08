import * as passport from 'passport';
import JWTStrategy from './strategies/jwt.strategy';
import UserModel from '../entity/user/user.entity';

passport.use(JWTStrategy);

passport.serializeUser((user, callback) => {
  return callback(null, user);
});

passport.deserializeUser(async (UserId, callback) => {
  const user = await UserModel.findById(UserId);
  callback(null, user);
});
