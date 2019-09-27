import { User } from 'database/entities/user.entity';
import { googleSignIn } from './';
import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';

describe('google sign in function', () => {
  const accessToken = 'ashbdia7sd6basdia';
  const refreshToken = 'as78dbasdbv6tabs';
  let idealGoogleProfile: Profile;

  beforeEach(() => {
    idealGoogleProfile = {
      provider: 'google',
      profileUrl: '',
      id: '114304480626807725010',
      displayName: 'ghoststeam217',
      name: { familyName: 'Mastrodicasa', givenName: 'Tristan' },
      emails: [{ value: 'ghoststeam217@gmail.com' }],
      _raw: '{}',
      _json: {
        id: '114304480626807725010',
        email: 'ghoststeam217@gmail.com',
        verified_email: true,
        name: 'Tristan',
        given_name: 'Tristan',
        picture: 'https://lh3.googleusercontent.com/a-/AAuE7mAyHwVFG9sA02u-OKn_FfVsGuMDHB5gaIleclke9A',
        locale: 'en',
      },
    };
  });

  // Create connection //
  beforeAll(async () => {
    await createConnection(ormconfig);
  });

  // Close connection after all specs //
  afterAll(async () => {
    await getConnection().close();
  });

  it('should work with an ideal google response', async () => {
    const verifyCallback: VerifyCallback = async (_err, user: User) => {
      expect(user).toEqual(jasmine.any(Object));
      await user.remove();
    };

    await googleSignIn(accessToken, refreshToken, idealGoogleProfile, verifyCallback);
  });

  it('should fail if identical email already exists in database ', async () => {
    let userRecord: User;

    await googleSignIn(accessToken, refreshToken, idealGoogleProfile, (_err, user) => {
      userRecord = user;
    });

    const verifyCallback: VerifyCallback = async (err, user) => {
      expect(err).toBeDefined();
      expect(user).toBeUndefined();
      await userRecord.remove();
    };

    // Simulate a new google profile //
    idealGoogleProfile.id = '12n12y3b12y1';

    await googleSignIn(accessToken, refreshToken, idealGoogleProfile, verifyCallback);
  });

});
