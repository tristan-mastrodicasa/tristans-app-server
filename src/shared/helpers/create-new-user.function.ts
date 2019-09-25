import { User } from 'database/entities/user.entity';
import { UserActivity } from 'database/entities/user-activity.entity';
import { UserStatistics } from 'database/entities/user-statistics.entity';
import { UserSettings } from 'database/entities/user-settings.entity';
import { validate } from 'class-validator';

import { EProfileActions } from 'shared/models';

export async function createNewUser(user: User): Promise<User> {

  // Validate //
  const res = await validate(user);
  if (res.length > 0) {
    throw res;
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
