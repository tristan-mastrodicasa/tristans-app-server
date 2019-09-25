import { User } from 'database/entities/user.entity';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { createNewUser } from './';

export function googleSignIn(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): void {

  User.findOne({ googleId: profile.id }).then((user: User) => {

    if (user) {

      console.log(profile);
      console.log(`user is: ${user}`);
      done(null, user);

    }

    const newUser = new User();
    newUser.googleId = profile.id;
    newUser.username = profile.displayName;
    newUser.firstname = profile.name.givenName;
    newUser.profileImg = (profile.photos[0].value !== undefined ? profile.photos[0].value : 'default_image.jpg');
    newUser.email = (profile.emails[0].value !== undefined ? profile.emails[0].value : null);

    createNewUser(newUser).then((userRecord: User) => {
      console.log(profile);
      console.log(`new user is: ${userRecord}`);
      done(null, userRecord);
    });

  });
}
