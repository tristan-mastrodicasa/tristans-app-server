import { UserStatistics } from 'database/entities/user-statistics.entity';
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
}
