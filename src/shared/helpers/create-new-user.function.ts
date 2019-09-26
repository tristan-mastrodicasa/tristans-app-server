import { User } from 'database/entities/user.entity';
import { UserActivity } from 'database/entities/user-activity.entity';
import { UserStatistics } from 'database/entities/user-statistics.entity';
import { UserSettings } from 'database/entities/user-settings.entity';
import { validate, ValidationError } from 'class-validator';

import { EProfileActions } from 'shared/models';

/**
 * Create a new user in the database including all the relevant relations
 * @param  user The user object to create
 * @return      The user record or an error
 */
export async function createNewUser(user: User): Promise<User> {

  // Validate //
  const res = await validate(user);
  if (res.length > 0) {
    throw res;
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
