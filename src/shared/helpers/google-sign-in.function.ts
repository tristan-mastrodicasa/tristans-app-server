import { User } from 'database/entities/user.entity';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { createNewUser } from './';

/**
 * Function to call when the authorization token is verified and a user is to be
 * generated or collected from the database
 * @todo Use image from google profile as the users profile image
 * @param _accessToken  Token stuff
 * @param _refreshToken Token stuff
 * @param profile       Profile from google
 * @param done          Callback for next step
 */
export async function googleSignIn(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {

  // Find if user exists with this google id //
  const user = await User.findOne({ googleId: profile.id });

  // If they exist return that user object //
  if (user) return done(null, user);

  // Otherwise create a new user //
  const newUser = new User();
  newUser.googleId = profile.id;
  newUser.firstName = profile.name.givenName;
  newUser.profileImg = '/assets/default_image.jpg';
  newUser.profileImgMimeType = 'image/jpeg';
  newUser.email = (
    profile._json.email ? profile._json.email : (profile.emails[0].value ? profile.emails[0].value : null)
  );

  let userRecord: User;

  try { userRecord = await createNewUser(newUser, true); }
  catch (err) { return done(err); }

  return done(null, userRecord);

}
