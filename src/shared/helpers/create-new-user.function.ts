import { User } from 'database/entities/user.entity';
import { UserActivity } from 'database/entities/user-activity.entity';
import { UserStatistics } from 'database/entities/user-statistics.entity';
import { UserSettings } from 'database/entities/user-settings.entity';
import { validate, ValidationError } from 'class-validator';

import { EProfileActions } from 'shared/models';

/**
 * Create a new user in the database including all the relevant relations
 * @param  user            The user object to create
 * @param  autoFillFixable Should it auto fill unvalidated inupts that can generated
 * @return                 The user record or an error
 */
export async function createNewUser(user: User, autoFillFixable = false): Promise<User> {

  // Validate //
  const res = await validate(user);
  if (res.length > 0) {

    if (!autoFillFixable) {
      throw res;
    } else {

      for (let err of res) { // tslint:disable-line
        if (err.property === 'firstname') user.firstname = 'Larry';
        else if (err.property === 'username') user.username = `user${+(new Date()) - (10 ** 12)}`;
      }

    }

  }

  // Check if the email exists in the database //
  if (user.email) {
    const emailExists = await User.findOne({ email: user.email });
    if (emailExists) {
      const error = new ValidationError();
      error.property = 'email';
      error.constraints = { unique: 'Email is not unique' };
      error.children = [];
      throw [error];
    }
  }

  // Checks if the username already exists //
  const usernameExists = await User.findOne({ username: user.username });
  if (usernameExists) {
    const error = new ValidationError();
    error.property = 'username';
    error.constraints = { unique: 'Username is not unique' };
    error.children = [];
    throw [error];
  }

  // Generate the created profile record //
  const userActivity = new UserActivity();
  userActivity.action = EProfileActions.profileCreated;
  await userActivity.save();

  // Generate statistics record //
  const userStatistics = new UserStatistics();
  await userStatistics.save();

  // Generate settings record //
  const userSettings = new UserSettings();
  await userSettings.save();

  user.settings = userSettings;
  user.statistics = userStatistics;
  user.activity = [userActivity];

  return user.save();

}
