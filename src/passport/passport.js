import passport from 'passport';
import FacebookStrategy from './strategies/facebookStrategy';
import UserModel from '../models/UserModel';

passport.use(FacebookStrategy);

passport.serializeUser((user, callback) => {
  return callback(null, user);
});

passport.deserializeUser(async (UserId, callback) => {
  const user = await UserModel.findById(UserId);
  callback(null, user);
});

export default passport;

