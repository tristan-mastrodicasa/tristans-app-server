import { User } from 'database/entities/user.entity';

export function createNewUser(user: User): Promise<User> {

  return new Promise<User>((resolve, _reject) => {

    // Validate

    /** @todo add user statistics and settings */
    // Link settings and  stats

    user.save().then((userRecord: User) => resolve(userRecord));

  });

}
