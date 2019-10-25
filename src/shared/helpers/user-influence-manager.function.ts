import { UserStatistics } from 'database/entities/user-statistics.entity';
import { NotificationManager } from 'shared/helpers';
import { User } from 'database/entities/user.entity';
import { getConnection } from 'typeorm';

/**
 * Adds and removes influence points from users
 * @param  action    Add or remove influence
 * @param  userid    The user to act upon
 * @param  influence Amount of influence
 */
export async function userInfluenceManager(action: 'add' | 'remove', userid: number, influence: number): Promise<void> {
  await getConnection()
    .getRepository(UserStatistics)
    .createQueryBuilder('user_statistics')
    .update(UserStatistics)
    .where('user = :userid', { userid })
    .set({ influence: () => `influence ${(action === 'remove' ? `- ${influence}` : `+ ${influence}`)}` })
    .execute();

  // Send points update notifications //
  if (action === 'add') {
    User.findOne(userid, { relations: ['statistics'] }).then((user) => {
      const pointThresholds = [100, 250, 500, 1000, 2000, 5000, 10000, 100000];
      pointThresholds.forEach((points) => {
        if (user.statistics.influence > points && (user.statistics.influence - influence) <= points) {
          userInfluenceManager('add', userid, 50); // Give bonus to reduce likelyhood of double notifications //
          return NotificationManager.sendPointsPushNotification(userid, points);
        }
      });
    });
  }
}
