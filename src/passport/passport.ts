import passport from 'passport';
import JWTStrategy from './strategies/jwt.strategy';
import UserModel from '../models/user.model';

passport.use(JWTStrategy);

passport.serializeUser((user, callback) => {

  return callback(null, user);

});

passport.deserializeUser(async (UserId, callback) => {

  const user = await UserModel.findById(UserId);
  callback(null, user);

});
