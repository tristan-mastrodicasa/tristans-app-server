import { User } from 'database/entities/user.entity';
import passportFacebookToken from 'passport-facebook-token';
import { VerifyCallback } from 'passport-google-oauth20';
import { createNewUser } from './';

/**
 * Function to call when the access token is verified and a user is to be
 * generated or collected from the database
 * @todo Use image from facebook profile as the users profile image
 * @param _accessToken  Token stuff
 * @param _refreshToken Token stuff
 * @param profile       Profile from facebook
 * @param done          Callback for next step
 */
export async function facebookSignIn(_accessToken: string, _refreshToken: string, profile: passportFacebookToken.Profile, done: VerifyCallback): Promise<void> {

  // Find if user exists with this facebook id //
  const user = await User.findOne({ facebookId: profile.id });

  // If they exist return that user object //
  if (user) return done(null, user);

  // Otherwise create a new user //
  const newUser = new User();
  newUser.facebookId = profile.id;
  newUser.firstName = profile.name.givenName;
  newUser.profileImg = '/assets/svg-img/default-profile-picture.svg'; // Change to remote hosted image so web can access
  newUser.profileImgMimeType = 'image/jpeg';
  newUser.email = (
    profile._json.email ? profile._json.email : (profile.emails[0].value ? profile.emails[0].value : null)
  );

  let userRecord: User;

  try { userRecord = await createNewUser(newUser, true); }
  catch (err) { return done(err); }

  return done(null, userRecord);

}
