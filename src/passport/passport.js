import passport from 'passport';
import JWTStrategy from './strategies/jwtStrategy';
import UserModel from '../models/UserModel';

passport.use(JWTStrategy);

passport.serializeUser((user, callback) => {
  return callback(null, user);
});

passport.deserializeUser(async (UserId, callback) => {
  const user = await UserModel.findById(UserId);
  callback(null, user);
});

export default passport;

