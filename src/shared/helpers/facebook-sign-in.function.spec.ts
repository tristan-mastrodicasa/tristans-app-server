import { User } from 'database/entities/user.entity';
import { facebookSignIn } from './';
import passportFacebookToken from 'passport-facebook-token';
import { VerifyCallback } from 'passport-google-oauth20';

describe('facebook sign in function', () => {
  const accessToken = 'ashbdia7sd6basdia';
  const refreshToken = 'as78dbasdbv6tabs';
  let idealFacebookProfile: passportFacebookToken.Profile;

  beforeEach(() => {
    idealFacebookProfile = {
      provider: 'facebook',
      id: '1373377772413235',
      displayName: 'John Smith',
      name: {
        familyName: 'Smith',
        givenName: 'John',
        middleName: '',
      },
      gender: '',
      emails: [
        { value: 'testing@gmail.com' },
      ],
      photos: [
        { value: 'https://graph.facebook.com/v2.6/1373377772813875/picture?type=large' },
      ],
      _raw: '',
      _json: {
        id: '1373377772413235',
        name: 'John Smith',
        last_name: 'Smith',
        first_name: 'John',
        email: 'testing@gmail.com',
      },
    };
  });

  it('should work with an ideal facebook response', async () => {
    const verifyCallback: VerifyCallback = async (_err, user: User) => {
      expect(user).toEqual(jasmine.any(Object));
      await user.remove();
    };

    await facebookSignIn(accessToken, refreshToken, idealFacebookProfile, verifyCallback);
  });

  it('should fail if identical email already exists in database ', async () => {
    let userRecord: User;

    await facebookSignIn(accessToken, refreshToken, idealFacebookProfile, (_err, user) => {
      userRecord = user;
    });

    const verifyCallback: VerifyCallback = async (err, user) => {
      expect(err).toBeDefined();
      expect(user).toBeUndefined();
      await userRecord.remove();
    };

    // Simulate a new facebook profile //
    idealFacebookProfile.id = '12n12y3b12y1';

    await facebookSignIn(accessToken, refreshToken, idealFacebookProfile, verifyCallback);
  });

});
