import {Strategy} from 'passport-facebook';
import UserModel from '../../models/UserModel';

export default new Strategy({
  clientID: '1020821314789004',
  clientSecret: 'c21165856116f75fb4518aec0c6efbe5',
  callbackURL: '/api/authentication/facebook/test',
  profileFields: ['id', 'emails'],
}, async function(accessToken, refreshToken, profile, done) {
  const isFoundUser = await UserModel.findOne({'facebook.profileId': profile.id});

  if (isFoundUser) {
    return done(null, isFoundUser);
  } else {
    const user = await UserModel.create({
      facebook: {
        accessToken: accessToken,
        profileId: profile.id,
      },
    });
    return done(null, user);
  }
});
