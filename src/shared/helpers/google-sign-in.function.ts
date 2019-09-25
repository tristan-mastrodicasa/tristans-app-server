import { User } from 'database/entities/user.entity';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { createNewUser } from './';

export function googleSignIn(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): void {

  User.findOne({ googleId: profile.id }).then((user: User) => {

    console.log('find user');
    console.log(profile);
    console.log(user);

    if (user) {

      console.log(`user is: ${user}`);
      return done(null, user);

    }

    const profileRaw = profile._json;

    const newUser = new User();
    newUser.googleId = profileRaw.id;
    newUser.username = profileRaw.name;
    newUser.firstname = profileRaw.name;
    newUser.profileImg = (profileRaw.picture ? profileRaw.picture : '/assets/default_image.jpg');
    newUser.email = (profileRaw.email ? profileRaw.email : null);

    createNewUser(newUser).then((userRecord: User) => {
      console.log(`new user is: ${userRecord}`);
      return done(null, userRecord);
    });

  });
}
