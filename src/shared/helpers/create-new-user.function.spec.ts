import { User } from 'database/entities/user.entity';
import { UserSettings } from 'database/entities/user-settings.entity';
import { UserStatistics } from 'database/entities/user-statistics.entity';
import { UserActivity } from 'database/entities/user-activity.entity';
import { createNewUser } from './';
import { createConnection, getConnection } from 'typeorm';
import { ormconfig } from 'conf/ormconfig';

describe('create user function', () => {
  const idealUser = new User();

  beforeEach(() => {
    idealUser.googleId = 'asd6iatsid75ia76dsas';
    idealUser.username = 'george123';
    idealUser.firstname = 'Chris';
    idealUser.email = 'me@email.com';
    idealUser.profileImg = '/default/picture.jpg';
  });

  // Create connection //
  beforeAll(async () => {
    await createConnection(ormconfig);
  });

  // Close connection after all specs //
  afterAll(async () => {
    await getConnection().close();
  });

  it('should create and delete a user with ideal inputs', async () => {
    const user = await createNewUser(idealUser);

    // The user is correctly entered into the database //
    expect(user).toBeDefined();
    expect(user.settings).toBeDefined();
    expect(user.statistics).toBeDefined();
    expect(user.activity).toBeDefined();

    const userId = user.id;
    const userSettingsId = user.settings.id;
    const userStatisticsId = user.statistics.id;
    const userActivityId = user.activity[0].id;

    await user.remove();

    // The user is correctly deleted from the database //
    expect(await User.findOne(userId)).toBeUndefined();
    expect(await UserSettings.findOne(userSettingsId)).toBeUndefined();
    expect(await UserStatistics.findOne(userStatisticsId)).toBeUndefined();
    expect(await UserActivity.findOne(userActivityId)).toBeUndefined();
  });

  it('should reject with poor input', async () => {
    idealUser.email = '';
    idealUser.firstname = '';

    let error: any;

    try { await createNewUser(idealUser); }
    catch (err) { error = err; }

    expect(error).toBeDefined();
    expect(error.length).toEqual(2);
  });

  it('should reject users with an email that already exists', async () => {
    const user = await createNewUser(idealUser);

    let error: any;

    try { await createNewUser(idealUser); }
    catch (err) { error = err; }

    expect(error).toBeDefined();

    await user.remove();
  });

});
