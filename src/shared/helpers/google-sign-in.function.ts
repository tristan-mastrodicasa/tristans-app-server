import { User } from 'database/entities/user.entity';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { createNewUser } from './';

/**
 * Function to call when the authorization token is verified and a user is to be
 * generated or collected from the database
 * @param _accessToken  Token stuff
 * @param _refreshToken Token stuff
 * @param profile       Profile from google
 * @param done          Callback for next step
 */
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
